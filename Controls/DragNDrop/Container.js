define('Controls/DragNDrop/Container',
   [
      'Core/Control',
      'tmpl!Controls/DragNDrop/Container/Container'
   ],

   function(Control, template) {
      return Control.extend({
         _template: template,

         _documentDragStart: function(event, dragObject) {
            this._children.dragStartDetect.start(dragObject);
         },

         _documentDragEnd: function(event, dragObject) {
            this._children.dragEndDetect.start(dragObject);
         }
      });
   });
