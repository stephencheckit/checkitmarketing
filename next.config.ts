import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/gtm-exec/appendix/[page]": ["./private/fy28-plan/**"],
  },
};

export default nextConfig;
