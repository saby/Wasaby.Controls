/**
 * Created by am.gerasimov on 16.01.2018.
 */
define(
   [
      'SBIS3.CONTROLS/Mixins/ActiveMultiSelectable',
      'WS.Data/Collection/List',
      'Core/Abstract',
      'SBIS3.CONTROLS/Mixins/MultiSelectable',
      'WS.Data/Entity/Model'
   ], function (ActiveMultiSelectable, List, Abstract, MultiSelectable, Model) {
   
   'use strict';
   
   describe('SBIS3.CONTROLS/Mixins/ActiveMultiSelectable', function () {
      
      it('.add item with id that was already selected', function() {
         var myClass = Abstract.extend([ActiveMultiSelectable, MultiSelectable], function(){}),
             selectedItems = new List();
         
         selectedItems.append(new Model({
            rawData: {
               idProperty: 'item1'
            }
         }));
   
         selectedItems.append(new Model({
            rawData: {
               idProperty: 'item2'
            }
         }));
         
         var classInstance = new myClass({
            selectedItems: selectedItems,
            multiselect: false,
            idProperty: 'idProperty'
         });
   
         classInstance._notifyOnPropertyChanged = function(){};
         classInstance.getItems = function(){};
         classInstance.addSelectedItems([
            new Model({
               rawData: {
                  idProperty: 'item2',
                  newProp: 'newProp'
               }
            })
         ]);
         
         assert.equal(classInstance.getSelectedItems().at(0).get('newProp'), 'newProp');
      });
      
   });
});