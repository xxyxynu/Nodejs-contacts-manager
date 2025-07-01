const asyncHandler = require('express-async-handler');
//express-async-handler 就是帮你自动捕获异步错误并传递给 Express 的错误处理中间件。
const Contact = require('../models/contactModel');

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json({
        message: 'Contacts retrieved successfully',
        contacts,
    });
});

const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400).json({
            message: 'Please provide all required fields',
        });
        return;
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });

    res.status(201).json({
        message: 'Contact created successfully',
        contact,
    });
});

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({
            message: 'Contact not found',
        });
        return;
    }

    res.status(200).json({
        message: `Contact retrieved successfully ${req.params.id}`,
        contact,
    });
});

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404).json({
            message: 'Contact not found',
        });
    }

    if (contact.user_id.toString() !== req.user.id.toString()) {
        res.status(401).json({
            message: 'Not authorized to perform this action',
        });
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!contact) {
        res.status(404).json({
            message: 'Contact not found',
        });
        return;
    }

    res.status(200).json({
        message: `Contact updated successfully ${req.params.id}`,
        updatedContact,
    });
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404).json({
            message: 'Contact not found',
        });
        return;
    }

    if (contact.user_id.toString() !== req.user.id.toString()) {
        res.status(401).json({
            message: 'Not authorized to perform this action',
        });
    }

    await Contact.deleteOne({ _id: req.params.id });

    res.status(200).json({
        message: `Contact deleted successfully ${req.params.id}`,
    });
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};