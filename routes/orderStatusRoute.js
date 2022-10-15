const express = require("express")
const router = express.Router()
const { createOrderStatus, updateOrderStatus ,getAllOrderStatus } = require("../controllers/orderStatusController")
const { isLoggedIn , customRole } = require("../middlewares/userInfo")


router.route('/orderStatus/create').post(isLoggedIn , customRole('admin'), createOrderStatus )
router.route('/orderStatus/update').post(isLoggedIn , customRole('admin'), updateOrderStatus )
router.route('/orderStatus/list').get(isLoggedIn , customRole('admin'), getAllOrderStatus )


module.exports = router 