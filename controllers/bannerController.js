const Banner = require('../models/banner');

exports.addBanner = async (req,res,next) => {
    try{
           const {title,imageUrl,description,status,target_screen} =req.body;
           
           const newBanner = new Banner({title, imageUrl, description, status, target_screen});

           const result = await newBanner.save()

           res.status(201).json(result);
    }catch(err){
        console.error(err);
        res.status(400).json({message: 'Server Error'});
    }
}

exports.get_list_banner = async (req, res, next) => {
    try {

      const banner = await Banner.find().sort({createdAt: -1,});
  
      res.status(200).json(banner);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  