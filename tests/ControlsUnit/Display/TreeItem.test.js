/* global define, describe, it, assert */
define([
   'Types/_display/TreeItem'
], function(
   TreeItem
) {
   'use strict';

   TreeItem = TreeItem.default;

   describe('Types/_display/TreeItem', function() {
      var getOwnerMock = function() {
         return {
            notifyItemChange: function(item, property) {
               this.lastChangedItem = item;
               this.lastChangedProperty = property;
            }
         };
      };

      describe('.getParent()', function() {
         it('should return undefined by default', function() {
            var item = new TreeItem();
            assert.isUndefined(item.getParent());
         });

         it('should return value passed to the constructor', function() {
            var parent = new TreeItem(),
               item = new TreeItem({parent: parent});

            assert.strictEqual(item.getParent(), parent);
         });
      });

      describe('.getRoot()', function() {
         it('should return itself by default', function() {
            var item = new TreeItem();
            assert.strictEqual(item.getRoot(), item);
         });

         it('should return root of the parent', function() {
            var parent = new TreeItem(),
               item = new TreeItem({parent: parent});

            assert.strictEqual(item.getRoot(), parent.getRoot());
         });
      });

      describe('.isRoot()', function() {
         it('should return true by default', function() {
            var item = new TreeItem();
            assert.isTrue(item.isRoot());
         });

         it('should return false if has parent', function() {
            var parent = new TreeItem(),
               item = new TreeItem({parent: parent});

            assert.isFalse(item.isRoot());
         });
      });

      describe('.getLevel()', function() {
         it('should return 0 by default', function() {
            var item = new TreeItem();
            assert.strictEqual(item.getLevel(), 0);
         });

         it('should return value differs by +1 from the parent', function() {
            var root = new TreeItem(),
               level1 = new TreeItem({parent: root}),
               level2 = new TreeItem({parent: level1});

            assert.strictEqual(root.getLevel(), 0);
            assert.strictEqual(level1.getLevel(), root.getLevel() + 1);
            assert.strictEqual(level2.getLevel(), level1.getLevel() + 1);
         });

         it('should return 1 for root if it\'s enumerable', function() {
            var Owner = function() {
                  this.isRootEnumerable = function() {
                     return true;
                  };
               },
               owner =  new Owner(),
               root = new TreeItem({owner: owner}),
               level1 = new TreeItem({parent: root, owner: owner}),
               level2 = new TreeItem({parent: level1, owner: owner});

            assert.strictEqual(root.getLevel(), 1);
            assert.strictEqual(level1.getLevel(), root.getLevel() + 1);
            assert.strictEqual(level2.getLevel(), level1.getLevel() + 1);
         });
      });

      describe('.isNode()', function() {
         it('should return false by default', function() {
            var item = new TreeItem();
            assert.isFalse(item.isNode());
         });

         it('should return value passed to the constructor', function() {
            var item = new TreeItem({node: true});
            assert.isTrue(item.isNode());
         });
      });

      describe('.isExpanded()', function() {
         it('should return false by default', function() {
            var item = new TreeItem();
            assert.isFalse(item.isExpanded());
         });

         it('should return value passed to the constructor', function() {
            var item = new TreeItem({expanded: true});
            assert.isTrue(item.isExpanded());
         });
      });

      describe('.setExpanded()', function() {
         it('should set the new value', function() {
            var item = new TreeItem();

            item.setExpanded(true);
            assert.isTrue(item.isExpanded());

            item.setExpanded(false);
            assert.isFalse(item.isExpanded());
         });

         it('should notify owner if changed', function() {
            var owner = getOwnerMock(),
               item = new TreeItem({
                  owner: owner
               });

            item.setExpanded(true);

            assert.strictEqual(owner.lastChangedItem, item);
            assert.strictEqual(owner.lastChangedProperty, 'expanded');
         });

         it('should not notify owner if changed in silent mode', function() {
            var owner = getOwnerMock(),
               item = new TreeItem({
                  owner: owner
               });

            item.setExpanded(true, true);

            assert.isUndefined(owner.lastChangedItem);
            assert.isUndefined(owner.lastChangedProperty);
         });
      });

      describe('.toggleExpanded()', function() {
         it('should toggle the value', function() {
            var item = new TreeItem();

            item.toggleExpanded();
            assert.isTrue(item.isExpanded());

            item.toggleExpanded();
            assert.isFalse(item.isExpanded());
         });
      });

      describe('.isHasChildren()', function() {
         it('should return true by default', function() {
            var item = new TreeItem();
            assert.isTrue(item.isHasChildren());
         });

         it('should return value passed to the constructor', function() {
            var item = new TreeItem({hasChildren: false});
            assert.isFalse(item.isHasChildren());
         });
      });

      describe('.setHasChildren()', function() {
         it('should set the new value', function() {
            var item = new TreeItem();

            item.setHasChildren(false);
            assert.isFalse(item.isHasChildren());

            item.setHasChildren(true);
            assert.isTrue(item.isHasChildren());
         });
      });

      describe('.isLoaded()', function() {
         it('should return false by default', function() {
            var item = new TreeItem();
            assert.isFalse(item.isLoaded());
         });

         it('should return value passed to the constructor', function() {
            var item = new TreeItem({loaded: true});
            assert.isTrue(item.isLoaded());
         });
      });

      describe('.setLoaded()', function() {
         it('should set the new value', function() {
            var item = new TreeItem();

            item.setLoaded(true);
            assert.isTrue(item.isLoaded());

            item.setLoaded(false);
            assert.isFalse(item.isLoaded());
         });
      });

      describe('.getChildrenProperty()', function() {
         it('should return na empty string by default', function() {
            var item = new TreeItem();
            assert.strictEqual(item.getChildrenProperty(), '');
         });

         it('should return value passed to the constructor', function() {
            var name = 'test',
               item = new TreeItem({childrenProperty: name});

            assert.strictEqual(item.getChildrenProperty(), name);
         });
      });

      describe('.toJSON()', function() {
         it('should serialize the tree item', function() {
            var item = new TreeItem(),
               json = item.toJSON(),
               options = item._getOptions();

            delete options.owner;

            assert.strictEqual(json.module, 'Types/display:TreeItem');
            assert.deepEqual(json.state.$options, options);
         });
      });

      describe('::fromJSON()', function() {
      });
   });
});
