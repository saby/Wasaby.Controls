/**
 * dropdown library
 * @library Controls/dropdown
 * @includes Button Controls/_dropdown/Button
 * @includes Input Controls/_dropdown/Input
 * @includes _Controller Controls/_dropdown/_Controller
 * @includes Opener Controls/_dropdown/Opener
 * @includes Combobox Controls/_dropdown/ComboBox
 * @includes ItemTemplate Controls/_dropdown/itemTemplate
 * @includes IFooterTemplate Controls/_dropdown/interface/IFooterTemplate
 * @includes IGrouped Controls/_dropdown/interface/IGrouped
 * @includes IHeaderTemplate Controls/_dropdown/interface/IHeaderTemplate
 * @includes MenuStyles Controls/_dropdown/Button/MenuStyles
 * @includes Styles Controls/_dropdown/Input/Styles
 * @includes inputDefaultContentTemplate wml!Controls/_dropdown/Input/resources/defaultContentTemplate
 * @public
 * @author Kraynov D.
 */

import Button = require('Controls/_dropdown/Button');
import Input = require('Controls/_dropdown/Input');
import _Controller = require('Controls/_dropdown/_Controller');
import Opener = require('Controls/_dropdown/Opener');
import Combobox = require('Controls/_dropdown/ComboBox');
import ItemTemplate = require('wml!Controls/_dropdown/itemTemplate');

import MenuUtils = require('Controls/_dropdown/Button/MenuUtils');
import dropdownHistoryUtils = require('Controls/_dropdown/dropdownHistoryUtils');
import inputDefaultContentTemplate = require('wml!Controls/_dropdown/Input/resources/defaultContentTemplate');
import defaultContentTemplateWithIcon = require('wml!Controls/_dropdown/Input/resources/defaultContentTemplateWithIcon');

export {
    Button,
    Input,
    _Controller,
    Opener,
    Combobox,
    ItemTemplate,

    MenuUtils,
    dropdownHistoryUtils,
    inputDefaultContentTemplate,
    defaultContentTemplateWithIcon
}
