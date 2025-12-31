import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 환경 변수
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

// 광고 관련 검색 키워드
const SEARCH_KEYWORDS = [
  "mobile advertising",
  "digital advertising",
  "ad tech",
  "programmatic advertising",
  "in-app advertising",
];

// 카테고리 분류 기준
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  programmatic: ["programmatic", "rtb", "dsp", "ssp", "real-time bidding", "auction"],
  mobile: ["mobile ad", "in-app", "app advertising", "mobile marketing", "rewarded ad", "interstitial"],
  privacy: ["privacy", "idfa", "att", "gdpr", "ccpa", "cookie", "tracking", "sandbox"],
  platform: ["google ads", "meta", "facebook", "tiktok", "apple", "amazon ads", "microsoft"],
  trend: ["market", "forecast", "growth", "spending", "revenue", "report", "study"],
};

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

interface ProcessedNews {
  title: string;
  title_ko: string;
  summary: string;
  summary_ko: string;
  category: string;
  source: string;
  source_url: string;
  published_at: string;
}

// Google News RSS 파싱
async function fetchGoogleNewsRSS(keyword: string): Promise<NewsItem[]> {
  const encodedKeyword = encodeURIComponent(keyword);
  const rssUrl = `https://news.google.com/rss/search?q=${encodedKeyword}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") || "";
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "Unknown";

      if (title && link) {
        items.push({ title, link, pubDate, source });
      }
    }

    return items.slice(0, 5); // 키워드당 최대 5개
  } catch (error) {
    console.error(`Error fetching RSS for ${keyword}:`, error);
    return [];
  }
}

// 카테고리 자동 분류
function classifyCategory(title: string, summary: string): string {
  const text = (title + " " + summary).toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return "trend"; // 기본값
}

// Gemini API로 뉴스 요약 및 번역
async function processWithGemini(newsItems: NewsItem[]): Promise<ProcessedNews[]> {
  const results: ProcessedNews[] = [];

  for (const item of newsItems) {
    try {
      const prompt = `You are a news summarizer for the advertising industry.

Given this news headline: "${item.title}"

Please provide:
1. A concise 1-2 sentence summary in English
2. The same summary translated to Korean
3. The title translated to Korean

Respond in this exact JSON format:
{
  "summary": "English summary here",
  "summary_ko": "Korean summary here",
  "title_ko": "Korean title here"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini response:", JSON.stringify(data).slice(0, 500));

      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Text content:", textContent.slice(0, 200));

      // JSON 파싱
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const category = classifyCategory(item.title, parsed.summary || "");

        results.push({
          title: item.title,
          title_ko: parsed.title_ko || item.title,
          summary: parsed.summary || "",
          summary_ko: parsed.summary_ko || "",
          category,
          source: item.source,
          source_url: item.link,
          published_at: new Date(item.pubDate).toISOString(),
        });
      }
    } catch (error) {
      console.error(`Error processing news item:`, error);
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Supabase 클라이언트 (service role)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. 모든 키워드로 뉴스 수집
    console.log("Fetching news from Google News RSS...");
    const allNews: NewsItem[] = [];

    for (const keyword of SEARCH_KEYWORDS) {
      const news = await fetchGoogleNewsRSS(keyword);
      allNews.push(...news);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
    }

    // 중복 제거 (URL 기준)
    const uniqueNews = allNews.filter(
      (item, index, self) => index === self.findIndex((t) => t.link === item.link)
    );

    console.log(`Found ${uniqueNews.length} unique news items`);

    // 2. 기존 URL 체크 (중복 방지)
    const { data: existingUrls } = await supabase
      .from("ad_news")
      .select("source_url");

    const existingUrlSet = new Set(existingUrls?.map((r) => r.source_url) || []);
    const newItems = uniqueNews.filter((item) => !existingUrlSet.has(item.link));

    console.log(`${newItems.length} new items to process`);
    console.log("First 3 new items:", newItems.slice(0, 3).map(i => i.title));

    if (newItems.length === 0) {
      return new Response(
        JSON.stringify({ message: "No new news items found", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Gemini로 처리
    console.log("Processing with Gemini...");
    const processedNews = await processWithGemini(newItems.slice(0, 10)); // 최대 10개

    // 4. DB에 저장
    if (processedNews.length > 0) {
      const { error } = await supabase.from("ad_news").insert(processedNews);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
    }

    // 5. 오래된 뉴스 정리 (30일 이상)
    await supabase
      .from("ad_news")
      .delete()
      .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return new Response(
      JSON.stringify({
        message: "News fetch completed",
        fetched: uniqueNews.length,
        processed: processedNews.length,
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
