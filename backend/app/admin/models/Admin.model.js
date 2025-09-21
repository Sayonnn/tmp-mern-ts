import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const AdminSchema = new mongoose.Schema(
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
    super_admin: { type: Boolean, default: false },
    role: { type: String, default: "admin" },
    permissions: { 
      type: [Number], 
      enum: [1, 2, 3, 4], 
      default: [1] 
    }, 
    provider_id: { type: String, default: null },
    provider: { type: String, default: null },
    avatar: { type: String, default: null },
    status: { type: String, default: "active" },
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
AdminSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
  this.updatedAt = Date.now();
  next();
});

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
