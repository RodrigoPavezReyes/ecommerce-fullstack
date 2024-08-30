import express from "express";
import { createCart, getCartById, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

// Crear un nuevo carrito
router.post("/cart", createCart);

// Listar productos del carrito por ID
router.get("/cart/:cid", getCartById);

// Agregar producto al carrito
router.post("/cart/:cid/products/:pid", addProductToCart);

// Eliminar un producto del carrito
router.delete("/cart/:cid/products/:pid", removeProductFromCart);

// Actualizar el carrito con un arreglo de productos
router.put("/cart/:cid", updateCart);

// Actualizar la cantidad de un producto en el carrito
router.put("/cart/:cid/products/:pid", updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete("/cart/:cid", clearCart);

export default router;
