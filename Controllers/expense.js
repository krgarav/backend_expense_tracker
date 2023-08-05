const Expense = require("../Models/expense");
const sequelize = require("../Util/database");
const Userservices = require("../Services/userservices");
const S3services = require("../Services/s3services");
const Expensedownload = require("../Models/downloadexpense");
exports.postExpense = async (req, res, next) => {
    const { quantity, description, category } = req.body;

    const t = await sequelize.transaction();

    const postData = async () => {
        try {
            const totalAmount = req.user.totalExpense += +quantity;
            await req.user.createExpense({ amount: quantity, description, category }, { transaction: t });
            await req.user.update({ totalExpense: totalAmount }, { transaction: t })
            await t.commit();
            res.status(200).json({ message: "Expense Created" });
        } catch (err) {
            await t.rollback();
            res.status(500).json({ err: err })
            console.log(err);
        }
    }
    postData();
};
exports.getExpensesCount = async (req, res) => {
    const count = req.params.count;
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
console.log(count)
    const length =  Math.ceil(+expenses.length / count);

    res.status(200).json({ pages: length });
}
exports.getExpenses = (req, res) => {

    const limit = +req.query.e;
    const row = +req.query.row;

    const getData = async () => {
        const arr = [];
        let endingValue;
        let initialValue;
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        initialValue = (limit - 1) * row;;
        endingValue = limit * row;
        for (let i = initialValue; i < endingValue; i++) {
            if (expenses[i] !== undefined) {
                arr.push(expenses[i]);
            }
        }
        res.status(201).json(arr);
    }
    getData();
}

exports.getAllExpenses = async (req, res) => {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.status(200).json(expenses)
}
exports.deleteExpense = (req, res) => {
    const expenseId = +req.params.expenseId;

    const deleteExpense = async () => {
        const t = await sequelize.transaction();

        try {
            const toBeDeletedExpense = await Expense.findOne({ where: { userId: req.user.id, id: expenseId } }, { transaction: t });
            const amount = req.user.totalExpense - +toBeDeletedExpense.amount;
            await req.user.update({ totalExpense: amount }, { transaction: t });
            await toBeDeletedExpense.destroy();
            await t.commit();
            res.status(200).json({ message: "Expense deleted" });
        } catch (err) {
            await t.rollback();
            res.status(500).json({ err: err });
            console.log(err)
        }
    }
    deleteExpense();
}

exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await Userservices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses, fileName);
        await req.user.createExpensesdownload({ url: fileURL })
        res.status(200).json({ fileURL: fileURL, success: true })
    } catch (err) {
        res.status(401).json({ success: false })
    }
}
exports.allDownloadedExpenses = async (req, res) => {
    try {
        const allDownloadedExpenses = await Expensedownload.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ data: allDownloadedExpenses, success: true });
    } catch (err) {
        console.log(err);
    }
}