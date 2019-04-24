define(
   [
      'Controls/Popup/Opener/Notification/NotificationController',
      'Controls/_popup/Opener/Notification'
   ],
   (NotificationController, Notification) => {
      'use strict';

      describe('Controls/Popup/Opener/Notification', () => {
         const containers = [
            {
               offsetHeight: 10
            },
            {
               offsetHeight: 20
            },
            {
               offsetHeight: 30
            }
         ];

         afterEach(function() {
            NotificationController._stack.clear();
         });

         it('elementCreated', function() {
            const item1 = {
               popupOptions: {}
            };
            const item2 = {
               popupOptions: {}
            };

            NotificationController.elementCreated(item1, containers[1]);
            assert.equal(NotificationController._stack.getCount(), 1);
            assert.equal(NotificationController._stack.at(0), item1);
            assert.equal(item1.height, containers[1].offsetHeight);
            assert.deepEqual(item1.position, {
               right: 0,
               bottom: 0
            });

            NotificationController.elementCreated(item2, containers[2]);
            assert.equal(NotificationController._stack.getCount(), 2);
            assert.equal(NotificationController._stack.at(0), item2);
            assert.equal(NotificationController._stack.at(1), item1);
            assert.equal(item2.height, containers[2].offsetHeight);
            assert.deepEqual(item2.position, {
               right: 0,
               bottom: 0
            });
            assert.deepEqual(item1.position, {
               right: 0,
               bottom: containers[2].offsetHeight
            });
         });

         it('elementUpdated', function() {
            const item = {
               popupOptions: {}
            };

            NotificationController.elementCreated(item, containers[1]);
            NotificationController.elementUpdated(item, containers[2]);
            assert.equal(NotificationController._stack.getCount(), 1);
            assert.equal(NotificationController._stack.at(0), item);
            assert.equal(item.height, containers[2].offsetHeight);
            assert.deepEqual(item.position, {
               right: 0,
               bottom: 0
            });
         });

         it('elementDestroyed', function() {
            const item = {
               popupOptions: {}
            };

            NotificationController.elementCreated(item, containers[1]);
            NotificationController.elementDestroyed(item);
            assert.equal(NotificationController._stack.getCount(), 0);
         });

         it('getDefaultConfig', function() {
            const item = {
               popupOptions: {}
            };

            NotificationController.getDefaultConfig(item);
            assert.equal(item.popupOptions.content, 'Controls/_popup/Opener/Notification/NotificationContent');
         });

         it('getCompatibleConfig', function() {
            const cfg = {
               autoClose: true
            };

            Notification._private.getCompatibleConfig({ prepareNotificationConfig: function(config) {return config;} }, cfg);
            assert.equal(cfg.notHide, false);
            cfg.autoClose = false;
            Notification._private.getCompatibleConfig({ prepareNotificationConfig: function(config) {return config;} }, cfg);
            assert.equal(cfg.notHide, true);
         });

      });
   }
);
