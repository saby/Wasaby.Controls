define('Controls/DragNDrop/Avatar', [
   'Core/Control',
   'tmpl!Controls/DragNDrop/Avatar/Avatar',
   'css!Controls/DragNDrop/Avatar/Avatar'
], function(Control, template) {
   var Avatar = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._mainText = options.entity.getMainText() || rk('Запись реестра');
         this._additionalText = options.entity.getAdditionalText();
         this._logo = options.entity.getLogo() || 'icon-DocumentUnknownType';
         this._image = options.entity.getImage();
      }
   });

   Avatar.getDefaultOptions = function() {
      return {
         avatarOffset: 10
      };
   };

   return Avatar;
});
