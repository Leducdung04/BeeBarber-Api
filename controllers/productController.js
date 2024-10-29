const Product = require('../models/product');

exports.get_list_product = async (req, res, next) => {
    try {
        const products = await Product.find().sort("");
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.add_product = async (req, res, next) => {
    try {
        const imageUrl = req.file ? req.file.path : null; 
        const newProduct = new Product({
            ...req.body,
            imageUrl,
        });
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.update_product = async (req, res, next) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.imageUrl; 
        const result = await Product.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body, imageUrl },
            { new: true }
        );
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
