/**
 * dropdownPopup library
 * @library Controls/dropdownPopup
 * @includes Template wml!Controls/_dropdownPopup/defaultHeadTemplate
 * @includes List Controls/_dropdownPopup/DropdownList
 * @includes ListStyles Controls/_dropdownPopup/DropdownListStyles
 * @includes itemTemplate tmpl!Controls/_dropdownPopup/itemTemplate
 * @public
 * @author Kraynov D.
 */

import Template = require('wml!Controls/_dropdownPopup/defaultHeadTemplate');
import GroupTemplate = require('wml!Controls/_dropdownPopup/defaultGroupTemplate');
import List = require('Controls/_dropdownPopup/DropdownList');
import _ForTemplate = require('wml!Controls/_dropdownPopup/For');
import MoreButton = require('Controls/_dropdownPopup/MoreButton');
import itemTemplate = require('tmpl!Controls/_dropdownPopup/itemTemplate');

export {
    Template,
    GroupTemplate,
    List,
    _ForTemplate,
    MoreButton,
    itemTemplate
}
