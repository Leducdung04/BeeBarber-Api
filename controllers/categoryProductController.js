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
        const {name,description,status} = req.body;
        const { file } = req;
        let image = null;
        if (req.file) {image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;}
        const newCategory = new Category_Product({name,description,image,status});
        const result = await newCategory.save()
        res.status(201).json(result)
    } catch (error) {
        console.error(error);
        res.status(400).json({message: 'Server Error'});      
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
