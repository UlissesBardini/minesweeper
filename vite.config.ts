import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      directoryAsNamespace: false,
      globalNamespaces: [],
      dts: 'src/types/components.d.ts',
    }),
    AutoImport({
      imports: ['vue'],
      dirs: ['src/composables'],
      dts: 'src/types/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@models': path.resolve(__dirname, 'src/models')
    },
  },
  base: '/minesweeper/'
})
