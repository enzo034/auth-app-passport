import crypto from 'crypto';
import { RecoveryToken } from '../models/RecoveryToken.model.js';

// Función para crear un token de verificación de correo electrónico
export const createVerificationToken = async (userId) => {
    try {
        // Verificar si ya existe un token para el usuario
        const existingToken = await RecoveryToken.findOne({ where: { userId: userId } });
        if (existingToken) {
            return false;
        }

        // Generar un nuevo token y establecer la fecha de vencimiento
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Crear el nuevo token en la base de datos
        const createdToken = await RecoveryToken.create({
            token: token,
            userId: userId,
            expiresAt: expiresAt
        });
        
        return createdToken;
    } catch (error) {
        console.error("Error al crear el token de verificación:", error);
        return null;
    }
}

// Función para verificar un token de verificación de correo electrónico
export const verifyEmailToken = async (token) => {
    try {
        const emailToken = await VerificationToken.findOne({
            where: {
                token: token
            }
        });

        if (emailToken && emailToken.expiresAt > new Date()) {
            console.log("El token es válido");
            return emailToken;
        } else {
            console.log("Token no encontrado, inválido o expirado");
            return null;
        }
    } catch (error) {
        console.log("Error al verificar el token : ", error);
        return null;
    }
}
