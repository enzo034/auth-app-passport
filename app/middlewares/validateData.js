import Joi from 'joi';

const schemaSignup = Joi.object({
    firstname: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).max(20),
    lastname: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).max(20),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(8).max(24).required()
})

export const validateDataSignup = (req, res, next) => {

    const { firstname, lastname, email, password } = req.body;

    const validatorResult = schemaSignup.validate({firstname, lastname, email, password});

    if(validatorResult.error) {
        //Send error to the signup
    }

    next();
}

