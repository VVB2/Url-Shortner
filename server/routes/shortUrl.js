import prisma from "@/lib/prisma.js"
import { getOriginalUrl, getTopShortUrls } from "@/utils/redis.js"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const ipAddress = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress

            const shortUrl = req.url.split("/").pop()

            if (!shortUrl) {
                return res.status(400).json({ error: "Short URL parameter is missing" })
            }

            const originalUrl = await getOriginalUrl(shortUrl)

            if (originalUrl) {
                await prisma.shortenUrls.update({
                    where: {
                        shortUrl,
                    },
                    data: {
                        views: {
                            increment: 1,
                        },
                    },
                })

                await getTopShortUrls()

                res.redirect(originalUrl)
            }

            return res.status(404).json({ error: "Short URL not found" })
        } catch (error) {
            console.error("Error redirecting:", error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" })
}
