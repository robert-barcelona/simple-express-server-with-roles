import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: true,
    validate: validatePassword
  }
});

function validatePassword(password) {
  if (password.length < 6) throw Error("password length is too short");
}

const User = mongoose.model("User", userSchema);
export default User;
