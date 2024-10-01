import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import { builtinModules } from "node:module";

const tanstack = TanStackRouterVite({
  routesDirectory: 'src/client/routes',
  generatedRouteTree: 'src/client/routeTree.gen.ts'
})

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [
        tanstack,
      ],
      build: {
        rollupOptions: {
          input: './src/client/clientIndex.tsx',
          output: {
            entryFileNames: 'static/client.js',
            // TanStackRouter lazy load assets
            chunkFileNames: 'static/[name]-[hash].js'
          }
        }
      }
    }
  } else if (mode === 'server') {
    return {
      ssr: {
        // server side のコードの依存関係もバンドルする
        noExternal: process.env.NODE_ENV === "production" || undefined,
        external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
      },
      build: {
        ssr: true,
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
          input: './src/server/serverIndex.tsx',
          output: {
            entryFileNames: 'index.js',
          },
        }
      }
    }
  } else {
    // dev server
    return {
      plugins: [
        tanstack,
        devServer({
          adapter,
          entry: 'src/server/serverIndex.tsx'
        })
      ],
    }
  }
})
