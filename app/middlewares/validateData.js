import Joi from 'joi';

const schemaSignup = Joi.object({
    firstname: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).max(20),
    lastname: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).max(20),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(8).max(24).required()
});

const schemaLogin = Joi.object({
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(8).max(24).required()
});

export const validateDataSignup = (req, res, next) => {

    const { firstname, lastname, email, password } = req.body;

    const validatorResult = schemaSignup.validate({ firstname, lastname, email, password });

    if (validatorResult.error) {
        const errorMessage = validatorResult.error.details[0].message;
        res.render('signup', { errorMessage });
    } else {
        next();
    }
}

export const validateDataSignin = (req, res, next) => {

    const { email, password } = req.body;

    const validatorResult = schemaLogin.validate({email, password});

    if(validatorResult.error){
        const errorMessage = validatorResult.error.details[0].message;
        res.render('signin', { errorMessage });
    } else {
        next();
    }
}

