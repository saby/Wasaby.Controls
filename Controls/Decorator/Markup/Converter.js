/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/Converter', [
   'Controls/Decorator/Markup/resources/template'
], function(template) {
   'use strict';

   function domToJson(dom) {
      if (dom.nodeType === 3) {
         // Text node.
         return dom.nodeValue;
      }

      // Tag name.
      var json = [dom.nodeName.toLowerCase()];

      if (dom.nodeType === 1 && dom.attributes.length > 0) {
         // Element node with attributes.
         json[1] = {};
         for (var j = 0; j < dom.attributes.length; ++j) {
            var attribute = dom.attributes.item(j);
            json[1][attribute.nodeName] = attribute.nodeValue;
         }
      }

      if (dom.hasChildNodes()) {
         for (var i = 0; i < dom.childNodes.length; ++i) {
            // Recursive converting of children.
            var item = domToJson(dom.childNodes.item(i));
            json.push(item);
         }
      }

      return json;
   }

   function wrapUrl(html) {
      var parseRegExp = /(?:(((?:https?|ftp|file):\/\/|www\.)[^\s<>]+?)|([^\s<>]+@[^\s<>]+(?:\.[^\s<>]{2,6}?))|([^\s<>]*?))([.,:]?(?:\s|$|(<[^>]*>)))/g,
         inLink = false;
      return html.replace(parseRegExp, function(match, link, linkPrefix, email, text, end) {
         if (link && !inLink) {
            return '<a rel="noreferrer" href="' + (linkPrefix === 'www.' ? 'http://' : '') + link + '" target="_blank">' + link + '</a>' + end;
         }
         if (email && !inLink) {
            return '<a href="mailto:' + email + '">' + email + '</a>' + end;
         }
         if (~end.indexOf('<a')) {
            inLink = true;
         } else if (~end.indexOf('</a')) {
            inLink = false;
         }
         return match;
      });
   }

   var htmlToJson = function(html) {
      var div = document.createElement('div');
      div.innerHTML = wrapUrl(html);
      return domToJson(div).slice(1);
   };

   var jsonToHtml = function(json, tagResolver, resolverParams) {
      return template({
         _options: {
            value: json,
            tagResolver: tagResolver,
            resolverParams: resolverParams
         }
      }, {});
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
