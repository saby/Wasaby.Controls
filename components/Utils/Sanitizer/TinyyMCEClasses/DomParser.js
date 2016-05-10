define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/DomParser', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Node',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Schema',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/SaxParser',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Tools'
], function(Node, Schema, SaxParser, Tools) {
   var makeMap = Tools.makeMap, extend = Tools.extend;
   return function(settings, schema) {
      var self = this, nodeFilters = {}, attributeFilters = [], matchedNodes = {}, matchedAttributes = {};
      settings = settings || {};
      settings.validate = "validate" in settings ? settings.validate : true;
      settings.root_name = settings.root_name || 'body';
      self.schema = schema = schema || new Schema();
      function fixInvalidChildren(nodes) {
         var ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i;
         var nonEmptyElements, nonSplitableElements, textBlockElements, specialElements, sibling, nextNode;
         nonSplitableElements = makeMap('tr,td,th,tbody,thead,tfoot,table');
         nonEmptyElements = schema.getNonEmptyElements();
         textBlockElements = schema.getTextBlockElements();
         specialElements = schema.getSpecialElements();
         for (ni = 0; ni < nodes.length; ni++) {
            node = nodes[ni];
            if (!node.parent || node.fixed) {
               continue;
            }
            if (textBlockElements[node.name] && node.parent.name == 'li') {
               sibling = node.next;
               while (sibling) {
                  if (textBlockElements[sibling.name]) {
                     sibling.name = 'li';
                     sibling.fixed = true;
                     node.parent.insert(sibling, node.parent);
                  } else {
                     break;
                  }
                  sibling = sibling.next;
               }
               node.unwrap(node);
               continue;
            }
            parents = [node];
            for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) &&
            !nonSplitableElements[parent.name]; parent = parent.parent) {
               parents.push(parent);
            }
            if (parent && parents.length > 1) {
               parents.reverse();
               newParent = currentNode = self.filterNode(parents[0].clone());
               for (i = 0; i < parents.length - 1; i++) {
                  if (schema.isValidChild(currentNode.name, parents[i].name)) {
                     tempNode = self.filterNode(parents[i].clone());
                     currentNode.append(tempNode);
                  } else {
                     tempNode = currentNode;
                  }
                  for (childNode = parents[i].firstChild; childNode && childNode != parents[i + 1];) {
                     nextNode = childNode.next;
                     tempNode.append(childNode);
                     childNode = nextNode;
                  }
                  currentNode = tempNode;
               }
               if (!newParent.isEmpty(nonEmptyElements)) {
                  parent.insert(newParent, parents[0], true);
                  parent.insert(node, newParent);
               } else {
                  parent.insert(node, parents[0], true);
               }
               parent = parents[0];
               if (parent.isEmpty(nonEmptyElements) || parent.firstChild === parent.lastChild && parent.firstChild.name === 'br') {
                  parent.empty().remove();
               }
            } else if (node.parent) {
               if (node.name === 'li') {
                  sibling = node.prev;
                  if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                     sibling.append(node);
                     continue;
                  }
                  sibling = node.next;
                  if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                     sibling.insert(node, sibling.firstChild, true);
                     continue;
                  }
                  node.wrap(self.filterNode(new Node('ul', 1)));
                  continue;
               }
               if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) {
                  node.wrap(self.filterNode(new Node('div', 1)));
               } else {
                  if (specialElements[node.name]) {
                     node.empty().remove();
                  } else {
                     node.unwrap();
                  }
               }
            }
         }
      }
      self.filterNode = function(node) {
         var i, name, list;
         if (name in nodeFilters) {
            list = matchedNodes[name];

            if (list) {
               list.push(node);
            } else {
               matchedNodes[name] = [node];
            }
         }
         i = attributeFilters.length;
         while (i--) {
            name = attributeFilters[i].name;

            if (name in node.attributes.map) {
               list = matchedAttributes[name];

               if (list) {
                  list.push(node);
               } else {
                  matchedAttributes[name] = [node];
               }
            }
         }

         return node;
      };
      self.parse = function(html, args) {
         var parser, rootNode, node, nodes, i, l, fi, fl, list, name, validate;
         var blockElements, invalidChildren = [], isInWhiteSpacePreservedElement;
         var endWhiteSpaceRegExp, isAllWhiteSpaceRegExp, whiteSpaceElements;
         var children, nonEmptyElements;
         args = args || {};
         matchedNodes = {};
         matchedAttributes = {};
         blockElements = extend(makeMap('script,style,head,html,body,title,meta,param'), schema.getBlockElements());
         nonEmptyElements = schema.getNonEmptyElements();
         children = schema.children;
         validate = true;
         whiteSpaceElements = schema.getWhiteSpaceElements();
         endWhiteSpaceRegExp = /[ \t\r\n]+$/;
         isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/;
         function createNode(name, type) {
            var node = new Node(name, type), list;
            if (name in nodeFilters) {
               list = matchedNodes[name];
               if (list) {
                  list.push(node);
               } else {
                  matchedNodes[name] = [node];
               }
            }
            return node;
         }
         function removeWhitespaceBefore(node) {
            var textNode, textNodeNext, textVal, sibling, blockElements = schema.getBlockElements();
            for (textNode = node.prev; textNode && textNode.type === 3;) {
               textVal = textNode.value.replace(endWhiteSpaceRegExp, '');
               if (textVal.length > 0) {
                  textNode.value = textVal;
                  return;
               }
               textNodeNext = textNode.next;
               if (textNodeNext) {
                  if (textNodeNext.type == 3 && textNodeNext.value.length) {
                     textNode = textNode.prev;
                     continue;
                  }
                  if (!blockElements[textNodeNext.name] && textNodeNext.name != 'script' && textNodeNext.name != 'style') {
                     textNode = textNode.prev;
                     continue;
                  }
               }
               sibling = textNode.prev;
               textNode.remove();
               textNode = sibling;
            }
         }
         function cloneAndExcludeBlocks(input) {
            var name, output = {};
            for (name in input) {
               if (name !== 'li' && name != 'p') {
                  output[name] = input[name];
               }
            }
            return output;
         }
         parser = new SaxParser({
            validate: validate,
            allow_script_urls: settings.allow_script_urls,
            allow_conditional_comments: settings.allow_conditional_comments,
            self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()),
            cdata: function(text) {
               node.append(createNode('#cdata', 4)).value = text;
            },
            text: function(text, raw) {
               var textNode;
               if (text.length !== 0) {
                  textNode = createNode('#text', 3);
                  textNode.raw = !!raw;
                  node.append(textNode).value = text;
               }
            },
            comment: function(text) {
               node.append(createNode('#comment', 8)).value = text;
            },
            pi: function(name, text) {
               node.append(createNode(name, 7)).value = text;
               removeWhitespaceBefore(node);
            },
            doctype: function(text) {
               var newNode;
               newNode = node.append(createNode('#doctype', 10));
               newNode.value = text;
               removeWhitespaceBefore(node);
            },
            start: function(name, attrs, empty) {
               var newNode, attrFiltersLen, elementRule, attrName, parent;
               elementRule = validate ? schema.getElementRule(name) : {};
               if (elementRule) {
                  newNode = createNode(elementRule.outputName || name, 1);
                  newNode.attributes = attrs;
                  newNode.shortEnded = empty;
                  node.append(newNode);
                  parent = children[node.name];
                  if (parent && children[newNode.name] && !parent[newNode.name]) {
                     invalidChildren.push(newNode);
                  }
                  attrFiltersLen = attributeFilters.length;
                  while (attrFiltersLen--) {
                     attrName = attributeFilters[attrFiltersLen].name;
                     if (attrName in attrs.map) {
                        list = matchedAttributes[attrName];
                        if (list) {
                           list.push(newNode);
                        } else {
                           matchedAttributes[attrName] = [newNode];
                        }
                     }
                  }
                  if (!empty) {
                     node = newNode;
                  }
                  if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                     isInWhiteSpacePreservedElement = true;
                  }
               }
            },
            end: function(name) {
               var textNode, elementRule, text, sibling, tempNode;
               elementRule = validate ? schema.getElementRule(name) : {};
               if (elementRule) {
                  if (blockElements[name]) {
                     if (!isInWhiteSpacePreservedElement) {
                        textNode = node.firstChild;
                        if (textNode && textNode.type === 3) {
                           text = textNode.value;
                           if (text.length > 0) {
                              textNode.value = text;
                              textNode = textNode.next;
                           } else {
                              sibling = textNode.next;
                              textNode.remove();
                              textNode = sibling;
                              while (textNode && textNode.type === 3) {
                                 text = textNode.value;
                                 sibling = textNode.next;
                                 if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                                    textNode.remove();
                                    textNode = sibling;
                                 }
                                 textNode = sibling;
                              }
                           }
                        }
                        textNode = node.lastChild;
                        if (textNode && textNode.type === 3) {
                           text = textNode.value.replace(endWhiteSpaceRegExp, '');
                           if (text.length > 0) {
                              textNode.value = text;
                              textNode = textNode.prev;
                           } else {
                              sibling = textNode.prev;
                              textNode.remove();
                              textNode = sibling;
                              while (textNode && textNode.type === 3) {
                                 text = textNode.value;
                                 sibling = textNode.prev;
                                 if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                                    textNode.remove();
                                    textNode = sibling;
                                 }
                                 textNode = sibling;
                              }
                           }
                        }
                     }
                  }
                  if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                     isInWhiteSpacePreservedElement = false;
                  }
                  if (elementRule.removeEmpty || elementRule.paddEmpty) {
                     if (node.isEmpty(nonEmptyElements)) {
                        if (elementRule.paddEmpty) {
                           node.empty().append(new Node('#text', '3')).value = '\u00a0';
                        } else {
                           if (!node.attributes.map.name && !node.attributes.map.id) {
                              tempNode = node.parent;
                              if (blockElements[node.name]) {
                                 node.empty().remove();
                              } else {
                                 node.unwrap();
                              }
                              node = tempNode;
                              return;
                           }
                        }
                     }
                  }
                  node = node.parent;
               }
            }
         }, schema);
         rootNode = node = new Node(args.context || settings.root_name, 11);
         parser.parse(html);
         if (validate && invalidChildren.length) {
            if (!args.context) {
               fixInvalidChildren(invalidChildren);
            } else {
               args.invalid = true;
            }
         }
         if (!args.invalid) {
            for (name in matchedNodes) {
               if (matchedNodes.hasOwnProperty(name)) {
                  list = nodeFilters[name];
                  nodes = matchedNodes[name];
                  fi = nodes.length;
                  while (fi--) {
                     if (!nodes[fi].parent) {
                        nodes.splice(fi, 1);
                     }
                  }
                  for (i = 0, l = list.length; i < l; i++) {
                     list[i](nodes, name, args);
                  }
               }
            }
            for (i = 0, l = attributeFilters.length; i < l; i++) {
               list = attributeFilters[i];
               if (list.name in matchedAttributes) {
                  nodes = matchedAttributes[list.name];
                  fi = nodes.length;
                  while (fi--) {
                     if (!nodes[fi].parent) {
                        nodes.splice(fi, 1);
                     }
                  }
                  for (fi = 0, fl = list.callbacks.length; fi < fl; fi++) {
                     list.callbacks[fi](nodes, list.name, args);
                  }
               }
            }
         }
         return rootNode;
      };
   };
});
