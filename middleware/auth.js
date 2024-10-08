import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN,
            (err, decodedAccessToken) => {
                if (err) return res.status(403).json(err)
                req.creatorId = decodedAccessToken?.id
                next()
            }
        )
    } catch (error) {
        console.log(error)
    }
}

export default auth