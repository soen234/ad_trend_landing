import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

// Gemini 모델 우선순위 (메인 → 백업)
const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
];

async function callGeminiWithFallback(prompt: string): Promise<{ data: unknown; model: string } | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      const data = await response.json();

      // Rate limit 에러면 다음 모델 시도
      if (data.error) {
        console.log(`${model} error: ${data.error.status || data.error.code}`);
        if (data.error.code === 429 || data.error.status === "RESOURCE_EXHAUSTED") {
          console.log(`${model} rate limited, trying next model...`);
          continue;
        }
        // 다른 에러도 다음 모델 시도
        continue;
      }

      console.log(`Using model: ${model}`);
      return { data, model };
    } catch (error) {
      console.log(`${model} fetch error, trying next...`);
      continue;
    }
  }

  console.log("All models exhausted");
  return null;
}

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

// Get all KST dates that have news but no digest or empty summary
async function getMissingDigestDates(supabase: ReturnType<typeof createClient>): Promise<string[]> {
  // Get all unique dates from ad_news
  const { data: newsData } = await supabase
    .from("ad_news")
    .select("published_at")
    .order("published_at", { ascending: false });

  if (!newsData || newsData.length === 0) return [];

  // Convert to KST dates and get unique values
  const newsDates = [...new Set(newsData.map((n) => toKSTDate(n.published_at)))];

  // Get all existing digests with their summary status
  const { data: digestData } = await supabase
    .from("ad_news_digest")
    .select("digest_date, summary");

  // Create a map of dates with valid summaries
  const validDigestDates = new Set(
    digestData
      ?.filter((d) => d.summary && d.summary.trim() !== "")
      .map((d) => d.digest_date) || []
  );

  // Find dates with news but no digest or empty summary
  const missingDates = newsDates.filter((date) => !validDigestDates.has(date));

  console.log(`Found ${missingDates.length} dates missing/incomplete digest: ${missingDates.join(", ")}`);
  return missingDates;
}

// Generate digest for a single date
async function generateDigestForDate(
  supabase: ReturnType<typeof createClient>,
  targetDate: string
): Promise<{ success: boolean; newsCount: number; summary?: string; summary_ko?: string }> {
  console.log(`Generating digest for ${targetDate} (KST)`);

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
    console.log(`No news found for ${targetDate}`);
    return { success: false, newsCount: 0 };
  }

  console.log(`Found ${newsItems.length} news items for ${targetDate}`);

  const counts = {
    adtech: newsItems.filter((n) => n.category === "adtech").length,
    martech: newsItems.filter((n) => n.category === "martech").length,
    general: newsItems.filter((n) => n.category === "general").length,
  };

  const newsForDigest = newsItems.slice(0, 10).map((n: NewsItem, i: number) =>
    `${i + 1}. [${n.category.toUpperCase()}] ${n.title}\n   ${n.summary || ""}`
  ).join("\n\n");

  const prompt = `You are an ad industry analyst. Summarize today's news in 2-3 sentences.

NEWS:
${newsForDigest}

INSTRUCTIONS:
- Write a 2-3 sentence summary focusing on key themes and trends
- Translate the summary to Korean
- Return ONLY valid JSON, no markdown, no code blocks, no explanation

OUTPUT FORMAT (return exactly this structure):
{"summary":"English summary here","summary_ko":"Korean translation here"}`;

  console.log("Calling Gemini API...");

  const result = await callGeminiWithFallback(prompt);

  let summary = "";
  let summaryKo = "";

  if (result) {
    const { data: geminiData } = result;
    const textContent = (geminiData as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
      ?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Text content:", textContent.substring(0, 300));

    try {
      // Remove markdown code blocks if present
      let cleanContent = textContent;
      if (textContent.includes("```json")) {
        cleanContent = textContent.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      } else if (textContent.includes("```")) {
        cleanContent = textContent.replace(/```\s*/g, "");
      }

      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = parsed.summary || "";
        summaryKo = parsed.summary_ko || "";
        console.log("Parsed summary length:", summary.length);
      } else {
        console.log("No JSON match found in Gemini response");
      }
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e);
    }
  } else {
    console.log("All Gemini models failed, skipping digest generation");
  }

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

  console.log(`Digest saved for ${targetDate}`);
  return { success: true, newsCount: newsItems.length, summary, summary_ko: summaryKo };
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get date from request
    const { date } = await req.json().catch(() => ({}));

    // If specific date provided, generate for that date only
    if (date) {
      const result = await generateDigestForDate(supabase, date);
      return new Response(
        JSON.stringify({
          message: result.success ? "Digest generated" : "No news found",
          date,
          ...result,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Otherwise, find and process all missing dates
    const missingDates = await getMissingDigestDates(supabase);

    if (missingDates.length === 0) {
      // Also generate for today if no digest exists
      const today = toKSTDate(new Date().toISOString());
      const { data: todayDigest } = await supabase
        .from("ad_news_digest")
        .select("digest_date")
        .eq("digest_date", today)
        .single();

      if (!todayDigest) {
        missingDates.push(today);
      }
    }

    if (missingDates.length === 0) {
      return new Response(
        JSON.stringify({ message: "All digests up to date" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process all missing dates (limit to 5 to avoid timeout)
    const results: Array<{ date: string; success: boolean; newsCount: number }> = [];
    const datesToProcess = missingDates.slice(0, 5);

    for (const targetDate of datesToProcess) {
      try {
        const result = await generateDigestForDate(supabase, targetDate);
        results.push({ date: targetDate, ...result });
        // Small delay between API calls
        if (datesToProcess.indexOf(targetDate) < datesToProcess.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Failed to generate digest for ${targetDate}:`, error);
        results.push({ date: targetDate, success: false, newsCount: 0 });
      }
    }

    console.log(`Processed ${results.length} digests`);

    const remaining = missingDates.length - datesToProcess.length;
    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} digests`,
        results,
        remaining: remaining > 0 ? remaining : 0,
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
