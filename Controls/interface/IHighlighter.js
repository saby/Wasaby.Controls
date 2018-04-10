define('Controls/interface/IHighlighter', [
], function() {

   /**
    * Интерфейс для работы с подсветкой. В компонент можно добавлять разные типы подсветки. Это подсветка поиска, подсветка цветом или подсветка валидации. Данная подсветка будет активироваться при ее наличии в момент отрисовки шаблона элемента списка.
    * @mixin Controls/interface/IHighlighter
    * @public
    */

   /**
    * @typedef {Object} Highlighter
    */

   /**
    * @name Controls/interface/IHighlighter#highlighter
    * @cfg {Array.<Highlighter>} Массив выделителей
    */
});
