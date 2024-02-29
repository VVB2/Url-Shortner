import prisma from "../utils/prisma.js"

function generateShortUrl() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const shortUrl = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    return shortUrl
}

export const generateURL = async (req, res) => {
    try {
        const { originalUrl, expirationDate, password } = req.body
        const shortUrl = generateShortUrl()

        const createdShortUrl = await prisma.shortenUrls.create({
            data: {
                originalUrl,
                shortUrl,
                expirationDate,
                password
            },
        })

        res.status(201).json(createdShortUrl)
    } catch (error) {
        console.error("Error creating short URL:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
} 