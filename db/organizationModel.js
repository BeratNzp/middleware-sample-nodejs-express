import mongoose from "mongoose"

const organizationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    creator_id: {
        type: String,
        required: true
    }
})

const Organization = mongoose.model('organization', organizationSchema)
export default Organization