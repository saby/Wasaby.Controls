/**
 * Библиотека контролов, которые предназначены для преобразования данных к какому-либо внешнему виду.
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes Number Controls/_decorator/Number
 * @includes Phone Controls/_decorator/Phone
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes _highlightResolver Controls/_decorator/Markup/resolvers/highlight
 * @includes linkDecorate Controls/_decorator/Markup/resolvers/linkDecorate
 * @includes linkWrapResolver Controls/_decorator/Markup/resolvers/linkWrap
 * @includes noOuterTag Controls/_decorator/Markup/resolvers/noOuterTag
 * @public
 * @author Крайнов Д.О.
 */

/*
 * Decoratror library
 * @library Controls/decorator
 * @includes Highlight Controls/_decorator/Highlight
 * @includes Markup Controls/_decorator/Markup
 * @includes Money Controls/_decorator/Money
 * @includes Number Controls/_decorator/Number
 * @includes Phone Controls/_decorator/Phone
 * @includes WrapURLs Controls/_decorator/WrapURLs
 * @includes Converter Controls/_decorator/Markup/Converter
 * @includes InnerText Controls/_decorator/Markup/resolvers/innerText
 * @includes _highlightResolver Controls/_decorator/Markup/resolvers/highlight
 * @includes linkDecorate Controls/_decorator/Markup/resolvers/linkDecorate
 * @includes linkWrapResolver Controls/_decorator/Markup/resolvers/linkWrap
 * @includes noOuterTag Controls/_decorator/Markup/resolvers/noOuterTag
 * @public
 * @author Крайнов Д.О.
 */

import {default as Markup} from './_decorator/Markup';
import Number = require('Controls/_decorator/Number');
import PhoneNumber = require('Controls/_decorator/PhoneNumber');

export {default as Phone, IPhoneOptions} from 'Controls/_decorator/Phone';
export {default as Money, IMoneyOptions} from 'Controls/_decorator/Money';
export {default as WrapURLs, IWrapURLsOptions} from 'Controls/_decorator/WrapURLs';
export {default as Highlight, SearchMode, IHighlightOptions} from 'Controls/_decorator/Highlight';

import * as Converter from './_decorator/Markup/Converter';
import {default as InnerText}  from './_decorator/Markup/resolvers/innerText';
import {default as _highlightResolver} from './_decorator/Markup/resolvers/highlight';
import {default as noOuterTag} from './_decorator/Markup/resolvers/noOuterTag';
import {default as linkDecorate}  from './_decorator/Markup/resolvers/linkDecorate';
import {default as linkWrapResolver}  from './_decorator/Markup/resolvers/linkWrap';

export {
    Markup,
    Number,
    PhoneNumber,

    Converter,
    InnerText,
    noOuterTag,
    linkDecorate,
    linkWrapResolver,

   _highlightResolver,
}
