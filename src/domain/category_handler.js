// src/domain/category_handler.js
let categories = [];

exports.addCategory = (name, description) => {
    if (categories.find(category => category.name === name)) return false;
    categories.push({ name, description });
    return true;
};

exports.getCategories = () => categories;

exports.deleteCategory = (name) => {
    const initialLength = categories.length;
    categories = categories.filter(category => category.name !== name);
    return initialLength !== categories.length;
};
