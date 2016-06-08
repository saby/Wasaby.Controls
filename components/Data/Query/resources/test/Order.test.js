/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Query.Order'
], function (Order) {
   'use strict';
   describe('SBIS3.CONTROLS.Data.Query.Order', function () {
      describe('.getSelector', function () {
         it('should return empty string by default', function () {
            var order = new Order();
            assert.strictEqual(order.getSelector(), '');
         });
         it('should return value passed to the constructor', function () {
            var order = new Order({
               selector: 'test'
            });
            assert.equal(order.getSelector(), 'test');
         });
      });

      describe('.getOrder', function () {
         it('should return false by default', function () {
            var order = new Order();
            assert.isFalse(order.getOrder());
         });
         it('should return boolean value passed to the constructor', function () {
            var order = new Order({
               order: false
            });
            assert.isFalse(order.getOrder());
         });
         it('should return false from string "ASC" passed to the constructor', function () {
            var order = new Order({
               order: 'ASC'
            });
            assert.isFalse(order.getOrder());

            order = new Order({
               order: 'asc'
            });
            assert.isTrue(order.getOrder());

            order = new Order({
               order: 'Asc'
            });
            assert.isTrue(order.getOrder());
         });
         it('should return true from string "DESC" passed to the constructor', function () {
            var order = new Order({
               order: 'DESC'
            });
            assert.isTrue(order.getOrder());

            order = new Order({
               order: 'desc'
            });
            assert.isFalse(order.getOrder());

            order = new Order({
               order: 'Desc'
            });
            assert.isFalse(order.getOrder());
         });
      });
   });
});