define([
   'Controls/DragNDrop/Container'
], function(Container) {
   'use strict';

   describe('Controls.DragNDrop.Container', function() {
      var
         endDetected = false,
         startDetected = false,
         container = new Container();
      container._children = {
         dragStartDetect: {
            start: function() {
               startDetected = true;
            }
         },
         dragEndDetect: {
            start: function() {
               endDetected = true;
            }
         }
      };

      it('documentDragStart', function() {
         container._documentDragStart();
         assert.isTrue(startDetected);
      });

      it('documentDragEnd', function() {
         container._documentDragEnd();
         assert.isTrue(endDetected);
      });

      it('updateAvatar', function() {
         var
            avatarOptions = 'avatarOptions',
            avatarTemplate = 'avatarTemplate';
         container._updateDragAvatar(null, avatarOptions, avatarTemplate);
         assert.equal(container._avatarOptions, avatarOptions);
         assert.equal(container._avatarTemplate, avatarTemplate);
      });
   });
});
