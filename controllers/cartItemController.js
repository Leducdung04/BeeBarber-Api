const CartItem = require('../models/cartItem');

exports.get_list_CartItem = async (req, res, next) => {
    try {

      const cartItem = await CartItem.find();
  
      res.status(200).json(cartItem);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

exports.add_CartItem = async (req, res, next) => {
    try {
        const cartItem = await CartItem.create(req.body);
        
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

exports.delete_CartItem = async (req, res, next) => {
    try {
        const result = await CartItem.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 1) {
            res.status(200).json({ msg: "Xóa thành công!" });
        } else {
            res.status(404).json({ msg: "Không tìm thấy mục để xóa." });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.update_CartItem = async (req, res, next) => {    
    try {
        const result = await CartItem.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
