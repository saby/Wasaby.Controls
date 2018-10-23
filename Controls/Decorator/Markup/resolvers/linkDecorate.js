/**
 * Created by rn.kondakov on 23.10.2018.
 */
define('Controls/Decorator/Markup/resolvers/linkDecorate', function() {
   'use strict';

   return function linkDecorate(json, parent) {
      // Decorate tag "a" only.
      if (!Array.isArray(json) || Array.isArray(json[0]) || json[0] + '' !== 'a') {
         return json;
      }

      // Decorate link right inside paragraph.
      if (!parent || parent[0] + '' !== 'p') {
         return json;
      }

      // TODO: Decorate link only with text === href;

      // Decorate link just in the end of paragraph.
      var last = parent.length - 1;
      if (json !== parent[last] && json !== parent[last - 1]) {
         return json;
      }
      if (parent[last] !== json && (Array.isArray(parent[last]) || /[^ \u00a0]/.test(parent[last]))) {
         return json;
      }

      // TODO: finish returning
      return [json[0], json[1], ['img', {}]];
   };
});
