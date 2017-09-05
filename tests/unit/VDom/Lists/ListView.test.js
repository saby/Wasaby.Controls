/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/ListView2', 'js!WS.Data/Source/Memory', 'Core/core-instance'],
   function (ListView, MemorySource, cInstance) {

      'use strict';

      describe('WSControls.ListView', function () {
         var data;

         beforeEach(function() {
            data = [
               {
                  id : 1,
                  title : 'Первый',
                  type: 1
               },
               {
                  id : 2,
                  title : 'Второй',
                  type: 2
               },
               {
                  id : 3,
                  title : 'Третий',
                  type: 2
               }
            ]
         });

         describe('Events', function () {

            it('ItemClick', function () {
               var cfg = {
                  items : data,
                  idProperty: 'id'
               };
               var ctrl = new ListView(cfg);
               ctrl.saveOptions(cfg);

               var display = ctrl._display;
               ctrl._onItemClick({}, display.at(1));

               assert.equal(2, ctrl._selectedKey, 'itemClick doesn\'t select key');
               assert.equal(1, ctrl._selectedIndex, 'itemClick doesn\'t select index');
            });
   
            it('mousemove', function () {
               var itemData;

               var ctrl = new ListView({
                  items : data,
                  idProperty: 'id'
               });
      
               ctrl._mouseMove({}, ctrl._display.at(1));
               assert.equal(1, ctrl._hoveredIndex, 'Wrong hovered index');
               
               ctrl._mouseMove({}, ctrl._display.at(0));
               assert.equal(0, ctrl._hoveredIndex, 'Wrong hovered index');

               itemData = ctrl._getItemData(ctrl._display.at(0), 0);
               assert.isTrue(itemData.hovered, 'Wrong itemData');
               itemData = ctrl._getItemData(ctrl._display.at(1), 1);
               assert.isFalse(itemData.hovered, 'Wrong itemData');
            });
   
            it('mouseleave', function () {
               var ctrl = new ListView({
                  items : data,
                  idProperty: 'id'
               });
   
               ctrl._mouseMove({}, ctrl._display.at(1));
               ctrl._mouseLeave({});
               assert.equal(-1, ctrl._hoveredIndex, 'Wrong hovered index');
            });

            it('navigation', function () {
               var dataSource = new MemorySource({
                  data : data,
                  idProperty: 'id'
               });
               var ctrl = new ListView({
                  dataSource : dataSource,
                  idProperty: 'id'
               });

               ctrl._beforeMount({
                  dataSource : dataSource,
                  idProperty: 'id',
                  navigation : {
                     type: 'page',
                     config : {
                        pageSize: 2
                     }
                  }
               });

               var params = ctrl._prepareQueryParams();
               //проверим только наличие полей. Само содержимое тестируется в тестах навигации
               assert.isTrue(params.limit !== undefined, '_prepareQuery params doesn\'t return correct limit');
               assert.isTrue(params.offset !== undefined, '_prepareQuery params doesn\'t return correct limit');

               ctrl._beforeUnmount();
               assert.isTrue(ctrl._navigationController === null, '_beforeUnmount doesn\'t destroy navigationController');
            });

         });


      });
   });