import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import organizationRouter from "./routers/organizationRouter.js"
import userRouter from "./routers/userRouter.js"

dotenv.config()

const app = express()

app.use(express.json({ "limit": "2048kb" }))
app.use(cors())

app.use('/organizations', organizationRouter)
app.use('/users', userRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    mongoose.connect(process.env.DATABASE_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Database connected.")).catch(() => console.log("Database connection failed."))
    console.log(`Server is running on port ${PORT}.`)
})