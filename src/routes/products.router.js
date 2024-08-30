// routes/products.router.js

import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/products", getProducts);

router.post("/products", createProduct);

router.put("/products/:uid", updateProduct);

router.delete("/products/:uid", deleteProduct);

export default router;
