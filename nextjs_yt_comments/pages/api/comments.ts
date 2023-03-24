import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { google } from 'googleapis'
const prisma = new PrismaClient()
const youtube = google.youtube('v3')
const API_KEY = process.env.YOUTUBE_API_KEY

// calls to database via prisma to save comments
async function saveComment(comment: any) {
  const savedComment = await prisma.comment.create({
    data: comment,
  })
  return savedComment
}

// calls to database via prisma to fetch comments by video id
async function getCommentsByVideoId(videoId: string) {

  // current time, and 24 hrs ago date
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const comments = await prisma.comment.findMany({
    where: {
      videoId,
      updatedAt: {
        gte: twentyFourHoursAgo,
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })
  return comments
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  // only GET method allowed, take videoIds from query
  if (method === 'GET') {
    const { videoIds } = req.query

    // if no videoIds sent, or if they're not string
    if (!videoIds || typeof videoIds !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid videoIds' })
    }

    // because videoIds are requested to be separated by comma by user, we split into an array using it
    const videoIdArray = videoIds.split(',')

    const comments = []

    // for loop through every videoId that was just split into array
    for (const videoId of videoIdArray) {

      // attempt to get comments from DB by videoId
      const cachedComments = await getCommentsByVideoId(videoId)

      if (cachedComments.length > 0) {
        comments.push({
          comments: cachedComments.map((comment) => ({
            ...comment,
            fromDb: true,
          })),
        })

        //if comments were found, use 'continue' to skip this videoId
        continue
      }

      if (comments.length === 0) {

        // attempt to get comments from youtube api
        const response = await youtube.commentThreads.list({
          auth: API_KEY,
          part: ['id', 'snippet', 'replies'],
          videoId,
          maxResults: 20,
        })

        const fetchedComments = response.data.items?.map((item) => {

          // for every item, get author, channelurl, publish date, text, likecount
          const { authorDisplayName, authorChannelUrl, publishedAt } =
            item.snippet?.topLevelComment?.snippet || {}

          // instead of using the raw response.data.items, make more simple object out of received data
          return {
            videoId,
            text: item.snippet?.topLevelComment?.snippet?.textDisplay || '',
            authorName: authorDisplayName || '',
            authorUrl: authorChannelUrl || '',
            likeCount: item.snippet?.topLevelComment?.snippet?.likeCount || 0,
            publishedAt,
          }
        })

        // save fetched comments from the api to the DB
        const savedComments = []
        for (const comment of fetchedComments || []) {
          const savedComment = await saveComment(comment)
          savedComments.push(savedComment)
        }

        // push videoid + comments object to general comments array.
        comments.push({
          comments: savedComments,
        })
      }
    }

    // return general comments array
    return res.status(200).json(comments)
  }

  return res.status(404).json({ message: 'Not found' })
}