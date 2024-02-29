import prisma from "../utils/prisma.js"
import crypto from "crypto"
import bcrypt from "bcrypt"

const SALT = 10

const encryptPassword = (password) => {
    bcrypt.hash(password, SALT, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err)
        }

        return hash
    })
}

const generateShortUrl = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const randomBytes = crypto.randomBytes(length)
    let shortUrl = ""

    for (let i = 0; i < 7; i++) {
        const randomIndex = randomBytes[i] % characters.length
        shortUrl += characters.charAt(randomIndex)
    }

    return shortUrl
}

export const generateURL = async (req, res) => {
    try {
        const { originalUrl, expirationDate, password: unencrypted, customUrl } = req.body
        let shortUrl = customUrl

        if (!customUrl) {
            shortUrl = generateShortUrl()
        }

        const password = encryptPassword(unencrypted)

        const createdShortUrl = await prisma.shortenUrls.create({
            data: {
                originalUrl,
                shortUrl,
                expirationDate,
                password
            }
        })

        res.status(201).json(createdShortUrl)
    } catch (error) {
        console.error("Error creating short URL:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
