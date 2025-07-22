import { Hono } from 'hono'
import Parser from 'rss-parser'
import { serve } from '@hono/node-server'

const app = new Hono()
const parser = new Parser()

app.get('/feed', async (c) => {
  const channel = c.req.query('channel')
  if (!channel) return c.text('Missing ?channel= parameter', 400)

  const feedUrl = `https://rsshub.app/telegram/channel/${channel}`
  try {
    const feed = await parser.parseURL(feedUrl)
    return c.json(feed)
  } catch (err) {
    return c.text('Failed to fetch feed: ' + (err as Error).message, 500)
  }
})

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || '3000'),
})
