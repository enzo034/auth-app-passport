import crypto from 'crypto';
import { RecoveryToken } from '../models/RecoveryToken.model.js';

export const createVerificationToken = async (userId) => {
    const existingToken = await RecoveryToken.findOne({ where: { userId: userId } });

    if (existingToken) {
        throw new Error("There's an existing token for this account.");
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const createdToken = await RecoveryToken.create({
        token: token,
        userId: userId,
        expiresAt: expiresAt
    });

    return createdToken;
};

// Function to verify an email verification token
export const verifyEmailToken = async (token) => {
    const emailToken = await RecoveryToken.findOne({
        where: {
            token: token
        }
    });

    // Valid token
    if (emailToken && emailToken.expiresAt > new Date()) {
        return emailToken;
    } else {
        // Token expired, invalid or not found
        throw new Error("The token not found, expired or invalid.");
    }
}
