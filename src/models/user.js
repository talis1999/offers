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
  phone:{
      type:String,
      required: true,
      trim: true,
      validate: {
        validator: (phone) => phone.length===10,
      },
  }
});

userSchema.pre("save", function (next) {
  const user = this;
  user.password = bcrypt.hashSync(user.password, 8);
  next();
});

userSchema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

userSchema.methods.generateToken = function () {
  const user = this;
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
};

userSchema.methods.deleteToken = async function () {
  const user = this;
  await user.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
  return user;
};

export default model("User", userSchema);