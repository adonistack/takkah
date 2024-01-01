const DeliveryOrder = require('../model/DeliveryOrder');

exports.createDeliveryOrder = async (req, res) => {
    const deliveryOrder = req.body;
    const newDeliveryOrder = new DeliveryOrder(deliveryOrder);
    try {
        await newDeliveryOrder.save();
        res.status(201).json(newDeliveryOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.getDeliveryOrders = async (req, res) => {
    try {
        const paymentStatus = req.query.paymentStatus || req.body.paymentStatus;
        const status = req.query.status || req.body.status;

        if (paymentStatus) {
            const deliveryOrders = await DeliveryOrder.find({ paymentStatus: paymentStatus });
            if (deliveryOrders.length === 0) {
                return res.status(404).send('No orders found for the provided payment status');
            }
            return res.json(deliveryOrders);
        }

        if (status) {
            const deliveryOrders = await DeliveryOrder.find({ status: status });
            if (deliveryOrders.length === 0) {
                return res.status(404).send('No orders found for the provided status');
            }
            return res.json(deliveryOrders);
        }

        const deliveryOrders = await DeliveryOrder.find();
     
    
        res.status(200).json(deliveryOrders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.getDeliveryOrdersByStore = async (req, res) => {
    const { id: orderOwner } = req.params;
    try {
        const deliveryOrders = await DeliveryOrder.find({ orderOwner });
        res.status(200).json(deliveryOrders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.getDeliveryOrdersByCourier = async (req, res) => {
    const { id: orderCourier } = req.params;
    try {
        const deliveryOrders = await DeliveryOrder.find({ orderCourier });
        res.status(200).json(deliveryOrders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getDeliveryOrdersByCustomerPhone = async (req, res) => {
    try {
        const phone = req.query.phone || req.body.phone;

        if (!phone) {
            return res.status(400).send('Phone number is required');
        }

        const orders = await DeliveryOrder.find({ phone: phone });
        if (orders.length === 0) {
            return res.status(404).send('No orders found for the provided phone number');
        }
        res.json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    
};

exports.getDeliveryOrder = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const deliveryOrder = await DeliveryOrder.findById(_id);
        res.status(200).json(deliveryOrder);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

};
exports.updateDeliveryOrder = async (req, res) => {
    const { id: _id } = req.params;
    const updatedOrder = req.body;

    try {
        const deliveryOrder = await DeliveryOrder.findByIdAndUpdate(_id, updatedOrder, { new: true });
        if (!deliveryOrder) res.status(404).send("No order found with that id");
        res.status(200).json(deliveryOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
exports.deleteDeliveryOrder = async (req, res) => {
    const { id: _id } = req.params;

    try {
        const result = await DeliveryOrder.findByIdAndRemove(_id);
        if (!result) res.status(404).send("No order found with that id");
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

