import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

interface NewsItem {
  title: string;
  title_ko?: string;
  summary: string;
  summary_ko?: string;
  category: string;
}

// Convert UTC timestamp to KST date string (YYYY-MM-DD)
function toKSTDate(utcTimestamp: string): string {
  const date = new Date(utcTimestamp);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().split("T")[0];
}

// Get KST date range for a given KST date (returns UTC timestamps)
function getKSTDateRange(kstDate: string): { start: string; end: string } {
  const startUTC = new Date(`${kstDate}T00:00:00+09:00`).toISOString();
  const endUTC = new Date(`${kstDate}T23:59:59.999+09:00`).toISOString();
  return { start: startUTC, end: endUTC };
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get date from request, or find most recent date with news
    const { date } = await req.json().catch(() => ({}));
    let targetDate = date;

    if (!targetDate) {
      // Find the most recent KST date with news
      const { data: latestNews } = await supabase
        .from("ad_news")
        .select("published_at")
        .order("published_at", { ascending: false })
        .limit(1);

      if (latestNews && latestNews.length > 0) {
        targetDate = toKSTDate(latestNews[0].published_at);
      } else {
        // Fallback to today in KST
        targetDate = toKSTDate(new Date().toISOString());
      }
    }

    console.log(`Generating digest for ${targetDate} (KST)`);

    // Fetch news for the target KST date
    const { start: startOfDay, end: endOfDay } = getKSTDateRange(targetDate);

    const { data: newsItems, error: newsError } = await supabase
      .from("ad_news")
      .select("title, title_ko, summary, summary_ko, category")
      .gte("published_at", startOfDay)
      .lte("published_at", endOfDay)
      .order("published_at", { ascending: false });

    if (newsError) {
      throw new Error(`Failed to fetch news: ${newsError.message}`);
    }

    if (!newsItems || newsItems.length === 0) {
      console.log("No news found for today");
      return new Response(
        JSON.stringify({ message: "No news found for digest", date: targetDate }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${newsItems.length} news items`);

    // Count by category
    const counts = {
      adtech: newsItems.filter((n) => n.category === "adtech").length,
      martech: newsItems.filter((n) => n.category === "martech").length,
      general: newsItems.filter((n) => n.category === "general").length,
    };

    // Prepare news summaries for Gemini (limit to top 10 for context length)
    const newsForDigest = newsItems.slice(0, 10).map((n: NewsItem, i: number) =>
      `${i + 1}. [${n.category.toUpperCase()}] ${n.title}\n   ${n.summary || ""}`
    ).join("\n\n");

    // Generate digest with Gemini
    const prompt = `You are an ad industry analyst creating a daily digest.

Here are today's top ad industry news stories:

${newsForDigest}

Create a concise daily digest (2-3 sentences) that summarizes the key themes and most important developments in the ad industry today. Focus on trends and significant news.

Respond in this exact JSON format:
{
  "summary": "English summary here (2-3 sentences)",
  "summary_ko": "Korean translation of the summary"
}`;

    console.log("Calling Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const geminiData = await response.json();
    console.log("Gemini response received");
    console.log("Gemini raw response:", JSON.stringify(geminiData));

    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const finishReason = geminiData.candidates?.[0]?.finishReason;
    console.log("Finish reason:", finishReason);
    console.log("Text content length:", textContent.length);
    console.log("Text content:", textContent.substring(0, 500));

    let summary = "";
    let summaryKo = "";

    // Parse JSON response
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = parsed.summary || "";
        summaryKo = parsed.summary_ko || "";
        console.log("Parsed summary:", summary.substring(0, 100));
      } else {
        console.log("No JSON match found in response");
        // Try to extract summary directly if JSON parsing fails
        const summaryMatch = textContent.match(/"summary":\s*"([^"]+)"/);
        if (summaryMatch) {
          summary = summaryMatch[1];
        }
      }
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e);
      console.log("Raw text for debugging:", textContent);
    }

    // Upsert digest
    const { error: upsertError } = await supabase
      .from("ad_news_digest")
      .upsert({
        digest_date: targetDate,
        summary,
        summary_ko: summaryKo,
        total_news_count: newsItems.length,
        adtech_count: counts.adtech,
        martech_count: counts.martech,
        general_count: counts.general,
      }, { onConflict: "digest_date" });

    if (upsertError) {
      throw new Error(`Failed to upsert digest: ${upsertError.message}`);
    }

    console.log("Digest saved successfully");

    return new Response(
      JSON.stringify({
        message: "Digest generated successfully",
        date: targetDate,
        newsCount: newsItems.length,
        counts,
        summary,
        summary_ko: summaryKo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
