import express from 'express'
import { Client } from '@notionhq/client'
import { config } from 'dotenv'
import { transformPageObject } from './util.js'
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
    const newPage = await addComments(req.body)
    res.sendStatus(201).json(newPage)
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
      comments.set(id, transformPageObject(id, properties))
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
  // const page = await notion.request({
  await notion.request({
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
  // return transformPageObject(page.properties)
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})