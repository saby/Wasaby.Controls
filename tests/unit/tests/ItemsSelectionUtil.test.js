/**
 * Created by am.gerasimov on 12.04.2017.
 */
define(['js!SBIS3.CONTROLS.Utils.ItemsSelection', 'js!WS.Data/Entity/Model'], function (ItemsSelection, Model) {
   'use strict';
   
   describe('SBIS3.CONTROLS.Utils.ItemsSelection', function () {
      
      const displayProp = 'displayProp';
      const idProp = 'idProp';
      const displayPropValue = 'displayPropValue';
      const idPropValue = 'idPropValue';
      
      function getModel(idPropVal, displayPropVal) {
         var modelRawData = {};
   
         modelRawData[displayProp] = idPropVal;
         modelRawData[idProp] = displayPropVal;
   
         return new Model({rawData: modelRawData});
      }
   
      describe('ItemsSelection::isEmptyItem', function () {
         
         it('displayProp is null', function () {
            assert.isTrue(ItemsSelection.isEmptyItem(getModel(idPropValue, null), idProp, displayProp));
         });
   
         it('idProp is null', function () {
            assert.isTrue(ItemsSelection.isEmptyItem(getModel(null, displayPropValue), idProp, displayProp));
         });
         
         it('fullPropValues', function() {
            assert.isFalse(ItemsSelection.isEmptyItem(getModel(idPropValue, displayPropValue), idProp, displayProp));
         })
         
      });
   
      describe('ItemsSelection::checkItemForSelect', function () {
         
         it('correct new Item, current item is empty', function() {
            assert.isTrue(
               ItemsSelection.checkItemForSelect(getModel(idPropValue, displayPropValue), null, idProp, displayProp, true)
               )
         });
   
         it('incorrect new Item, current item is empty', function() {
            assert.isTrue(
               ItemsSelection.checkItemForSelect(getModel(null, null), null, idProp, displayProp, false)
            )
         });
   
         it('correct new Item, has current item', function() {
            assert.isTrue(
               ItemsSelection.checkItemForSelect(getModel(idPropValue, displayPropValue), getModel(idPropValue, displayPropValue), idProp, displayProp, false)
            )
         });
   
         it('incorrect new Item, has current item', function() {
            assert.isTrue(
               ItemsSelection.checkItemForSelect(getModel(null, null), getModel(idPropValue, displayPropValue), idProp, displayProp, false)
            )
         });
         
      });
      
   })
});

