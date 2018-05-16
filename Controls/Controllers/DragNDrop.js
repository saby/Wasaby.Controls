define('Controls/Controllers/DragNDrop',
   [
      'Core/Control',
      'tmpl!Controls/Controllers/DragNDrop/DragNDrop'
   ],

   function(Control, template) {

      var DragNDropController = Control.extend({
         _template: template,

         startDragNDrop: function(entity, event, options) {
            this._notify('_startDragNDrop', [entity, event, options], {bubbling: true});
         },

         _onDragMove: function(event, dragObject) {
            this._notify('dragMove', [dragObject]);
         },

         _onDragEnd: function(event, dragObject) {
            this._notify('dragEnd', [dragObject]);
         }
      });

      return DragNDropController;
   });
