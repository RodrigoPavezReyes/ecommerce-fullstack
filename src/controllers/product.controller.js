import productModel from "../model/products.model.js";

export const getProducts = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        let filter = {};
        if (req.query.title) {
            filter.title = req.query.title;
        } else if (req.query.stock) {
            filter.stock = parseInt(req.query.stock);
        }

        let sort = null;
        if (req.query.sort === "asc") {
            sort = "price";
        } else if (req.query.sort === "desc") {
            sort = "-price";
        }

        const options = {
            page: page,
            limit: limit,
            sort: sort,
            customLabels: {
                totalDocs: 'totalProducts',
                docs: 'payload',
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

        const baseUrl = '/api/products';
        const resultPrevLink = result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${encodeURIComponent(req.query.query)}` : ''}` : null;
        const resultNextLink = result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${encodeURIComponent(req.query.query)}` : ''}` : null;

        res.send({
            status: 'success',
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: resultPrevLink,
            nextLink: resultNextLink
        });

    } catch (error) {
        console.error("Error al cargar los productos", error);
        res.status(500).send({ status: 'error', message: 'Error al cargar los productos' });
    }
};

export const createProduct = async (req, res) => {
    try {
        let { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.send({ status: "error", error: "Faltan datos obligatorios" });
        }

        let result = await productModel.create({ title, description, price, thumbnail, code, stock });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al ingresar el producto", error);
        res.status(500).send({ status: 'error', message: 'Error al ingresar el producto' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        let { uid } = req.params;
        let productsToReplace = req.body;
        if (!productsToReplace.title || !productsToReplace.description || !productsToReplace.thumbnail || !productsToReplace.code || !productsToReplace.stock) {
            return res.send({ status: "error", error: "Faltan datos obligatorios para reemplazar el producto" });
        }

        let result = await productModel.updateOne({ _id: uid }, productsToReplace);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al reemplazar el producto", error);
        res.status(500).send({ status: 'error', message: 'Error al reemplazar el producto' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let { uid } = req.params;
        let result = await productModel.deleteOne({ _id: uid });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
};
