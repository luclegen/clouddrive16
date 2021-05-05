// Environment Variables
require('dotenv').config();

// Initialization
const app = require('express')()

app.get('/', (req, res) => res.send(`Hello ${process.env.SERVER_NAME}!`))

app.listen(process.env.PORT, () => console.log(`Server started at http://localhost:${process.env.PORT || 5000}`))