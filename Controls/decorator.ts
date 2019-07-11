/**
 * Библиотека декораторов.
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes MoneyStyles Controls/_decorator/MoneyStyles
 * @includes Number Controls/_decorator/Number
 * @includes PhoneNumber Controls/_decorator/PhoneNumber
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes MoneyStyles Controls/_decorator/Money/Styles
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes linkDecorateUtils Controls/_decorator/Markup/resources/linkDecorateUtils
 * @public
 * @author Крайнов Д.О.
 */

/*
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
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes linkDecorateUtils Controls/_decorator/Markup/resources/linkDecorateUtils
 * @public
 * @author Крайнов Д.О.
 */

import {default as Markup} from './_decorator/Markup';
import Money = require('Controls/_decorator/Money');
import Number = require('Controls/_decorator/Number');
import PhoneNumber = require('Controls/_decorator/PhoneNumber');

import {default as WrapURLs, IWrapURLsOptions} from 'Controls/_decorator/WrapURLs';
import {Highlight, SearchMode, IHighlightOptions} from 'Controls/_decorator/Highlight';

import Converter = require('Controls/_decorator/Markup/Converter');
import InnerText = require('Controls/_decorator/Markup/resolvers/innerText');
import _highlightResolver = require('Controls/_decorator/Markup/resolvers/highlight');
import noOuterTag = require('Controls/_decorator/Markup/resolvers/noOuterTag');
import linkDecorate = require('Controls/_decorator/Markup/resolvers/linkDecorate');

export {
    Highlight,
    SearchMode,
    IHighlightOptions,
    Markup,
    Money,
    Number,
    PhoneNumber,
    WrapURLs,
    IWrapURLsOptions,

    Converter,
    InnerText,
    noOuterTag,
    linkDecorate,

   _highlightResolver,
}
