import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    first_name : String,
    last_name: String,
    email:String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' } // Referencia al modelo de carrito
})


const User = mongoose.model("User", userShema)

export default User