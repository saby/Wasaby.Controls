/**
 * Created by rn.kondakov on 15.02.2019.
 */
import base64 = require('Core/base64');
import { constants } from 'Env/Env';
import * as objectMerge from 'Core/core-merge';

const hrefMaxLength = 1499;
const onlySpacesRegExp = /^\s+$/;
const paragraphTagNameRegExp = /^(p(re)?|div)$/;
const charsToScreenRegExp = /([\\"])/g;
const classes = {
   wrap: 'LinkDecorator__wrap',
   link: 'LinkDecorator__linkWrap',
   image: 'LinkDecorator__image'
};

function isAttributes(value) {
   return typeof value === 'object' && !Array.isArray(value);
}

function isElementNode(jsonNode) {
   return Array.isArray(jsonNode) && typeof jsonNode[0] === 'string';
}

function isTextNode(jsonNode) {
   return typeof jsonNode === 'string';
}

function getAttributes(jsonNode) {
   let result;
   if (isElementNode(jsonNode) && isAttributes(jsonNode[1])) {
      result = jsonNode[1];
   } else {
      result = {};
   }
   return result;
}

function getTagName(jsonNode) {
   let result;
   if (isElementNode(jsonNode)) {
      result = jsonNode[0];
   } else {
      result = '';
   }
   return result;
}

function getFirstChild(jsonNode) {
   let result;
   if (isElementNode(jsonNode)) {
      if (isAttributes(jsonNode[1])) {
         result = jsonNode[2];
      } else {
         result = jsonNode[1];
      }
   }
   if (!result) {
      result = '';
   }
   return result;
}

function isLinkGoodForDecorating(linkNode) {
   const attributes = getAttributes(linkNode);
   const firstChild = getFirstChild(linkNode);

   // Decorate link only with text == href, and href length shouldn't be more than given maximum.
   // And decorate link that starts with "http://" or "https://".
   return attributes.href && attributes.href.length <= getHrefMaxLength() &&
      isTextNode(firstChild) && attributes.href === firstChild && attributes.href.indexOf('http') === 0;
}

/**
 * Get class names for decorating link.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#getClasses
 * @returns {Object}
 */
function getClasses() {
   return classes;
}

/**
 * Get name of decorated link service.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#getService
 * @returns {String|undefined}
 */
function getService() {
   return constants.decoratedLinkService;
}

/**
 * Get name of decorated link service.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#getHrefMaxLength
 * @returns {number}
 */
function getHrefMaxLength() {
   // TODO: In this moment links with length 1500 or more are not being decorated.
   // Have to take this constant from the correct source. Problem link:
   // https://online.sbis.ru/opendoc.html?guid=ff5532f0-d4aa-4907-9f2e-f34394a511e9
   return hrefMaxLength;
}

/**
 * Check if json node with given tag name and the first child node is a decorated link
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#isDecoratedLink
 * @param tagName {string}
 * @param firstChildNode {JsonML}
 * @returns {boolean}
 */
function isDecoratedLink(tagName, firstChildNode) {
   let result;
   if (tagName === 'span') {
      const firstChildTagName = getTagName(firstChildNode);
      const firstChildAttributes = getAttributes(firstChildNode);

      result = firstChildTagName === 'a' && !!firstChildAttributes.href &&
         firstChildAttributes.class === getClasses().link;
   } else {
      result = false;
   }
   return result;
}

/**
 * Undecorate decorated link. Calls after "isDecoratedLink" function, link node here is the first child there.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#getUndecoratedLink
 * @param linkNode {jsonML}
 * @returns {jsonML}
 */
function getUndecoratedLink(linkNode) {
   const linkAttributes = getAttributes(linkNode);
   const newLinkAttributes = objectMerge({}, linkAttributes, { clone: true });

   // Save all link attributes, replace only special class name on usual.
   newLinkAttributes.class = linkAttributes.class.replace(getClasses().link, 'asLink');
   return ['a', newLinkAttributes, newLinkAttributes.href];
}

/**
 * Check if json node is a link, that should be decorated.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#needDecorate
 * @param jsonNode {jsonML}
 * @param parentNode {jsonML}
 * @returns {boolean}
 */
function needDecorate(jsonNode, parentNode) {
   // Can't decorate without decoratedLink service address.
   if (!getService()) {
      return false;
   }

   // Decorate tag "a" only.
   if (getTagName(jsonNode) !== 'a') {
      return false;
   }

   // Decorate link right inside paragraph.
   if (!paragraphTagNameRegExp.test(getTagName(parentNode))) {
      return false;
   }

   // Link have already been checked, just return result.
   const attributes = getAttributes(jsonNode);
   if (attributes['__needDecorate']) {
      const result = attributes['__needDecorate'];
      delete attributes['__needDecorate'];
      return result;
   }

   // Check all links in parentNode from the end to current, set attribute '__needDecorate' for all of them.
   // Set it true if two conditions are met:
   // 1. Link is good for decorating.
   // 2. Between link and the end of paragraph there are only spaces and other good for decorating links.
   let canBeDecorated = true;
   for (let i = parentNode.length - 1; parentNode[i] !== jsonNode; --i) {
      const nodeToCheck = parentNode[i];
      if (isTextNode(nodeToCheck)) {
         canBeDecorated = canBeDecorated && onlySpacesRegExp.test(nodeToCheck);
         continue;
      }
      const tagName = getTagName(nodeToCheck);
      if (tagName === 'a') {
         const attributes = getAttributes(nodeToCheck);
         canBeDecorated = canBeDecorated && isLinkGoodForDecorating(nodeToCheck);
         attributes['__needDecorate'] = canBeDecorated;
      } else {
         // Tag br is the end of paragraph.
         canBeDecorated = tagName === 'br';
      }
   }

   // The last checked link is current jsonNode.
   return canBeDecorated && isLinkGoodForDecorating(jsonNode);
}

/**
 * Get json node of decorated link. Calls after "needDecorate" function.
 * @function Controls/_decorator/Markup/resources/linkDecorateUtils#getDecoratedLink
 * @param linkNode {JsonML}
 * @returns {JsonML}
 */
function getDecoratedLink(linkNode) {
   const linkAttributes = getAttributes(linkNode);
   const newLinkAttributes = objectMerge({}, linkAttributes, { clone: true });
   const decoratedLinkClasses = getClasses();

   newLinkAttributes.class = ((newLinkAttributes.class ? newLinkAttributes.class.replace('asLink', '') + ' ' : '') +
      decoratedLinkClasses.link).trim();
   newLinkAttributes.target = '_blank';

   const image = (typeof location === 'object' ? location.protocol + '//' + location.host : '') +
      getService() + '?method=LinkDecorator.DecorateAsSvg&params=' + encodeURIComponent(
         base64.encode('{"SourceLink":"' + newLinkAttributes.href.replace(charsToScreenRegExp, '\\$1') + '"}')
      ) + '&id=0&srv=1';

   return ['span',
      { 'class': decoratedLinkClasses.wrap },
      ['a',
         newLinkAttributes,
         ['img',
            { 'class': decoratedLinkClasses.image, alt: newLinkAttributes.href, src: image }
         ]
      ]
   ];
}


/**
 *
 * Module with utils to work with decorated link.
 *
 * @class Controls/_decorator/Markup/resources/linkDecorateUtils
 * @public
 * @author Кондаков Р.Н.
 */
const linkDecorateUtils = {
   getClasses: getClasses,
   getService: getService,
   getHrefMaxLength: getHrefMaxLength,
   isDecoratedLink: isDecoratedLink,
   getUndecoratedLink: getUndecoratedLink,
   needDecorate: needDecorate,
   getDecoratedLink: getDecoratedLink
};

export = linkDecorateUtils;
