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

// AdTech 검색 키워드 (35개 - 약 100개 뉴스 수집 목표)
const ADTECH_KEYWORDS = [
  // Core AdTech
  "programmatic advertising",
  "real-time bidding RTB",
  "demand side platform DSP",
  "supply side platform SSP",
  "ad exchange platform",
  "ad network mobile",
  "header bidding advertising",
  "ad server technology",
  // Mobile Advertising
  "mobile advertising 2024",
  "in-app advertising revenue",
  "mobile ad SDK",
  "rewarded video ads",
  "interstitial ads",
  "playable ads gaming",
  "app install campaign",
  "user acquisition mobile",
  // Attribution & Privacy
  "mobile attribution tracking",
  "SKAdNetwork SKAN iOS",
  "Privacy Sandbox Android",
  "IDFA deprecation iOS",
  "ATT app tracking transparency",
  "privacy-first advertising",
  "cookieless advertising",
  // Video & CTV
  "CTV connected TV advertising",
  "OTT streaming ads",
  "video advertising platform",
  "AVOD advertising",
  "programmatic TV ads",
  // Retail Media
  "retail media network",
  "commerce media advertising",
  "Amazon advertising news",
  "shoppable ads retail",
  // Ad Fraud & Verification
  "ad fraud prevention",
  "brand safety advertising",
];

// MarTech 검색 키워드 (35개)
const MARTECH_KEYWORDS = [
  // MMP Vendors
  "mobile measurement partner MMP",
  "Airbridge attribution",
  "Appsflyer mobile attribution",
  "Adjust mobile attribution",
  "Singular mobile attribution",
  "Branch deep linking",
  "Kochava mobile analytics",
  // Analytics Platforms
  "Amplitude product analytics",
  "Mixpanel analytics",
  "Firebase analytics mobile",
  "Google Analytics 4 GA4",
  "Heap analytics",
  "PostHog analytics",
  // CDP
  "customer data platform CDP",
  "Segment CDP",
  "mParticle CDP",
  "Tealium CDP",
  "Rudderstack CDP",
  // Engagement Platforms
  "Braze customer engagement",
  "CleverTap engagement",
  "OneSignal push notification",
  "Leanplum mobile marketing",
  "Iterable marketing",
  "MoEngage engagement",
  "Insider marketing",
  // Marketing Automation
  "marketing automation platform",
  "email marketing automation",
  "push notification marketing",
  "in-app messaging platform",
  "lifecycle marketing",
  "customer journey orchestration",
  // CRM & Sales
  "Salesforce marketing cloud",
  "HubSpot marketing",
  "marketing personalization",
];

// General 검색 키워드 (10개)
const GENERAL_KEYWORDS = [
  "digital marketing trends 2024",
  "advertising industry news",
  "ad spend forecast",
  "marketing technology trends",
  "digital advertising growth",
  "marketing budget trends",
  "adtech martech investment",
  "advertising regulation news",
  "digital marketing innovation",
  "marketing AI automation",
];

// 모든 키워드 통합
const SEARCH_KEYWORDS = [
  ...ADTECH_KEYWORDS,
  ...MARTECH_KEYWORDS,
  ...GENERAL_KEYWORDS,
];

// 카테고리 분류 기준
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  adtech: [
    // Core AdTech
    "programmatic", "rtb", "dsp", "ssp", "real-time bidding", "auction",
    "ad tech", "adtech", "mobile ad", "in-app", "app advertising",
    "rewarded ad", "interstitial", "banner ad", "video ad", "native ad",
    "ad network", "ad exchange", "ad server", "header bidding",
    // Attribution & Privacy
    "skadnetwork", "skan", "privacy sandbox",
    "idfa", "att", "gaid", "advertising id", "app tracking",
    "cookieless", "privacy-first",
    // Video & Display
    "ctv", "ott", "connected tv", "streaming ad", "display ad", "avod",
    // Retail Media
    "retail media", "commerce media", "shoppable",
    // Ad Fraud
    "ad fraud", "brand safety", "viewability"
  ],
  martech: [
    // MMP Vendors
    "mmp", "appsflyer", "adjust", "branch", "singular", "kochava", "airbridge",
    "mobile measurement", "attribution",
    // Analytics & CDP
    "amplitude", "mixpanel", "firebase", "ga4", "google analytics",
    "heap", "posthog", "analytics platform",
    "cdp", "customer data platform", "segment", "mparticle", "tealium", "rudderstack",
    // Engagement
    "braze", "clevertap", "onesignal", "leanplum", "iterable", "moengage", "insider",
    // CRM & Marketing Automation
    "salesforce", "hubspot", "marketing cloud",
    "martech", "marketing tech", "marketing automation", "crm",
    "customer data", "personalization", "segmentation",
    "email marketing", "push notification", "engagement", "retention",
    "lifecycle", "journey", "campaign management", "a/b test"
  ],
  // general은 기본값으로 사용
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

    return items.slice(0, 3); // 키워드당 최대 3개 (총 ~100개 수집 목표)
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

  return "general"; // 기본값
}

