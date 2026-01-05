-- Migrate existing MDX blog posts to ad_blog table

INSERT INTO ad_blog (slug, title_ko, title_en, description_ko, description_en, content, category_ko, category_en, emoji, image_url, featured, published_at) VALUES

-- 1. Rewarded Ads 2025 (Trends)
('rewarded-ads-2025',
 '2025년 리워드 광고 트렌드: 왜 모든 앱이 도입해야 하는가',
 '2025 Rewarded Ad Trends: Why Every App Should Implement Them',
 '리워드 광고는 사용자 경험을 해치지 않으면서 높은 수익을 창출하는 가장 효과적인 광고 포맷입니다. 2025년 최신 트렌드와 성공 사례를 분석합니다.',
 'Rewarded ads are the most effective ad format that generates high revenue without harming user experience. We analyze the latest 2025 trends and success stories.',
 '## Why Rewarded Ads Are Dominating in 2025

Rewarded ads have become the cornerstone of mobile app monetization. Unlike intrusive ad formats, rewarded ads offer a win-win scenario: users voluntarily watch ads in exchange for in-app rewards, and developers earn premium revenue.

### Key Statistics for 2025

- **eCPM**: Rewarded ads consistently deliver 3-5x higher eCPM compared to banner ads
- **User Satisfaction**: 79% of users prefer rewarded ads over other ad formats
- **Retention**: Apps with well-implemented rewarded ads see 20% higher retention rates

## Best Practices for Implementation

### 1. Strategic Placement

Place rewarded ads at natural break points in your app:
- After completing a level in games
- To unlock premium features temporarily
- For extra lives or attempts
- To skip wait times

### 2. Clear Value Proposition

Always communicate what users will receive:
- Show the exact reward before the ad plays
- Display a countdown timer during the ad
- Confirm reward delivery immediately after

### 3. Frequency Capping

Avoid overwhelming users:
- Limit to 3-5 rewarded ad views per session
- Allow at least 60 seconds between offers
- Don''t force rewarded ads - keep them optional

## 2025 Trends to Watch

| Trend | Impact |
|-------|--------|
| Interactive Rewards | Higher engagement through playable reward previews |
| AI Optimization | Machine learning for optimal placement timing |
| Privacy-First | Contextual targeting without personal data |

## Conclusion

Rewarded ads represent the future of sustainable app monetization. By respecting user choice and providing genuine value, developers can build profitable apps while maintaining positive user experiences.',
 '트렌드', 'Trends', '📊',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
 true, '2025-12-30 00:00:00+09'),

-- 2. Banner Sizes (Guide)
('banner-sizes',
 '모바일 배너 광고 사이즈 완벽 가이드: 어떤 크기가 가장 효과적인가?',
 'Complete Guide to Mobile Banner Ad Sizes: Which Size Works Best?',
 '320x50, 300x250, 320x100... 다양한 배너 사이즈 중 어떤 것이 CTR과 eCPM이 가장 높을까요? 실제 데이터 기반으로 분석합니다.',
 '320x50, 300x250, 320x100... Which banner size has the highest CTR and eCPM? We analyze based on real data.',
 '## Understanding Mobile Banner Ad Sizes

Choosing the right banner size can significantly impact your ad revenue. Let''s dive into the most common mobile banner formats and their performance characteristics.

## Standard Banner Sizes

### 320x50 (Mobile Banner)

The most common mobile banner size, appearing at the top or bottom of the screen.

- **Pros**: Non-intrusive, high fill rate, works on all devices
- **Cons**: Lower eCPM due to smaller size
- **Best for**: Apps requiring constant ad visibility without disrupting UX

### 300x250 (Medium Rectangle)

A larger, more prominent banner that typically appears within content.

- **Pros**: Higher eCPM, better engagement, more creative space
- **Cons**: More intrusive, requires dedicated placement
- **Best for**: Content feeds, between sections, natural breaks

### 320x100 (Large Mobile Banner)

Double the height of standard banners, offering more visibility.

- **Pros**: Higher CTR than 320x50, still relatively non-intrusive
- **Cons**: Takes more screen real estate
- **Best for**: Premium placements, high-value screens

### Adaptive Banners

Automatically adjusts to the device''s screen width for optimal display.

- **Pros**: Perfect fit on any device, higher fill rates
- **Cons**: Less predictable layout
- **Best for**: New apps, cross-device experiences

## Performance Comparison

| Size | Avg eCPM | CTR | Fill Rate |
|------|----------|-----|-----------|
| 320x50 | $0.50-1.00 | 0.3% | 95%+ |
| 300x250 | $2.00-4.00 | 0.8% | 85% |
| 320x100 | $1.00-2.00 | 0.5% | 90% |
| Adaptive | $1.50-3.00 | 0.6% | 95%+ |

## Best Practices

1. **Test multiple sizes**: A/B test different banner sizes in your app
2. **Consider context**: Use larger banners in content-rich areas
3. **Monitor metrics**: Track both revenue and user experience metrics
4. **Refresh wisely**: Implement smart refresh intervals (30-60 seconds)

## Conclusion

The best banner size depends on your app''s layout and user experience priorities. Start with adaptive banners for flexibility, then optimize based on your specific performance data.',
 '가이드', 'Guide', '📱',
 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop',
 false, '2025-12-28 00:00:00+09'),

