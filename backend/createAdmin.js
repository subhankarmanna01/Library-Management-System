const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({
      username: "admin",
    });

    if (existingUser) {
      const hashedPassword = await bcrypt.hash(
        "admin123",
        10
      );

      existingUser.password = hashedPassword;
      await existingUser.save();

      console.log("Admin password hashed successfully");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("Admin user created with hashed password");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();