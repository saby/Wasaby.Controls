/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Core'
], function (Core) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Core', function () {
      describe('.extend()', function () {
         it('should emulate $ws.core.extend', function () {
            var Parent = Core.extend({
                  constructor: function() {
                     called.parentConstructor = true;
                  }
               }),
               Mixin = {
                  mixinMethod: function() {
                     called.mixinMethod = true;
                  }
               },
               Child = Parent.extend([Mixin], {
                  $protected: {
                     _options: {
                        opt1: {
                           opt1a: {
                              v1: 1,
                              v2: 2
                           }
                        },
                        opt2: {
                           v1: 1,
                           v2: 2
                        }
                     }
                  },

                  $constructor: function() {
                     called.childConstructor = true;
                  },

                  childMethod: function() {
                     called.childMethod = true;
                  }
               }),
               called = {};
            var inst = new Child({
               opt1: {
                  opt1a: {
                     v1: 3
                  }
               }
            });
            assert.isTrue(called.parentConstructor);
            assert.isTrue(called.childConstructor);
            assert.deepEqual(inst._options.opt1, {
               opt1a: {
                  v1: 3,
                  v2: 2
               }
            });
            assert.deepEqual(inst._options.opt2, {
               v1: 1,
               v2: 2
            });
            inst.mixinMethod();
            assert.isTrue(called.mixinMethod);
            inst.childMethod();
            assert.isTrue(called.childMethod);
         });
      });
   });
});