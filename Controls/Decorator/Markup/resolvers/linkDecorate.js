/**
 * Created by rn.kondakov on 23.10.2018.
 */
define('Controls/Decorator/Markup/resolvers/linkDecorate', [
   'Core/base64',
   'Core/constants'
], function(base64,
   cConstants) {
   'use strict';

   return function linkDecorate(json, parent) {
      // Decorate tag "a" only.
      if (!Array.isArray(json) || Array.isArray(json[0]) || json[0] != 'a') {
         return json;
      }

      // Decorate link right inside paragraph.
      if (!parent || parent[0] != 'p') {
         return json;
      }

      // Decorate link only with text == href, and href length should be less then 1500;
      if (!json[1] || !json[1].href || json[1].length >= 1500 || json[1].href != json[2]) {
         return json;
      }

      // Decorate link just in the end of paragraph.
      var last = parent.length - 1;
      if (json !== parent[last] && json !== parent[last - 1]) {
         return json;
      }
      if (parent[last] !== json && (Array.isArray(parent[last]) || /[^ \u00a0]/.test(parent[last]))) {
         return json;
      }

      var linkAttrs = {};
      for (var key in json[1]) {
         if (json[1].hasOwnProperty(key)) {
            linkAttrs[key] = json[1][key];
         }
      }
      linkAttrs.class = (linkAttrs.class ? linkAttrs.class + ' ' : '') + 'LinkDecorator__linkWrap';
      linkAttrs.href = linkAttrs.href.replace(/\\/g, '/');

      var image = cConstants.decoratedLinkService ? ((typeof location === 'object' ? location.origin : '') + cConstants.decoratedLinkService) : '' +
         '?method=LinkDecorator.DecorateAsSvg&params=' + encodeURIComponent(base64.encode('{"SourceLink":"' + linkAttrs.href + '"}')) + '&id=0&srv=1';

      return ['span',
         { 'class': 'LinkDecorator__wrap' },
         ['a',
            linkAttrs,
            ['img',
               { 'class': 'LinkDecorator__image', alt: linkAttrs.href, src: image }
            ]
         ]
      ];
   };
});
