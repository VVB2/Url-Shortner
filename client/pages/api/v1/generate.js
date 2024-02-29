// import prisma from "../../../lib/prisma"
import prisma from "@/lib/prisma"

function generateShortUrl() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const shortUrl = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    return shortUrl
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { originalUrl } = req.body
            const shortUrl = generateShortUrl()

            const createdShortUrl = await prisma.shortenUrls.create({
                data: {
                    originalUrl,
                    shortUrl,
                },
            })

            res.status(201).json(createdShortUrl)
        } catch (error) {
            console.error("Error creating short URL:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" })
    }
}
