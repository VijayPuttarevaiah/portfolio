import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next generates CLAUDE.md and AGENTS.md on dev otherwise. This repo is kept
  // free of AI-assistant files, and a local .git/info/exclude does not travel
  // with a clone — so turn the generation off at the source.
  agentRules: false,
};

export default nextConfig;
