define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Node', [], function() {
   var whiteSpaceRegExp = /^[ \t\r\n]*$/, typeLookup = {
      '#text': 3,
      '#comment': 8,
      '#cdata': 4,
      '#pi': 7,
      '#doctype': 10,
      '#document-fragment': 11
   };
   function walk(node, root_node, prev) {
      var sibling, parent, startName = prev ? 'lastChild' : 'firstChild', siblingName = prev ? 'prev' : 'next';
      if (node[startName]) {
         return node[startName];
      }
      if (node !== root_node) {
         sibling = node[siblingName];
         if (sibling) {
            return sibling;
         }
         for (parent = node.parent; parent && parent !== root_node; parent = parent.parent) {
            sibling = parent[siblingName];
            if (sibling) {
               return sibling;
            }
         }
      }
   }
   function Node(name, type) {
      this.name = name;
      this.type = type;

      if (type === 1) {
         this.attributes = [];
         this.attributes.map = {};
      }
   }
   Node.prototype = {
      replace: function(node) {
         var self = this;
         if (node.parent) {
            node.remove();
         }
         self.insert(node, self);
         self.remove();
         return self;
      },
      attr: function(name, value) {
         var self = this, attrs, i, undef;
         if (typeof name !== "string") {
            for (i in name) {
               self.attr(i, name[i]);
            }

            return self;
         }
         if ((attrs = self.attributes)) {
            if (value !== undef) {
               if (value === null) {
                  if (name in attrs.map) {
                     delete attrs.map[name];

                     i = attrs.length;
                     while (i--) {
                        if (attrs[i].name === name) {
                           attrs = attrs.splice(i, 1);
                           return self;
                        }
                     }
                  }
                  return self;
               }
               if (name in attrs.map) {
                  // Set attribute
                  i = attrs.length;
                  while (i--) {
                     if (attrs[i].name === name) {
                        attrs[i].value = value;
                        break;
                     }
                  }
               } else {
                  attrs.push({name: name, value: value});
               }
               attrs.map[name] = value;
               return self;
            }
            return attrs.map[name];
         }
      },
      clone: function() {
         var self = this, clone = new Node(self.name, self.type), i, l, selfAttrs, selfAttr, cloneAttrs;
         if ((selfAttrs = self.attributes)) {
            cloneAttrs = [];
            cloneAttrs.map = {};
            for (i = 0, l = selfAttrs.length; i < l; i++) {
               selfAttr = selfAttrs[i];
               if (selfAttr.name !== 'id') {
                  cloneAttrs[cloneAttrs.length] = {name: selfAttr.name, value: selfAttr.value};
                  cloneAttrs.map[selfAttr.name] = selfAttr.value;
               }
            }
            clone.attributes = cloneAttrs;
         }
         clone.value = self.value;
         clone.shortEnded = self.shortEnded;
         return clone;
      },
      wrap: function(wrapper) {
         var self = this;
         self.parent.insert(wrapper, self);
         wrapper.append(self);
         return self;
      },
      unwrap: function() {
         var self = this, node, next;
         for (node = self.firstChild; node;) {
            next = node.next;
            self.insert(node, self, true);
            node = next;
         }
         self.remove();
      },
      remove: function() {
         var self = this, parent = self.parent, next = self.next, prev = self.prev;
         if (parent) {
            if (parent.firstChild === self) {
               parent.firstChild = next;
               if (next) {
                  next.prev = null;
               }
            } else {
               prev.next = next;
            }
            if (parent.lastChild === self) {
               parent.lastChild = prev;
               if (prev) {
                  prev.next = null;
               }
            } else {
               next.prev = prev;
            }
            self.parent = self.next = self.prev = null;
         }

         return self;
      },
      append: function(node) {
         var self = this, last;
         if (node.parent) {
            node.remove();
         }
         last = self.lastChild;
         if (last) {
            last.next = node;
            node.prev = last;
            self.lastChild = node;
         } else {
            self.lastChild = self.firstChild = node;
         }
         node.parent = self;
         return node;
      },
      insert: function(node, ref_node, before) {
         var parent;
         if (node.parent) {
            node.remove();
         }
         parent = ref_node.parent || this;
         if (before) {
            if (ref_node === parent.firstChild) {
               parent.firstChild = node;
            } else {
               ref_node.prev.next = node;
            }
            node.prev = ref_node.prev;
            node.next = ref_node;
            ref_node.prev = node;
         } else {
            if (ref_node === parent.lastChild) {
               parent.lastChild = node;
            } else {
               ref_node.next.prev = node;
            }
            node.next = ref_node.next;
            node.prev = ref_node;
            ref_node.next = node;
         }
         node.parent = parent;
         return node;
      },
      empty: function() {
         var self = this, nodes, i, node;
         if (self.firstChild) {
            nodes = [];
            for (node = self.firstChild; node; node = walk(node, self)) {
               nodes.push(node);
            }
            i = nodes.length;
            while (i--) {
               node = nodes[i];
               node.parent = node.firstChild = node.lastChild = node.next = node.prev = null;
            }
         }
         self.firstChild = self.lastChild = null;
         return self;
      },
      isEmpty: function(elements) {
         var self = this, node = self.firstChild, i, name;
         if (node) {
            do {
               if (node.type === 1) {
                  if (elements[node.name]) {
                     return false;
                  }
                  i = node.attributes.length;
                  while (i--) {
                     name = node.attributes[i].name;
                     if (name === "name") {
                        return false;
                     }
                  }
               }
               if (node.type === 8) {
                  return false;
               }
               if ((node.type === 3 && !whiteSpaceRegExp.test(node.value))) {
                  return false;
               }
            } while ((node = walk(node, self)));
         }
         return true;
      },
      walk: function(prev) {
         return walk(this, null, prev);
      }
   };
   Node.create = function(name, attrs) {
      var node, attrName;
      node = new Node(name, typeLookup[name] || 1);
      if (attrs) {
         for (attrName in attrs) {
            node.attr(attrName, attrs[attrName]);
         }
      }
      return node;
   };
   return Node;
});
