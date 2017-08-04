/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/ListView2', 'js!WS.Data/Collection/RecordSet', 'js!WS.Data/Source/Memory', 'Core/core-instance'],
   function (ListView, RecordSet, MemorySource, cInstance) {

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
               var ctrl = new ListView({
                  items : data,
                  idProperty: 'id'
               });

               var display = ctrl._display;
               ctrl._onItemClick({}, display.at(1));

               assert.equal(2, ctrl._selectedKey, 'itemClick doesn\'t select key');
               assert.equal(1, ctrl._selectedIndex, 'itemClick doesn\'t select index');
            });
   
            it('mousemove', function () {
               var ctrl = new ListView({
                  items : data,
                  idProperty: 'id'
               });
      
               ctrl._mouseMove({}, ctrl._display.at(1));
               assert.equal(1, ctrl._hoveredIndex);
               
               ctrl._mouseMove({}, ctrl._display.at(0));
               assert.equal(0, ctrl._hoveredIndex);
            });
   
            it('mouseleave', function () {
               var ctrl = new ListView({
                  items : data,
                  idProperty: 'id'
               });
   
               ctrl._mouseMove({}, ctrl._display.at(1));
               ctrl._mouseLeave({});
               assert.equal(-1, ctrl._hoveredIndex);
            });

         });


      });
   });