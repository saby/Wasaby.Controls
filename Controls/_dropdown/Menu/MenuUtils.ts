import buttonLib = require('Controls/buttons');

   function cssStyleGeneration(options) {
      var sizes = ['small', 'medium', 'large'],
         menuStyle = options.headConfig && options.headConfig.menuStyle,
         currentButtonClass, iconSize;

      currentButtonClass = buttonLib.classesUtil.getCurrentButtonClass(options.style);

      // для каждого размера вызывающего элемента создаем класс, который выравнивает popup через margin.
      var offsetClassName = 'controls-MenuButton_' + (currentButtonClass.viewMode || options.viewMode);

      if ((!options.icon || options.viewMode === 'toolButton') && options.viewMode !== 'button') {
         offsetClassName += ('__' + options.size);
      } else if (options.icon) {
         sizes.forEach(function(size) {
            if (options.icon.indexOf('icon-' + size) !== -1) {
               iconSize = size;
            }
         });

         // у кнопки типа 'Ссылка' высота вызывающего элемента зависит от размера иконки,
         // поэтому необходимо это учесть при сдвиге
         offsetClassName += '_iconSize-' + iconSize;
      }
      offsetClassName += (((menuStyle === 'duplicateHead' && options.showHeader) || (!options.headerTemplate && !options.showHeader)) ? '_duplicate' : '') + '_popup';
      return offsetClassName;
   }

   export = {
      cssStyleGeneration: cssStyleGeneration
   };

