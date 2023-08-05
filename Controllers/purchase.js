const Razorpay = require("razorpay");
const Order = require("../Models/order");
const User = require("../Models/user");
const Expense = require("../Models/expense");
const sequelize = require("../Util/database");
const purchasePremium = async (req, res) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            const sendResponse = async () => {
                await req.user.createOrder({ orderid: order.id, status: "PENDING" })
                return res.status(201).json({ order, key_id: rzp.key_id })
            }
            sendResponse();
        })
    } catch (err) {
        console.log(err)
    }
}

const updateStatus = async (req, res) => {

    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        await Promise.all([order.update({ paymentid: payment_id, status: 'SUCCESSFULL' }),
        req.user.update({ ispremiumuser: true })]);
        return res.status(201).json({ success: true, message: "Transaction Successfull" });

    } catch (err) {
        console.log(err);
    }
}

const showLeaderBoard = async (req, res) => {
    try {
        const leaderBoardOfUsers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
            include: [{
                model: Expense,
                attributes: []
            }],
            group: ['users.id'],
            order: [['totalExpense', 'DESC']]
        })
        res.json(leaderBoardOfUsers)
    } catch (err) {
        console.log(err)
    }
}
module.exports = { purchasePremium, updateStatus, showLeaderBoard };