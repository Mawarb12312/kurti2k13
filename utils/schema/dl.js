const { Schema, model } = require("mongoose")

const schema = new Schema({
    Rate: {
        type: String,
        required: true
    }
})

const Rate = model("Rate", schema)

module.exports = Rate