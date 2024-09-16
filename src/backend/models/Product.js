// src/backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  inventories: [{
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    quantity: { type: Number, required: true, default: 0 }
  }]
}, { timestamps: true });

ProductSchema.virtual('totalQuantity').get(function() {
  return this.inventories.reduce((total, inv) => total + inv.quantity, 0);
});

module.exports = mongoose.model('Product', ProductSchema);
 
// اعتقد لازم يبقي في طريقه نعرف بيها الكميه كله بتاعت برودكت معين