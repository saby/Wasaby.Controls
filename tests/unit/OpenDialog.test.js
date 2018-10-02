define(['SBIS3.CONTROLS/Action/OpenDialog', 'Core/core-instance', 'Lib/Control/Dialog/Dialog', 'Lib/Control/FloatArea/FloatArea'
], function (OpenDialog, cInstance) {
   describe('SBIS3.CONTROLS/Action/OpenDialog', function() {
      var cOptions = {
         _prepareClassesByConfig: function() {
            return {};
         }
      };

      beforeEach(function () {
         if (typeof window === 'undefined') {
            this.skip();
         }
      });
      describe('execute', function() {
         it('should open dialog', function(done) {
            let action = new OpenDialog({
               mode: 'dialog',
               template: 'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
               dialogOptions: {
                  animationLength: 0
               },
               componentOptions: cOptions
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
               template: 'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
               dialogOptions: {
                  animationLength: 0
               },
               componentOptions: cOptions
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
               template: 'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
               dialogOptions: {
                  handlers: {
                     'onAfterClose': function () {
                        done()
                     }
                  }
               },
               componentOptions: cOptions
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });
         it('should notify onBeforeShow', function(done) {
            let action = new OpenDialog({
               template: 'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
               dialogOptions: {
                  handlers: {
                     'onBeforeShow': function () {
                        done()
                     }
                  }
               },
               componentOptions: cOptions
            });
            action.execute();
            action.subscribe('onAfterShow', function (e, dialog) {
               dialog.close();
            });
         });
         it('should notify onAfterShow', function(done) {
            let action = new OpenDialog({
               template: 'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
               dialogOptions: {
                  handlers: {
                     'onAfterShow': function () {
                        this.close();
                        done()
                     }
                  }
               },
               componentOptions: cOptions
            });
            action.execute();
         });
      });
   })
});