-- 3. eCPM Optimization (Analysis)
('ecpm-optimization',
 'eCPM 최적화 전략: 광고 수익을 2배로 늘리는 방법',
 'eCPM Optimization Strategy: How to Double Your Ad Revenue',
 '같은 트래픽으로 더 많은 수익을 올리는 비결. 워터폴 설정, 메디에이션 최적화, A/B 테스트 전략을 공개합니다.',
 'The secret to earning more revenue with the same traffic. We reveal waterfall settings, mediation optimization, and A/B testing strategies.',
 '## What is eCPM and Why Does It Matter?

eCPM (effective Cost Per Mille) represents how much you earn per 1,000 ad impressions. Optimizing eCPM is crucial for maximizing ad revenue without increasing traffic.

## Key Optimization Strategies

### 1. Mediation Setup

Use ad mediation to maximize fill rates and competition:

- **AdMob Mediation**: Great for beginners, easy setup
- **AppLovin MAX**: Advanced features, higher eCPM potential
- **ironSource**: Strong for gaming apps

### 2. Waterfall Optimization

Configure your waterfall to prioritize high-paying networks:

1. Set initial floor prices based on historical data
2. Order networks by average eCPM
3. Include a catch-all network at the bottom
4. Review and adjust weekly

### 3. A/B Testing

Continuously test and optimize:

- Ad placements and timing
- Frequency caps
- Ad format mix
- Floor prices

## Quick Wins

| Strategy | Expected Impact |
|----------|-----------------|
| Add 2-3 mediation networks | +20-30% eCPM |
| Optimize floor prices | +10-15% eCPM |
| Implement smart refresh | +15-25% revenue |
| Add rewarded ads | +40-60% total revenue |

## Conclusion

eCPM optimization is an ongoing process. Start with the basics, measure everything, and continuously iterate for the best results.',
 '분석', 'Analysis', '💰',
 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=300&fit=crop',
 false, '2025-12-25 00:00:00+09'),

