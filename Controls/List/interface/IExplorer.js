define('Controls/List/interface/IExplorer', [
], function() {
   /**
    * Интерфейс работы списков в виде иерархия с проваливанием
    *
    * @mixin Controls/List/interface/IExplorer
    * @public
    */

   /**
    * @typedef {String} explorerViewMode
    * @variant grid Таблица
    * @variant list Список
    * @variant tile Плитка
    */
   /**
    * @name Controls/List/interface/IExplorer#viewMode
    * @cfg {explorerViewMode} Режим отображения списка
    */

   /**
    * @event Controls/List/interface/IExplorer#itemOpen Перед проваливанием в папку
    */
   /**
    * @event Controls/List/interface/IExplorer#itemOpened После проваливания в папку
    */

});
