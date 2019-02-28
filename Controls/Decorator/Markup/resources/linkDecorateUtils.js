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
      classes = {
         wrap: 'LinkDecorator__wrap',
         link: 'LinkDecorator__linkWrap',
         image: 'LinkDecorator__image'
      };


   /**
    *
    * Module with utils to work with decorated link.
    *
    * @class Controls/Decorator/Markup/resources/linkDecorateUtils
    * @private
    * @author Кондаков Р.Н.
    */
   return {

      /**
       * Get class names for decorating link.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getClasses
       * @returns {Object}
       */
      getClasses: function() {
         return classes;
      },

      /**
       * Get name of decorated link service.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getService
       * @returns {String|undefined}
       */
      getService: function() {
         return Env.constants.decoratedLinkService;
      },

      /**
       * Get name of decorated link service.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#getHrefMaxLength
       * @returns {number}
       */
      getHrefMaxLength: function() {
         // TODO: In this moment links with length 1500 or more are not being decorated.
         // Have to take this constant from the correct source. Problem link:
         // https://online.sbis.ru/opendoc.html?guid=ff5532f0-d4aa-4907-9f2e-f34394a511e9
         return hrefMaxLength;
      },

      /**
       * Check if json is a decorated link or not.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#isDecoratedLink
       * @param json {jsonML}
       * @returns {boolean}
       */
      isDecoratedLink: function(json) {
         // Decorated link is always wrapped in span with special class name.
         // If json has attributes, they are located in json[1].
         return Array.isArray(json) && json[0] === 'span' && json[1] && json[1].class === this.getClasses().wrap;
      },

      /**
       * Undecorate decorated link.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#undecorateLink
       * @param json {jsonML}
       * @returns {jsonML}
       */
      undecorateLink: function(json) {
         // json should be a decorated link here, so it looks like ['span', {...}, ['a', {...}, ['img', {...}]]].
         // That is why json[2] is a link, and json[2][1] is link attributes (see decorateLink method below).
         var linkAttributes = json[2][1];

         // Save all link attributes, replace only special class name on usual.
         linkAttributes.class = linkAttributes.class.replace(this.getClasses().link, 'asLink');
         return ['a', linkAttributes, linkAttributes.href];
      },

      /**
       * Check if json is a decorated link or not, and undecorate it if it's true.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#undecorateLinkIfNeed
       * @param json {jsonML}
       * @returns {jsonML} - original json or undecorated link.
       */
      undecorateLinkIfNeed: function(json) {
         return this.isDecoratedLink(json) ? this.undecorateLink(json) : json;
      },

      /**
       * Check if json is a link, that should be decorated.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#needDecorateLink
       * @param json {jsonML}
       * @param parent {jsonML} - parent of the current json.
       * @returns {boolean}
       */
      needDecorateLink: function(json, parent) {
         // Can't decorate without decoratedLink service address.
         if (!this.getService()) {
            return false;
         }

         // Decorate tag "a" only.
         if (!Array.isArray(json) || Array.isArray(json[0]) || json[0] !== 'a') {
            return false;
         }

         // Decorate link right inside paragraph.
         if (!parent || (typeof parent[0] === 'string' && parent[0] !== 'p' && parent[0] !== 'div')) {
            return false;
         }

         // Decorate link only with text == href, and href length shouldn't be more than given maximum.
         if (!json[1] || !json[1].href || json[1].href.length > this.getHrefMaxLength() ||
            json[1].href !== json[2]) {
            return false;
         }

         // Decorate link just in the end of paragraph.
         var indexOfNextChild = parent.indexOf(json) + 1;
         if (typeof parent[indexOfNextChild] === 'string' && /^[ \u00a0]+$/.test(parent[indexOfNextChild])) {
            // Between decorated link and the end of paragraph can be string consisting of spaces only.
            indexOfNextChild++;
         }
         return indexOfNextChild >= parent.length ||
            (Array.isArray(parent[indexOfNextChild]) && parent[indexOfNextChild][0] === 'br');
      },

      /**
       * Decorate link.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#decorateLink
       * @param json {jsonML}
       * @returns {boolean}
       */
      decorateLink: function(json) {
         // json should be a link with attributes here, which are located in json[1].
         // Save all link attributes, replace only usual class name on special, and add target="_blank".
         var linkAttrs = objectMerge({}, json[1], { clone: true }),
            classes = this.getClasses();
         linkAttrs.class = (linkAttrs.class ? linkAttrs.class.replace('asLink', '') + ' ' : '') + classes.link;
         linkAttrs.target = '_blank';

         // '\' is a screen character, link decorate service can't decode the link with it.
         linkAttrs.href = linkAttrs.href.replace(/\\/g, '/');

         var image = (typeof location === 'object' ? location.protocol + '//' + location.host : '') +
            this.getService() + '?method=LinkDecorator.DecorateAsSvg&params=' +
            encodeURIComponent(base64.encode('{"SourceLink":"' + linkAttrs.href + '"}')) + '&id=0&srv=1';

         return ['span',
            { 'class': classes.wrap },
            ['a',
               linkAttrs,
               ['img',
                  { 'class': classes.image, alt: linkAttrs.href, src: image }
               ]
            ]
         ];
      },

      /**
       * Check if json is a link, that should be decorated, and decorate it if it's true.
       * @function Controls/Decorator/Markup/resources/linkDecorateUtils#decorateLinkIfNeed
       * @param json {jsonML}
       * @param parent {jsonML} - parent of the current json.
       * @returns {jsonML} - original json or decorated link.
       */
      decorateLinkIfNeed: function(json, parent) {
         return this.needDecorateLink(json, parent) ? this.decorateLink(json) : json;
      }
   };
});
