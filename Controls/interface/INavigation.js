define('Controls/interface/INavigation', [
], function() {

   /**
    * Интерфейс работы навигации
    *
    * @mixin Controls/interface/INavigation
    * @public
    */

   /**
    * @typedef {String} ListNavigationSource
    * @variant position работа с курсорами
    * @variant offset работа с оффсетом
    * @variant page работа со страницами
    */

   /**
    * @typedef {String} ListNavigationView
    * @variant infinity бесконечный скролл
    * @variant pages разбиение на страницы с пэйджингом
    * @variant demand подгрузка по кнопке
    */

   /**
    * @typedef {Object} ListNavigationPositionSourceConfig
    * @property {String} field поле, по которому строится курсор
    * @property {String} direction направление
    */

   /**
    * @typedef {Object} ListNavigationOffsetSourceConfig
    * @property {Number} limit количество элементов в порции данных
    */

   /**
    * @typedef {Object} ListNavigationInfinityViewConfig
    * @property {String} pagingMode режим отображения пэйджинга
    */

   /**
    * @typedef {Object} ListNavigationPagesViewConfig
    * @property {Boolean} pagesCountSelector возможность настройки количества элментов на странице
    */

   /**
    * @typedef {Object} ListNavigation
    * @property {ListNavigationSource} source способ работы с источником данных
    * @property {ListNavigationView} view внешнее отображение навигации
    * @property {ListNavigationPositionSourceConfig|ListNavigationOffsetSourceConfig} sourceConfig настройки способа работы с источником
    * @property {ListNavigationInfinityViewConfig|ListNavigationPagesViewConfig} viewConfig настройки внешнего отображения навигации
    */

   /**
    * @name Controls/interface/INavigation#navigation
    * @cfg {ListNavigation} Конфигурация навигации. Задает набор настроек, определяющих функционал навигации в списке.
    * Настраивается формат общения с сервисом для разных типов навигации: постраничная, оффсеты и курсор. Так же можно настроить отображение навигации: пэйджинг, подгрузка по скроллу и подгрузка по требованию
    */

});
