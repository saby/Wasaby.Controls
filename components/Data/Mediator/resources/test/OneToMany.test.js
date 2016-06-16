/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Mediator.OneToMany',
   'js!SBIS3.CONTROLS.Data.Model'
], function (OneToMany, Model) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Mediator.OneToMany', function() {
      var addChildren = function(mediator, parent, children) {
            for (var i = 0; i < children.length; i++) {
               mediator.addTo(parent, children[i], 'rel' + i);
            }
         },
         removeChildren = function(mediator, parent, children) {
            for (var i = 0; i < children.length; i++) {
               mediator.removeFrom(parent, children[i]);
            }
         },
         getParentAsSimple = function() {
            return 'parent';
         },
         getChildrenAsSimple = function() {
            return ['child0', 'child1', 'child2'];
         },
         getParentAsObject = function() {
            return {name: 'parent'};
         },
         getChildrenAsObjects = function() {
            return [{name: 'child0'}, {name: 'child1'}, {name: 'child2'}];
         },
         getParentAsHashable = function() {
            return new Model();
         },
         getChildrenAsHashable = function() {
            return [new Model(), new Model(), new Model()];
         },
         checkParent = function(mediator, parent, children) {
            for (var i = 0; i < children.length; i++) {
               assert.strictEqual(mediator.getParent(children[i]), parent);
            }
         },
         checkChildren = function(mediator, parent, children) {
            var i = 0;
            mediator.each(parent, function(child, name) {
               assert.strictEqual(child, children[i]);
               assert.equal(name, 'rel' + i);
               i++;
            });
            assert.strictEqual(i, children.length);
         },
         mediator;

      beforeEach(function() {
         mediator = new OneToMany();
      });

      afterEach(function() {
         mediator = undefined;
      });

      describe('.getInstance()', function() {
         it('should return same object twice', function() {
            var mediator = OneToMany.getInstance();
            assert.strictEqual(mediator, OneToMany.getInstance());
         });
      });

      describe('.addTo()', function() {
         it('should add a relation for primitives', function() {
            var parent = getParentAsSimple(),
               children = getChildrenAsSimple();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });

         it('should add a relation for objects', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsObjects();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });

         it('should add a relation for objects with hash', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });
      });

      describe('.removeFrom()', function() {
         it('should remove a relation for primitives', function() {
            var parent = getParentAsSimple(),
               children = getChildrenAsSimple();

            addChildren(mediator, parent, children);
            removeChildren(mediator, parent, children);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });

         it('should remove a relation for objects', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsObjects();

            addChildren(mediator, parent, children);
            removeChildren(mediator, parent, children);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });

         it('should add a relation for objects with hash', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable();

            addChildren(mediator, parent, children);
            removeChildren(mediator, parent, children);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });
      });

      describe('.clear()', function() {
         it('should work for primitives', function() {
            var parent = getParentAsSimple(),
               children = getChildrenAsSimple();

            addChildren(mediator, parent, children);
            mediator.clear(parent);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });

         it('should work for objects', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsObjects();

            addChildren(mediator, parent, children);
            mediator.clear(parent);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });

         it('should work for objects with hash', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable();

            addChildren(mediator, parent, children);
            mediator.clear(parent);
            checkParent(mediator, undefined, children);
            checkChildren(mediator, parent, []);
         });
      });

      describe('.each()', function() {
         it('should not call a handler by default', function() {
            checkChildren(mediator, 'a', []);
            checkChildren(mediator, {}, []);
            checkChildren(mediator, new Model(), []);
         });

         it('should return children for primitives', function() {
            var parent = getParentAsSimple(),
               children = getChildrenAsSimple();

            addChildren(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });

         it('should return children for objects', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsObjects();

            addChildren(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });

         it('should return children for objects with hash', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable();

            addChildren(mediator, parent, children);
            checkChildren(mediator, parent, children);
         });
      });

      describe('.getParent()', function() {
         it('should return undefined by default', function() {
            assert.isUndefined(mediator.getParent('a'));
            assert.isUndefined(mediator.getParent({}));
            assert.isUndefined(mediator.getParent(new Model()));
         });

         it('should return parent for primitives', function() {
            var parent = getParentAsSimple(),
               children = getChildrenAsSimple();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
         });

         it('should return parent for objects', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsObjects();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
         });

         it('should return parent for objects with hash', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable();

            addChildren(mediator, parent, children);
            checkParent(mediator, parent, children);
         });
      });

      describe('.childChanged()', function() {
         it('should notify the parent', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsObjects(),
               result = {};

            parent.relationChanged = function(which, name, data) {
               result.which = which;
               result.name = name;
               result.data = data;
            };

            addChildren(mediator, parent, children);

            mediator.childChanged(children[1], 'test');
            assert.strictEqual(result.which, children[1]);
            assert.equal(result.name, 'rel1');
            assert.equal(result.data, 'test');
         });
         it('should notify all of the parents if recursive', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable(),
               handler = function(which, name, data) {
                  results.push({
                     which: which,
                     name: name,
                     data: data
                  });
                  callsCount++;
               },
               results = [],
               stack,
               callsCount = 0,
               i;

            parent.relationChanged = handler;
            var curr = parent;
            for (i = 0; i < children.length; i++) {
               mediator.addTo(curr, children[i], 'level' + i);
               children[i].relationChanged = handler;
               curr = children[i];
            }

            mediator.childChanged(children[children.length - 1], 'last', true);
            stack = children.slice();
            stack.reverse();
            var result;
            for (i = 0; i < stack.length; i++) {
               result = results[i];
               assert.strictEqual(result.which, stack[i]);
               assert.equal(result.name, 'level' + (stack.length - i - 1));
               assert.equal(result.data, 'last');
            }
            assert.equal(callsCount, children.length);
         });
      });

      describe('.parentChanged()', function() {
         it('should notify all of direct children', function() {
            var parent = getParentAsObject(),
               children = getChildrenAsHashable(),
               handler = function(which, name, data) {
                  results.push({
                     which: which,
                     name: name,
                     data: data
                  });
               },
               results = [],
               i;

            for (i = 0; i < children.length; i++) {
               children[i].relationChanged = handler;
            }

            addChildren(mediator, parent, children);

            mediator.parentChanged(parent, 'test');
            var result;
            for (i = 0; i < children.length; i++) {
               result = results[i];
               assert.strictEqual(result.which, parent);
               assert.equal(result.name, 'rel' + i);
               assert.equal(result.data, 'test');
            }
         });
         it('should notify all of the children if recursive', function() {
            var parent = getParentAsHashable(),
               children = getChildrenAsHashable(),
               handler = function(which, name, data) {
                  results.push({
                     which: which,
                     name: name,
                     data: data
                  });
                  callsCount++;
               },
               results = [],
               stack,
               callsCount = 0,
               i;

            parent.relationChanged = handler;
            var curr = parent;
            for (i = 0; i < children.length; i++) {
               mediator.addTo(curr, children[i], 'level' + i);
               children[i].relationChanged = handler;
               curr = children[i];
            }

            mediator.parentChanged(parent, 'first', true);
            stack = children.slice();
            stack.pop();
            stack.unshift(parent);
            var result;
            for (i = 0; i < stack.length; i++) {
               result = results[i];
               assert.strictEqual(result.which, stack[i]);
               assert.equal(result.name, 'level' + i);
               assert.equal(result.data, 'first');
            }
            assert.equal(callsCount, children.length);
         });
      });
   });
});
