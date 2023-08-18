import { Schema, model } from "mongoose";

const IconSchema = new Schema({
    uid: { type: String, required: true },
    percent: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    url: { type: String, required: true }
});

const User = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    prefix: { type: String, required: true },
    description: { type: String },
    icon: { type: IconSchema },
    roles: [{ type: String, ref: 'Role' }]
})

export default model('User', User)
