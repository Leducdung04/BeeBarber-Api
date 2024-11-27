const { default: mongoose } = require('mongoose');
const Order_Product = require('../models/oder_product');
const Payment = require('../models/payments');
const Product = require('../models/product');

exports.updateOrderStatus = async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const order = await Order_Product.findById(orderId);
  
      if (!order) {
        return res.status(404).json({
          status: 404,
          message: "Order not found",
        });
      }
  
      order.status = status;
      switch (status) {
        case "active":
          order.timeConfirm = new Date();
          break;
        case "trading":
          order.timeDelivery = new Date();
          break;
        case "deactive":
          order.timeCancel = new Date();
          break;
        case "delivered":
          order.timeSuccess = new Date();
          for (const product of order.listProduct) {
            await Product.findByIdAndUpdate(product.idProduct, {
              $inc: {
                quantity: -product.quantity,
                soldQuantity: +product.quantity,
              },
            });
          }
          break;
      }
  
      await order.save();
      res.status(200).json({
        status: 200,
        message: "Order status updated successfully",
        order: order,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
};
exports.totalAmount = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      console.log(`${startDate}#${endDate}`)

      const startTime = new Date(startDate);
      const endTime = new Date(endDate);
  
      const orders = await Order_Product.find({
        status: "delivered",
        timeSuccess: {$gte: startTime, $lte: endTime }
      });
  
      let uniqueProduct = [];
      let totalAmount = 0;
      const dailyTotalPrices = {};
      const dailySoldQuantity = {};
  
      orders.forEach(order => {
        const date = order.timeSuccess.toISOString().slice(0, 10);
        if (!dailyTotalPrices[date]) {
          dailyTotalPrices[date] = 0;
        }

        if (!dailySoldQuantity[date]) {
            dailySoldQuantity[date] = 0;
        }

        const revenue = order.total_price_sold - order.total_price_import
        dailyTotalPrices[date] += parseFloat(revenue);

        let totalSoldProduct = 0
        order.listProduct.map(product =>{
            totalSoldProduct += product.quantity
        })
        dailySoldQuantity[date] = totalSoldProduct

      });
      console.log(dailyTotalPrices)
      const sortedDates = Object.keys(dailyTotalPrices).sort();
      const labels = sortedDates;
      const prices = sortedDates.map(date => dailyTotalPrices[date]);
      const products = sortedDates.map(date  => dailySoldQuantity[date]);
  
      for (const order of orders) {
        const revenue = order.total_price_sold - order.total_price_import
        totalAmount += parseFloat(revenue);
  
        for (const product of order.listProduct) {
          const existingProduct = uniqueProduct.find(item => item.idProduct.toString() === product.idProduct.toString());
         
          if (!existingProduct) {
             const foundProduct = await Product.findOne({ _id: product.idProduct });
            uniqueProduct.push({
              idProduct: product.idProduct,
              name: product.name,
              quantity: product.quantity,
              price: product.price_selling,
              image: product.image,
              soldQuantity: foundProduct ? foundProduct.soldQuantity : 0
            });
          }
        }
      }
      for(let i = 0 ; i < uniqueProduct.length - 1; i++){
        for(let j = 0; j< uniqueProduct.length - 1 - i; j++){
            if(uniqueProduct[j].soldQuantity < uniqueProduct[j+1].soldQuantity){
                const temp  = uniqueProduct[j]
                uniqueProduct[j] = uniqueProduct[j+1]
                uniqueProduct[j+1] = temp
            }
        }
      }
      console.log(uniqueProduct)
      console.log(totalAmount)
      
      res.status(200).json({ status: 200, message: "successfully", total: totalAmount, uniqueProduct:uniqueProduct, labels,prices, products });
    } catch (error) {
      res.status(404).json({ status: 404, message: error.message });
    }
  };
