/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'js!Controls/List/ItemsRender',
   'js!Controls/List/resources/utils/ItemsUtil'
], function(ItemsRender, ItemsUtil){
   describe('Controls.List.ItemsRender', function () {
      var data, display;
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
         ];
         display = ItemsUtil.getDefaultDisplayFlat(data, {idProperty: 'id'});
      });
      it('Enumeration', function () {

         var ctrl = new ItemsRender({
            display: display
         });

         assert.equal(0, ctrl._startIndex, 'Incorrect start enumeration index after constructor');
         assert.equal(3, ctrl._stopIndex, 'Incorrect stop enumeration index after constructor');
         assert.equal(0, ctrl._curIndex, 'Incorrect current enumeration index after constructor');

         ctrl._curIndex = 3;
         ctrl._getStartEnumerationPosition();
         assert.equal(0, ctrl._curIndex, 'Incorrect current enumeration index after _getStartEnumerationPosition');

         ctrl._getNextEnumerationPosition();
         ctrl._getNextEnumerationPosition();
         assert.equal(2, ctrl._curIndex, 'Incorrect current enumeration index after 2x_getNextEnumerationPosition');

         var condResult = ctrl._checkConditionForEnumeration();
         assert.isTrue(condResult, 'Incorrect condition value enumeration index after 2x_getNextEnumerationPosition');
         ctrl._getNextEnumerationPosition();
         condResult = ctrl._checkConditionForEnumeration();
         assert.isFalse(condResult, 'Incorrect condition value enumeration index after 3x_getNextEnumerationPosition');
      });
   })
});