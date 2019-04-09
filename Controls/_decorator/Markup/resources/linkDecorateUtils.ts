/**
 * Created by rn.kondakov on 15.02.2019.
 */
define('Controls/Decorator/Markup/resources/linkDecorateUtils', [
   'Core/base64',
   'Env/Env',
   'Core/core-merge'
], function(base64,
   Env,
   objectMerge) {
   'use strict';

   var hrefMaxLength = 1499,
      onlySpacesRegExp = /^[ \u00a0]+$/,
      paragraphTagNameRegExp = /^(p(re)?|div)$/,
      backSlashRegExp = /\\/g,
      classes = {
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
      var result;
      if (isElementNode(jsonNode) && isAttributes(jsonNode[1])) {
         result = jsonNode[1];
      } else {
         result = {};
      }
      return result;
   }

   function getTagName(jsonNode) {
      var result;
      if (isElementNode(jsonNode)) {
         result = jsonNode[0];
      } else {
         result = '';
      }
      return result;
   }

   function getFirstChild(jsonNode) {
      var result;
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

   /**
    * Get class names for decorating link.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getClasses
    * @returns {Object}
    */
   function getClasses() {
      return classes;
   }

   /**
    * Get name of decorated link service.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getService
    * @returns {String|undefined}
    */
   function getService() {
      return Env.constants.decoratedLinkService;
   }

   /**
    * Get name of decorated link service.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getHrefMaxLength
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
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#isDecoratedLink
    * @param tagName {string}
    * @param firstChildNode {JsonML}
    * @returns {boolean}
    */
   function isDecoratedLink(tagName, firstChildNode) {
      var result;
      if (tagName === 'span') {
         var firstChildTagName = getTagName(firstChildNode),
            firstChildAttributes = getAttributes(firstChildNode);

         result = firstChildTagName === 'a' && !!firstChildAttributes.href &&
            firstChildAttributes.class === getClasses().link;
      } else {
         result = false;
      }
      return result;
   }

   /**
    * Undecorate decorated link. Calls after "isDecoratedLink" function, link node here is the first child there.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getUndecoratedLink
    * @param linkNode {jsonML}
    * @returns {jsonML}
    */
   function getUndecoratedLink(linkNode) {
      var linkAttributes = getAttributes(linkNode),
         newLinkAttributes = objectMerge({}, linkAttributes, { clone: true });

      // Save all link attributes, replace only special class name on usual.
      newLinkAttributes.class = linkAttributes.class.replace(getClasses().link, 'asLink');
      return ['a', newLinkAttributes, newLinkAttributes.href];
   }

   /**
    * Check if json node is a link, that should be decorated.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#needDecorate
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

      // Decorate link only with text == href, and href length shouldn't be more than given maximum.
      var attributes = getAttributes(jsonNode),
         firstChild = getFirstChild(jsonNode);
      if (!attributes.href || attributes.href.length > getHrefMaxLength() ||
            !isTextNode(firstChild) || attributes.href !== firstChild) {
         return false;
      }

      // Decorate link just in the end of paragraph.
      var indexOfNextChild = parentNode.indexOf(jsonNode) + 1;
      if (isTextNode(parentNode[indexOfNextChild]) && onlySpacesRegExp.test(parentNode[indexOfNextChild])) {
         // Between decorated link and the end of paragraph can be string consisting of spaces only.
         indexOfNextChild++;
      }
      return indexOfNextChild >= parentNode.length || getTagName(parentNode[indexOfNextChild]) === 'br';
   }

   /**
    * Get json node of decorated link. Calls after "needDecorate" function.
    * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getDecoratedLink
    * @param linkNode {JsonML}
    * @returns {JsonML}
    */
   function getDecoratedLink(linkNode) {
      var linkAttributes = getAttributes(linkNode),
         newLinkAttributes = objectMerge({}, linkAttributes, { clone: true }),
         decoratedLinkClasses = getClasses();

      newLinkAttributes.class = ((newLinkAttributes.class ? newLinkAttributes.class.replace('asLink', '') + ' ' : '') +
         decoratedLinkClasses.link).trim();
      newLinkAttributes.target = '_blank';

      // '\' is a screen character, link decorate service can't decode the link with it.
      newLinkAttributes.href = newLinkAttributes.href.replace(backSlashRegExp, '/');

      var image = (typeof location === 'object' ? location.protocol + '//' + location.host : '') +
         getService() + '?method=LinkDecorator.DecorateAsSvg&params=' +
         encodeURIComponent(base64.encode('{"SourceLink":"' + newLinkAttributes.href + '"}')) + '&id=0&srv=1';

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
    * @class Controls/Decorator/Markup/resources/linkDecorateUtils
    * @public
    * @author Кондаков Р.Н.
    */
   var linkDecorateUtils = {
      getClasses: getClasses,
      getService: getService,
      getHrefMaxLength: getHrefMaxLength,
      isDecoratedLink: isDecoratedLink,
      getUndecoratedLink: getUndecoratedLink,
      needDecorate: needDecorate,
      getDecoratedLink: getDecoratedLink
   };

   return linkDecorateUtils;
});
