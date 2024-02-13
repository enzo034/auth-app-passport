import crypto from 'crypto';
import { RecoveryToken } from '../models/RecoveryToken.model.js';

export const createVerificationToken = async (userId) => {
    try {
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
    } catch (error) {
        console.log("Error sending the email:", error);
        throw new Error(error.message);
    }
};

// Function to verify an email verification token
export const verifyEmailToken = async (token) => {
    try {
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
            return null;
        }
    } catch (error) {
        console.log("Token error : ", error);
        return null;
    }
}
