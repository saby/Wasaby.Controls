/**
 * List library
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes Number Controls/_decorator/Number
 * @includes PhoneNumber Controls/_decorator/PhoneNumber
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes Dictionary Controls/_decorator/PhoneNumber/Dictionary
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes template Controls/_decorator/Markup/resources/template
 * @includes linkDecorateUtils Controls/_decorator/Markup/resources/linkDecorateUtils
 * @includes noOuterTag Controls/_decorator/Markup/resolvers/noOuterTag
 * @includes linkDecorate Controls/_decorator/Markup/resolvers/linkDecorate
 * @includes innerText Controls/_decorator/Markup/resolvers/innerText
 * @includes highlight Controls/_decorator/Markup/resolvers/highlight
 * @public
 * @author Kraynov D.
 */

import Highlight = require('Controls/_decorator/Highlight');
import Markup = require('Controls/_decorator/Markup');
import Money = require('Controls/_decorator/Money');
import Number = require('Controls/_decorator/Number');
import PhoneNumber = require('Controls/_decorator/PhoneNumber');
import WrapURLs = require('Controls/_decorator/WrapURLs');
import Dictionary = require('Controls/_decorator/PhoneNumber/Dictionary');
import Converter = require('Controls/_decorator/Markup/Converter');
import template = require('Controls/_decorator/Markup/resources/template');
import linkDecorateUtils = require('Controls/_decorator/Markup/resources/linkDecorateUtils');
import noOuterTag = require('Controls/_decorator/Markup/resolvers/noOuterTag');
import linkDecorate = require('Controls/_decorator/Markup/resolvers/linkDecorate');
import innerText = require('Controls/_decorator/Markup/resolvers/innerText');
import highlight = require('Controls/_decorator/Markup/resolvers/highlight');

export {
    Highlight,
    Markup,
    Money,
    Number,
    PhoneNumber,
    WrapURLs,
    Dictionary,
    Converter,
    template,
    linkDecorateUtils,
    noOuterTag,
    linkDecorate,
    innerText,
    highlight
}