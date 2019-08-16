/* global define, describe, it, assert */
define([
   'Types/_display/CollectionItem'
], function(
   CollectionItem
) {
   'use strict';

   CollectionItem = CollectionItem.default;

   describe('Types/_display/CollectionItem', function() {
      describe('.getOwner()', function() {
         it('should return null by default', function() {
            var item = new CollectionItem();
            assert.isNull(item.getOwner());
         });

         it('should return value passed to the constructor', function() {
            var owner = {},
               item = new CollectionItem({owner: owner});

            assert.strictEqual(item.getOwner(), owner);
         });
      });

      describe('.setOwner()', function() {
         it('should set the new value', function() {
            var owner = {},
               item = new CollectionItem();

            item.setOwner(owner);

            assert.strictEqual(item.getOwner(), owner);
         });
      });

      describe('.getContents()', function() {
         it('should return null by default', function() {
            var item = new CollectionItem();
            assert.isNull(item.getContents());
         });

         it('should return value passed to the constructor', function() {
            var contents = {},
               item = new CollectionItem({contents: contents});

            assert.strictEqual(item.getContents(), contents);
         });
      });

      describe('.setContents()', function() {
         it('should set the new value', function() {
            var contents = {},
               item = new CollectionItem();

            item.setContents(contents);

            assert.strictEqual(item.getContents(), contents);
         });

         it('should notify the owner', function() {
            var newContents = 'new',
               owner = {},
               item = new CollectionItem({owner: owner}),
               given = {};

            owner.notifyItemChange = function(item, property) {
               given.item = item;
               given.property = property;
            };

            item.setContents(newContents);

            assert.strictEqual(given.item, item);
            assert.strictEqual(given.property, 'contents');
         });

         it('should not notify the owner', function() {
            var newContents = 'new',
               owner = {},
               item = new CollectionItem({owner: owner}),
               given = {};


            owner.notifyItemChange = function(item, property) {
               given.item = item;
               given.property = property;
            };

            item.setContents(newContents, true);

            assert.isUndefined(given.item);
            assert.isUndefined(given.property);
         });
      });

      describe('.getUid()', function() {
         it('should return calling result of getItemUid() on owner', function() {
            var owner = {
               getItemUid: function(item) {
                  return [item];
               }
            };
            var item = new CollectionItem({owner: owner});

            assert.deepEqual(item.getUid(), [item]);
         });

         it('should return undefined if there is no owner', function() {
            var item = new CollectionItem();
            assert.isUndefined(item.getUid());
         });
      });

      describe('.isSelected()', function() {
         it('should return false by default', function() {
            var item = new CollectionItem();
            assert.isFalse(item.isSelected());
         });

         it('should return value passed to the constructor', function() {
            var selected = true,
               item = new CollectionItem({selected: selected});

            assert.strictEqual(item.isSelected(), selected);
         });
      });

      describe('.setSelected()', function() {
         it('should set the new value', function() {
            var selected = true,
               item = new CollectionItem();

            item.setSelected(selected);

            assert.strictEqual(item.isSelected(), selected);
         });

         it('should notify the owner', function() {
            var owner = {},
               item = new CollectionItem({owner: owner}),
               given = {};

            owner.notifyItemChange = function(item, property) {
               given.item = item;
               given.property = property;
            };

            item.setSelected(true);

            assert.strictEqual(given.item, item);
            assert.strictEqual(given.property, 'selected');
         });

         it('should not notify the owner', function() {
            var owner = {},
               item = new CollectionItem({owner: owner}),
               given = {};

            owner.notifyItemChange = function(item, property) {
               given.item = item;
               given.property = property;
            };

            item.setSelected(true, true);

            assert.isUndefined(given.item);
            assert.isUndefined(given.property);
         });
      });

      describe('.toJSON()', function() {
         it('should serialize the collection item', function() {
            var item = new CollectionItem(),
               json = item.toJSON(),
               options = item._getOptions();

            delete options.owner;

            assert.strictEqual(json.module, 'Types/display:CollectionItem');
            assert.isNumber(json.id);
            assert.isTrue(json.id > 0);
            assert.deepEqual(json.state.$options, options);
            assert.strictEqual(json.state.iid, item.getInstanceId());
         });

         it('should serialize contents of the item if owner is not defined', function() {
            var items = [1],
               owner = {},
               item,
               json;

            owner.getCollection = function() {
               return items;
            };
            items.getIndex = Array.prototype.indexOf;

            item = new CollectionItem({
               owner: owner,
               contents: 'foo'
            });

            json = item.toJSON();

            assert.isUndefined(json.state.ci);
            assert.equal(json.state.$options.contents, 'foo');
         });

         it('should serialize contents of the item if owner doesn\'t supports IList', function() {
            var items = [1],
               owner = {},
               item,
               json;

            owner.getCollection = function() {
               return items;
            };

            item = new CollectionItem({
               owner: owner,
               contents: 'foo'
            });

            json = item.toJSON();

            assert.isUndefined(json.state.ci);
            assert.equal(json.state.$options.contents, 'foo');
         });

         it('should don\'t serialize contents of the item if owner supports IList', function() {
            var items = [1],
               owner = {},
               item,
               json;

            owner.getCollection = function() {
               return items;
            };
            items['[Types/_collection/IList]'] = true;
            items.getIndex = Array.prototype.indexOf;

            item = new CollectionItem({
               owner: owner,
               contents: items[0]
            });

            json = item.toJSON();

            assert.strictEqual(json.state.ci, 0);
            assert.isUndefined(json.state.$options.contents);
         });
      });
   });
});
