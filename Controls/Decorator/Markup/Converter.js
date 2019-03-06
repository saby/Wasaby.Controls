/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/Converter', [
   'Controls/Decorator/Markup/resources/template',
   'Controls/Decorator/Markup/resources/linkDecorateUtils',
   'Core/core-merge'
], function(template,
   linkDecorateUtils,
   objectMerge) {
   'use strict';

   // Convert node to jsonML array.
   function nodeToJson(node) {
      // Text node, in jsonML it is just a string.
      if (node.nodeType === Node.TEXT_NODE) {
         return node.nodeValue;
      }

      // Element node, in jsonML it is an array.
      if (node.nodeType === Node.ELEMENT_NODE) {
         var json = [];

         // json[0] is a tag name.
         var tagName = node.nodeName.toLowerCase();
         json[0] = tagName;

         // If node has attributes, they are located in json[1].
         var nodeAttributes = node.attributes;
         if (nodeAttributes.length) {
            var jsonAttributes = {};
            for (var i = 0; i < nodeAttributes.length; ++i) {
               jsonAttributes[nodeAttributes[i].name] = nodeAttributes[i].value;
            }
            json[1] = jsonAttributes;
         }

         // After that convert child nodes and push them to array.
         var firstChild;
         if (node.hasChildNodes()) {
            var childNodes = node.childNodes,
               child;

            // Recursive converting of children.
            for (var i = 0; i < childNodes.length; ++i) {
               child = nodeToJson(childNodes[i]);
               if (!i) {
                  firstChild = child;
               }
               json.push(child);
            }
         }

         // By agreement, json shouldn't contain decorated link. Undecorate it if found.
         if (linkDecorateUtils.isDecoratedLink(tagName, firstChild)) {
            json = linkDecorateUtils.getUndecoratedLink(firstChild);
         }

         return json;
      }

      // Return empty array if node is neither text nor element.
      return [];
   }

   var linkTagPattern = '(/?a[ >])',
      linkPrefixPattern = '((?:https?|ftp|file|smb)://|www\\.)',
      linkPattern = '(' + linkPrefixPattern + '(?:[^\\s\\x16<>]+?))',
      emailPattern = '([^\\s\\x16<>]+@[^\\s\\x16<>]+(?:\\.[^\\s\\x16<>]{2,6}?))',
      endingPattern = '([.,:]?(?:[\\s\\x16<>]|$))',
      nbsp = '&nbsp;',
      nbspReplacer = '\x16',
      nbspRegExp = new RegExp(nbsp, 'g'),
      nbspReplacerRegExp = new RegExp(nbspReplacer, 'g'),
      linkParseRegExp = new RegExp(linkTagPattern + '|(?:(?:' + linkPattern + '|' + emailPattern + ')' + endingPattern + ')', 'g');

   // Wrap all links and email addresses placed not in tag a.
   function wrapUrl(html) {
      var resultHtml = html.replace(nbspRegExp, nbspReplacer),
         inLink = false;
      resultHtml = resultHtml.replace(linkParseRegExp, function(match, linkTag, link, linkPrefix, email, ending, index, origin) {
         var linkParseResult;
         if (linkTag && origin[index - 1] === '<') {
            inLink = !inLink;
            linkParseResult = match;
         } else if (inLink) {
            linkParseResult = match;
         } else {
            if (link) {
               if (linkPrefix === 'www.') {
                  link = 'http://' + link;
               }
               linkParseResult = '<a class="asLink" rel="noreferrer" href="' + link + '" target="_blank">' + link + '</a>' + ending;
            } else {
               linkParseResult = '<a href="mailto:' + email + '">' + email + '</a>' + ending;
            }
         }
         return linkParseResult;
      });
      resultHtml = resultHtml.replace(nbspReplacerRegExp, nbsp);
      return resultHtml;
   }

   /**
    * Convert html string to valid JsonML.
    * @function Controls/Decorator/Markup/Converter#htmlToJson
    * @param html {String}
    * @returns {Array}
    */
   var htmlToJson = function(html) {
      var div = document.createElement('div'),
         result;
      div.innerHTML = wrapUrl(html).trim();
      result = nodeToJson(div).slice(1);
      div = null;
      return result;
   };

   /**
    * Convert Json to html string.
    * @function Controls/Decorator/Markup/Converter#jsonToHtml
    * @param json {Array} Json based on JsonML.
    * @param tagResolver {Function} exactly like in {@link Controls/Decorator/Markup#tagResolver}.
    * @param resolverParams {Object} exactly like in {@link Controls/Decorator/Markup#resolverParams}.
    * @returns {String}
    */
   var jsonToHtml = function(json, tagResolver, resolverParams) {
      var result = template({
         _options: {
            value: json,
            tagResolver: tagResolver,
            resolverParams: resolverParams
         }
      }, {});

      // Invisible node in vdom equals empty string in html.
      return result === '<invisible-node></invisible-node>' ? '' : result;
   };

   /**
    * Convert Json array to its copy  by value in all nodes.
    * @function Controls/Decorator/Markup/Converter#deepCopyJson
    * @param json
    * @return {Array}
    */
   var deepCopyJson = function(json) {
      return objectMerge([], json, { clone: true });
   };

   /**
    * @class Controls/Decorator/Markup/Converter
    * @author Кондаков Р.Н.
    * @public
    */
   var MarkupConverter = {
      htmlToJson: htmlToJson,
      jsonToHtml: jsonToHtml,
      deepCopyJson: deepCopyJson
   };

   return MarkupConverter;
});
