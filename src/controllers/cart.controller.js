import cartModel from "../model/carts.model.js";
import productModel from "../model/products.model.js";

// Crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ message: "Carrito creado con éxito", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
};

// Listar productos del carrito por ID
export const getCartById = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate("products.product");
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const product = await productModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === req.params.pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
};

// Actualizar el carrito con un arreglo de productos
export const updateCart = async (req, res) => {
    try {
        const cart = await cartModel.findByIdAndUpdate(
            req.params.cid,
            { products: req.body.products },
            { new: true }
        );
        res.json({ message: "Carrito actualizado", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (product) {
            product.quantity = req.body.quantity;
            await cart.save();
            res.json({ message: "Cantidad actualizada", cart });
        } else {
            res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
    }
};

// Eliminar todos los productos del carrito
export const clearCart = async (req, res) => {
    try {
        const cart = await cartModel.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );
        res.json({ message: "Todos los productos eliminados del carrito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar todos los productos del carrito" });
    }
};