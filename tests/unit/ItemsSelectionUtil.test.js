/**
 * Created by am.gerasimov on 12.04.2017.
 */
define([
   'SBIS3.CONTROLS/Utils/ItemsSelectionUtil',
   'WS.Data/Entity/Model',
   'SBIS3.CONTROLS/Action/SelectorAction',
   'SBIS3.CONTROLS/SelectorButton'
], function (ItemsSelection, Model, SelectorAction, SelectorButton) {
   'use strict';
   
   describe('SBIS3.CONTROLS/Utils/ItemsSelectionUtil', function () {
      
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
   
      context('do not need JQ', function() {
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
      });
   
      context('need JQ', function() {
         var getContainer = function(isInsideItem) {
               var elem = $('<div class="selectorButtonContainer"/>');
               if(isInsideItem) {
                  elem = $('<div class="js-controls-ListView__item controls-ListView__item"/>').append(elem);
               }
               elem.appendTo('body');
               return elem;
         },
         removeContainer = function() {
            $('.selectorButtonContainer').remove();
         };
         describe('ItemsSelection::initSelectorAction', function () {
            var action, selectorButton;
            
            before(function() {
               if(typeof window === 'undefined') {
                  this.skip();
               } else {
                  action = new SelectorAction();
                  selectorButton = new SelectorButton({element: getContainer()});
                  ItemsSelection.initSelectorAction(action, selectorButton);
               }
            });
   
            after(function() {
               if(typeof window !== 'undefined') {
                  removeContainer();
                  selectorButton.destroy();
               }
            });
            
            it('has event handler for onExecuted', function () {
               assert.isTrue(action.hasEventHandlers('onExecuted'))
            });
      
            it('has event handler for onExecute', function () {
               assert.isTrue(action.hasEventHandlers('onExecute'))
            });
   
            it('config is not changed', function () {
               let cfg = {
                  componentsOptions: {
                     handlers: {
                        onSelectComplete: function () {}
                     }
                  }
               };
               action._buildComponentConfig(cfg);
               assert.isTrue(typeof cfg.componentsOptions.handlers.onSelectComplete === "function");
            });
      
         });
   
         describe('ItemsSelection::itemClickHandler', function () {
            var selectorButton;
      
            before(function() {
               if(typeof window === 'undefined') {
                  this.skip();
               } else {
                  selectorButton = new SelectorButton({
                     element: getContainer(true),
                     displayProperty: 'title',
                     idProperty: 'id',
                     selectedItem: {id: 123, title: 'title'}
                  });
               }
            });
   
            after(function() {
               if(typeof window !== 'undefined') {
                  removeContainer();
               }
            });
   
            it('cross click check', function () {
               var crossClicked;
   
               ItemsSelection.clickHandler.call(selectorButton, selectorButton.getContainer().find('.js-controls__item-cross'),
                  function() {
                     crossClicked = true;
                  },
                  function() {
                     crossClicked = false;
                  }
               );
               assert.isTrue(crossClicked);
            });
   
            it('item click check', function () {
               var itemClicked;
      
               ItemsSelection.clickHandler.call(selectorButton, selectorButton.getContainer().find('.js-controls-ListView__item'),
                  function() {
                     itemClicked = false;
                  },
                  function(id) {
                     itemClicked = id && true;
                  }
               );
               assert.isTrue(itemClicked);
            });
      
         });
      });
      
   })
});

