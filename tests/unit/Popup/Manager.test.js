define(
   [
      'Controls/Popup/Manager',
      'Controls/Popup/Manager/Container',
      'Controls/Popup/Opener/BaseController'
   ],

   function (ManagerConstructor, ManagerContainer, BaseController) {
      'use strict';

      function getManager() {
         let Manager = new ManagerConstructor();
         let Container = new ManagerContainer();
         Manager._afterMount();
         Container._afterMount();
         return Manager;
      }

      describe('Controls/Popup/Manager', function () {
         var id, element;
         let Manager = getManager();

         it('initialize', function() {
            let Manager = getManager();
            assert.equal(Manager._popupItems.getCount(), 0);
         });

         it('append popup', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            assert.equal(Manager._popupItems.getCount(), 1);
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'created');
         });

         it('update popup', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            id = Manager.update(id, {
               testOption: 'updated'
            });
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'updated');
         });
   
         it('fireEventHandler', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
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
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            Manager.remove(id);
            assert.equal(Manager._popupItems.getCount(), 0);
         });

         it('add modal popup', function() {
            let Manager = getManager();
            let id1 = Manager.show({
               isModal: false,
               testOption: 'created'
            }, new BaseController());

            Manager.show({
               isModal: true,
               testOption: 'created'
            }, new BaseController());

            let indices = Manager._popupItems.getIndicesByValue('isModal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 1);

            Manager.remove(id1);

            indices = Manager._popupItems.getIndicesByValue('isModal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 0);
         });
      });
   }
);