const Cart = require('../models/cart');

// exports.getlistCart = async (req, res, next) => {
//     try {
//         const cart = await Cart.findOne({user_id: req.user._id});
//         console.log(cart);
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

exports.get_list_cart = async (req, res, next) => {
    try {

      const cart = await Cart.find();
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  

exports.add_Cart = async (req, res, next) => {
    try {
        const newCart = new Cart({user_id: req.user._id});
        const result = await newCart.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

exports.update_Cart = async (req, res, next) => {
    try {
        const result = await Cart.findOneAndUpdate({user_id: req.user._id}, req.body, {new: true});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