-- 4. Interstitial Best Practices (Analysis)
('interstitial-best-practices',
 '전면 광고 베스트 프랙티스: 이탈률 없이 수익 극대화하기',
 'Interstitial Ad Best Practices: Maximize Revenue Without Losing Users',
 '전면 광고는 양날의 검입니다. 잘못 사용하면 사용자 이탈을, 잘 사용하면 높은 수익을 가져옵니다. 올바른 타이밍과 빈도 설정법을 알아봅니다.',
 'Interstitial ads are a double-edged sword. Misuse leads to user churn, proper use brings high revenue. Learn the right timing and frequency settings.',
 '## The Double-Edged Sword of Interstitial Ads

Interstitial ads can be your highest-earning ad format or your biggest user retention killer. The difference lies entirely in implementation.

## When to Show Interstitials

### Good Timing

- Between game levels
- After completing a task
- When navigating between major sections
- After natural content breaks

### Bad Timing

- Immediately on app launch
- During active user engagement
- Multiple times in quick succession
- When user is mid-action

## Frequency Best Practices

| App Type | Recommended Frequency |
|----------|----------------------|
| Casual Games | Every 2-3 levels |
| Utility Apps | Every 3-4 actions |
| Content Apps | Every 4-5 articles |
| Productivity | Minimal or none |

## User Experience Tips

1. **Preload ads**: Ensure instant display without loading delays
2. **Clear close buttons**: Make dismissal easy and obvious
3. **Skip options**: Consider offering skip after 5 seconds
4. **Frequency caps**: Limit to 3-4 per session maximum

## Measuring Success

Track these metrics to ensure healthy implementation:

- **Session length**: Should remain stable or increase
- **Day 1/7/30 retention**: Monitor for negative trends
- **App store ratings**: Watch for ad-related complaints
- **eCPM trends**: Higher isn''t always better if users leave

## Conclusion

Interstitial ads require careful balance. Prioritize user experience, and the revenue will follow sustainably.',
 '분석', 'Analysis', '📺',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
 false, '2025-12-22 00:00:00+09'),

-- 5. Gaming Ads Case Study
('gaming-ads',
 '게임 앱 광고 수익화 성공 사례: 월 $10,000 달성한 인디 개발자 이야기',
 'Gaming App Monetization Success: How an Indie Developer Reached $10K/Month',
 '작은 게임 앱이 리워드 광고와 전면 광고의 적절한 조합으로 월 $10,000 수익을 달성한 실제 사례를 분석합니다.',
 'A real case study of how a small gaming app achieved $10,000 monthly revenue through the right combination of rewarded and interstitial ads.',
 '## The Journey to $10K/Month

This is the story of an indie game developer who transformed a simple casual game into a profitable venture through strategic ad monetization.

## The Game: Puzzle Master

- **Genre**: Casual puzzle game
- **DAU**: 15,000 users
- **Sessions per day**: 3.2 average
- **Session length**: 8 minutes average

## Monetization Strategy

### Ad Format Mix

| Format | Placement | Revenue Share |
|--------|-----------|---------------|
| Rewarded | Extra lives, hints | 55% |
| Interstitial | Between levels | 35% |
| Banner | Bottom of screen | 10% |

### Key Decisions

1. **Rewarded ads for core mechanics**: Players can watch ads for extra lives
2. **Interstitial after every 3 levels**: Balanced frequency
3. **No ads for first 5 levels**: New user experience protection
4. **VIP ad-free option**: $2.99 for ad removal

## Results

- **Month 1**: $2,500
- **Month 3**: $5,800
- **Month 6**: $10,200

## Lessons Learned

1. Rewarded ads generate the most revenue per impression
2. User retention is more important than short-term revenue
3. Testing different frequencies is crucial
4. Premium ad-free option can boost overall revenue

## Conclusion

Success in game monetization comes from balancing user experience with revenue goals. Start conservative, measure everything, and optimize gradually.',
 '사례 분석', 'Case Study', '🎮',
 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=300&fit=crop',
 false, '2025-12-20 00:00:00+09'),

