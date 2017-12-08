define('js!Controls/interface/INavigation', [
], function() {

   /**
    * Интерфейс работы навигации
    *
    * @mixin Controls/interface/INavigation
    * @public
    */

   /**
    * @typedef {String} ListNavigationSource
    * @variant position Описание
    * @variant offset Описание
    * @variant page Описание
    */

   /**
    * @typedef {String} ListNavigationView
    * @variant infinity Описание
    * @variant pages Описание
    * @variant demand Описание
    */

   /**
    * @typedef {Object} ListNavigationPositionSourceConfig
    * @property {String} field Описание
    * @property {String} direction Описание
    */

   /**
    * @typedef {Object} ListNavigationOffsetSourceConfig
    * @property {Number} limit Описание
    */

   /**
    * @typedef {Object} ListNavigationInfinityViewConfig
    * @property {String} pagingMode Описание
    */

   /**
    * @typedef {Object} ListNavigationPagesViewConfig
    * @property {Boolean} pagesCountSelector Описание
    */

   /**
    * @typedef {Object} ListNavigation
    * @property {ListNavigationSource} source Описание
    * @property {ListNavigationView} view Описание
    * @property {ListNavigationPositionSourceConfig|ListNavigationOffsetSourceConfig} sourceConfig Описание
    * @property {ListNavigationInfinityViewConfig|ListNavigationPagesViewConfig} viewConfig Описание
    */

   /**
    * @name Controls/List/ListControl#navigation
    * @cfg {ListNavigation} Конфигурация навигации
    */

});