exports.addOrderProduct = async (req, res, next) => {
    try {
        const idUser = req.params.id
        const {listProduct, location, status, user_voucher_id} = req.body

        let total_price_import = 0
        let total_price_sold = 0

        listProduct.map((item)=>{
            total_price_import += item.price_import * item.quantity
            total_price_sold += item.price_selling * item.quantity
        })

        const newOrderProduct = new Order_Product({
            listProduct: listProduct,
            user_id: idUser,
            location: location,
            status,
            total_price_import: total_price_import,
            total_price_sold: total_price_sold,
            user_voucher_id: user_voucher_id
        });

        const result = await newOrderProduct.save();
        if(result){
            return res.status(201).json({messsage:"Create a new order successfully", data:result});
        }else{
            return res.json({messsage:"Create a new order failed", data:{}});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.addOrderWithPayment = async (req, res) => {
    try {
        const { order, payment } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!order || !payment) {
            return res.status(400).json({ message: 'Missing order or payment data' });
        }

        // Tạo và lưu đơn hàng
        const newOrder = new Order_Product(order);
        const orderResult = await newOrder.save();

        // Tạo và lưu thanh toán
        const newPayment = new Payment({
            related_id: orderResult._id,
            ...payment,
        });

        newPayment.price = parseFloat(newPayment.price);
        if (isNaN(newPayment.price)) {
            return res.status(400).json({ message: 'Invalid price format in payment' });
        }

        const paymentResult = await newPayment.save();

        res.status(201).json({
            status: 201,
            message: 'Order and Payment added successfully',
            order: orderResult,
            payment: paymentResult,
        });
    } catch (err) {
        console.error('Error adding order with payment:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getOrdersByUserId = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        // Kiểm tra nếu không có user_id được cung cấp
        if (!user_id) {
            return res.status(400).json({ msg: "user_id is required" });
        }

        // Tìm tất cả các đơn hàng của người dùng
        const orders = await Order_Product.find({
            user_id,
            // status: { $ne: 5 }, // Bỏ qua đơn hàng đã hủy (status = 5)
        })
            .populate('product_id')
            .populate('user_voucher_id') // Lấy thông tin từ bảng UserVoucher nếu có
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Tìm tất cả các thanh toán liên quan đến user_id
        const payments = await Payment.find({ user_id, status: true });

        // Gắn thông tin thanh toán tương ứng vào mỗi đơn hàng
        const result = orders.map(order => {
            const relatedPayment = payments.find(
                payment => String(payment.related_id) === String(order._id)
            );
            return {
                ...order._doc,
                payment: relatedPayment || null,
            };
        });

        // Trả về danh sách đơn hàng kèm thanh toán và thông tin sản phẩm
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
};

exports.getAllOrdersAdmin = async (req, res, next) => {
    try {
        // Lấy tất cả các đơn hàng
        const orders = await Order_Product.find()// Lấy thông tin sản phẩm
            .populate('user_voucher_id') // Lấy thông tin từ bảng UserVoucher nếu có
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Lấy tất cả các thanh toán
        const payments = await Payment.find({ status: true });

        // Gắn thông tin thanh toán tương ứng vào mỗi đơn hàng
        const result = orders.map(order => {
            const relatedPayment = payments.find(
                payment => String(payment.related_id) === String(order._id)
            );
            return {
                ...order._doc,
                payment: relatedPayment || null,
            };
        });

        // Trả về danh sách đơn hàng kèm thông tin thanh toán và sản phẩm
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
};


exports.updateOderStatusToCanceled = async (req, res) => {
    try {
        const { oderId } = req.params; // Lấy ID từ URL

        // Kiểm tra định dạng của appointmentId
        if (!mongoose.Types.ObjectId.isValid(oderId)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        // Tìm và cập nhật trạng thái của Appointment
        const updatedAppointment = await Order_Product.findByIdAndUpdate(
            oderId,
            { status: 5 }, // Cập nhật trạng thái
            { new: true } // Trả về dữ liệu đã cập nhật
        );

        // Nếu không tìm thấy Appointment
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Trả về phản hồi thành công
        res.status(200).json({
            status: 200,
            message: 'Appointment status updated successfully',
            data: updatedAppointment,
        });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateOderStatusToCanceled_ByZaloPay = async (req, res) => {
    const session = await mongoose.startSession(); // Khởi tạo session để quản lý transaction
    session.startTransaction();

    try {
        const { oderId } = req.params; // Lấy ID từ URL
        const { bank_account } = req.body; // Lấy bank_account từ body request

        // Kiểm tra định dạng của appointmentId
        if (!mongoose.Types.ObjectId.isValid(oderId)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        // Tìm và cập nhật trạng thái của Appointment
        const updatedAppointment = await Order_Product.findByIdAndUpdate(
            oderId,
            { status: 5 }, // Cập nhật trạng thái
            { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
        );

        // Nếu không tìm thấy Appointment
        if (!updatedAppointment) {
            await session.abortTransaction(); // Hủy transaction
            session.endSession();
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Tìm payment liên quan và cập nhật trạng thái pay_method_status và bank_account
        const relatedPayment = await Payment.findOneAndUpdate(
            { related_id: oderId }, // Liên kết payment thông qua related_id
            {
                pay_method_status: "canceled", // Cập nhật trạng thái
                bank_account: bank_account || null, // Cập nhật bank_account, mặc định null nếu không có giá trị
            },
            { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
        );

        // Nếu không tìm thấy Payment
        if (!relatedPayment) {
            await session.abortTransaction(); // Hủy transaction
            session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Commit transaction khi mọi thứ hoàn tất
        await session.commitTransaction();
        session.endSession();

        // Trả về phản hồi thành công
        res.status(200).json({
            status: 200,
            message: 'Appointment and payment status updated successfully',
            data: {
                appointment: updatedAppointment,
                payment: relatedPayment,
            },
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();

        console.error("Error updating appointment and payment status:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateOrderProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const updateData = req.body; // Lấy dữ liệu từ body

        const updatedOrderProduct = await Order_Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrderProduct) {
            return res.status(404).json({ message: 'Order product not found' });
        }

        res.status(200).json(updatedOrderProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}
exports.getListOrderProducts = async (req, res, next) => {
    try {
        const orderProducts = await Order_Product.find().sort({ createdAt: -1 });

        res.status(200).json(orderProducts);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
}