import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The old Supabase-backed news list was replaced by the daily brief.
      { source: "/news", destination: "/brief", permanent: true },
      { source: "/news/:path*", destination: "/brief", permanent: true },
    ];
  },
};

export default nextConfig;
