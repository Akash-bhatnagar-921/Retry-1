const Redis = require("ioredis")
let redis = new Redis();


exports.rateLimiter = async(req, res , next) => {
    try {
        console.log('inside arte limiter')
        console.log('req',req.id)
        let userId = req.id
        let key = `rate:${userId}`
        let limit = 5
        let window = 60

        let count = await redis.incr(key)
        let ttl = await redis.ttl(key)
        console.log('ttl is', ttl)
        // if(ttl <= -1) await redis.expire(key,window)
        console.log('count is', count)
        if(count == 1) await redis.expire(key,window);

        if(count>limit){
            return res.status(429).json({"msg":"Too many attempts"})
        }

        next()
    } catch (error) {
        console.log(error)
    }
}
