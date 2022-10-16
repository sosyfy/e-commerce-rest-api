const Product = require('../models/product')
const Brand = require('../models/brand')
const Category = require('../models/category')
const SubCategory = require('../models/subcategory')

const productJson = async function(passedarray){
  let newProducts = [];
  let oldProducts = passedarray

  for ( oldProduct of oldProducts ){

    let foundproduct = await Product.findById( oldProduct._id)

    const brand = await Brand.findById(foundproduct.brandId)
    const category = await Category.findById(foundproduct.categoryId)
    const subCategory = await SubCategory.findById(foundproduct.subCategoryId)
  
    foundproduct = foundproduct.toJSONFor()

    foundproduct.brand = brand.toJSONFor(brand)
    foundproduct.category = category.toJSONFor(category)
    foundproduct.subCategory = subCategory.toJSONFor(subCategory)

   newProducts.push( foundproduct)
  }

  return newProducts
}

module.exports = productJson