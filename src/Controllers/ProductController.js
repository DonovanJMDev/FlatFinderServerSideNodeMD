const productService = require("../Services/ProductService");

async function createProduct(req, res) {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Sucessfully Created Record",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      message: "ALL PRODUCTS",
      data: products,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const updatedProduct = await productService.updateProduct(req.body, id);

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "ProductId is not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Sucessfully Updated Record",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
async function getProductByFilter(req, res) {
  try {
    const filters = {
      name: req.query.name,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };
    const product = await productService.getProductsByFilter(
      filters,
      req.query.sort,
      req.query.limit,
      req.query.page
    );
    res.status(200).json({
      success: true,
      message: "Product Found",
    ...product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  getProductByFilter,
};
