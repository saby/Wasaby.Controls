/**
 * validate library
 * @library Controls/validate
 * @includes Controller Controls/_validate/FormController
 * @includes Container Controls/_validate/Controller
 * @includes InputContainer Controls/_validate/Input
 * @includes isEmail Controls/_validate/Validators/IsEmail
 * @includes isRequired Controls/_validate/Validators/IsRequired
 * @includes isValidDate Controls/_validate/Validators/IsValidDate
 * @includes Selection Controls/_validate/Selection
 * @public
 * @author Крайнов Д.О.
 */

import Controller = require('Controls/_validate/FormController');
import Container = require('Controls/_validate/Controller');
import InputContainer = require('Controls/_validate/Input');
import isEmail = require('Controls/_validate/Validators/IsEmail');
import isRequired = require('Controls/_validate/Validators/IsRequired');
import isValidDate = require('Controls/_validate/Validators/IsValidDate');
import Selection = require('Controls/_validate/Selection');

export {
    Controller,
    Container,
    InputContainer,
    isEmail,
    isRequired,
    isValidDate,
    Selection
}
