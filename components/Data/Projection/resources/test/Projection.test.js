/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Projection',
      'js!SBIS3.CONTROLS.Data.Collection.ObservableList'
   ], function (Projection, ObservableList) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection', function() {
         var items,
            list,
            projection;

         beforeEach(function() {
            items = [{
               'Ид': 1,
               'Фамилия': 'Иванов'
            }, {
               'Ид': 2,
               'Фамилия': 'Петров'
            }, {
               'Ид': 3,
               'Фамилия': 'Сидоров'
            }, {
               'Ид': 4,
               'Фамилия': 'Пухов'
            }, {
               'Ид': 5,
               'Фамилия': 'Молодцов'
            }, {
               'Ид': 6,
               'Фамилия': 'Годолцов'
            }, {
               'Ид': 7,
               'Фамилия': 'Арбузнов'
            }];

            list = new ObservableList({
               items: items
            });
         });

         afterEach(function() {
            list.destroy();
            list = undefined;
            items = undefined;
         });

         describe('.getDefaultProjection()', function() {
            it('should return a projection', function() {
               var list = new ObservableList({
                     items: []
                  }),
                  projection = Projection.getDefaultProjection(list);
               assert.equal(projection, Projection.getDefaultProjection(list));
            });
         });
      });
   }
);
