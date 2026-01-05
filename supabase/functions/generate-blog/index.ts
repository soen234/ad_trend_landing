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

async function callGeminiWithFallback(prompt: string, maxTokens = 4096, jsonMode = false): Promise<{ data: unknown; model: string } | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const generationConfig: Record<string, unknown> = {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
      };

      // JSON 모드 설정 (더 안정적인 JSON 응답)
      if (jsonMode) {
        generationConfig.responseMimeType = "application/json";
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.log(`${model} error: ${data.error.status || data.error.code}`);
        if (data.error.code === 429 || data.error.status === "RESOURCE_EXHAUSTED") {
          console.log(`${model} rate limited, trying next model...`);
          continue;
        }
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

function extractGeminiText(data: unknown): string {
  return (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    ?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50)
    .replace(/-$/, "");
}

// Blog categories matching existing content
const BLOG_CATEGORIES = [
  { id: "guide", category_en: "Guide", category_ko: "가이드", emoji: "📖" },
  { id: "trend", category_en: "Trends", category_ko: "트렌드", emoji: "📊" },
  { id: "analysis", category_en: "Analysis", category_ko: "분석", emoji: "🔍" },
  { id: "case-study", category_en: "Case Study", category_ko: "사례 분석", emoji: "📋" },
  { id: "comparison", category_en: "Comparison", category_ko: "비교", emoji: "⚖️" },
];

// Unsplash images by category (curated for ad/marketing content)
const CATEGORY_IMAGES: Record<string, string[]> = {
  guide: [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop",
  ],
  trend: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=300&fit=crop",
  ],
  analysis: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=300&fit=crop",
  ],
  "case-study": [
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop",
  ],
  comparison: [
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
  ],
};

function getRandomImage(categoryId: string): string {
  const images = CATEGORY_IMAGES[categoryId] || CATEGORY_IMAGES.trend;
  return images[Math.floor(Math.random() * images.length)];
}

interface NewsItem {
  title: string;
  title_ko: string;
  summary: string;
  summary_ko: string;
  category: string;
}

