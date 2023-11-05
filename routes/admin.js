const express = require('express');
const adminRouter = express.Router();
const admin = require('../middleware/admin');
const { Product } = require('../models/product');
const Order = require('../models/order');

// Add Product
adminRouter.post('/admin/add-product', admin, async (req, res) => {
   try {
      const { name, description, images, quantity, price, category } = req.body;
      let product = new Product({
         name,
         description,
         images,
         quantity,
         price,
         category,
      });

      // Saving  to database
      product = await product.save();
      res.json(product);
   } catch (err) {
      console.log("500 err saving to database");
      res.status(500).json({ err: err.message });
   }
});

// Get all products
adminRouter.get('/admin/get-products', admin, async (req, res) => {
   try {
      const products = await Product.find({});
      res.json(products);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Get all orders
adminRouter.get('/admin/get-orders', admin, async (req, res) => {
   try {
      const orders = await Order.find({});
      res.json(orders);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Delete the product
adminRouter.post('/admin/delete-product', admin, async (req, res) => {
   try {
      const { id } = req.body;
      let product = await Product.findByIdAndDelete(id);
      res.json(product);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// change order status
adminRouter.post('/admin/change-order-status', admin, async (req, res) => {
   try {
      const { id, status } = req.body;
      let order = await Order.findById(id);
      order.status = status;

      order = order.save();
      res.json(order);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// get total earnings of orders
adminRouter.get('/admin/analytics', admin, async (req, res) => {
   try {
      const orders = await Order.find({});
      let totalEarnings = 0;

      console.log('orders length:'+ orders.length);

      for (let i = 0; i < orders.length; i++) {
         for (let j = 0; j < orders[i].products.length; j++) {
            totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
         }
      }
      console.log('total'+ totalEarnings);

      // get category wise earnings
      let SmartPhoneEarnings = await fetchCategoryWiseProduct('SmartPhone');
      let LaptopEarnings = await fetchCategoryWiseProduct('Laptop');
      let TabletEarnings = await fetchCategoryWiseProduct('Tablet');
      let SpeakersEarnings = await fetchCategoryWiseProduct('Speakers');
      let SmartWatchEarnings = await fetchCategoryWiseProduct('SmartWatch');
      let HeadPhonesEarnings = await fetchCategoryWiseProduct('HeadPhones');
     

      let earnings = {
         totalEarnings,
         SmartPhoneEarnings,
         LaptopEarnings,
         TabletEarnings,
         SpeakersEarnings,
         SmartWatchEarnings,
         HeadPhonesEarnings
      }
      console.log('total earnings' + earnings.totalEarnings);

     

      res.json(earnings);

   } catch (e) {
      res.status(500).json({ error: e.message });
   }
});

async function fetchCategoryWiseProduct(category) {
   let earnings = 0;
   let categoryOrders = await Order.find({
      "products.product.category": category,
   });

   for (let i = 0; i < categoryOrders.length; i++) {
      for (let j = 0; j < categoryOrders[i].products.length; j++) {
         earnings +=
            categoryOrders[i].products[j].quantity *
            categoryOrders[i].products[j].product.price;
      }
   }
   return earnings;
}

module.exports = adminRouter;
