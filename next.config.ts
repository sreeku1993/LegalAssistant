import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // 1. Keeps heavy AI packages isolated from frontend bundles
  serverExternalPackages: [
    "@xenova/transformers",
    "onnxruntime-node"
  ],

  // 2. ROOT LEVEL PROPERTY: Tells Next.js to strip heavy, unused OS binaries from your serverless function
  outputFileTracingExcludes: {
    '*': [
      'node_modules/onnxruntime-node/bin/napi-v3/win32/**',
      'node_modules/onnxruntime-node/bin/napi-v3/darwin/**',
      'node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**', // Delete if your Vercel functions deploy to ARM architecture
      'node_modules/@xenova/transformers/deps/**',
    ],
  },
};

export default nextConfig;
