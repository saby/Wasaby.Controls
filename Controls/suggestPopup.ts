/**
 * suggestPopup library
 * @library Controls/suggestPopup
 * @includes ListContainer Controls/_suggestPopup/List
 * @includes FooterTemplate wml!Controls/_suggestPopup/footer
 * @public
 * @author Kraynov D.
 */

import ListContainer = require('Controls/_suggestPopup/List');
import FooterTemplate = require('wml!Controls/_suggestPopup/footer');

import _ListWrapper = require('Controls/_suggestPopup/_ListWrapper');
import Dialog = require('Controls/_suggestPopup/Dialog');

export {
   ListContainer,
   FooterTemplate,

   _ListWrapper,
   Dialog
};
