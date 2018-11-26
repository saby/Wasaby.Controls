define([
   'Controls/EditableArea/Templates/Editors/Base'
], function(
   EditAtPlaceTemplate
) {
   'use strict';

   describe('Controls.EditAtPlace', function() {
      it('_editorValueChangeHandler', function() {
         var instance = new EditAtPlaceTemplate();
         instance._notify = function(eventName, eventArgs, eventOptions) {
            assert.equal(eventName, 'valueChanged');
            assert.instanceOf(eventArgs, Array);
            assert.equal(eventArgs[0], 'test');
            assert.isUndefined(eventOptions);
         };

         instance._editorValueChangeHandler({}, 'test');
      });
   });
});
