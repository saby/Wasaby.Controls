define('Controls/Button/Menu/MenuUtils', [
   'Controls/Button/Classes'
], function(Classes) {

   function cssStyleGeneration(options) {
      var sizes = ['small', 'medium', 'large'],
         menuStyle = options.headConfig && options.headConfig.menuStyle,
         currentButtonClass, iconSize;

      currentButtonClass = Classes.getCurrentButtonClass(options.style);

      // для каждого размера вызывающего элемента создаем класс, который выравнивает popup через margin.
      var offsetClassName = 'controls-MenuButton controls-MenuButton_' + (currentButtonClass.viewMode || options.viewMode);

      if ((!options.icon || currentButtonClass.type === 'iconButtonBordered') && currentButtonClass.viewMode !== 'button') {
         offsetClassName += ('__' + options.size);
      }

      if (options.icon) {
         sizes.forEach(function(size) {
            if (options.icon.indexOf('icon-' + size) !== -1) {
               iconSize = size;
            }
         });

         // у кнопки типа 'Ссылка' высота вызывающего элемента зависит от размера иконки,
         // поэтому необходимо это учесть при сдвиге
         offsetClassName += '_' + iconSize;
      }
      offsetClassName += (menuStyle === 'duplicateHead' ? '_duplicate' : '');
      return offsetClassName;
   }

   return {
      cssStyleGeneration: cssStyleGeneration
   };
});
