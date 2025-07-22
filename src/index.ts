import { Hono } from 'hono'
import Parser from 'rss-parser'

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

export default app
