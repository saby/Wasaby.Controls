/**
 * Библиотека контролов, которые реализуют выбор из меню.
 * @library Controls/dropdownPopup
 * @includes Template wml!Controls/_dropdownPopup/defaultHeadTemplate
 * @includes List Controls/_dropdownPopup/DropdownList
 * @includes itemTemplate tmpl!Controls/_dropdownPopup/itemTemplate
 * @public
 * @author Крайнов Д.О.
 */

/*
 * dropdownPopup library
 * @library Controls/dropdownPopup
 * @includes Template wml!Controls/_dropdownPopup/defaultHeadTemplate
 * @includes List Controls/_dropdownPopup/DropdownList
 * @includes itemTemplate tmpl!Controls/_dropdownPopup/itemTemplate
 * @public
 * @author Крайнов Д.О.
 */

import Template = require('wml!Controls/_dropdownPopup/defaultHeadTemplate');
import GroupTemplate = require('wml!Controls/_dropdownPopup/defaultGroupTemplate');
import List = require('Controls/_dropdownPopup/DropdownList');
import _ForTemplate = require('wml!Controls/_dropdownPopup/For');
import MoreButton = require('Controls/_dropdownPopup/MoreButton');
import DropdownViewModel = require('Controls/_dropdownPopup/DropdownViewModel');
import itemTemplate = require('tmpl!Controls/_dropdownPopup/itemTemplate');

export {
    Template,
    GroupTemplate,
    List,
    _ForTemplate,
    MoreButton,
    DropdownViewModel,
    itemTemplate
}
