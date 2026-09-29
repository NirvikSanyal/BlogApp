require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!process.env.MONGODB_URI || !email || !password)
    throw new Error(
      "MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env",
    );
  if (!/^\S+@\S+\.\S+$/.test(email))
    throw new Error("ADMIN_EMAIL must be a valid email");
  if (password.length < 12)
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");

  await mongoose.connect(process.env.MONGODB_URI);
  let admin = await User.findOne({ email }).select("+password");
  if (admin) {
    admin.name = name;
    admin.password = password;
    admin.role = "admin";
    await admin.save();
    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin account created: ${email}`);
  }
};

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
