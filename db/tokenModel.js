import mongoose from "mongoose"

const tokenSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String
    }
})

const Token = mongoose.model('token', tokenSchema)
export default Token