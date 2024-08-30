import productModel from "../model/products.model.js";
import cartModel from "../model/carts.model.js";

// Controlador para obtener todos los productos con paginación
export const getAllProducts = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const { first_name, last_name, role } = req.session.user;

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        const filter = {};
        if (req.query.title) {
            filter.title = req.query.title;
        } else if (req.query.stock) {
            filter.stock = parseInt(req.query.stock);
        }

        const sort = req.query.sort === "asc" ? "price" : req.query.sort === "desc" ? "-price" : null;

        const options = {
            page,
            limit,
            sort,
            customLabels: {
                totalDocs: 'totalProducts',
                docs: 'productsList',
                totalPages: 'totalPages',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevLink: 'prevLink',
                nextLink: 'nextLink'
            }
        };

        const result = await productModel.paginate(filter, options);

        res.render("products", {
            first_name,
            last_name,
            role,
            productsList: result.productsList,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: result.limit
        });
    } catch (error) {
        console.error("Error al cargar los productos", error);
        res.status(500).send("Error al cargar los productos");
    }
};

// Controlador para obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (product) {
            res.render('productDetail', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los detalles del producto', error);
        res.status(500).send('Error al obtener los detalles del producto');
    }
};

// Controlador para obtener un carrito por ID
export const getCartById = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate("products.product");
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error("Error al cargar el carrito", error);
        res.status(500).send("Error al cargar el carrito");
    }
};

// Controlador para renderizar la página de login
export const getLoginPage = (req, res) => {
    res.render("login");
};

// Controlador para renderizar la página de registro
export const getRegisterPage = (req, res) => {
    res.render("register");
};

// Controlador para renderizar la página de restauración de contraseña
export const getRestorePage = (req, res) => {
    res.render("restore");
};

// Controlador para renderizar la página de perfil
export const getProfilePage = (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    const { first_name, last_name, role } = req.session.user;
    res.render("profile", { first_name, last_name, role });
};
