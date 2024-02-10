import crypto from 'crypto';
import { RecoveryToken } from '../models/RecoveryToken.model.js';

// Function to create an email verification token
export const createVerificationToken = async (userId) => {
    try {
        // Check if a token already exists for the user
        const existingToken = await RecoveryToken.findOne({ where: { userId: userId } });
        if (existingToken) {
            return false;
        }

        // Generate a new token and set the expiration date
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Create the new token in the database
        const createdToken = await RecoveryToken.create({
            token: token,
            userId: userId,
            expiresAt: expiresAt
        });
        
        return createdToken;
    } catch (error) {
        console.error("Error creating verification token: ", error);
        return null;
    }
}

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
