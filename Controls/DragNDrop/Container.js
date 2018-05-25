define('Controls/DragNDrop/Container',
   [
      'Core/Control',
      'tmpl!Controls/DragNDrop/Container/Container'
   ],

   function(Control, template) {
      return Control.extend({
         _template: template,
         _avatarOptions: undefined,
         _avatarTemplate: undefined,

         _documentDragStart: function(event, dragObject) {
            this._children.dragStartDetect.start(dragObject);
         },

         _documentDragEnd: function(event, dragObject) {
            this._children.dragEndDetect.start(dragObject);
            this._avatarTemplate = null;
            this._avatarOptions = null;
         },

         _updateDragAvatar: function(event, avatarOptions, avatarTemplate) {
            this._avatarOptions = avatarOptions;
            this._avatarTemplate = avatarTemplate;
         }
      });
   });
