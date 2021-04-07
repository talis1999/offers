import pkg from "mongoose";
const { Schema, model } = pkg;

const offerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default() {
      return "";
    },
    validate: {
      validator: (description) => description.length <= 200,
    },
  },
  email: {
    type: String,
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

export default model("Offer", offerSchema);
