
const User = require("../models/ModelUser");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// SIGNUP

const doSignup = async (req, res) => {
    try {
        const { emailid, password, utype } = req.body;

        if (!emailid || !password || !utype) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!["vendor", "citizen"].includes(utype)) {
            return res.status(400).json({
                message: "Invalid user type"
            });
        }

        const existingUser = await User.findOne({
            emailid: emailid.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            emailid: emailid.trim().toLowerCase(),
            password: encryptedPassword,
            utype: utype,
            status: 1
        });

        await user.save();

        res.status(201).json({
            message: "Signup Successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Signup Failed",
            error: error.message
        });
    }
};


// LOGIN

const doLogin = async (req, res) => {
    try {
        const { emailid, password } = req.body;

        const user = await User.findOne({
            emailid: emailid.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        // Check whether user is blocked
        if (user.status === 0) {
            return res.status(403).json({
                message: "Your account is blocked"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT Token
        let token = jwt.sign(
            { emailid: user.emailid },
            process.env.SEC_KEY
        );

        res.status(200).json({
            status: true,
            message: "Login Successful",
            utype: user.utype,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: "Login Failed",
            error: error.message
        });
    }
};


// VERIFY OLD PASSWORD

async function verifyOldPassword(req, res) {
    try {
        let emailid = req.emailid;
        let oldPassword = req.body.oldPassword;

        if (!oldPassword) {
            return res.json({
                status: false,
                message: "Please enter old password"
            });
        }

        // Find logged-in user using JWT email
        let user = await User.findOne({
            emailid: emailid
        });

        if (!user) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }

        // Compare old password
        let isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.json({
                status: false,
                message: "Old password is incorrect"
            });
        }

        return res.json({
            status: true,
            message: "Old password verified successfully"
        });

    } catch (error) {
        console.log("VERIFY PASSWORD ERROR:", error);

        return res.json({
            status: false,
            message: "Something went wrong"
        });
    }
}


// CHANGE PASSWORD

async function changePassword(req, res) {
    try {
        let emailid = req.emailid;

        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let confirmPassword = req.body.confirmPassword;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.json({
                status: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.json({
                status: false,
                message: "New passwords do not match"
            });
        }

        if (oldPassword === newPassword) {
            return res.json({
                status: false,
                message: "New password must be different"
            });
        }

        // Find logged-in user
        let user = await User.findOne({
            emailid: emailid
        });

        if (!user) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }

        // Verify old password again
        let isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.json({
                status: false,
                message: "Old password is incorrect"
            });
        }

        // Encrypt new password
        let encryptedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        user.password = encryptedPassword;

        await user.save();

        return res.json({
            status: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log("CHANGE PASSWORD ERROR:", error);

        return res.json({
            status: false,
            message: "Something went wrong"
        });
    }
}


// EXPORT FUNCTIONS

module.exports = {
    doSignup,
    doLogin,
    verifyOldPassword,
    changePassword
};
