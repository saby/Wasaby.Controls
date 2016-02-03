define('js!SBIS3.Engine.Browser', [
   'js!SBIS3.CONTROLS.Browser',
   'html!SBIS3.Engine.Browser',
   'js!SBIS3.CONTROLS.SearchForm',
   'js!SBIS3.CONTROLS.BreadCrumbs',
   'js!SBIS3.CONTROLS.BackButton',
   'js!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.FilterButton',
   'js!SBIS3.CONTROLS.FastDataFilter',
   'css!SBIS3.Engine.Browser'
], function(ControlsBrowser, dotTplFn){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.Engine.Browser
    * @author Крайнов Дмитрий Олегович
    * @extends SBIS3.CONTROLS.Browser
    * @control
    * @public
    * @demo SBIS3.Engine.Demo.MyBrowser
    */



   var Browser = ControlsBrowser.extend( /** @lends SBIS3.Engine.Browser.prototype */{
      /**
       * @event onEdit при редактировании/создании записи
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Ид редактируемой записи. Для добавления будет null
       * @param {SBIS3.CONTROLS.Record} item Редактируемая запись,
       * @param {Object} metaData Дополнительные данные
       * @example
       */
      _dotTplFn : dotTplFn,
      _resizeTimeout: null,
      $protected: {
         _options : {
            /**
             * @cfg {String} Опции для контрола "Строка поиска (SBIS3.CONTROLS.SearchForm)"  в виде набора данных,
             * переданных через теги <opt></opt>, <opts></opts>
             */
            searchConfig : '',
            /**
             * @cfg {String} Опции для контрола "Панель массовых операций (SBIS3.CONTROLS.OperationsPanel)"  в виде набора данных,
             * переданных через теги <opt></opt>, <opts></opts>
             */
            operationsPanelConfig : '',
            /**
             * @cfg {String} Опции для контрола "Кнопка для реализации поведения возврата назад по истории (SBIS3.CONTROLS.BackButton)"
             * в виде набора данных, переданных через теги <opt></opt>, <opts></opts>
             */
            backButtonConfig : '',
            /**
             * @cfg {String} Опции для контрола "Хлебные крошки (SBIS3.CONTROLS.BreadCrumbs)"  в виде набора данных,
             * переданных через теги <opt></opt>, <opts></opts>
             */
            breadCrumbsConfig : '',
            /**
             * @cfg {String} Опции для контрола "Быстрый доступ к фильтру (SBIS3.CONTROLS.FastDataFilter)"  в виде набора данных,
             * переданных через теги <opt></opt>, <opts></opts>
             */
            fastDataFilterConfig : '',
            /**
             * @cfg {String} Опции для контрола "Кнопка фильтров (SBIS3.CONTROLS.FilterButton) " в виде набора данных,
             * переданных через теги <opt></opt>, <opts></opts>
             */
            filterButtonConfig : ''
         }
      },

      $constructor: function () {
         $(window).on('resize', this._onWindowResize.bind(this));
      },

      init: function(){
         Browser.superclass.init.call(this);
         var self = this;
         if (this.hasChildControlByName('browserBreadCrumbs')){
            this.getChildControlByName('browserBreadCrumbs').subscribe('onDataLoad', function(event, dataSet){
               $('.controls-Browser__path', self._container).toggleClass('controls-Browser__path-not-empty', dataSet.getCount() !== 0);
            });
         }
         //$('.controls-Browser__backButtonArrow').on('click', this._onBackButtonArrowClick.bind(this));
         if (!this._hierMode) {
            this.getContainer().addClass('controls-Browser__hide-path');
         } else {
            this._calculatePathPosition();
            this._view.subscribe('onSetRoot', function(){
               self._calculatePathPosition();
            });
         }
      },

      _onWindowResize: function(){
         clearTimeout(this._resizeTimeout);
         var self = this;
         this._resizeTimeout = setTimeout(function(){
            self._calculatePathPosition();
         }, 100);
      },

      _calculatePathPosition: function(){
         var headerWidth = this._getHeaderWidth(),
            viewWidth = this.getContainer().width() - 20, //берем с запасом
            emptyHeaderWidth = viewWidth - headerWidth, 
            path = $('.controls-Browser__path', this.getContainer()),
            backButton = this._backButton.getContainer(),
            breadCrumbs = this._breadCrumbs.getContainer();
         //Если заголовки занимают меньше 1/3 таблицы
         if (headerWidth <= (viewWidth / 3)) {
            this.getContainer().addClass('controls-Browser__in-head-path')
            path.width(emptyHeaderWidth);
            //Установим ширину контейнера для хлебных крошек
            breadCrumbs.width(Math.floor(emptyHeaderWidth - backButton.outerWidth(true)));
         }

         //Если заголовки занимают больше 1/3 таблицы или их нет то путь должен быть над таблицей
         var isAboveHeadPath = headerWidth > (viewWidth / 3) || headerWidth == 0;
         if (isAboveHeadPath){
            this.getContainer().removeClass('controls-Browser__in-head-path');
         }
         
         //Нужно ограничить размеры хлебных крошек и кнопки назад если они в одну строку
         var halfWidth = emptyHeaderWidth / 2;
         //Если кнопка назад больше половины отведенного места
         if (backButton.width() > halfWidth){
            //И хлебные крошки больше половины отведенного метса, выделяем им по 50%
            if (breadCrumbs.width() > halfWidth){
               backButton.width(halfWidth);
               breadCrumbs.width(halfWidth);
            } else {
               //Если хлебные крошки меньше половины отведенного места
               backButton.width(emptyHeaderWidth - breadCrumbs.width());
            }
         } else {
            //Если кнопка назад меньше половины отведенного места
            breadCrumbs.width(emptyHeaderWidth - backButton.width());
         }
         
         var headerHeight = $('thead' ,this._view.getContainer()).height();
         if (headerHeight > 24){
            //Если высота заголовков больше 24px и путь должен быть над таблицей 
            //то кнопка назад должна быть внутри первого заголовка
            if (isAboveHeadPath){
               this.getContainer().addClass('controls-Browser__two-rows-path');
               // Выровняем кнопку назад по середине заголовков
               backButton.css('top', Math.round(headerHeight / 2 - backButton.height() / 2 + path.height()));
            } else {
               // Выровняем кнопку назад и хлебные крошки по середине заголовков
               path.css('top', Math.round(headerHeight / 2 - path.height() / 2));
            }
         } 
      },

      _getHeaderWidth: function(){
         var header = $('thead' ,this._view.getContainer()),
            th = $('.controls-DataGridView__th', header),
            width = 0;
            th.each(function(){
               if ($('.controls-DataGridView__th-content', this).html()) {
                  width += $(this).width();
               }
            })
         return (width);
      },

      _onBackButtonArrowClick: function(){
         if (this._view.getCurrentRoot){
            this._view._activateItem(this._view.getCurrentRoot());
         }
      },

      addItem: function(addMetaData) {
         var filter = this._mergeFilter(addMetaData) || {};
         if (filter['ВызовИзБраузера'] === undefined) {
            filter['ВызовИзБраузера'] = true;
         }
         var metaData = {
               id : null,
               item: null,
               filter : filter
            };
         $ws.core.merge(addMetaData, metaData);
         this._notify('onEdit', addMetaData);
      },

      _mergeFilter : function(addMetaData) {
         var
            baseFilter = $ws.core.clone(this._view.getFilter());
         if (this._hierMode) {
            var hierField = this._view.getHierField();
            baseFilter[hierField] = this._view.getCurrentRoot();
            baseFilter[hierField + '@'] = (typeof addMetaData.itemType !== 'undefined') ? addMetaData.itemType : null;
         }
         return baseFilter;
      },

      _notifyOnEditByActivate : function(itemMeta){
         if (this._hierMode) {
            itemMeta.itemType =  itemMeta.item.get(itemMeta.hierField + '@');
         }
         this._notify('onEdit', itemMeta);
      }
   });

   return Browser;
});