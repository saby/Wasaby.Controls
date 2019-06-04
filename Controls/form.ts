/**
 * form library
 * @library Controls/form
 * @includes Controller Controls/_form/FormController
 * @includes Crud Controls/_form/Crud
 * @includes PrimaryAction Controls/_form/PrimaryAction
 * @public
 * @author Kraynov D.
 */

import Controller = require('Controls/_form/FormController');
import Crud = require('Controls/_form/Crud');

export {default as PrimaryAction} from './_form/PrimaryAction';

export {
    Controller,
    Crud
};
