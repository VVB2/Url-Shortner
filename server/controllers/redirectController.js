import axios from "axios";
import prisma from "../utils/prisma.js"
import { getOriginalUrl, getTopShortUrls } from "../utils/redis.js"

export const redirectURL = async (req, res) => {
    try {
        const { browser, os: deviceType } = req.useragent;
        const ipAddress = "133.25.36.24" || req.clientIp
        const geoLocationResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`)
        const { country, city } = geoLocationResponse.data

        const shortUrl = req.params.shortUrl

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

            await prisma.Analytics.create({
                data: {
                    ipAddress,
                    country,
                    city,
                    browser,
                    deviceType,
                    shortenUrlId: shortUrl
                },
            });

            await getTopShortUrls()

            return res.redirect(originalUrl)
        }

        return res.status(404).json({ error: "Short URL not found" })
    } catch (error) {
        console.error("Error redirecting:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
