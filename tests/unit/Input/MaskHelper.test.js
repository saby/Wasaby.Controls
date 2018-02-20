define(
   [
      'Controls/Input/resources/MaskHelper',
      'Controls/Input/resources/MaskDataHelper'
   ],
   function(MaskHelper, MaskDataHelper) {

      'use strict';

      describe('Controls.Input.MaskHelper', function() {
         var
            formatMaskChars = {
               'd': '[0-9]'
            },
            maskData = [
               MaskDataHelper.getMaskData('dd.dd', formatMaskChars, ' '),
               MaskDataHelper.getMaskData('+7(ddd)ddd-dd-dd', formatMaskChars, ''),
               MaskDataHelper.getMaskData('+7(ddd)ddd-dd-dd', formatMaskChars, ' ')
            ],
            result;
         describe('_private.getValueGroups', function() {
            it('Test_01', function() {
               result = MaskHelper._private.getValueGroups(maskData[0], '1 .3 ');
               assert.deepEqual(result, ['1', ' ', '.', '3', ' ']);
            });
            it('Test_02', function() {
               result = MaskHelper._private.getValueGroups(maskData[1], '+7(915)972-11-61');
               assert.deepEqual(result, ['+7', '(', '9', '1', '5', ')', '9', '7', '2', '-', '1', '1', '-', '6', '1']);
            });
            it('Test_03', function() {
               result = MaskHelper._private.getValueGroups(maskData[2], '+7(   )972-  -61');
               assert.deepEqual(result, ['+7', '(', ' ', ' ', ' ', ')', '9', '7', '2', '-', ' ', ' ', '-', '6', '1']);
            });
         });

         describe('getClearData', function() {
            it('Test_01', function() {
               result = MaskHelper.getClearData(maskData[0], '1 .3 ');
               assert.deepEqual(result, {
                  value: '1 3 ',
                  positions: [0, 1, 2, 2, 3]
               });
            });
            it('Test_02', function() {
               result = MaskHelper.getClearData(maskData[1], '+7(915)972-11-61');
               assert.deepEqual(result, {
                  value: '9159721161',
                  positions: [0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9]
               });
            });
            it('Test_03', function() {
               result = MaskHelper.getClearData(maskData[2], '+7(   )972-  -61');
               assert.deepEqual(result, {
                  value: '   972  61',
                  positions: [0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9]
               });
            });
         });

         describe('getData', function() {
            it('Test_01', function() {
               result = MaskHelper.getData(maskData[0], {
                  value: '1 3 ',
                  position: 3
               });
               assert.deepEqual(result, {
                  value: '1 .3 ',
                  position: 4
               });
            });
            it('Test_02', function() {
               result = MaskHelper.getData(maskData[1], {
                  value: '9159721161',
                  position: 5
               });
               assert.deepEqual(result, {
                  value: '+7(915)972-11-61',
                  position: 9
               });
            });
            it('Test_03', function() {
               result = MaskHelper.getData(maskData[2], {
                  value: '   972  61',
                  position: 5
               });
               assert.deepEqual(result, {
                  value: '+7(   )972-  -61',
                  position: 9
               });
            });
         });
      });
   }
);