define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/SaxParser', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Schema',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Entities',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Tools'
], function(Schema, Entities, Tools) {
   var each = Tools.each;
   function SaxParser(settings, schema) {
      var self = this;
      function noop() {}
      settings = settings || {};
      self.schema = schema = schema || new Schema();
      if (settings.fix_self_closing !== false) {
         settings.fix_self_closing = true;
      }
      each('comment cdata text start end pi doctype'.split(' '), function(name) {
         if (name) {
            self[name] = settings[name] || noop;
         }
      });
      self.parse = function(html) {
         var self = this, matches, index = 0, value, endRegExp, stack = [], attrList, i, text, name;
         var shortEndedElements, fillAttrsMap, isShortEnded;
         var validate, elementRule, isValidElement, attr, attribsValue, validAttributesMap, validAttributePatterns;
         var attributesRequired, attributesDefault, attributesForced;
         var anyAttributesRequired, selfClosing, tokenRegExp, attrRegExp, specialElements, attrValue, idCount = 0;
         var decode = Entities.decode, fixSelfClosing, filteredUrlAttrs = Tools.makeMap('src,href,data,background,formaction,poster');
         var scriptUriRegExp = /((java|vb)script|mhtml):/i, dataUriRegExp = /^data:/i;
         function processEndTag(name) {
            var pos, i;
            pos = stack.length;
            while (pos--) {
               if (stack[pos].name === name) {
                  break;
               }
            }
            if (pos >= 0) {
               for (i = stack.length - 1; i >= pos; i--) {
                  name = stack[i];

                  if (name.valid) {
                     self.end(name.name);
                  }
               }
               stack.length = pos;
            }
         }
         function parseAttribute(match, name, value, val2, val3) {
            var attrRule, i, trimRegExp = /[\s\u0000-\u001F]+/g;
            name = name.toLowerCase();
            value = name in fillAttrsMap ? name : decode(value || val2 || val3 || '');
            if (validate && name.indexOf('data-') !== 0) {
               attrRule = validAttributesMap[name];
               if (!attrRule && validAttributePatterns) {
                  i = validAttributePatterns.length;
                  while (i--) {
                     attrRule = validAttributePatterns[i];
                     if (attrRule.pattern.test(name)) {
                        break;
                     }
                  }
                  if (i === -1) {
                     attrRule = null;
                  }
               }
               if (!attrRule) {
                  return;
               }
               if (attrRule.validValues && !(value in attrRule.validValues)) {
                  return;
               }
            }
            if (filteredUrlAttrs[name] && !settings.allow_script_urls) {
               var uri = value.replace(trimRegExp, '');

               try {
                  uri = decodeURIComponent(uri);
               } catch (ex) {
                  uri = unescape(uri);
               }
               if (scriptUriRegExp.test(uri)) {
                  return;
               }
               if (!settings.allow_html_data_urls && dataUriRegExp.test(uri) && !/^data:image\//i.test(uri)) {
                  return;
               }
            }
            attrList.map[name] = value;
            attrList.push({
               name: name,
               value: value
            });
         }
         tokenRegExp = new RegExp('<(?:' +
         '(?:!--([\\w\\W]*?)-->)|' + // Comment
         '(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + // CDATA
         '(?:!DOCTYPE([\\w\\W]*?)>)|' + // DOCTYPE
         '(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + // PI
         '(?:\\/([^>]+)>)|' + // End element
         '(?:([A-Za-z0-9\\-_\\:\\.]+)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' +
         ')', 'g');
         attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g;
         shortEndedElements = schema.getShortEndedElements();
         selfClosing = settings.self_closing_elements || schema.getSelfClosingElements();
         fillAttrsMap = schema.getBoolAttrs();
         validate = true;
         fixSelfClosing = settings.fix_self_closing;
         specialElements = schema.getSpecialElements();
         while ((matches = tokenRegExp.exec(html))) {
            if (index < matches.index) {
               self.text(html.substr(index, matches.index - index));
            }
            if ((value = matches[6])) {
               value = value.toLowerCase();
               if (value.charAt(0) === ':') {
                  value = value.substr(1);
               }
               processEndTag(value);
            } else if ((value = matches[7])) {
               value = value.toLowerCase();
               if (value.charAt(0) === ':') {
                  value = value.substr(1);
               }
               isShortEnded = value in shortEndedElements;
               if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value) {
                  processEndTag(value);
               }
               if (!validate || (elementRule = schema.getElementRule(value))) {
                  isValidElement = true;
                  if (validate) {
                     validAttributesMap = elementRule.attributes;
                     validAttributePatterns = elementRule.attributePatterns;
                  }
                  if ((attribsValue = matches[8])) {
                     attrList = [];
                     attrList.map = {};
                     attribsValue.replace(attrRegExp, parseAttribute);
                  } else {
                     attrList = [];
                     attrList.map = {};
                  }
                  if (validate) {
                     attributesRequired = elementRule.attributesRequired;
                     attributesDefault = elementRule.attributesDefault;
                     attributesForced = elementRule.attributesForced;
                     anyAttributesRequired = elementRule.removeEmptyAttrs;
                     if (anyAttributesRequired && !attrList.length) {
                        isValidElement = false;
                     }
                     if (attributesForced) {
                        i = attributesForced.length;
                        while (i--) {
                           attr = attributesForced[i];
                           name = attr.name;
                           attrValue = attr.value;
                           attrList.map[name] = attrValue;
                           attrList.push({name: name, value: attrValue});
                        }
                     }
                     if (attributesDefault) {
                        i = attributesDefault.length;
                        while (i--) {
                           attr = attributesDefault[i];
                           name = attr.name
                           if (!(name in attrList.map)) {
                              attrValue = attr.value;
                              attrList.map[name] = attrValue;
                              attrList.push({name: name, value: attrValue});
                           }
                        }
                     }
                     if (attributesRequired) {
                        i = attributesRequired.length;
                        while (i--) {
                           if (attributesRequired[i] in attrList.map) {
                              break;
                           }
                        }
                        if (i === -1) {
                           isValidElement = false;
                        }
                     }
                  }
                  if (isValidElement) {
                     self.start(value, attrList, isShortEnded);
                  }
               } else {
                  isValidElement = false;
               }
               if ((endRegExp = specialElements[value])) {
                  endRegExp.lastIndex = index = matches.index + matches[0].length;
                  if ((matches = endRegExp.exec(html))) {
                     if (isValidElement) {
                        text = html.substr(index, matches.index - index);
                     }
                     index = matches.index + matches[0].length;
                  } else {
                     text = html.substr(index);
                     index = html.length;
                  }
                  if (isValidElement) {
                     if (text.length > 0) {
                        self.text(text, true);
                     }
                     self.end(value);
                  }
                  tokenRegExp.lastIndex = index;
                  continue;
               }
               if (!isShortEnded) {
                  if (!attribsValue || attribsValue.indexOf('/') != attribsValue.length - 1) {
                     stack.push({name: value, valid: isValidElement});
                  } else if (isValidElement) {
                     self.end(value);
                  }
               }
            } else if ((value = matches[1])) {
               if (value.charAt(0) === '>') {
                  value = ' ' + value;
               }
               if (!settings.allow_conditional_comments && value.substr(0, 3) === '[if') {
                  value = ' ' + value;
               }
               self.comment(value);
            } else if ((value = matches[2])) {
               self.cdata(value);
            } else if ((value = matches[3])) {
               self.doctype(value);
            } else if ((value = matches[4])) {
               self.pi(value, matches[5]);
            }
            index = matches.index + matches[0].length;
         }
         if (index < html.length) {
            self.text(html.substr(index));
         }
         for (i = stack.length - 1; i >= 0; i--) {
            value = stack[i];
            if (value.valid) {
               self.end(value.name);
            }
         }
      };
   }
   return SaxParser;
});