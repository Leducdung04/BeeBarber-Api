const Category_Product = require('../models/categoryProduct');

exports.get_list_Category_Product = async (req, res, next) => {
    try {
        
        const category_product = await Category_Product.find();
        
        res.status(200).json(category_product);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

exports.add_Category_Product = async (req, res, next) => {
    try {
        const newCategory_Product = new Category_Product(req.body);
        const result = await newCategory_Product.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

exports.update_Category_Product = async (req, res, next) => {
    try {
        const result = await Category_Product.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
