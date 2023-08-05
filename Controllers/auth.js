const User = require("../Models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Forgotpassword = require("../Models/forgotpassword");
exports.authSignupPost = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const postSignup = async () => {
        try {
            const users = await User.findAll();
            const userExists = users.find((user) => user.email === email);
            if (userExists) {
                return res.status(301).json({ error: "Email id already exists" });
            }
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    throw new Error(err)
                }
                await User.create({ name, email, password: hash, totalExpense: 0, ispremiumuser: 0 });
                res.status(200).json({ data: "success" });
            })

        } catch (err) {
            console.log(err);
        }
    }
    postSignup();
}

function generateToken(id, name) {
    return jwt.sign({ userid: id, name: name }, "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
}

exports.authLoginPost = (req, res, next) => {
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;
    const postLogin = async () => {
        try {

            const users = await User.findAll();
            const userExists = users.find((user) => {
                return user.email === enteredEmail;
            });

            if (userExists) {
                bcrypt.compare(enteredPassword, userExists.password, (err, result) => {
                    if (err) {
                        throw new Error(err)
                    }

                    if (result === true) {
                        res.status(200).json({
                            data: "user successfully logged in",
                            token: generateToken(userExists.id, userExists.name),
                            ispremiumuser: userExists.ispremiumuser,
                        });

                    } else {
                        res.status(401).json({ error: "Entered password is wrong" });
                    }
                })

            } else {
                res.status(404).json({ error: "Email id  does not exists" });
            }

        } catch (err) {
            console.log(err);
        }
    }
    postLogin();
}

exports.updatePassword = async (req, res) => {
    const password = req.body.password;
    const userId = req.body.userId;
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error(err)
            }

            const forgotTable = await Forgotpassword.findOne({ where: { id: userId } })
            const clientId = forgotTable.userId;
            await forgotTable.update({ isActive: false });
            const user = await User.findOne({ where: { id: clientId } })
            console.log(user)

            await user.update({ password: hash });

            res.status(200).json({ data: "success" });
        })
    } catch (err) {
        res.status(500).json({ err: err })
        console.log(err)
    }
}