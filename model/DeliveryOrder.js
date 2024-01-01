const mongoose = require('mongoose');

const deliveryOrderSchema = new mongoose.Schema({
  deliveryId: mongoose.Schema.Types.ObjectId,
  customerFirstName: String,
  customerLastName: String,
    address: {
      area: {type: String, enum: ['north', 'south', 'mothalath', 'jerusalem']},
      city: String,
      street: String,
      number: String,
    },
    phone: String,
    notes: String,
    cost: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: 'Cost must be a non-negative number.'
      }
    },
    orderTime: Date,
    paymentType: { type: String, enum: ['cash', 'credit'] },
    paymentStatus: { type: String, enum: ['pending', 'paid'] },
    status: { type: String, enum: ['pending', 'preparing', 'delivering', 'delivered'] },
    orderOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderCourier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   

  }, { timestamps: true });

  deliveryOrderSchema.pre('save', function(next) {
    if (this.isNew) {
      if (this.paymentType === 'credit') {
        this.paymentStatus = 'paid';
      }
      this.status = 'pending';
    }
    next();
  });

  deliveryOrderSchema.pre('save', function(next) {
    if (this.isModified('cost') && !this.cost.toString().includes('.')) {
      this.cost = parseFloat(this.cost).toFixed(2);
    }
    next();
  }
  );
  
  
  const DeliveryOrder =  mongoose.model('DeliveryOrder', deliveryOrderSchema);
  
  module.exports = DeliveryOrder;
  