-- 6. Privacy Ads (Trends)
('privacy-ads',
 'iOS ATT와 Android Privacy Sandbox: 광고 수익에 미치는 영향과 대응 전략',
 'iOS ATT & Android Privacy Sandbox: Impact on Ad Revenue and Strategies',
 '프라이버시 규제 강화로 타겟팅이 어려워지고 있습니다. SKAdNetwork, Privacy Sandbox에 대응하는 광고 전략을 알아봅니다.',
 'Privacy regulations are making targeting harder. Learn advertising strategies to adapt to SKAdNetwork and Privacy Sandbox.',
 '## The Privacy Revolution in Mobile Advertising

Mobile advertising is undergoing its biggest transformation since the smartphone era began. Understanding and adapting to these changes is crucial for sustainable monetization.

## iOS App Tracking Transparency (ATT)

### What Changed

- Users must explicitly opt-in to tracking
- Only 25-35% of users typically opt-in
- IDFA availability dropped significantly

### Impact on Revenue

| Metric | Pre-ATT | Post-ATT |
|--------|---------|----------|
| CPM (iOS) | $12-15 | $8-10 |
| Fill Rate | 95% | 90% |
| Targeting Accuracy | High | Medium |

## Android Privacy Sandbox

### Key Components

1. **Topics API**: Broad interest-based targeting
2. **Attribution Reporting**: Privacy-preserving measurement
3. **FLEDGE**: On-device ad selection

### Timeline

- 2024: Testing phase
- 2025: Gradual rollout
- 2026: Full implementation expected

## Adaptation Strategies

### 1. First-Party Data

Build direct relationships with users:
- In-app accounts and preferences
- Contextual data collection
- Engagement-based segmentation

### 2. Contextual Advertising

Focus on content rather than user identity:
- App category targeting
- Content-based placements
- Time-of-day optimization

### 3. SKAdNetwork Optimization

Maximize iOS attribution:
- Implement all conversion values
- Use predictive analytics
- Focus on early signals

## Conclusion

Privacy changes are not obstacles but opportunities to build more sustainable, user-respecting monetization strategies. Adapt early and thrive.',
 '트렌드', 'Trends', '🔒',
 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop',
 false, '2025-12-18 00:00:00+09'),

-- 7. AdMob vs AppLovin (Comparison)
('admob-vs-applovin',
 'AdMob vs AppLovin MAX: 어떤 광고 플랫폼을 선택해야 할까?',
 'AdMob vs AppLovin MAX: Which Ad Platform Should You Choose?',
 '가장 인기 있는 두 광고 플랫폼을 fill rate, eCPM, 사용 편의성, 메디에이션 지원 측면에서 비교 분석합니다.',
 'We compare the two most popular ad platforms in terms of fill rate, eCPM, ease of use, and mediation support.',
 '## The Two Giants of Mobile Ad Monetization

When it comes to mobile ad monetization, AdMob and AppLovin MAX dominate the market. Let''s compare them across key metrics.

## Overview

| Feature | AdMob | AppLovin MAX |
|---------|-------|--------------|
| Parent Company | Google | AppLovin |
| Best For | Beginners | Advanced users |
| Integration | Easy | Moderate |
| Mediation | Yes | Yes |

## Detailed Comparison

### Fill Rate

- **AdMob**: 95%+ globally, excellent Google demand
- **AppLovin MAX**: 90-95%, strong with gaming apps

### eCPM Performance

- **AdMob**: Consistent, reliable rates
- **AppLovin MAX**: Often higher, especially for games

### Ease of Use

- **AdMob**: Simple dashboard, quick setup
- **AppLovin MAX**: More complex, steeper learning curve

### Mediation Capabilities

- **AdMob**: Good network support, waterfall + bidding
- **AppLovin MAX**: Excellent bidding, more network partners

## When to Choose AdMob

1. You''re new to ad monetization
2. You need quick implementation
3. Your app isn''t a game
4. You want Google ecosystem integration

## When to Choose AppLovin MAX

1. You have a gaming app
2. You want maximum eCPM
3. You need advanced mediation
4. You''re comfortable with complexity

## Conclusion

Both platforms are excellent choices. AdMob offers simplicity and reliability, while AppLovin MAX provides advanced features and potentially higher revenue for those willing to invest time in optimization.',
 '비교', 'Comparison', '📈',
 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=300&fit=crop',
 false, '2025-12-15 00:00:00+09')

ON CONFLICT (slug) DO NOTHING;
