import Redis from "ioredis"
import prisma from "./prisma"

const redis = new Redis(process.env.REDIS_URI)

async function getOriginalUrl(shortUrl) {
    const cachedUrl = await redis.get(shortUrl)

    if (cachedUrl) {
        return cachedUrl
    }

    const urlEntry = await prisma.shortenUrls.findUnique({
        where: {
            shortUrl,
        },
    })

    if (urlEntry) {
        await redis.set(shortUrl, urlEntry.originalUrl)
        return urlEntry.originalUrl
    }

    return null
}

async function cacheTopShortUrls(topUrls) {
    await redis.flushall()
    const pipeline = redis.pipeline()

    topUrls.forEach((url, index) => {
        pipeline.zadd("topShortUrls", "NX", index + 1, url.shortUrl)
    })

    await pipeline.exec()
}

async function getTopShortUrls() {
    const topShortUrls = await redis.zrevrange("topShortUrls", 0, 49)

    if (topShortUrls.length > 0) {
        return topShortUrls
    }

    const topUrlsFromDb = await prisma.shortenUrls.findMany({
        take: 50,
        orderBy: {
            views: "desc",
        },
    })

    await cacheTopShortUrls(topUrlsFromDb)

    return topUrlsFromDb.map((url) => url.shortUrl)
}

export { getOriginalUrl, getTopShortUrls }
