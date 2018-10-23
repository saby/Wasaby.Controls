/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/Converter', [
   'Controls/Decorator/Markup/resources/template'
], function(template) {
   'use strict';

   function domToJson(dom) {
      if (dom.nodeType === 3) {
         return dom.nodeValue;
      }

      var json = [dom.nodeName.toLowerCase()];

      if (dom.nodeType === 1 && dom.attributes.length > 0) {
         json[1] = {};
         for (var j = 0; j < dom.attributes.length; ++j) {
            var attribute = dom.attributes.item(j);
            json[1][attribute.nodeName] = attribute.nodeValue;
         }
      }

      if (dom.hasChildNodes()) {
         for (var i = 0; i < dom.childNodes.length; ++i) {
            var item = domToJson(dom.childNodes.item(i));
            json.push(item);
         }
      }

      return json;
   }

   var htmlToJson = function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return domToJson(div).slice(1);
   };

   var jsonToHtml = function(json, tagResolver) {
      return template({ _options: { value: json, tagResolver: tagResolver } }, {});
   };

   var deepCopyJson = function(json) {
      if (typeof json === 'string' || json instanceof String) {
         return json;
      }
      var result;
      if (Array.isArray(json)) {
         result = [];
         for (var i = 0; i < json.length; ++i) {
            result.push(deepCopyJson(json[i]));
         }
      } else {
         result = {};
         for (var key in json) {
            if (json.hasOwnProperty(key)) {
               result[key] = deepCopyJson(json[key]);
            }
         }
      }
      return result;
   };

   var MarkupConverter = {
      htmlToJson: htmlToJson,
      jsonToHtml: jsonToHtml,
      deepCopyJson: deepCopyJson
   };

   return MarkupConverter;
});
