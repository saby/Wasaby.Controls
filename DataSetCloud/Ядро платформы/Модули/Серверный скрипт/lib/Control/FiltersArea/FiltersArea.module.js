/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 9:51
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FiltersArea", ["js!SBIS3.CORE.TemplatedAreaAbstract"], function( TemplatedAreaAbstract ) {

   "use strict";

   /**
    * Область фильтров
    *
    * @class $ws.proto.FiltersArea
    * @extends $ws.proto.TemplatedAreaAbstract
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FiltersArea' style='width: 100px; height: 100px;'></component>
    */
   $ws.proto.FiltersArea = TemplatedAreaAbstract.extend(/** @lends $ws.proto.FiltersArea.prototype */{
      /**
       * @event onBeforeApplyFilter Перед применением фильтров в браузер
       * Реагирует на код возврата. Если false - фильтры не применяются, если Object - рассматриваются как новые фильтры.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} Текущие фильтры.
       * @example
       * При готовности табличного представления (tableView) связать его с областью фильтров (filtersArea).
       * <pre>
       *    //подписываем область фильтров на событие перед применением фильтров
       *    filtersArea.subscribe('onBeforeApplyFilter', function() {
       *       this.setLinkedBrowsers('Табличное представление');
       *    });
       * </pre>
       */
      $protected: {
         _width: '',
         _height: '',
         _horizontalAlignment: 'Left',
         _options: {
            /**
             * @cfg {Array} Массив идентификаторов браузеров
             * <wiTag group="Данные">
             * В данной опции указывается массив идентификаторов браузеров, связанных с данной областью фильтров.
             * @see setLinkedBrowsers
             * @see getLinkedBrowsers
             */
            linkedBrowsers : []
         },
         _defaults: {},
         _defaultsIsReady: false,
         _onFiltersChangeHandler: null
      },
      $constructor : function() {
         var
               self = this;

         this._publish('onBeforeApplyFilter');

         this._onFiltersChangeHandler = function(eventObject, filter){
            self._filterChange(filter);
         };

         $ws.single.CommandDispatcher.declareCommand(this, 'applyFilter', this.applyFilter);
         $ws.single.CommandDispatcher.declareCommand(this, 'resetFilter', this.resetFilter);

         self._saveFiltersFromLinkedBrowsers();
      },
      _restoreSize: function() {
         this._container.css({ width: '', height: '' });
      },
      /**
       * <wiTag group="Данные">
       * Получить связанные с областью фильтров браузеры.
       * @returns {Array} Массив связанных браузеров.
       * @example
       * <pre>
       *     filtersArea.getLinkedBrowsers()[0].sendCommand('applyFilter');
       * </pre>
       * @see linkedBrowsers
       * @see setLinkedBrowsers
       */
      getLinkedBrowsers: function(){
         var browsers = [];
         for(var i in this._options.linkedBrowsers) {
            if(this._options.linkedBrowsers.hasOwnProperty(i))
               browsers.push($ws.single.ControlStorage.getWithParentName(this._options.linkedBrowsers[i]));
         }
         return browsers;
      },
      /**
       * <wiTag group="Управление">
       * Установить связанные с областью фильтров браузеры.
       * @param {Array} browsers Массив связанных браузеров.
       * @example
       * При готовности табличного представления (tableView) связать его с областью фильтров (filtersArea).
       * <pre>
       *    filtersArea.subscribe('onBeforeApplyFilter', function() {
       *       //привязываем к области фильтров табличное представление
       *       this.setLinkedBrowsers('Табличное представление');
       *    });
       * </pre>
       * @see linkedBrowsers
       * @see getLinkedBrowsers
       */
      setLinkedBrowsers: function(browsers){
         var self = this;
         if(!(browsers instanceof Array))
            browsers = [browsers];
         this._options.linkedBrowsers = browsers;
         if(self._defaultsIsReady)
            self._saveFiltersFromLinkedBrowsers();
         else{
            this.subscribe('onReady', function(){
               self._saveFiltersFromLinkedBrowsers();
            });
         }
      },
      _saveFiltersFromLinkedBrowsers: function(){
         var allFilters = {};
         var pD = new $ws.proto.ParallelDeferred();
         var self = this;
         for(var i in self._options.linkedBrowsers){
            if(self._options.linkedBrowsers.hasOwnProperty(i)) {
               pD.push($ws.single.ControlStorage.waitWithParentName(self._options.linkedBrowsers[i]).addCallback(
                  function(browser){
                     browser.subscribe("onFilterChange", self._onFiltersChangeHandler);
                     var filter = browser.getQuery();
                     for(var i in filter){
                        if(filter.hasOwnProperty(i)) {
                           if(filter[i] && filter[i].fieldName)
                              filter[i] = browser.getLinkedContext().getValue(filter[i].fieldName);
                        }
                     }
                     allFilters = $ws.core.merge(allFilters, filter);
                     return browser;
                  }));
            }
         }
         pD.done(allFilters).getResult().addCallback(function(f){
            self._setFieldsByFilter(f);
            self._defaultsIsReady = true;

            if (self._options.template) {
               self._loadTemplate();
            }
         });
      },
      /**
       *
       * @param filter
       */
      _filterChange : function(filter){
         if(!this._defaultsIsReady)
            this._defaults = $ws.core.merge(this._defaults, filter);
         this._setFieldsByFilter(filter);
      },
      /**
       * <wiTag group="Управление">
       * Применить фильтр.
       * Применяет фильтр к связанным с этой областью браузерам, предварительно найдя его.
       * @command
       * @example
       * Применить фильтр по клику на кнопку applyButton:
       * <pre>
       *     applyButton.subscribe('onActivated', function(){
       *        //вызываем метод applyFilter
       *        filtersArea.applyFilter({
       *           "Группа": "Семья"
       *        });
       *     })
       * </pre>
       */
      applyFilter: function(userFilter){
         var filter = userFilter && Object.prototype.toString.call(userFilter) == "[object Object]" ? userFilter : this._fillFilter();
         var applyFilter = this._notify("onBeforeApplyFilter", filter);
         if(applyFilter && applyFilter instanceof Object)
            filter = applyFilter;
         if(applyFilter !== false){
            var browsers = this.getLinkedBrowsers();
            for(var i = 0, l = browsers.length; i < l; i++) {
               browsers[i].setQuery(filter);
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Сбросить значение фильтра в начальное (дефолтное).
       * @command
       * @example
       * Сбросить фильтр по клику на кнопку resetButton:
       * <pre>
       *     resetButton.subscribe('onActivated', function(){
       *        //вызываем метод resetFilter
       *        filtersArea.resetFilter();
       *     })
       * </pre>
       */
      resetFilter: function(){
         var browsers = this.getLinkedBrowsers();
         for(var i = 0, l = browsers.length; i < l; i++) {
            browsers[i].resetFilter();
         }
      },
      _setContextByFilter: function(filter){
         var context = this.getLinkedContext();
         for(var i in filter){
            if(filter.hasOwnProperty(i)){
               context.setValue(i, filter[i]);
            }
         }
      },
      /**
       * Выставляет значения полей на области фильтров в соответствии с переданным набором значений
       * @param {Object} filter Параметры Фильтрации
       */
      _setFieldsByFilter: function(filter){
         var allChildControls = this.getChildControls(true),
             control,
             filterValue,
             controlName;
         for(var j in allChildControls){
            if(allChildControls.hasOwnProperty(j)) {
               control = allChildControls[j];
               controlName = control.getName();
               filterValue = filter[controlName];
               if(filterValue !== undefined) {
                  if(controlName && control.setValue && control.getValue() != filterValue){
                     var value;
                     if($ws.proto.FieldDate && control instanceof $ws.proto.FieldDate && !(filterValue instanceof Date)){
                        value = Date.fromSQL(filterValue + "");
                     }
                     else if($ws.proto.FieldRadio && control instanceof $ws.proto.FieldRadio){
                        value = control.getDefaultValue().clone();
                        value.set(filterValue);
                     }
                     else{
                        value = filterValue;
                     }
                     control.setValue(value);
                  }
               }
            }
         }
         this._setContextByFilter(filter);
      },
      /**
       * Возвращает текущий набор параметров фильтрации путем обхода элементов управленяи на области
       * @returns {Object} Фильтр
       */
      _fillFilter: function(){
         var
               allChildControl = this.getChildControls(true),
               control, filter = {};

         for(var j in allChildControl){
            if(allChildControl.hasOwnProperty(j)) {
               control = allChildControl[j];
               if(control.getName && control.getValue) {
                  var fVal = control.getValue();
                  if(fVal !== undefined && fVal !== '')
                     filter[control.getName()] = fVal;
               }
            }
         }

         return filter;
      },
      destroy: function() {
         var self = this;
         for(var i in self._options.linkedBrowsers){
            if(self._options.linkedBrowsers.hasOwnProperty(i)) {
               $ws.single.ControlStorage.waitWithParentName(self._options.linkedBrowsers[i]).addCallback(function(browser){
                  browser.unsubscribe("onFilterChange", self._onFiltersChangeHandler);
                  return browser;
               });
            }
         }
         $ws.proto.FiltersArea.superclass.destroy.apply(self, arguments);
      }
   });

   return $ws.proto.FiltersArea;

});