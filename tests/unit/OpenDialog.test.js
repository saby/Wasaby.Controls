define(['js!SBIS3.CONTROLS.Action.OpenDialog', 'Core/core-instance'
], function (OpenDialog, cInstance) {
   describe('SBIS3.CONTROLS.Action.OpenDialog', function() {
      beforeEach(function () {
         if (typeof window === 'undefined') {
            this.skip();
            return;
         }
      });
      describe('execute', function() {
         it('should open dialog', function(done) {
            let action = new OpenDialog({
               mode: 'dialog'
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               assert.isTrue(cInstance.instanceOfModule(dialog), 'SBIS3.CORE.Dialog');
               dialog.close();
               done()
            });

         });

         it('should open floatArea', function(done) {
            let action = new OpenDialog({
               mode: 'floatArea'
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               assert.isTrue(cInstance.instanceOfModule(dialog), 'SBIS3.CORE.FloatArea');
               action.getDialog().close();
               done()
            });
         });
      });

      describe('subscribe', function() {
         it('should notify onAfterClose', function(done) {
            let action = new OpenDialog({
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
