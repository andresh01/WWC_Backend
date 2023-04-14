const Joi = require("joi");

const id = Joi.string().min(1).guid({version: 'uuidv4'});
const name = Joi.string().min(2).max(20);
const description = Joi.string().min(3);
const price = Joi.number().integer().min(10);
const quantity = Joi.number().integer().positive().min(0);
const category = Joi.string().min(3).max(15);


const createProductValidation = Joi.object({
    id : id,
    name : name.required(),
    description : description.required(),
    price : price.required(),
    quantity : quantity.required(),
    category : category.required(),
})

const updateProductValidation = Joi.object({
    id : id,
    name : name,
    description : description,
    price : price,
    quantity : quantity,
    category : category,
})

const getProductValidation = Joi.object({
    id : id.required(),
})

const deleteProductValidation = Joi.object({
    id : id.required()
})

module.exports = { createProductValidation, updateProductValidation, getProductValidation, deleteProductValidation } 