define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Schema', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Tools'
], function(Tools) {
   var mapCache = {}, dummyObj = {};
   var makeMap = Tools.makeMap, each = Tools.each, extend = Tools.extend, explode = Tools.explode, inArray = Tools.inArray;
   function split(items, delim) {
      return items ? items.split(delim || ' ') : [];
   }
   function compileSchema(type) {
      var schema = {}, globalAttributes, blockContent;
      var phrasingContent, flowContent, html4BlockContent, html4PhrasingContent;
      function add(name, attributes, children) {
         var ni, i, attributesOrder, args = arguments;
         function arrayToMap(array, obj) {
            var map = {}, i, l;
            for (i = 0, l = array.length; i < l; i++) {
               map[array[i]] = obj || {};
            }
            return map;
         }
         children = children || [];
         attributes = attributes || "";
         if (typeof children === "string") {
            children = split(children);
         }
         for (i = 3; i < args.length; i++) {
            if (typeof args[i] === "string") {
               args[i] = split(args[i]);
            }
            children.push.apply(children, args[i]);
         }
         name = split(name);
         ni = name.length;
         while (ni--) {
            attributesOrder = [].concat(globalAttributes, split(attributes));
            schema[name[ni]] = {
               attributes: arrayToMap(attributesOrder),
               attributesOrder: attributesOrder,
               children: arrayToMap(children, dummyObj)
            };
         }
      }
      function addAttrs(name, attributes) {
         var ni, schemaItem, i, l;
         name = split(name);
         ni = name.length;
         attributes = split(attributes);
         while (ni--) {
            schemaItem = schema[name[ni]];
            for (i = 0, l = attributes.length; i < l; i++) {
               schemaItem.attributes[attributes[i]] = {};
               schemaItem.attributesOrder.push(attributes[i]);
            }
         }
      }

      if (mapCache[type]) {
         return mapCache[type];
      }
      globalAttributes = split("id accesskey class dir lang style tabindex title");
      blockContent = split(
         "address blockquote div dl fieldset form h1 h2 h3 h4 h5 h6 hr menu ol p pre table ul"
      );
      phrasingContent = split(
         "a abbr b bdo br button cite code del dfn em embed i iframe img input ins kbd " +
         "label map noscript object q s samp script select small span strong sub sup " +
         "textarea u var #text #comment"
      );
      if (type != "html4") {
         globalAttributes.push.apply(globalAttributes, split("contenteditable contextmenu draggable dropzone " +
         "hidden spellcheck translate"));
         blockContent.push.apply(blockContent, split("article aside details dialog figure header footer hgroup section nav"));
         phrasingContent.push.apply(phrasingContent, split("audio canvas command datalist mark meter output picture " +
         "progress time wbr video ruby bdi keygen"));
      }
      if (type != "html5-strict") {
         globalAttributes.push("xml:lang");
         html4PhrasingContent = split("acronym applet basefont big font strike tt");
         phrasingContent.push.apply(phrasingContent, html4PhrasingContent);
         each(html4PhrasingContent, function(name) {
            add(name, "", phrasingContent);
         });
         html4BlockContent = split("center dir isindex noframes");
         blockContent.push.apply(blockContent, html4BlockContent);
         flowContent = [].concat(blockContent, phrasingContent);
         each(html4BlockContent, function(name) {
            add(name, "", flowContent);
         });
      }
      flowContent = flowContent || [].concat(blockContent, phrasingContent);
      add("html", "manifest", "head body");
      add("head", "", "base command link meta noscript script style title");
      add("title hr noscript br");
      add("base", "href target");
      add("link", "href rel media hreflang type sizes hreflang");
      add("meta", "name http-equiv content charset");
      add("style", "media type scoped");
      add("script", "src async defer type charset");
      add("body", "onafterprint onbeforeprint onbeforeunload onblur onerror onfocus " +
      "onhashchange onload onmessage onoffline ononline onpagehide onpageshow " +
      "onpopstate onresize onscroll onstorage onunload", flowContent);
      add("address dt dd div caption", "", flowContent);
      add("h1 h2 h3 h4 h5 h6 pre p abbr code var samp kbd sub sup i b u bdo span legend em strong small s cite dfn", "", phrasingContent);
      add("blockquote", "cite", flowContent);
      add("ol", "reversed start type", "li");
      add("ul", "", "li");
      add("li", "value", flowContent);
      add("dl", "", "dt dd");
      add("a", "href target rel media hreflang type filelink", phrasingContent);
      add("q", "cite", phrasingContent);
      add("ins del", "cite datetime", flowContent);
      add("img", "src sizes srcset alt usemap ismap width height");
      add("iframe", "src name width height", flowContent);
      add("embed", "src type width height");
      add("object", "data type typemustmatch name usemap form width height", flowContent, "param");
      add("param", "name value");
      add("map", "name", flowContent, "area");
      add("area", "alt coords shape href target rel media hreflang type");
      add("table", "border", "caption colgroup thead tfoot tbody tr" + (type == "html4" ? " col" : ""));
      add("colgroup", "span", "col");
      add("col", "span");
      add("tbody thead tfoot", "", "tr");
      add("tr", "", "td th");
      add("td", "colspan rowspan headers", flowContent);
      add("th", "colspan rowspan headers scope abbr", flowContent);
      add("form", "accept-charset action autocomplete enctype method name novalidate target", flowContent);
      add("fieldset", "disabled form name", flowContent, "legend");
      add("label", "form for", phrasingContent);
      add("input", "accept alt autocomplete checked dirname disabled form formaction formenctype formmethod formnovalidate " +
         "formtarget height list max maxlength min multiple name pattern readonly required size src step type value width"
      );
      add("button", "disabled form formaction formenctype formmethod formnovalidate formtarget name type value",
         type == "html4" ? flowContent : phrasingContent);
      add("select", "disabled form multiple name required size", "option optgroup");
      add("optgroup", "disabled label", "option");
      add("option", "disabled label selected value");
      add("textarea", "cols dirname disabled form maxlength name readonly required rows wrap");
      add("menu", "type label", flowContent, "li");
      add("noscript", "", flowContent);
      if (type != "html4") {
         add("wbr");
         add("ruby", "", phrasingContent, "rt rp");
         add("figcaption", "", flowContent);
         add("mark rt rp summary bdi", "", phrasingContent);
         add("canvas", "width height", flowContent);
         add("video", "src crossorigin poster preload autoplay mediagroup loop " +
         "muted controls width height buffered", flowContent, "track source");
         add("audio", "src crossorigin preload autoplay mediagroup loop muted controls buffered volume", flowContent, "track source");
         add("picture", "", "img source");
         add("source", "src srcset type media sizes");
         add("track", "kind src srclang label default");
         add("datalist", "", phrasingContent, "option");
         add("article section nav aside header footer", "", flowContent);
         add("hgroup", "", "h1 h2 h3 h4 h5 h6");
         add("figure", "", flowContent, "figcaption");
         add("time", "datetime", phrasingContent);
         add("dialog", "open", flowContent);
         add("command", "type label icon disabled checked radiogroup command");
         add("output", "for form name", phrasingContent);
         add("progress", "value max", phrasingContent);
         add("meter", "value min max low high optimum", phrasingContent);
         add("details", "open", flowContent, "summary");
         add("keygen", "autofocus challenge disabled form keytype name");
      }
      if (type != "html5-strict") {
         addAttrs("script", "language xml:space");
         addAttrs("style", "xml:space");
         addAttrs("object", "declare classid code codebase codetype archive standby align border hspace vspace");
         addAttrs("embed", "align name hspace vspace");
         addAttrs("param", "valuetype type");
         addAttrs("a", "charset name rev shape coords");
         addAttrs("br", "clear");
         addAttrs("applet", "codebase archive code object alt name width height align hspace vspace");
         addAttrs("img", "name longdesc align border hspace vspace");
         addAttrs("iframe", "longdesc frameborder marginwidth marginheight scrolling align");
         addAttrs("font basefont", "size color face");
         addAttrs("input", "usemap align");
         addAttrs("select", "onchange");
         addAttrs("textarea");
         addAttrs("h1 h2 h3 h4 h5 h6 div p legend caption", "align");
         addAttrs("ul", "type compact");
         addAttrs("li", "type");
         addAttrs("ol dl menu dir", "compact");
         addAttrs("pre", "width xml:space");
         addAttrs("hr", "align noshade size width");
         addAttrs("isindex", "prompt");
         addAttrs("table", "summary width frame rules cellspacing cellpadding align bgcolor");
         addAttrs("col", "width align char charoff valign");
         addAttrs("colgroup", "width align char charoff valign");
         addAttrs("thead", "align char charoff valign");
         addAttrs("tr", "align char charoff valign bgcolor");
         addAttrs("th", "axis align char charoff valign nowrap bgcolor width height");
         addAttrs("form", "accept");
         addAttrs("td", "abbr axis scope align char charoff valign nowrap bgcolor width height");
         addAttrs("tfoot", "align char charoff valign");
         addAttrs("tbody", "align char charoff valign");
         addAttrs("area", "nohref");
         addAttrs("body", "background bgcolor text link vlink alink");
      }
      if (type != "html4") {
         addAttrs("input button select textarea", "autofocus");
         addAttrs("input textarea", "placeholder");
         addAttrs("a", "download");
         addAttrs("link script img", "crossorigin");
         addAttrs("iframe", "sandbox seamless allowfullscreen"); // Excluded: srcdoc
      }
      each(split('a form meter progress dfn'), function(name) {
         if (schema[name]) {
            delete schema[name].children[name];
         }
      });
      delete schema.caption.children.table;
      delete schema.script;
      mapCache[type] = schema;
      return schema;
   }
   function compileElementMap(value, mode) {
      var styles;
      if (value) {
         styles = {};
         if (typeof value == 'string') {
            value = {
               '*': value
            };
         }
         each(value, function(value, key) {
            styles[key] = styles[key.toUpperCase()] = mode == 'map' ? makeMap(value, /[, ]/) : explode(value, /[, ]/);
         });
      }
      return styles;
   }
   return function(settings) {
      var self = this, elements = {}, children = {}, patternElements = [], validStyles, invalidStyles, schemaItems;
      var whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, validClasses;
      var blockElementsMap, nonEmptyElementsMap, moveCaretBeforeOnEnterElementsMap, textBlockElementsMap, textInlineElementsMap;
      var customElementsMap = {}, specialElements = {};
      function createLookupTable(option, default_value, extendWith) {
         var value = settings[option];
         if (!value) {
            value = mapCache[option];
            if (!value) {
               value = makeMap(default_value, ' ', makeMap(default_value.toUpperCase(), ' '));
               value = extend(value, extendWith);
               mapCache[option] = value;
            }
         } else {
            value = makeMap(value, /[, ]/, makeMap(value.toUpperCase(), /[, ]/));
         }
         return value;
      }
      settings = settings || {};
      schemaItems = compileSchema(settings.schema);
      if (settings.verify_html === false) {
         settings.valid_elements = '*[*]';
      }
      validStyles = compileElementMap(settings.valid_styles);
      invalidStyles = compileElementMap(settings.invalid_styles, 'map');
      validClasses = compileElementMap(settings.valid_classes, 'map');
      whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea video audio iframe object');
      selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr');
      shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link ' +
      'meta param embed source wbr track');
      boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize ' +
      'noshade nowrap readonly selected autoplay loop controls');
      nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object script', shortEndedElementsMap);
      moveCaretBeforeOnEnterElementsMap = createLookupTable('move_caret_before_on_enter_elements', 'table', nonEmptyElementsMap);
      textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' +
      'blockquote center dir fieldset header footer article section hgroup aside nav figure');
      blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' +
      'th tr td li ol ul caption dl dt dd noscript menu isindex option ' +
      'datalist select optgroup figcaption', textBlockElementsMap);
      textInlineElementsMap = createLookupTable('text_inline_elements', 'span strong b em i font strike u var cite ' +
      'dfn code mark q sup sub samp');
      each((settings.special || 'script noscript style textarea').split(' '), function(name) {
         specialElements[name] = new RegExp('<\/' + name + '[^>]*>', 'gi');
      });
      function patternToRegExp(str) {
         return new RegExp('^' + str.replace(/([?+*])/g, '.$1') + '$');
      }
      function addValidElements(validElements) {
         var ei, el, ai, al, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder,
            prefix, outputName, globalAttributes, globalAttributesOrder, key, value,
            elementRuleRegExp = /^([#+\-])?([^\[!\/]+)(?:\/([^\[!]+))?(?:(!?)\[([^\]]+)\])?$/,
            attrRuleRegExp = /^([!\-])?(\w+::\w+|[^=:<]+)?(?:([=:<])(.*))?$/,
            hasPatternsRegExp = /[*?+]/;
         if (validElements) {
            validElements = split(validElements, ',');
            if (elements['@']) {
               globalAttributes = elements['@'].attributes;
               globalAttributesOrder = elements['@'].attributesOrder;
            }
            for (ei = 0, el = validElements.length; ei < el; ei++) {
               matches = elementRuleRegExp.exec(validElements[ei]);
               if (matches) {
                  prefix = matches[1];
                  elementName = matches[2];
                  outputName = matches[3];
                  attrData = matches[5];
                  attributes = {};
                  attributesOrder = [];
                  element = {
                     attributes: attributes,
                     attributesOrder: attributesOrder
                  };
                  if (prefix === '#') {
                     element.paddEmpty = true;
                  }
                  if (prefix === '-') {
                     element.removeEmpty = true;
                  }
                  if (matches[4] === '!') {
                     element.removeEmptyAttrs = true;
                  }
                  if (globalAttributes) {
                     for (key in globalAttributes) {
                        if (globalAttributes.hasOwnProperty(key)) {
                           attributes[key] = globalAttributes[key];
                        }
                     }
                     attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
                  }
                  if (attrData) {
                     attrData = split(attrData, '|');
                     for (ai = 0, al = attrData.length; ai < al; ai++) {
                        matches = attrRuleRegExp.exec(attrData[ai]);
                        if (matches) {
                           attr = {};
                           attrType = matches[1];
                           attrName = matches[2].replace(/::/g, ':');
                           prefix = matches[3];
                           value = matches[4];
                           if (attrType === '!') {
                              element.attributesRequired = element.attributesRequired || [];
                              element.attributesRequired.push(attrName);
                              attr.required = true;
                           }
                           if (attrType === '-') {
                              delete attributes[attrName];
                              attributesOrder.splice(inArray(attributesOrder, attrName), 1);
                              continue;
                           }
                           if (prefix) {
                              if (prefix === '=') {
                                 element.attributesDefault = element.attributesDefault || [];
                                 element.attributesDefault.push({name: attrName, value: value});
                                 attr.defaultValue = value;
                              }
                              if (prefix === ':') {
                                 element.attributesForced = element.attributesForced || [];
                                 element.attributesForced.push({name: attrName, value: value});
                                 attr.forcedValue = value;
                              }
                              if (prefix === '<') {
                                 attr.validValues = makeMap(value, '?');
                              }
                           }
                           if (hasPatternsRegExp.test(attrName)) {
                              element.attributePatterns = element.attributePatterns || [];
                              attr.pattern = patternToRegExp(attrName);
                              element.attributePatterns.push(attr);
                           } else {
                              if (!attributes[attrName]) {
                                 attributesOrder.push(attrName);
                              }
                              attributes[attrName] = attr;
                           }
                        }
                     }
                  }
                  if (!globalAttributes && elementName == '@') {
                     globalAttributes = attributes;
                     globalAttributesOrder = attributesOrder;
                  }
                  if (outputName) {
                     element.outputName = elementName;
                     elements[outputName] = element;
                  }
                  if (hasPatternsRegExp.test(elementName)) {
                     element.pattern = patternToRegExp(elementName);
                     patternElements.push(element);
                  } else {
                     elements[elementName] = element;
                  }
               }
            }
         }
      }
      function setValidElements(validElements) {
         elements = {};
         patternElements = [];
         addValidElements(validElements);
         each(schemaItems, function(element, name) {
            children[name] = element.children;
         });
      }
      function addCustomElements(customElements) {
         var customElementRegExp = /^(~)?(.+)$/;
         if (customElements) {
            mapCache.text_block_elements = mapCache.block_elements = null;
            each(split(customElements, ','), function(rule) {
               var matches = customElementRegExp.exec(rule),
                  inline = matches[1] === '~',
                  cloneName = inline ? 'span' : 'div',
                  name = matches[2];
               children[name] = children[cloneName];
               customElementsMap[name] = cloneName;
               if (!inline) {
                  blockElementsMap[name.toUpperCase()] = {};
                  blockElementsMap[name] = {};
               }
               if (!elements[name]) {
                  var customRule = elements[cloneName];
                  customRule = extend({}, customRule);
                  delete customRule.removeEmptyAttrs;
                  delete customRule.removeEmpty;
                  elements[name] = customRule;
               }
               each(children, function(element, elmName) {
                  if (element[cloneName]) {
                     children[elmName] = element = extend({}, children[elmName]);
                     element[name] = element[cloneName];
                  }
               });
            });
         }
      }
      function addValidChildren(validChildren) {
         var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/;
         mapCache[settings.schema] = null;
         if (validChildren) {
            each(split(validChildren, ','), function(rule) {
               var matches = childRuleRegExp.exec(rule), parent, prefix;
               if (matches) {
                  prefix = matches[1];
                  if (prefix) {
                     parent = children[matches[2]];
                  } else {
                     parent = children[matches[2]] = {'#comment': {}};
                  }
                  parent = children[matches[2]];
                  each(split(matches[3], '|'), function(child) {
                     if (prefix === '-') {
                        delete parent[child];
                     } else {
                        parent[child] = {};
                     }
                  });
               }
            });
         }
      }
      function getElementRule(name) {
         var element = elements[name], i;
         if (element) {
            return element;
         }
         i = patternElements.length;
         while (i--) {
            element = patternElements[i];

            if (element.pattern.test(name)) {
               return element;
            }
         }
      }
      if (!settings.valid_elements) {
         each(schemaItems, function(element, name) {
            elements[name] = {
               attributes: element.attributes,
               attributesOrder: element.attributesOrder
            };
            children[name] = element.children;
         });
         if (settings.schema != "html5") {
            each(split('strong/b em/i'), function(item) {
               item = split(item, '/');
               elements[item[1]].outputName = item[0];
            });
         }
         each(split('ol ul sub sup blockquote span font a table tbody tr strong em b i'), function(name) {
            if (elements[name]) {
               elements[name].removeEmpty = true;
            }
         });
         each(split('p h1 h2 h3 h4 h5 h6 th td pre div address caption'), function(name) {
            elements[name].paddEmpty = true;
         });
         each(split('span'), function(name) {
            elements[name].removeEmptyAttrs = true;
         });
      } else {
         setValidElements(settings.valid_elements);
      }
      addCustomElements(settings.custom_elements);
      addValidChildren(settings.valid_children);
      addValidElements(settings.extended_valid_elements);
      addValidChildren('+ol[ul|ol],+ul[ul|ol]');
      if (settings.invalid_elements) {
         each(explode(settings.invalid_elements), function(item) {
            if (elements[item]) {
               delete elements[item];
            }
         });
      }
      if (!getElementRule('span')) {
         addValidElements('span[!data-mce-type|*]');
      }
      self.children = children;
      self.getValidStyles = function() {
         return validStyles;
      };
      self.getInvalidStyles = function() {
         return invalidStyles;
      };
      self.getValidClasses = function() {
         return validClasses;
      };
      self.getBoolAttrs = function() {
         return boolAttrMap;
      };
      self.getBlockElements = function() {
         return blockElementsMap;
      };
      self.getTextBlockElements = function() {
         return textBlockElementsMap;
      };
      self.getTextInlineElements = function() {
         return textInlineElementsMap;
      };
      self.getShortEndedElements = function() {
         return shortEndedElementsMap;
      };
      self.getSelfClosingElements = function() {
         return selfClosingElementsMap;
      };

      self.getNonEmptyElements = function() {
         return nonEmptyElementsMap;
      };
      self.getMoveCaretBeforeOnEnterElements = function() {
         return moveCaretBeforeOnEnterElementsMap;
      };
      self.getWhiteSpaceElements = function() {
         return whiteSpaceElementsMap;
      };
      self.getSpecialElements = function() {
         return specialElements;
      };
      self.isValidChild = function(name, child) {
         var parent = children[name];

         return !!(parent && parent[child]);
      };
      self.isValid = function(name, attr) {
         var attrPatterns, i, rule = getElementRule(name);
         if (rule) {
            if (attr) {
               if (rule.attributes[attr]) {
                  return true;
               }
               attrPatterns = rule.attributePatterns;
               if (attrPatterns) {
                  i = attrPatterns.length;
                  while (i--) {
                     if (attrPatterns[i].pattern.test(name)) {
                        return true;
                     }
                  }
               }
            } else {
               return true;
            }
         }
         return false;
      };
      self.getElementRule = getElementRule;
      self.getCustomElements = function() {
         return customElementsMap;
      };
      self.addValidElements = addValidElements;
      self.setValidElements = setValidElements;
      self.addCustomElements = addCustomElements;
      self.addValidChildren = addValidChildren;
      self.elements = elements;
   };
});
