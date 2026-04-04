const Epic = require("../../model/EPic/Epic");

const createEpicCtrl = async (req, res) => {
    const { title, description, priority } = req.body
    try {
        const titleExists = await Epic.findOne({ title });
        if (titleExists) {
            return res.json({
                status: "failed",
                message: "Epic already exists"
            })
        }
        const createEpic = await Epic.create({

            title,
            description,
            priority,
            user: req.userAuth
        });
        res.json({
            status: "Success",
            messsage: createEpic,
        })
    } catch (error) {
        res.json(error.message);
    }
}

const getAllEpicsCtrl = async (req, res) => {
    try {
        const epics = await Epic.find();
        return res.json({
            status: "Success",
            message: epics,
        })
    } catch (error) {
        res.json(error.message)
    }
}
// single-epic
const getEpicCtrl = async (req, res) => {
    try {
        const epic = await Epic.findById(req.params.id);
        if (!epic) {
           return res.json({
                status: "Failed",
                message: "Epic not found",
            })
        }
       return res.json({
            status: "Success",
            message: epic,
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    createEpicCtrl,
    getAllEpicsCtrl,
    getEpicCtrl,
}