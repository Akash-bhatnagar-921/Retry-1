require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const userController = require("./controller/userController")
const auth = require("./middleware/auth")

const app = express()
const route = express.Router()

app.use(bodyParser.json())

app.get("/",(req,res) => {
    res.send("Hello API")
})

app.post("/signUp", userController.register)
app.post("/login", userController.login)
app.post("/profile", auth.authenticate, userController.profile)
app.put("/profile", auth.authenticate, userController.updateProfile)



// start server
app.listen(process.env.PORT,() => {
    console.log('app starting at 3000')
})