const Sib = require('sib-api-v3-sdk');
const Forgotpasswordrequests = require("../Models/forgotpassword");
const User = require('../Models/user');
exports.sendMail = async (req, res) => {
    const receivedEmail = req.body.mail;
    const timeInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
    try {
        const user = await User.findOne({ where: { email: receivedEmail } })
        await Forgotpasswordrequests.create({ userId: user.id, isActive: true });
        const requestUser = await Forgotpasswordrequests.findOne({ userId: user.id, isActive: true });
        const forgotRequest = requestUser.id;
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.NEW_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'gaurvkmr1997@gmail.com'
        }
        const receivers = [{
            email: receivedEmail
        },]
        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset password link",
            textContent: 'Click below to reset your password',
            htmlContent: `<a href='http://localhost:3000/password/resetpassword/${forgotRequest}'>click here</a>`
        });
        setTimeout(() => {
            deactivateForgotPasswordRequest(forgotRequest);
        }, timeInterval);
        res.status(200).json({ message: "Sent message successfully" })
    } catch (err) {
        res.status(500).json({ err: err })
        console.log(err)
    }
}

exports.resetMail = async (req, res) => {
    const userId = req.params.userId;
    try {
        const requestUser = await Forgotpasswordrequests.findOne({ userId: userId, isActive: true });
        res.set('Location', `http://localhost:5173/resetpassword/${userId}`);
        res.status(302).send();
    } catch (err) {
        // res.set('Location', `http://localhost:5173/resetpassword/${userId}`);
        res.status(500).send('alert("Reset password link failed , please retry")');
        console.log(err)
    }
}

const deactivateForgotPasswordRequest = async (requestId) => {
    try {
        const requestUser = await Forgotpasswordrequests.findOne({ where: { id: requestId, isActive: true } });

        if (!requestUser) {
            console.log('Forgot password request not found or already inactive.');
            return;
        }

        // Update the isActive field to false
        await requestUser.update({ isActive: false });
        console.log(`Forgot password request with ID ${requestId} has been deactivated.`);
    } catch (error) {
        console.error('Error updating isActive field:', error.message);
    }
};
