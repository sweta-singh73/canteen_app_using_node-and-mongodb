const Joi = require('joi');

const empValidationSchema = Joi.object({
  emp_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Employee ID must be a number.',
      'number.integer': 'Employee ID must be an integer.',
      'number.positive': 'Employee ID must be a positive number.',
      'any.required': 'Employee ID is required.',
    }),
    otherwise:Joi.forbidden(),

  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/) // Only alphabets and spaces
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain alphabets and spaces.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name cannot exceed 50 characters.',
      'any.required': 'Name is required.',
    }),
    otherwise:Joi.forbidden(),

  role: Joi.string()
    .trim()
    .valid('user', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be either "user" or "admin".',
      'any.required': 'Role is required.',
    }),
    otherwise:Joi.forbidden(),

  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // Strict email regex
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format. Use a valid email address.',
      'any.required': 'Email is required.',
    }),
    otherwise:Joi.forbidden(),

  department: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/) // Only alphabets and spaces
    .required()
    .messages({
      'string.pattern.base': 'Department name can only contain alphabets and spaces.',
      'string.min': 'Department must be at least 3 characters long.',
      'string.max': 'Department cannot exceed 50 characters.',
      'any.required': 'Department is required.',
    }),
    otherwise:Joi.forbidden(),

    
});

module.exports = empValidationSchema;
