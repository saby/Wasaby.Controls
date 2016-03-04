/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.FormatsFactory'
   ], function (FormatsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.FormatsFactory', function() {
         describe('.create()', function() {
            it('should throw an error if not simple array passed', function() {
               assert.throw(function () {
                  FormatsFactory.create();
               });
               assert.throw(function () {
                  FormatsFactory.create(null);
               });
               assert.throw(function () {
                  FormatsFactory.create(false);
               });
               assert.throw(function () {
                  FormatsFactory.create(true);
               });
               assert.throw(function () {
                  FormatsFactory.create(0);
               });
               assert.throw(function () {
                  FormatsFactory.create(1);
               });
               assert.throw(function () {
                  FormatsFactory.create('');
               });
               assert.throw(function () {
                  FormatsFactory.create({});
               });
            });
            it('should return an empty formats list', function() {
               var format = FormatsFactory.create([]);
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Format'));
               assert.strictEqual(format.getCount(), 0);
            });
            it('should return formats list', function() {
               var declaration = [{
                     name: 'f1',
                     type: 'boolean'
                  }, {
                     name: 'f2',
                     type: 'integer'
                  }, {
                     name: 'f3',
                     type: 'real'
                  }, {
                     name: 'f4',
                     type: 'string'
                  }],
                  format = FormatsFactory.create(declaration);

               assert.strictEqual(format.getCount(), 4);
               for (var i = 0; i < format.getCount(); i++) {
                  assert.strictEqual(format.at(i).getName(), declaration[i].name);
               }
            });
         });
      });
   }
);
