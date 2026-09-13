import express from "express";
import postRouter from "./routes/postRouter.js";
import authRouter from "./routes/adminRouter.js";
import commentRouter from "./routes/commentRouter.js";
import cors from "cors"

process.loadEnvFile()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use("/v1/posts", postRouter)
app.use("/v1/admin", authRouter)
app.use("/v1/posts/:postId/comments", commentRouter)

app.listen(process.env.PORT, () => console.log("Server listening at " + process.env.PORT))