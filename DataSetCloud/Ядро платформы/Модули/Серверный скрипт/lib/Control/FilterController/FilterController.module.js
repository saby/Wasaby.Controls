/**
 * Created by aa.adilov on 22.07.14.
 */
define('js!SBIS3.CORE.FilterController', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CORE.FilterController',
   'js!SBIS3.CORE.PathFilter', 'js!SBIS3.CORE.FilterButton', 'css!SBIS3.CORE.FilterController'], function(CompoundControl, dotTplFn){

   var FILTER_BUTTON_MARGIN = 8;                 //Внешний отступ кнопки фильтров

   /**
    * Фильтр контроллер
    * @class $ws.proto.FilterController
    * @extends $ws.proto.CompoundControl
    * @control
    */
   $ws.proto.FilterController = CompoundControl.extend(/** @lends $ws.proto.FilterController.prototype */{
      $protected : {
         _dotTplFn: dotTplFn,
         _pathFilter : null,
         _filterButton : null,
         _minWidth: undefined,
         _PFContainer: undefined,
         _PFName: 'fastFilter',
         _FBName: 'filterButton',
         _options : {
            /**
             * @cfg {String} Имя шаблона для всплывающей панели
             */
            template: '',
            /**
             * @cfg {String} Идентификатор связанного браузера
             * @editor InternalBrowserChooser
             */
            browserId: undefined,
            /**
             * @cfg {Function} Функция рендеринга компонента фильтра
             */
            singleFilterItem: undefined,
            /**
             * @cfg {Function} Функция рендеринга строки кнопки фильтров
             */
            filterLine: undefined,
            /**
             * @cfg {Boolean} Нужно ли кнопке фильтров посылать значения по умолчанию
             */
            sendDefault: false,
            /**
             * @typeDef {string} DisplayMode
             * @variant standart стандартный
             * @variant hover    выпадающий список
             */
            /**
             * @cfg {DisplayMode} Режим отображения быстрого фильтра
             */
            mode: 'standart',
            /**
             * @typedef {Object} Filter
             * @property {string} defaultValue значение фильтра по умолчанию
             * @property {string} value начальное значение
             */
            /**
             * @cfg {Object.<string, Filter>} Параметры фильтрации быстрого фильтра
             */
            filters: {},
            /**
             * @cfg {Object} Обработчики для быстрого доступа к фильтру
             */
            pathFilterHandlers: {},
            /**
             * @cfg {Object} Обработчики для кнопки фильтров
             */
            filterButtonHandlers: {},
            /**
             * @cfg {Boolean} Отображать ли историю выбора
             */
            showHistory: false
         }
      },
      $constructor : function() {
         var name = '-' + this.getName();
         this._PFName += name;
         this._FBName += name;
      },
      init: function(){
         $ws.proto.FilterController.superclass.init.call(this);
         this._pathFilter = this.getChildControlByName(this._PFName);
         this._filterButton = this.getChildControlByName(this._FBName);
         this._container.find('.ws-filter-button-text').addClass('ws-hidden');
         this._filterButton.setLinkedPathFilter(this._pathFilter);
         this._minWidth = Math.round(this._container.width()/2);
         this._PFContainer = this._container.find('.ws-FilterController__pathFilter');
         this._initEvents();
         //Хлебный фильтр, метод setFilter(), может не поднимать событие onFilterChange,
         //для обхода было предложено такое решение
         this._pathFilter.setFilter = this._pathFilter.setFilter.callNext(this._setFilter.bind(this));
      },
      /**
       * Возвращает кнопку фильтров
       * @returns {Control|*}
       */
      getFilterButton: function() {
         return this._filterButton;
      },
      /**
       * Возвращает хлебный фильтр
       * @returns {Control|*}
       */
      getPathFilter: function() {
         return this._pathFilter;
      },
      /**
       * Устанавливает шаблон, который будет показан в панели фильтров
       * @param {String} template Название шаблона
       */
      setTemplate: function (template) {
         if (template) {
            this.waitChildControlByName(this._FBName).addCallback(function (instance) {
               instance.setTemplate(template);
            });
         }
      },
      /**
       * Устанавливает связанный браузер
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Браузер, который нужно выбрать
       */
      setLinkedView: function (browser) {
         if (browser) {
            this.waitChildControlByName(this._FBName).addCallback(function (instance) {
               instance.setLinkedView(browser);
            });
         }
      },
      _initEvents: function(){
         var self = this;
         this.subscribe('onResize', function(){
            var width = this._container.width() - FILTER_BUTTON_MARGIN,
                minWidth = Math.round(width/2),
                resultWidth;
            if (minWidth !== self._minWidth) {
               self._minWidth = minWidth;
               resultWidth = self._pathFilter.getResultWidth();
               self._filterButton.setMaxWidth(resultWidth < self._minWidth ? width - resultWidth : self._minWidth);
               if (resultWidth < self._pathFilter.getFullWidth()) {
                  self._updateSize();
               }
               self._pathFilter.updateWidth();
            }
         });
         this._filterButton.subscribe('onDrawLine', function(){
            self._updateSize();
         });
         this._pathFilter.subscribe('onFilterChange', this._onFilterChangeHandler.bind(this));
      },
      /**
       * Обработчик на изменение фильтра в быстром доступе к фильтру
       * @private
       */
      _onFilterChangeHandler: function() {
         this._updateSize();
      },
      /**
       * Метод, вызываемый после метода быстрого доступа к фильтру setFilter()
       * необходим в случае noNotify == true
       * @param {String} filterName имя фильтра, который устанавливается
       * @param {String} value - значение фильтра, который устанавливается
       * @param {Boolean} [noNotify] - признак поднятия события onFilterChange
       * @private
       */
      _setFilter: function(filterName, value, noNotify) {
         if (noNotify) {
            this._onFilterChangeHandler();
         }
      },
      _updateSize: function(){
         var pathFilterFullWidth = this._pathFilter.getFullWidth(),
             pathFilterResultWidth = this._pathFilter.getResultWidth(),
             width = this._container.width() - FILTER_BUTTON_MARGIN,
             maxWidth;
         if (this._filterButton.getContainer().width() > this._minWidth) {
            maxWidth = width - (pathFilterFullWidth < this._minWidth ? pathFilterFullWidth : this._minWidth);
         } else {
            maxWidth = width - pathFilterResultWidth;
            if (maxWidth < pathFilterResultWidth) {
               maxWidth = this._minWidth;
               this._PFContainer.css('max-width', width - this._minWidth);
            }
         }
         this._filterButton.setMaxWidth(maxWidth);
      }
   });

   return $ws.proto.FilterController;
});
