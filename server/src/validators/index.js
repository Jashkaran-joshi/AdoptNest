const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and validate the request body
      const result = schema.parse(req.body);
      // Replace req.body with validated and transformed data
      req.body = result;
      next();
    } catch (error) {
      // Log validation errors for debugging
      console.error('Validation error:', error.errors);
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {})
      });
    }
  };
};

module.exports = validate;
