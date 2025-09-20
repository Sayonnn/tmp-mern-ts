import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // adjust for security/performance tradeoff

const UserSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"]
    },
    password: { 
      type: String, 
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      validate: {
        validator: (value) => validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0 
        }),
        message: "Password is not strong enough"
      }
    },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, default: "user" },
    permissions: { 
      type: [Number], 
      enum: [1, 2, 3, 4], 
      default: [1] 
    },
    provider_id: { type: String, default: null },
    provider: { type: String, default: null },
    avatar: { type: String, default: null },
    status: { type: String, default: "active" },
    lastLogin: { type: Date, default: Date.now },
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
  this.updatedAt = Date.now();
  next();
});

// Method to compare password during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
