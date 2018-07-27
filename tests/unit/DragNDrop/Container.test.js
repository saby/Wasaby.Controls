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

      it('updateDraggingTemplate', function() {
         var
            draggingTemplateOptions = 'draggingTemplateOptions',
            draggingTemplate = 'draggingTemplate';
         container._updateDraggingTemplate(null, draggingTemplateOptions, draggingTemplate);
         assert.equal(container._draggingTemplateOptions, draggingTemplateOptions);
         assert.equal(container._draggingTemplate, draggingTemplate);
      });
   });
});
