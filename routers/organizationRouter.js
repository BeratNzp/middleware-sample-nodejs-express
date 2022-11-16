import express from "express"
import mongoose from "mongoose"

import Organization from "../db/organizationModel.js"

const router = express.Router()

/* Get all organizations. */
router.get('/', async (req, res) => {
    try {
        const organizations = await Organization.find()
        res.status(200).json(organizations)
    } catch (error) {
        res.status(404).json({"Message": error.message + " Organization id is not valid. Code: 1000"})
    }
})
/* .Get all organizations. */

/* Get a specific organization. */
router.get('/:id', async (req, res) => {
    try {
        //const params = req.params
        //const id = params.id
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id))
            res.status(404).json({"Message": error.message + " | Organization id is not valid. Code: 1001"})

        const organization = await Organization.findById(id)
        res.status(200).json(organization)
    } catch (error) {
        res.status(404).json({"Message": error.message + " | Organization could not found. Code: 1002"})
    }
})
/* .Get a specific organization. */

/* Create an organization. */
router.post('/', async (req, res) => {
    try {
        const organization = req.body
        const createdOrganization = await Organization.create(organization)
        res.status(201).json(createdOrganization)
    } catch (error) {
        res.status(404).json({"Message": error.message + " | Organization could not create. Code: 1003"})
    }
})
/* .Create an organization. */

/* Update specific organization. */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id))
            res.status(404).json({"Message": error.message + " | Organization id is not valid. Code: 1004"})

        const { title } = req.body
        const updatedOrganization = await Organization.findByIdAndUpdate(id, { title, _id: id }, { new: true })
        res.status(200).json(updatedOrganization)
    } catch (error) {
        res.status(404).json({"Message": error.message + " | Organization could not update. Code: 1005"})
    }
})
/* .Update specific organization. */

/* Delete an organization. */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id))
            res.status(404).json({"Message": error.message + " Organization id is not valid. Code: 1006"})

        await Organization.findByIdAndDelete(id)
        res.status(200).json({"Message": "Organization is deleted."})
    } catch (error) {
        res.status(404).json({"Message": error.message + " | Organization could not delete. Code: 1007"})
    }
})
/* .Delete an organization. */

const organizationRouter = router
export default organizationRouter