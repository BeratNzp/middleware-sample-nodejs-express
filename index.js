import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import organizationRouter from "./routers/organizationRouter.js"

dotenv.config()

const app = express()

app.use(express.json({ "limit": "2048kb" }))
app.use('/organizations', organizationRouter)

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.DATABASE_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Database connected.")).catch(() => console.log("Database connection failed."))
    console.log(`Listening on: ${process.env.PORT}`)
})