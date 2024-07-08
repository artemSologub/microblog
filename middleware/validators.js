const yup = require('yup');

const { ValidationError } = require('../errors');

const MESSAGES = {
  missing: 'should be provided',
  wrongType: (type) => `should be ${type}`,
};

const authorDataSchema = yup.object({
  authorname: yup
    .string()
    .typeError(MESSAGES.wrongType('a string'))
    .required(MESSAGES.missing)
    .min(4, 'should be at least 4 chars'),
  password: yup
    .string()
    .typeError(MESSAGES.wrongType('a string'))
    .required(MESSAGES.missing)
    .min(8, 'should be at least 8 chars'),
});

const authorValidator = async (req, resp, next) => {
  try {
    await authorDataSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    console.log('err = ', err);
    const errors = err.inner.reduce((acc, curr) => {
      if (!acc[curr.path]) {
        acc[curr.path] = [];
      }

      acc[curr.path].push(curr.message);
      return acc;
    }, {});

    next(
      new ValidationError({ msg: 'Inalid author credentials format', errors })
    );
  }
};

module.exports = {
  authorValidator,
};
