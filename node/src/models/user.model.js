import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters"],
        validate: {
            validator: function (v) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v);
            },
            message: "Password must contain uppercase, lowercase, and number",
        },
    },
    // This is the field we will automatically update
    role: {
        type: String,
        enum: ['student', 'gkvian', 'admin'],
        default: 'student'
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getAccessToken = function () {
    return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET || 'BLACKBIRDCODELABS',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
}

const User = mongoose.model('User', userSchema);
export default User;