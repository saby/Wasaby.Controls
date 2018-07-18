define(['SBIS3.CONTROLS/Action/OpenDialog', 'Core/core-instance', 'Lib/Control/Dialog/Dialog', 'Lib/Control/FloatArea/FloatArea'
], function (OpenDialog, cInstance) {
   describe('SBIS3.CONTROLS/Action/OpenDialog', function() {
      beforeEach(function () {
         if (typeof window === 'undefined') {
            this.skip();
         }
      });
      describe('execute', function() {
         it('should open dialog', function(done) {
            let action = new OpenDialog({
               mode: 'dialog',
               template: 'Controls/Button',
               dialogOptions: {
                  animationLength: 0
               }
            });
            action.execute();
            action.subscribe('onBeforeShow', function (e, dialog) {
               assert.isTrue(cInstance.instanceOfModule(dialog, 'Lib/Control/Dialog/Dialog'));
               done();
            });

            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });

         it('should open floatArea', function(done) {
            let action = new OpenDialog({
               mode: 'floatArea',
               template: 'Controls/Button',
               dialogOptions: {
                  animationLength: 0
               }
            });
            action.execute();
            action.subscribe('onBeforeShow', function (e, dialog) {
               assert.isTrue(cInstance.instanceOfModule(dialog, 'Lib/Control/FloatArea/FloatArea'));
               done();
            });

            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });
      });

      describe('subscribe', function() {
         it('should notify onAfterClose', function(done) {
            let action = new OpenDialog({
               template: 'Controls/Button',
               dialogOptions: {
                  handlers: {
                     'onAfterClose': function () {
                        done()
                     }
                  }
               }
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });
         it('should notify onBeforeShow', function(done) {
            let action = new OpenDialog({
               template: 'Controls/Button',
               dialogOptions: {
                  handlers: {
                     'onBeforeShow': function () {
                        done()
                     }
                  }
               }
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });
         it('should notify onAfterShow', function(done) {
            let action = new OpenDialog({
               template: 'Controls/Button',
               dialogOptions: {
                  handlers: {
                     'onAfterShow': function () {
                        this.close();
                        done()
                     }
                  }
               }
            });
            action.execute();
         });
      });
   })
});