// Existing blog topics (hardcoded MDX blogs)
const EXISTING_BLOG_TOPICS = [
  "AdMob vs AppLovin MAX comparison",
  "Mobile banner ad sizes guide",
  "eCPM optimization strategy",
  "Gaming app monetization case study",
  "Interstitial ad best practices",
  "iOS ATT and Android Privacy Sandbox",
  "Rewarded ad trends 2025",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. 기존 DB 블로그 주제 가져오기
    const { data: existingBlogs } = await supabase
      .from("ad_blog")
      .select("title_en, category_en")
      .order("published_at", { ascending: false })
      .limit(20);

    const existingDbTopics = existingBlogs?.map((b) => b.title_en) || [];
    const allExistingTopics = [...EXISTING_BLOG_TOPICS, ...existingDbTopics];

    console.log(`Existing topics: ${allExistingTopics.length}`);

    // 2. 최근 3일간 뉴스 가져오기
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentNews, error: newsError } = await supabase
      .from("ad_news")
      .select("title, title_ko, summary, summary_ko, category")
      .gte("published_at", threeDaysAgo)
      .order("published_at", { ascending: false })
      .limit(20);

    if (newsError) {
      throw new Error(`Failed to fetch news: ${newsError.message}`);
    }

    if (!recentNews || recentNews.length < 3) {
      return new Response(
        JSON.stringify({ message: "Not enough news to generate blog", newsCount: recentNews?.length || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${recentNews.length} recent news items`);

    // 3. 뉴스 기반 블로그 주제 선정 (기존 주제 회피)
    const newsContext = recentNews.slice(0, 10).map((n: NewsItem, i: number) =>
      `${i + 1}. [${n.category.toUpperCase()}] ${n.title}\n   ${n.summary}`
    ).join("\n\n");

    const existingTopicsStr = allExistingTopics.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join("\n");

    const topicPrompt = `You are an expert blog writer for the mobile advertising industry.

RECENT NEWS:
${newsContext}

EXISTING BLOG TOPICS (avoid similar topics):
${existingTopicsStr}

CATEGORIES (choose one):
- guide: How-to guides and tutorials
- trend: Industry trends and forecasts
- analysis: Deep-dive analysis of specific topics
- case-study: Success stories and real examples
- comparison: Product or strategy comparisons

Requirements:
- Choose a NEW topic that is DIFFERENT from existing blogs
- Synthesize insights from recent news
- Focus on practical value for mobile app marketers/developers
- Make it educational and actionable

Return ONLY valid JSON:
{
  "topic_en": "Engaging title in English (max 70 chars)",
  "topic_ko": "Korean title translation",
  "description_en": "1-2 sentence description",
  "description_ko": "Korean description",
  "category_id": "guide|trend|analysis|case-study|comparison",
  "key_points": ["point1", "point2", "point3"]
}`;

    console.log("Generating blog topic...");
    const topicResult = await callGeminiWithFallback(topicPrompt, 2048, true);

    if (!topicResult) {
      return new Response(
        JSON.stringify({ message: "Failed to generate topic - all models exhausted" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const topicText = extractGeminiText(topicResult.data);
    let topic;
    try {
      const cleanContent = topicText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        topic = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in topic response");
      }
    } catch (e) {
      console.error("Failed to parse topic:", e, topicText);
      return new Response(
        JSON.stringify({ message: "Failed to parse topic response", raw: topicText.substring(0, 500) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const categoryInfo = BLOG_CATEGORIES.find((c) => c.id === topic.category_id) || BLOG_CATEGORIES[1]; // default to trend

    // 4. 중복 체크 (유사한 제목 존재 확인)
    const slug = generateSlug(topic.topic_en);
    const { data: existingBlog } = await supabase
      .from("ad_blog")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingBlog) {
      console.log(`Blog with slug "${slug}" already exists, skipping`);
      return new Response(
        JSON.stringify({ message: "Similar blog already exists", slug }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. 블로그 본문 생성
    const contentPrompt = `Write a comprehensive blog post for mobile advertising professionals.

TOPIC: ${topic.topic_en}
KEY POINTS TO COVER: ${topic.key_points.join(", ")}

CONTEXT (recent news for reference):
${newsContext}

REQUIREMENTS:
- Write in English
- Use Markdown formatting
- Include 3-5 main sections with ## headers
- Include practical tips and actionable insights
- Add a table or bullet points where appropriate
- Length: 800-1200 words
- Professional but accessible tone
- Include a brief conclusion

DO NOT include:
- The main title (it will be added separately)
- Any intro like "In this article..."
- Generic filler content

Start directly with the first section header (##).`;

    console.log("Generating blog content...");

    // Delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const contentResult = await callGeminiWithFallback(contentPrompt, 16384);

    if (!contentResult) {
      return new Response(
        JSON.stringify({ message: "Failed to generate content - all models exhausted" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = extractGeminiText(contentResult.data);

    if (!content || content.length < 500) {
      return new Response(
        JSON.stringify({ message: "Generated content too short", length: content?.length || 0 }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generated content: ${content.length} characters`);

    // 6. DB에 저장
    const now = new Date();
    // KST 날짜로 published_at 설정
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const blogPost = {
      slug,
      title_en: topic.topic_en,
      title_ko: topic.topic_ko,
      description_en: topic.description_en,
      description_ko: topic.description_ko,
      content,
      category_en: categoryInfo.category_en,
      category_ko: categoryInfo.category_ko,
      emoji: categoryInfo.emoji,
      image_url: getRandomImage(topic.category_id || "trend"),
      featured: false,
      published_at: kstDate.toISOString(),
    };

    const { error: insertError } = await supabase
      .from("ad_blog")
      .insert(blogPost);

    if (insertError) {
      throw new Error(`Failed to insert blog: ${insertError.message}`);
    }

    console.log(`Blog created: ${slug}`);

    return new Response(
      JSON.stringify({
        message: "Blog generated successfully",
        slug,
        title: topic.topic_en,
        contentLength: content.length,
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
