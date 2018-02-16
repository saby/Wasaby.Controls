define(
   [
      'Controls/InfoBoxOpener'
   ],

   function (InfoBoxOpener) {
      'use strict';
      describe('Controls/InfoBoxOpener', function () {

         var getHorizontalOffset = InfoBoxOpener._private.getHorizontalOffset;
         var align, corner;

         var tests = [{
            align: { horizontal: 'left', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'left' },
            value: 28
         }, {
            align: { horizontal: 'center', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'left' },
            value: 9
         }, {
            align: { horizontal: 'right', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'left' },
            value: 0
         }, {
            align: { horizontal: 'left', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'right' },
            value: 0
         }, {
            align: { horizontal: 'center', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'right' },
            value: -9
         }, {
            align: { horizontal: 'right', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'right' },
            value: -28
         }, {
            align: { horizontal: 'left', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'center' },
            value: 19
         }, {
            align: { horizontal: 'center', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'center' },
            value: 0
         }, {
            align: { horizontal: 'right', vertical: 'top' },
            corner: { vertical: 'top', horizontal: 'center' },
            value: -19
         }, {
            align: { horizontal: 'left', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'left' },
            value: 28
         }, {
            align: { horizontal: 'center', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'left' },
            value: 9
         }, {
            align: { horizontal: 'right', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'left' },
            value: 0
         }, {
            align: { horizontal: 'left', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'right' },
            value: 0
         }, {
            align: { horizontal: 'center', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'right' },
            value: -9
         }, {
            align: { horizontal: 'right', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'right' },
            value: -28
         }, {
            align: { horizontal: 'left', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'center' },
            value: 19
         }, {
            align: { horizontal: 'center', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'center' },
            value: 0
         }, {
            align: { horizontal: 'right', vertical: 'bottom' },
            corner: { vertical: 'bottom', horizontal: 'center' },
            value: -19
         }];

         tests.forEach(function(cfg){
            it('align: ' + JSON.stringify(cfg.align) + ', corner: ' + JSON.stringify(cfg.corner), function(){
               assert.isTrue(getHorizontalOffset(400, cfg.corner, cfg.align) === cfg.value);
            });
         });

      });
   }
);