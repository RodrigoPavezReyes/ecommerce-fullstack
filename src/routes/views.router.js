import express from "express";
import {
    getAllProducts,
    getProductById,
    getCartById,
    getLoginPage,
    getRegisterPage,
    getRestorePage,
    getProfilePage
} from "../controllers/views.controller.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get('/products/:id', getProductById);
router.get("/carts/:cid", getCartById);

// Rutas de autenticación y gestión de sesiones
router.get("/login", getLoginPage);
router.get("/register", getRegisterPage);
router.get("/restore", getRestorePage);
router.get("/profile", getProfilePage);

export default router;
