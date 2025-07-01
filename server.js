const express = require('express');
const dotenv = require('dotenv').config(); //加载 .env 文件中的环境变量
const contactsRoute = require('./routes/contactsRoutes');
const usersRoute = require('./routes/usersRoutes');
const errorHandler = require('./middleware/errorHandler');
const dbConnections = require('./config/dbConnections');

dbConnections(); // Connect to database

const app = express();

const port = process.env.PORT || 5000; //设置端口号，或者从 .env 文件中读取

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/contacts", contactsRoute)
app.use("/users", usersRoute)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})