const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const articleRouter = require('./routes/articles')
const connectDB = require('./db/connect')
const authMiddleware = require('./middleware/auth')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
require('dotenv').config()
require('express-async-errors')


app.use(express.json())

//test route
app.get('/', (req, res) => {
    res.send('Article API')
})

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/article', authMiddleware, articleRouter)

//middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = 3000
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()