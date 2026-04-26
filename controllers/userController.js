const User = require("../models/userModel"); // Check karlo path sahi hai ya nahi
const bcrypt = require("bcrypt");

// 1. Pehle securePassword function banao (Upar hona chahiye)
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log("Password hashing error:", error.message);
    }
};

// 2. Phir register_user function
const register_user = async (req, res) => {
    try {
        // Yahan 'sPassword' variable ka naam alag rakho taaki confusion na ho
        const sPassword = await securePassword(req.body.password);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: sPassword, // Yahan hashed password jayega
            mobile: req.body.mobile,
            image: req.file.filename, 
            type: req.body.type
        });

        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            return res.status(200).send({ success: false, msg: "Email already exists" });
        } else {
            const user_data = await user.save();
            return res.status(200).send({ success: true, data: user_data });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(200).send({ success: false, msg: error.message });
    }
};

module.exports = {
    register_user
};