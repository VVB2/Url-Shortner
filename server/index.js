import * as dotenv from "dotenv"
import express from "express"
import cron from "node-cron"
import cors from "cors"
import requestIp from "request-ip"
import useragent from "express-useragent"
import mainRouter from "./routes/routes.js"
import { deleteRecords } from "./utils/deleteCronJob.js"
import { getTopShortUrls } from "./utils/redis.js"
dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use(useragent.express())

app.use(requestIp.mw())

const server = app.listen(PORT, console.log(`Server running on ${PORT}`))

app.use("/api/v1", mainRouter)

cron.schedule("*/10 * * * *", getTopShortUrls, {
    timezone: "Asia/Kolkata"
})

cron.schedule("0 0 * * *", deleteRecords, {
    timezone: "Asia/Kolkata"
})

process.on("unhandlededRejection", () => {
    server.close(() => process.exit(1))
})
