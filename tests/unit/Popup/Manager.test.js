define(
   [
      'Controls/Popup/Manager',
      'Controls/Popup/Opener/BaseController'
   ],

   function (Manager, BaseController) {
      'use strict';
      describe('Controls/Popup/Manager', function () {
         var id, element;
         it('initialize', function() {
            assert.equal(Manager._popupItems.getCount(), 0);
         });

         it('append popup', function() {
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            assert.equal(Manager._popupItems.getCount(), 1);
         });

         it('find popup', function() {
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'created');
         });

         it('update popup', function() {
            Manager.update(id, {
               testOption: 'updated'
            });
            assert.equal(Manager._popupItems.getCount(), 1);
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'updated');
         });
   
         it('fireEventHandler', function() {
            var eventCloseFired = false;
   
            Manager.update(id, {
               eventHandlers: {
                  onClose: function() {
                     eventCloseFired = true;
                  }
               }
            });
            
            Manager._private.fireEventHandler(id, 'onClose');
            
            assert.isTrue(eventCloseFired, 'event is not fired.');
         });

         it('remove popup', function() {
            Manager.remove(id);
            assert.equal(Manager._popupItems.getCount(), 0);
         });
      });
   }
);