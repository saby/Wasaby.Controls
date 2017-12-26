define(['js!Controls/Input/resources/SuggestPopupController', 'Core/core-instance', 'WS.Data/Source/Memory'],
   function(SuggestPopupController, cInstance, Memory) {
   
   'use strict';
      
      describe('Controls.Input.SuggestPopupController', function () {
         
         it('.getSearchController', function() {
            var self = {
               _options: {
                  dataSource: new Memory()
               }
            };
            
            var searchController = SuggestPopupController._private.getSearchController(self);
            assert.isTrue(cInstance.instanceOfModule(searchController, 'Controls/List/resources/utils/Search'));
            assert.isTrue(cInstance.instanceOfModule(searchController._dataSource, 'WS.Data/Source/Memory'));
         });
   
         it('.getPopupOpener', function() {
            var self = {};
      
            var popupOpener = SuggestPopupController._private.getPopupOpener(self);
            assert.isTrue(cInstance.instanceOfModule(popupOpener, 'Controls/Popup/Opener/Sticky'));
         });
         
      });
      
   }
);