import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { antdLessVars, antdLessVarsM } from './src/style';
import vitePluginImp from 'vite-plugin-imp';
import { visualizer } from 'rollup-plugin-visualizer';
import url from 'node:url';

const ___dirname = path.dirname(url.fileURLToPath(import.meta.url));
const componentsDir = path.join(___dirname, './src/components');

// https://vitejs.dev/config/
export default defineConfig({
  // root: 'src',
  build: {
    outDir: path.join(__dirname, './build'),
    emptyOutDir: true,
    rollupOptions: {
      // external: ['lodash', 'lodash/default'],
      output: {
        manualChunks(id, meta) {
          if (id.includes(componentsDir)) {
            return 'moeflow-components';
          } else if (id.includes('antd')) {
            return 'vendor-antd';
          }
          return null;
        },
      },
    },
  },
  define: {
    'process.env.REACT_APP_BASE_URL': JSON.stringify(
      process.env.REACT_APP_BASE_URL ?? '/api/',
    ),
    'process.env.REACT_APP__NUM_BASE_URL': JSON.stringify(
      process.env.REACT_APP_BASE_URL ?? 'wss://api.fwgxt.top/moeflow',
    ),
  },
  resolve: {
    alias: {},
  },
  plugins: [
    vitePluginImp({
      libList: [
        {
          // antd 按需导入
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`,
        },
        {
          // antd-mobile 按需导入
          libName: 'antd-mobile',
          style: (name) => `antd-mobile/es/${name}/style`,
        },
      ],
    }),
    react({
      jsxImportSource: '@emotion/core',
    }),
    visualizer({}),
    splitVendorChunkPlugin(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 覆盖 antd 的 Less 样式
        javascriptEnabled: true,
        modifyVars: {
          ...antdLessVars,
          ...antdLessVarsM,
        },
      },
    },
  },
});
