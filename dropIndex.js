const mongoose = require('mongoose');

const local = "mongodb+srv://leducdung02072004:g4H7FdXialfs66Cn@beebarber.ynx9m.mongodb.net/BeeBarber?retryWrites=true&w=majority&appName=BeeBarber"; 

const connectAndDropIndex = async () => {
    try {
        await mongoose.connect(local);
        console.log('Connection success');

        const SubcategoryProduct = mongoose.model("subcategoryproduct", new mongoose.Schema({}));

        // Drop the collection
        await SubcategoryProduct.collection.drop();
        console.log("Collection dropped successfully!");
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

connectAndDropIndex();
