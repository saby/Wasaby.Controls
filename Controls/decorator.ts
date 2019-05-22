/**
 * Decoratror library
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes MoneyStyles Controls/_decorator/MoneyStyles
 * @includes Number Controls/_decorator/Number
 * @includes PhoneNumber Controls/_decorator/PhoneNumber
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes MoneyStyles Controls/_decorator/Money/Styles
 * @public
 * @author Kraynov D.
 */

import Highlight = require('Controls/_decorator/Highlight');
import Markup = require('Controls/_decorator/Markup');
import Money = require('Controls/_decorator/Money');
import Number = require('Controls/_decorator/Number');
import PhoneNumber = require('Controls/_decorator/PhoneNumber');
import WrapURLs = require('Controls/_decorator/WrapURLs');

import Converter = require('Controls/_decorator/Markup/Converter');
import InnerText = require('Controls/_decorator/Markup/resolvers/innerText');
import _highlightResolver = require('Controls/_decorator/Markup/resolvers/highlight');
import NoOuterTag = require('Controls/_decorator/Markup/resolvers/noOuterTag');
import LinkDecorate = require('Controls/_decorator/Markup/resolvers/linkDecorate');

export {
    Highlight,
    Markup,
    Money,
    Number,
    PhoneNumber,
    WrapURLs,

    Converter,
    InnerText,
    NoOuterTag,
    LinkDecorate,

   _highlightResolver,
}
