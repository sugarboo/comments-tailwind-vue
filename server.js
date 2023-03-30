import express from 'express'
import { Client } from '@notionhq/client'
import { config } from 'dotenv'
const {
  NOTION_KEY,
  NOTION_DB_ID,
  NOTION_CURR_USER_ID
} = config()?.parsed

const notion = new Client({ auth: NOTION_KEY })

const app = express().use(express.json())
const port = 5172

app.get('/comments', async (req, res) => {
  try {
    const allComments = await getAllComments()
    res.json(allComments)
  } catch (error) {
    console.log(error)
    res.sendStatus('500')
  }
})

app.post('/comments', async (req, res) => {
  try {
    await addComments(req.body)
    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

const getAllComments = async() => {
  try {
    const { results = [] } = await notion.databases.query({ database_id: NOTION_DB_ID })
    
    const comments = new Map()

    results.forEach((page) => {
      const { id, properties } = page
      comments.set(id, {
        id: id,
        user: properties?.user.rich_text[0]?.plain_text,
        time: properties?.time.created_time,
        content: properties?.content?.rich_text[0]?.plain_text,
        avatar: properties?.avatar?.url,
        replies: properties?.replies?.relation,
        replyTo: properties?.replyTo?.relation[0]?.id
      })
    })

    const commentsPopulated = [...comments.values()].reduce((acc, curr) => {
      if(!curr.replyTo) {
        curr.replies = curr.replies.map((reply) => comments.get(reply.id))
        acc.push(curr)
      }
      return acc
    }, [])

    return commentsPopulated
  } catch (error) {
    console.log('getAllComments', error)
  }
}

const addComments = async ({ content, replyTo = '' }) => {
  const id = (await notion.databases.query({ database_id: NOTION_DB_ID })).results.length + 1
  const { avatar_url, name } = await notion.users.retrieve({ user_id: NOTION_CURR_USER_ID })
  notion.request({
    method: 'POST',
    path: 'pages',
    body: {
      parent: { database_id: NOTION_DB_ID },
      properties: {
        id: {
          title: [
            {
              text: {
                content: id.toString()
              }
            }
          ]
        },
        user: {
          rich_text: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        avatar: {
          url: avatar_url
        },
        content: {
          rich_text: [
            {
              text: {
                content
              }
            }
          ]
        },
        ...(replyTo && {
          replyTo: {
            relation: [
              {
                id: replyTo
              }
            ]
          }
        })
      }
    }
  })
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})