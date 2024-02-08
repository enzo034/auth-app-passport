import bcrypt from 'bcryptjs'

export const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

export const isValidPassword = (userpass, password) => {
    return bcrypt.compareSync(password, userpass);
}