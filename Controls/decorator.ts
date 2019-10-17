/**
 * Библиотека контролов, которые предназначены для преобразования данных к какому-либо внешнему виду.
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes MoneyStyles Controls/_decorator/MoneyStyles
 * @includes Number Controls/_decorator/Number
 * @includes Phone Controls/_decorator/Phone
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes MoneyStyles Controls/_decorator/Money/Styles
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes linkDecorateUtils Controls/_decorator/Markup/resources/linkDecorateUtils
 * @includes HighlightResolver Controls/_decorator/Markup/resolvers/highlight
 * @includes LinkDecorateResolver Controls/_decorator/Markup/resolvers/linkDecorate
 * @includes LinkWrapResolver Controls/_decorator/Markup/resolvers/linkWrap
 * @includes NoOuterTagResolver Controls/_decorator/Markup/resolvers/noOuterTag
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
 * @includes Phone Controls/_decorator/Phone
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes MoneyStyles Controls/_decorator/Money/Styles
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes linkDecorateUtils Controls/_decorator/Markup/resources/linkDecorateUtils
 * @includes HighlightResolver Controls/_decorator/Markup/resolvers/highlight
 * @includes LinkDecorateResolver Controls/_decorator/Markup/resolvers/linkDecorate
 * @includes LinkWrapResolver Controls/_decorator/Markup/resolvers/linkWrap
 * @includes NoOuterTagResolver Controls/_decorator/Markup/resolvers/noOuterTag
 * @public
 * @author Крайнов Д.О.
 */

import {default as Markup} from './_decorator/Markup';
import Money = require('Controls/_decorator/Money');
import Number = require('Controls/_decorator/Number');
import PhoneNumber = require('Controls/_decorator/PhoneNumber');

export {default as Phone} from 'Controls/_decorator/Phone';
import {default as WrapURLs, IWrapURLsOptions} from 'Controls/_decorator/WrapURLs';
import {Highlight, SearchMode, IHighlightOptions} from 'Controls/_decorator/Highlight';

import * as Converter from './_decorator/Markup/Converter';
import {default as InnerText}  from './_decorator/Markup/resolvers/innerText';
import {default as _highlightResolver} from './_decorator/Markup/resolvers/highlight';
import {default as noOuterTag} from './_decorator/Markup/resolvers/noOuterTag';
import {default as linkDecorate}  from './_decorator/Markup/resolvers/linkDecorate';
import {default as linkWrapResolver}  from './_decorator/Markup/resolvers/linkWrap';

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
    linkWrapResolver,

   _highlightResolver,
}
