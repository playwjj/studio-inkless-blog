import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'

// Module-level Promise cache — persists across requests in the same Worker instance.
// Using Promises (not values) prevents race conditions on concurrent cold-start requests.
let wasmReady: Promise<void> | null = null
let fontReady: Promise<ArrayBuffer> | null = null

function ensureWasm(origin: string): Promise<void> {
  if (!wasmReady) {
    wasmReady = fetch(`${origin}/resvg.wasm`)
      .then(res => initWasm(res))
      .catch((err) => {
        wasmReady = null // allow retry on next request
        throw err
      })
  }
  return wasmReady
}

function loadFont(origin: string): Promise<ArrayBuffer> {
  if (!fontReady) {
    fontReady = fetch(`${origin}/fonts/inter-bold.ttf`)
      .then(res => res.arrayBuffer())
      .catch((err) => {
        fontReady = null
        throw err
      })
  }
  return fontReady
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = String(query.title || 'Studio Inkless Blog').slice(0, 120)
  const category = String(query.category || '').slice(0, 50)
  const author = String(query.author || '').slice(0, 50)

  const { origin } = getRequestURL(event)

  const [fontData] = await Promise.all([
    loadFont(origin),
    ensureWasm(origin),
  ])

  // Responsive font size based on title length
  const titleSize = title.length > 60 ? 52 : title.length > 40 ? 60 : 68

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)',
          fontFamily: 'Inter',
        },
        children: [
          // Top accent bar
          {
            type: 'div',
            props: {
              style: {
                height: '4px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%)',
              },
              children: '',
            },
          },

          // Inner content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: '1',
                padding: '64px 88px',
              },
              children: [
                // Main content: category badge + title
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                    },
                    children: [
                      // Category badge (only if provided)
                      ...(category ? [
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignSelf: 'flex-start',
                              padding: '8px 20px',
                              borderRadius: '999px',
                              background: 'rgba(139,92,246,0.2)',
                              border: '1px solid rgba(139,92,246,0.4)',
                              color: '#c4b5fd',
                              fontSize: '22px',
                              fontWeight: '600',
                            },
                            children: category,
                          },
                        },
                      ] : []),

                      // Title
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#f1f5f9',
                            fontSize: `${titleSize}px`,
                            fontWeight: '700',
                            lineHeight: '1.2',
                            maxWidth: '980px',
                          },
                          children: title,
                        },
                      },
                    ],
                  },
                },

                // Footer: author + site branding
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                    children: [
                      // Author name
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#94a3b8',
                            fontSize: '22px',
                          },
                          children: author,
                        },
                      },

                      // Site branding
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: '#8b5cf6',
                                },
                                children: '',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: '#e2e8f0',
                                  fontSize: '22px',
                                  fontWeight: '600',
                                },
                                children: 'Studio Inkless Blog',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  )

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const png = resvg.render().asPng()

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable')

  return png
})
