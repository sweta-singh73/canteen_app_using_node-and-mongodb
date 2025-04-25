const Joi = require('joi');

// Common Validations
const idSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'ID must be a number.',
    'number.integer': 'ID must be an integer.',
    'number.positive': 'ID must be a positive number.',
    'any.required': 'ID is required.',
  });

  const objectIdSchema = Joi.string()
  .trim()
  .length(24)
  .hex()
  .required()
  .messages({
    'string.length': 'Item ID must be a 24-character hexadecimal string.',
    'string.hex': 'Item ID must be a valid hexadecimal string.',
    'any.required': 'Item ID is required.',
  });

const nameSchema = Joi.string()
  .trim()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Name can only contain alphabets and spaces.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot exceed 50 characters.',
    'any.required': 'Name is required.',
  });

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Invalid email format. Use a valid email address.',
    'any.required': 'Email is required.',
  });

const roleSchema = Joi.string()
  .trim()
  .valid('user', 'admin')
  .required()
  .messages({
    'any.only': 'Role must be either "user" or "admin".',
    'any.required': 'Role is required.',
  });

const departmentSchema = Joi.string()
  .trim()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Department can only contain alphabets and spaces.',
    'string.min': 'Department must be at least 3 characters long.',
    'string.max': 'Department cannot exceed 50 characters.',
    'any.required': 'Department is required.',
  });

const quantitySchema = Joi.number()
  .integer()
  .min(1)
  .required()
  .messages({
    'number.base': 'Quantity must be a number.',
    'number.min': 'Quantity must be at least 1.',
    'any.required': 'Quantity is required.',
  });

  const titleSchema = Joi.string()
  .trim()
  .min(3)
  .max(100)
  .required()
  .messages({
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title cannot exceed 100 characters.',
    'any.required': 'Title is required.',
  });

  const mealTypeSchema = Joi.string()
  .trim()
  .valid('breakfast', 'lunch', 'dinner', 'snack')
  .required()
  .messages({
    'any.only': 'Meal type must be one of: breakfast, lunch, dinner, or snack.',
    'any.required': 'Meal type is required.',
  });

const timeSchema = Joi.string()
  .trim()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    'string.pattern.base': 'Time must be in HH:MM format (24-hour).',
    'any.required': 'Time is required.',
  });


//  Signup Validation
const signupValidation = Joi.object({
  emp_id: idSchema,
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  department: departmentSchema,
}).unknown(false);

// Login Validation
const loginValidation = Joi.object({
  emp_id: idSchema
}).unknown(false);

//  Add to Cart Validation
const addToCartValidation = Joi.object({
  itemId:objectIdSchema,
  quantity: quantitySchema
}).unknown(false);

//  Update Cart Validation
const updateCartValidation = Joi.object({
  itemId: quantitySchema,
  quantity: quantitySchema,
}).unknown(false);

// Remove Cart Item Validation
const removeCartValidation = Joi.object({
  itemId: quantitySchema,
}).unknown(false);

//add menu validation 
const addMenuValidation = Joi.object({
  title:titleSchema,
  mealType: mealTypeSchema,
  startTime: timeSchema,
  endTime: timeSchema,
}).unknown(false);


//  Export All Validations
module.exports = {
  signupValidation,
  loginValidation,
  addToCartValidation,
  updateCartValidation,
  removeCartValidation,
  addMenuValidation
};
