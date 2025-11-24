const User = require('../models/User');
const Token = require('../models/Token');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require('../utils/email');
const config = require('../config');

class AuthService {
  async signup(userData) {
    try {
      const { name, email, password, phone, city } = userData;

      // Validate required fields
      if (!name || !email || !password) {
        throw new Error('Missing required fields: name, email, and password are required');
      }

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error('USER_EXISTS');
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        phone: phone || undefined,
        city: city || undefined
      });

      // Generate email verification token
      let verificationToken;
      try {
        verificationToken = generateToken();
        await Token.create({
          userId: user._id,
          token: verificationToken,
          type: 'email-verification',
          expiresAt: new Date(Date.now() + 3600000) // 1 hour
        });
      } catch (tokenError) {
        // If token creation fails, log but don't fail signup
        console.error('Failed to create verification token:', tokenError);
        // Continue without token - user can still sign up
      }

      // Send verification email (optional, can be disabled in dev)
      if (config.nodeEnv === 'production' && verificationToken) {
        try {
          await sendEmailVerificationEmail(user, verificationToken);
        } catch (emailError) {
          // Don't fail signup if email fails
          console.error('Failed to send verification email:', emailError);
        }
      }

      // Generate JWT
      let token;
      try {
        token = user.getSignedJwtToken();
      } catch (jwtError) {
        console.error('Failed to generate JWT token:', jwtError);
        throw new Error('Failed to generate authentication token');
      }

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          isEmailVerified: user.isEmailVerified
        },
        token
      };
    } catch (error) {
      // Re-throw known errors
      if (error.message === 'USER_EXISTS') {
        throw error;
      }
      // Log unexpected errors
      console.error('Signup service error:', error);
      throw error;
    }
  }

  async login(email, password) {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      throw new Error('ACCOUNT_SUSPENDED');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate JWT
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified
      },
      token
    };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If that email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = generateToken();
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'password-reset',
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });

    // Send email
    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return { message: 'If that email exists, a password reset link has been sent' };
  }

  async resetPassword(token, password) {
    // Find token
    const tokenDoc = await Token.findOne({
      token,
      type: 'password-reset',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      throw new Error('INVALID_TOKEN');
    }

    // Get user
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // Update password
    user.password = password;
    await user.save();

    // Delete token
    await Token.deleteOne({ _id: tokenDoc._id });

    return { message: 'Password reset successful' };
  }

  async verifyEmail(token) {
    // Find token
    const tokenDoc = await Token.findOne({
      token,
      type: 'email-verification',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      throw new Error('INVALID_TOKEN');
    }

    // Get user
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // Verify email
    user.isEmailVerified = true;
    await user.save();

    // Delete token
    await Token.deleteOne({ _id: tokenDoc._id });

    return { message: 'Email verified successfully' };
  }
}

module.exports = new AuthService();

