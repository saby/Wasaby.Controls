define('Controls/DragNDrop/Avatar', [
   'Core/Control',
   'tmpl!Controls/DragNDrop/Avatar/Avatar',
   'css!Controls/DragNDrop/Avatar/Avatar'
], function(Control, template) {

   var MAX_ITEMS_COUNT = 999;

   var _private = {
      getCounterText: function(itemsCount) {
         var result;
         if (itemsCount > MAX_ITEMS_COUNT) {
            result = MAX_ITEMS_COUNT + '+';
         } else if (itemsCount > 1) {
            result = itemsCount;
         }
         return result;
      }
   };

   var Avatar = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._mainText = options.entity.getMainText() || rk('Запись реестра');
         this._additionalText = options.entity.getAdditionalText();
         this._logo = options.entity.getLogo() || 'icon-DocumentUnknownType';
         this._image = options.entity.getImage();
         this._itemsCount = _private.getCounterText(options.entity.getItems().length);
      }
   });

   Avatar.getDefaultOptions = function() {
      return {
         avatarOffset: 10
      };
   };

   return Avatar;
});
