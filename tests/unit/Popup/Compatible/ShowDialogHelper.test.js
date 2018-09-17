define(
   [
      'Controls/Popup/Compatible/ShowDialogHelper'
   ],

   function(DialogHelper) {
      'use strict';

      describe('Controls/Popup/Compatible/ShowDialogHelper', function() {
         it('_prepareDeps', function() {
            var config = {
                  isStack: true,
                  target: 'testTarget'
               },
               deps;
            deps = DialogHelper._private.prepareDeps(config);
            assert.isTrue(deps.indexOf('Controls/Popup/Opener/BaseOpener') !== -1);
            assert.isTrue(deps.indexOf('Controls/Popup/Opener/Stack/StackController') !== -1);
            assert.isTrue(config._type === 'stack');
            delete config.isStack;
            deps = DialogHelper._private.prepareDeps(config);
            assert.isTrue(deps.indexOf('Controls/Popup/Opener/Sticky/StickyController') !== -1);
            assert.isTrue(config._type === 'sticky');
            delete config.target;
            deps = DialogHelper._private.prepareDeps(config);
            assert.isTrue(deps.indexOf('Controls/Popup/Opener/Dialog/DialogController') !== -1);
            assert.equal(config._popupComponent , 'floatArea');
            assert.isTrue(config._type === 'dialog');
         });
      })
   }
);
