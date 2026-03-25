const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");
let redis = new Redis();
require("dotenv").config();
const { queue } = require("../queue/rabbit");

exports.register = async (params) => {
  try {
    let { email, password, role } = params;
    console.log("email", email);

    let existedUser = await pool.query(`SELECT * from USERS where email = $1`, [
      email,
    ]);
    // console.log('exi', existedUser)
    let hashedPassword = await bcrypt.hash(password, 10);
    if (existedUser.rows.length)
      return { status: 503, msg: "User already existed" };
    console.log("am i here");
    let insertedData = await pool.query(
      `INSERT INTO USERS (email, password) VALUES ($1,$2) returning email`,
      [email, hashedPassword],
    );
    console.log("insertedData", insertedData);
    await queue.add("sendEmail", { email: email });

    return { status: 200, msg: insertedData.rows };
  } catch (error) {
    console.log("error", error.message);
  }
};

exports.login = async (params) => {
  try {
    let hashedPassword = await pool.query(
      `SELECT * from USERS where email = $1`,
      [params.email],
    );
    console.log("hashedPass", hashedPassword);
    let token = jwt.sign(
      { userId: hashedPassword.rows[0].id },
      process.env.JWT_TOKEN,
      { expiresIn: "60m" },
    );
    console.log("token is", token);
    if (await bcrypt.compare(params.password, hashedPassword.rows[0].password))
      return token;
  } catch (error) {
    console.log("err is", error);
  }
};

exports.profile = async (params) => {
  try {
    let cached = await redis.get(`userId:${params.id}`);
    if (cached) {
      console.log(await redis.ttl(`userId:${params.id}`));
      console.log("cache hit");
      return JSON.parse(cached);
    }
    console.log("cache miss");
    let data = await pool.query(`SELECT email,role from USERS where id = $1`, [
      params.id,
    ]);
    console.log("data tak aay", data.rows);
    await redis.set(`userId:${params.id}`, JSON.stringify(data.rows), "EX", 60);
    console.log("redis set hua");
    return data.rows;
  } catch (error) {
    console.log("err at", error);
  }
};

exports.updateUser = async (params) => {
  try {
    let updatedData = await pool.query(
      `UPDATE USERS SET role= $1 where id = $2 returning email`,
      [params.body.role, params.id],
    );
    console.log("updatedData", updatedData);
    if (updatedData.rows.length > 0) await redis.del(`userId:${params.id}`);
    // console.log('inside resis', redis)
    return updatedData;
  } catch (error) {
    console.log("err is", error);
  }
};
