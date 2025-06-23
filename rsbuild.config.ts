import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/entry.tsx',
    },
  },
  output: {
    distPath: {
      root: '.', // 输出到根目录
    },
    cleanDistPath: false, // 避免清空根目录其他文件
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  },
});
      