define('Controls/DragNDrop/Container',
   [
      'Core/Control',
      'tmpl!Controls/DragNDrop/Container/Container',
      'Controls/DragNDrop/DraggingTemplate'
   ],

   function(Control, template) {
      return Control.extend({
         _template: template,
         _draggingTemplateOptions: undefined,
         _draggingTemplate: undefined,

         _documentDragStart: function(event, dragObject) {
            this._children.dragStartDetect.start(dragObject);
         },

         _documentDragEnd: function(event, dragObject) {
            this._children.dragEndDetect.start(dragObject);
            this._draggingTemplate = null;
            this._draggingTemplateOptions = null;
         },

         _updateDraggingTemplate: function(event, draggingTemplateOptions, draggingTemplate) {
            this._draggingTemplateOptions = draggingTemplateOptions;
            this._draggingTemplate = draggingTemplate;
         }
      });
   });
