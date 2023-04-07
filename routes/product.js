const express = require("express")
const requireAuth = require('../middleware/requireAuth')

const {
    getCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/customerController')

const {
    getSuppliers,
    createSupplier,
    getSupplier,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplierController')

const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController')

const {
    getPurchases,
    createPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase,
    viewProductPurchase
} = require('../controllers/purchaseController')

const {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController')

const {
    inventoryStatus,
} = require('../controllers/dashboardController')
 

const productRoutes = express.Router()

// require auth for all product routes
// productRoutes.use(requireAuth)

productRoutes.route("/customer").get(getCustomers);
productRoutes.post('/customer/add', createCustomer);
productRoutes.route("/customer/:id").get(getCustomer);
productRoutes.route("/customer/update/:id").post(updateCustomer);
productRoutes.route("/customer/delete/:id").delete(deleteCustomer);

productRoutes.route("/supplier").get(getSuppliers);
productRoutes.post('/supplier/add', createSupplier);
productRoutes.route("/supplier/:id").get(getSupplier);
productRoutes.route("/supplier/update/:id").post(updateSupplier);
productRoutes.route("/supplier/delete/:id").delete(deleteSupplier);

productRoutes.route("/product").get(getProducts);
productRoutes.post('/product/add', createProduct);
productRoutes.route("/product/:id").get(getProduct);
productRoutes.route("/product/update/:id").post(updateProduct);
productRoutes.route("/product/delete/:id").delete(deleteProduct);

productRoutes.route("/purchase").get(getPurchases);
productRoutes.post('/purchase/add', createPurchase);
productRoutes.route("/purchase/:id").get(getPurchase);
productRoutes.route("/purchase/update/:id").post(updatePurchase);
productRoutes.route("/purchase/delete/:id").delete(deletePurchase);

productRoutes.route("/purchased/products").get(viewProductPurchase);

productRoutes.route("/order").get(getOrders);
productRoutes.post('/order/add', createOrder);
productRoutes.route("/order/:id").get(getOrder);
productRoutes.route("/order/update/:id").post(updateOrder);
productRoutes.route("/order/delete/:id").delete(deleteOrder);

productRoutes.route("/dashboard").get(inventoryStatus);


module.exports = productRoutes;