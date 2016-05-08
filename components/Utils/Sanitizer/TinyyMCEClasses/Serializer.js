define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Serializer', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Writer',
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses//Schema'
], function(Writer, Schema) {
   return function(schema) {
      var self = this, writer = new Writer();
      self.schema = schema = schema || new Schema();
      self.writer = writer;
      self.serialize = function(node) {
         var handlers, validate;
         validate = true;
         handlers = {
            3: function(node) {
               writer.text(node.value, node.raw);
            },

            8: function(node) {
               writer.comment(node.value);
            },
            7: function(node) {
               writer.pi(node.name, node.value);
            },
            10: function(node) {
               writer.doctype(node.value);
            },
            4: function(node) {
               writer.cdata(node.value);
            },
            11: function(node) {
               if ((node = node.firstChild)) {
                  do {
                     walk(node);
                  } while ((node = node.next));
               }
            }
         };
         writer.reset();
         function walk(node) {
            var handler = handlers[node.type], name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule;
            if (!handler) {
               name = node.name;
               isEmpty = node.shortEnded;
               attrs = node.attributes;
               if (validate && attrs && attrs.length > 1) {
                  sortedAttrs = [];
                  sortedAttrs.map = {};
                  elementRule = schema.getElementRule(node.name);
                  if (elementRule) {
                     for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) {
                        attrName = elementRule.attributesOrder[i];
                        if (attrName in attrs.map) {
                           attrValue = attrs.map[attrName];
                           sortedAttrs.map[attrName] = attrValue;
                           sortedAttrs.push({name: attrName, value: attrValue});
                        }
                     }
                     for (i = 0, l = attrs.length; i < l; i++) {
                        attrName = attrs[i].name;
                        if (!(attrName in sortedAttrs.map)) {
                           attrValue = attrs.map[attrName];
                           sortedAttrs.map[attrName] = attrValue;
                           sortedAttrs.push({name: attrName, value: attrValue});
                        }
                     }
                     attrs = sortedAttrs;
                  }
               }
               writer.start(node.name, attrs, isEmpty);
               if (!isEmpty) {
                  if ((node = node.firstChild)) {
                     do {
                        walk(node);
                     } while ((node = node.next));
                  }
                  writer.end(name);
               }
            } else {
               handler(node);
            }
         }
         if (node.type == 1) {
            walk(node);
         } else {
            handlers[11](node);
         }
         return writer.getContent();
      };
   };
});
