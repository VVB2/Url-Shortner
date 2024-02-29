import Redis from "ioredis"
import prisma from "./prisma.js"

const redis = new Redis(process.env.REDIS_URI)

export const getOriginalUrl = async (shortUrl) => {
    const cachedUrl = await redis.get(shortUrl)

    if (cachedUrl) {
        return cachedUrl
    }

    const urlEntry = await prisma.shortenUrls.findUnique({
        where: {
            shortUrl
        }
    })

    if (urlEntry) {
        return urlEntry.originalUrl
    }

    return null
}

const cacheTopShortUrls = async (topUrls) => {
    await redis.flushall()
    const pipeline = redis.pipeline()

    topUrls.forEach((url, index) => {
        pipeline.zadd("topShortUrls", "NX", index + 1, url.shortUrl)
    })

    await pipeline.exec()
}

export const getTopShortUrls = async () => {
    const topUrlsFromDb = await prisma.shortenUrls.findMany({
        take    : 50,
        orderBy : {
            views: "desc"
        }
    })

    await cacheTopShortUrls(topUrlsFromDb)

    return topUrlsFromDb.map((url) => url.shortUrl)
}
