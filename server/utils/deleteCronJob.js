import prisma from './prisma.js'
import { getTopShortUrls } from './redis.js'

export const deleteRecords = async () => {
    try {
        const deletedUrls = await prisma.shortenUrls.deleteMany({
            where: {
                expirationDate: { lt: new Date() },
            },
        })
        await getTopShortUrls()
        console.log('Expired data deleted:', deletedUrls);
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
} 