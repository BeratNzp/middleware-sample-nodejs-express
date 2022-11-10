import mongoose, { mongo } from "mongoose"

const organizationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Organization = mongoose.model('organization', organizationSchema)

export default Organization