// 최근 48시간 내 뉴스인지 확인
function isRecent(pubDate: string): boolean {
  const newsDate = new Date(pubDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 48;
}

// Gemini API rate limit: 5 RPM, 20 RPD (free tier)
// Cron runs 4 times/day (09:00, 12:00, 15:00, 18:00 KST)
// Each run processes 4-5 items = 16-20 items/day total
const ITEMS_PER_BATCH = 4; // 한 번에 4개 처리 (60초 타임아웃 내 안전하게)
const ITEM_DELAY_MS = 13000; // 13s delay between items (분당 4-5개)
const KEYWORDS_PER_BATCH = 20; // 한 번에 수집할 키워드 수

// Gemini 모델 우선순위 (메인 → 백업)
const GEMINI_MODELS = [
  "gemini-3-flash",
  "gemini-2.5-flash-lite",
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
              maxOutputTokens: 1024,
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

async function processWithGemini(newsItems: NewsItem[]): Promise<ProcessedNews[]> {
  const results: ProcessedNews[] = [];
  const itemsToProcess = newsItems.slice(0, ITEMS_PER_BATCH);

  console.log(`Processing ${itemsToProcess.length} items (${newsItems.length} total pending)`);

  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
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

      const result = await callGeminiWithFallback(prompt);

      if (!result) {
        console.log("All models rate limited, stopping batch");
        break;
      }

      const { data } = result;
      const textContent = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
        ?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
        console.log(`✓ [${i + 1}/${itemsToProcess.length}] ${item.title.slice(0, 50)}...`);
      }
    } catch (error) {
      console.error(`✗ Error: ${item.title.slice(0, 50)}...`, error);
    }

    // 아이템 간 대기 (마지막 제외)
    if (i < itemsToProcess.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, ITEM_DELAY_MS));
    }
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Rate limiting
    }

    // 중복 제거 (URL 기준)
    const uniqueNews = allNews.filter(
      (item, index, self) => index === self.findIndex((t) => t.link === item.link)
    );

    console.log(`Found ${uniqueNews.length} unique news items`);

    // 최근 24시간 뉴스만 필터링
    const recentNews = uniqueNews.filter((item) => isRecent(item.pubDate));
    console.log(`Recent news (24h): ${recentNews.length} items`);

    // 2. 기존 raw URL 체크 (중복 방지)
    const { data: existingRawUrls } = await supabase
      .from("ad_news_raw")
      .select("source_url");

    const existingRawUrlSet = new Set(existingRawUrls?.map((r) => r.source_url) || []);
    const newRawItems = recentNews.filter((item) => !existingRawUrlSet.has(item.link));

    console.log(`${newRawItems.length} new raw items to save`);

    // 3. Raw 뉴스 저장 (모든 뉴스 링크)
    if (newRawItems.length > 0) {
      const rawNewsData = newRawItems.map((item) => ({
        title: item.title,
        source: item.source,
        source_url: item.link,
        category: classifyCategory(item.title, ""),
        published_at: new Date(item.pubDate).toISOString(),
        is_processed: false,
      }));

      const { error: rawError } = await supabase.from("ad_news_raw").insert(rawNewsData);
      if (rawError) {
        console.error("Raw news insert error:", rawError);
      } else {
        console.log(`Saved ${rawNewsData.length} raw news items`);
      }
    }

    // 4. 미처리 뉴스 가져오기 (is_processed = false)
    const { data: unprocessedRaw } = await supabase
      .from("ad_news_raw")
      .select("title, source, source_url, published_at")
      .eq("is_processed", false)
      .order("published_at", { ascending: false })
      .limit(ITEMS_PER_BATCH);

    const itemsForGemini = (unprocessedRaw || []).map((item) => ({
      title: item.title,
      link: item.source_url,
      pubDate: item.published_at,
      source: item.source,
    }));

    console.log(`Unprocessed items in raw: ${itemsForGemini.length}`);

    if (itemsForGemini.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Raw news saved, no unprocessed items for Gemini",
          rawSaved: newRawItems.length,
          processed: 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Gemini로 처리
    console.log(`Processing ${itemsForGemini.length} items with Gemini...`);
    const processedNews = await processWithGemini(itemsForGemini);

    // 6. 처리된 뉴스 DB에 저장
    if (processedNews.length > 0) {
      const { error } = await supabase.from("ad_news").insert(processedNews);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      // Raw 테이블에서 처리됨 표시
      const processedUrls = processedNews.map((n) => n.source_url);
      await supabase
        .from("ad_news_raw")
        .update({ is_processed: true })
        .in("source_url", processedUrls);
    }

    // 7. Daily Digest 업데이트
    const today = new Date().toISOString().split("T")[0];
    const { data: todayRaw } = await supabase
      .from("ad_news_raw")
      .select("category")
      .gte("collected_at", today);

    const counts = {
      adtech: todayRaw?.filter((n) => n.category === "adtech").length || 0,
      martech: todayRaw?.filter((n) => n.category === "martech").length || 0,
      general: todayRaw?.filter((n) => n.category === "general").length || 0,
    };

    await supabase.from("ad_news_digest").upsert({
      digest_date: today,
      total_news_count: todayRaw?.length || 0,
      adtech_count: counts.adtech,
      martech_count: counts.martech,
      general_count: counts.general,
    }, { onConflict: "digest_date" });

    // 8. 오래된 뉴스 정리 (30일 이상)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("ad_news").delete().lt("created_at", thirtyDaysAgo);
    await supabase.from("ad_news_raw").delete().lt("collected_at", thirtyDaysAgo);

    return new Response(
      JSON.stringify({
        message: "News fetch completed",
        fetched: uniqueNews.length,
        recentNews: recentNews.length,
        rawSaved: newRawItems.length,
        processed: processedNews.length,
        todayCounts: counts,
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
