import { Hono } from 'hono'
import { apiApp } from './api/index';
import { renderToString } from 'react-dom/server'
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono()

app.route('/api', apiApp);
app.use('/static/*', serveStatic({ root: './' }))
app.use('/assets/*', serveStatic({ root: './' }))
app.get('*', (c) => {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js"></script>
          ) : (
            <script type="module" src="/src/client/clientIndex.tsx"></script>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    )
  )
})

export default app;

if (import.meta.env.PROD) {
  serve({
    fetch: app.fetch,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  }, (info) => {
    console.log(`Server running at http://${info.address}:${info.port}`)
  })
}
