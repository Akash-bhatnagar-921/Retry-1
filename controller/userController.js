const userService = require("../service/userService");
const pool = require("../database/db")

exports.profile = async (req, res) => {
    try {
        let data = await userService.profile(req)
        return res.status(200).json({msg:"User fetched",data:JSON.parse(data)})
    } catch (error) {
        console.log('err is', error)
    }
};

exports.register = async (req, res) => {
  try {
    let data = await userService.register(req.body);
    if (data) return res.status(data.status).json({ msg: data.msg });
    console.log("data", data);
    return res.status(200).json(data);
  } catch (error) {
    return res.json({ msg: `Error occured at ${error.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password)
      return res.status(401).json({ msg: "Please enter credentials" });
    let token = await userService.login(req.body);
    return res.status(200).json({"token":token});
  } catch (error) {
    console.log("err is", error);
  }
};

exports.updateProfile = async(req,res) => {
    try {
        let updatedData = await userService.updateUser(req)
        return res.status(201).json(updatedData)
    } catch (error) {
        console.log('err is', error)
    }
}