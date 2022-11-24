import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import express from 'express'

import User from '../db/userModel.js'
import tokenModel from '../db/tokenModel.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const { eMail, password, confirmPassword, firstName, lastName } = req.body

        const userExist = await User.findOne({eMail})
        if(userExist)
            return res.status(400).json({"Message": "This email already in use."})

        if( password !== confirmPassword ) return res.status(400).json({"Message": "Passwords are not matched."})

        const hashedPassword = await bcrypt.hash(password, 16)
        const user = await User.create({
            email: eMail,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
        })

        const accessToken = jwt.sign({email: user.email, id: user._id}, process.env.ACCESS_TOKEN, {
            expiresIn: '3m'
        })

        const refreshToken = jwt.sign({email: user.email, id: user._id}, process.env.REFRESH_TOKEN)

        await tokenModel.create({
            user_id: user._id,
            refresh_token: refreshToken
        })

        res.status(200).json({user, accessToken})
    } catch (error) {
        res.status(400).json({"Message": error.message + " | Code: 2000"})
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { eMail, password } = req.body
        const user = await User.findOne({ email: eMail })

        if(!user)
            return res.status(401).json({"Message": "Access denied."})

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect)
            return res.status(401).json({"Message": "Access denied."})

        const accessToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '3m' }
        )
        const refreshToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.ACCESS_TOKEN
        )
        await tokenModel.findOneAndUpdate(
            { user_id: user.id },
            {
                refresh_token: refreshToken
            },
            { new: true }
        )
        res.status(200).json({ user, accessToken })
    } catch (error) {
        res.status(500).json({"Message": error.message + " | Code: 2001"})
    }
})

router.get('/signout/:id', async (req, res) => {
    try {
        const { id } = req.params
        await tokenModel.findOneAndUpdate(
            {
                user_id: id
            }, 
            { refreshToken: null },
            { new: true }
        )
        return res.status(200).json({"Message": "Logout succesfully." + tokenModel})
    } catch (error) {
        res.status(500).json({"Message": error.message + " | Code: 2002"})
    }
})

router.get('/refresh/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { refreshToken } = await tokenModel.findOne({ user_id: id })
        if(!refreshToken) return res.sendStatus(401)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decodedRefreshToken) => {
            if (err) return res.status(403).json(err)

            const accessToken = jwt.sign({ email: decodedRefreshToken.email, id: decodedRefreshToken.id }, process.env.ACCESS_TOKEN, { expiresIn: '3m' })
            res.status(200).json(accessToken)
        })
    } catch (error) {
        res.status(500).json({"Message": error.message + " | Code: 2003"})
    }
})

const userRouter = router
export default userRouter