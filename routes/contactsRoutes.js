const express = require('express');
const { getContacts, createContact, getContact, updateContact, deleteContact } = require('../controllers/contactsControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');

const router = express.Router();

router.use(validateTokenHandler);

router.route('/').get(getContacts).post(createContact)
//上面这句相当于这两句的合并写法：
//router.get('/', getContacts);
//router.post('/', createContact);

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact)

module.exports = router