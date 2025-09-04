const Product = require("../models/ProductModel");

async function createProduct(data) {
  const product = new Product(data);
  const result = await product.save();
  return result;
}
async function getAllProducts() {
  return await Product.find();
}
async function updateProduct(data, id) {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}
async function getProductsByFilter(filter,{sort = {price : 1}},limit = 3,page = 1) {
  query = {};
  skip = (page-1)*limit;

  if (filter.name) {
    query.name = { $regex: filter.name, $options: "i" }; //case insenstive
  }
  if (filter.minPrice) {
    //   lte ==> less than equal
    query.price = { ...query.price, $lte: parseFloat(filter.maxPrice) };
  }
  if (filter.maxPrice) {
    //   gte ==> greater than equal
    query.price = { ...query.price, $lte: parseFloat(filter.maxPrice) };
  }
    limit = parseInt(limit);
if (!sort || typeof sort !== "object" || Array.isArray(sort)) {
  sort = { price: 1 }; // fallback sort
}
//   const result =  await Product.find(query).sort(sort).skip(skip).limit(limit);
//   const total = await Product.countDocuments(query);
//  return {
//     result, 
//     page,
//     skip,
//     limit,
//     totalCountPages : Math.ceil(total/limit)
//  }
const pipeline = [
  { $match: query }, // filter
  { $sort: sort }, // sort
  { $skip: skip }, // pagination skip
  { $limit: limit }, // pagination limit
  {
    $facet: {
      results: [{ $skip: skip }, { $limit: limit }], // return filtered results
      totalCount: [{ $count: "count" }], // count total docs
    },
  },
];

const data = await Product.aggregate(pipeline);

return {
  results: data[0].results,
  pagination: {
    total: data[0].totalCount[0] ? data[0].totalCount[0].count : 0,
    page,
    limit,
    totalPages: data[0].totalCount[0]
      ? Math.ceil(data[0].totalCount[0].count / limit)
      : 0,
  },
};

}
module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductsByFilter,
};
