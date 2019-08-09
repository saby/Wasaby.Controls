define(['Controls/buttons', 'Types/collection'], function(buttons, collection) {
   'use strict';

   var Validator = buttons.ActualApi;

   describe('Controls.Button.validateIconStyle', function() {
      it('iconStyleTransformation', function() {
         var oldIconStyle = 'test';
         assert.equal(Validator.iconStyleTransformation(oldIconStyle), 'test');
         oldIconStyle = 'default';
         assert.equal(Validator.iconStyleTransformation(oldIconStyle), 'default');
         oldIconStyle = 'error';
         assert.equal(Validator.iconStyleTransformation(oldIconStyle), 'danger');
         oldIconStyle = 'attention';
         assert.equal(Validator.iconStyleTransformation(oldIconStyle), 'warning');
         oldIconStyle = 'done';
         assert.equal(Validator.iconStyleTransformation(oldIconStyle), 'success');
      });
      it('iconColorFromOptIconToIconStyle', function() {
         var icon = 'test icon-large icon-small icon-Send icon-error icon-medium icon-Best';
         assert.equal(Validator.iconColorFromOptIconToIconStyle(icon), 'error');
      });
      it('itemsSetOldIconStyle', function() {
         var items = new collection.RecordSet({
               idProperty: 'id',
               rawData: [
                  { id: 1, iconStyle: 'test', icon: 'icon-Send icon-error icon-small' },
                  { id: 2, icon: 'icon-Send icon-error icon-small' },
                  { id: 3, icon: 'icon-Send icon-small' },
                  { id: 4 }
               ]
            }),
            resultItems = [
               { id: 1, iconStyle: 'test', icon: 'icon-Send icon-error icon-small' },
               { id: 2, iconStyle: 'error', icon: 'icon-Send icon-error icon-small' },
               { id: 3, icon: 'icon-Send icon-small' },
               { id: 4}
            ],
            itemsWithIconStyle;
         itemsWithIconStyle = Validator.itemsSetOldIconStyle(items);
         assert.deepEqual(items.getRawData(), resultItems);
      });
   });
});
