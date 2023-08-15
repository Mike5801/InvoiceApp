import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 40,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
