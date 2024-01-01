const express = require('express');
const router = express.Router();
const DeliveryOrderController = require('../controller/DeliveryOrderController');

router.post('/', DeliveryOrderController.createDeliveryOrder);
router.get('/', DeliveryOrderController.getDeliveryOrders);
router.get('/:id', DeliveryOrderController.getDeliveryOrder);
router.get('/store/:id', DeliveryOrderController.getDeliveryOrdersByStore);
router.get('/courier/:id', DeliveryOrderController.getDeliveryOrdersByCourier);
router.get('/customer/:phone', DeliveryOrderController.getDeliveryOrdersByCustomerPhone);
router.put('/:id', DeliveryOrderController.updateDeliveryOrder);
router.delete('/:id', DeliveryOrderController.deleteDeliveryOrder);


module.exports = router;