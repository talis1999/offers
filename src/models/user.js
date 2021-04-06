import pkg from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema, model } = pkg;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (phone) =>
        /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
          phone
        ),
    },
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  user.password = bcrypt.hashSync(user.password, 8);
  next();
});

userSchema.methods.comparePassword = function (password) {
  const user = this;
  console.log(password);
  console.log(user.password);
  return bcrypt.compareSync(password, user.password);
};

userSchema.methods.generateToken = function () {
  const { email, phone } = this;
  return jwt.sign({ email, phone }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

export default model("User", userSchema);
