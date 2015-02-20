/**
 * Created by ad.Chistyakova on 14.07.14.
 */
define('js!SBIS3.CORE.FilterView', ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.FieldLink', 'html!SBIS3.CORE.FilterView',
   'js!SBIS3.CORE.FilterFloatArea', 'css!SBIS3.CORE.FilterView'],
function( Control, FieldLink, mainTplFn, filterFloatArea ) {

   'use strict';
   var TEXT_WIDTH_REDUCER = 160;
   /**
    * Фильтр с набираемыми параметрами
    *
    * @class $ws.proto.FilterView
    * @extends $ws.proto.DataBoundControl
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FilterView'></component>
    * @category Decorate
    * @ignoreOptions width
    */
   $ws.proto.FilterView = Control.DataBoundControl.extend(/** @lends $ws.proto.FilterView.prototype */{
      /**
       * @event onClickLink При клике на ссылке выбора новых фильтров
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * При клике на ссылку добавить фильтр
       * <pre>
       *    filterView.subscribe('onClickLink', function(eventObject, filterName, currentText {
       *       this.addFilter({
       *          title: 'Регион'
       *          value: 'Москва'
       *       });
       *    });
       * </pre>
       * @see filters
       * @see addFilter
       */
      /**
       * @event onVisualizeFilter При отрисовке фильтра
       * Событие происходит при установке значения фильтра. Здесь можно изменить только внешнее текстовое отображение
       * Никакого влияния на фильтр не происходит. Речь идет о текстовых фильтрах, а не полях связи.
       * У полей связи можно самомстоятельно сразу передать в опциях обработчика onVisualizeLink
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} filterName Имя фильтра, значение которого изменилось.
       * @param {String} currentValue Текущее текстовое значение фильтра
       * @example
       * Если в фильтр пришло значение "Москва", поменяем его на более красивое и развернутое
       * <pre>
       *    filterView.subscribe('onVisualizeFilter', function(eventObject, filterName, currentValue) {
       *       if (filterName === 'Регион') {
       *             eventObject.setResult('Москва - столица нашей Родины!')
       *       };
       *
       *    });
       * </pre>
       * @see filters
       */
      /**
       * @event onAddNewControl При добавлении пользорвательского или платформенного контрола в набор фильтров.
       * Например поля связи, строки и тп.
       * Событие происходит при создании контрола. Используется в кнопке фильтров {$ws.proto.FilterButton}
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.FieldLink} filedLink Созданное поле связи.
       * @example
       * При добавлении поля связи, поставим в него значение
       * <pre>
       *    filterView.subscribe('onAddNewControl', function(eventObject, control) {
       *       control.setValue(42);
       *    });
       * </pre>
       */
      /**
       * @event onBeforeShow Перед показом контрола
       * Событие происходит при открытии всплывающей панели из кнопки фильтров {$ws.proto.FilterButton}
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * При добавлении поля связи, поставим в него значение
       * <pre>
       *    filterView.subscribe('onBeforeShow', function(eventObject, control) {
       *       control.setValue(42);
       *    });
       * </pre>
       */
      /**
       * @event onChangeFilters При добавлении\удалении фильтров или контроллов из набора фильтров.
       * Например поля связи, строки и тп.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} query Текущий набор фильтров.
       * @example
       * При добавлении поля связи, поставим в него значение
       * <pre>
       *    filterView.subscribe('onChangeFilters', function(eventObject, query) {
       *    //Если в фильтре нет Описания, добавим его спецаильно
       *       if (!query.hasOwnProperty('Описание') {
       *          this.addFilter({
       *             title:'Описание',
       *             value: 'Не удаляемый'
       *          });
       *       }
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {{}} Текстовые значения ссылки для выбора из окна набираемых фильтров
             * Два возможных текстовых значения ссылки для выбора из окна набираемых фильтров
             * emptyFilterText - Строковое значение ссылки при пустом наборе фильтров
             * filledFilterText - Строковое значение ссылки при наличии хотя бы одного фильтра
             */
            linkText: {
               emptyFilterText : 'Все записи...',
               filledFilterText: 'другие параметры...'
            },
            /**
             * @cfg {Array} Массив фильтров (массив объектов)
             * see @addFilter
             * Обызательные значения:
             * title - Имя фильтра
             * value - значение фильтра
             * Необязательные:
             * config - полная конфигурация поля связи
             * textValue(актуально только для простых фильтров) - текстовое отображение фильтра
             * toolTipText - подсказка при наведении
             */
            filters: []
         },
         _userControls: {},
         _hasFilters : false,
         _allFilters: {},
         _$link: undefined,
         _$table: undefined
      },
      _dotTplFn: mainTplFn,
      $constructor: function(){
         var self = this,
             parentFloatArea;
         this._publish('onClickLink', 'onVisualizeFilter', 'onBeforeShow', 'onAddNewControl', 'onChangeFilters');
         this._$link = this._container.find('.ws-FilterView__link span');
         this._$table = this._container.find('.ws-FilterView__table');
         this._$link.bind('click', function(event){
            var result;
            event.stopImmediatePropagation();
            result = self._notify('onClickLink');
         });
         parentFloatArea = this.getParentByClass($ws.proto.FilterFloatArea);
         if (parentFloatArea) {
            parentFloatArea.subscribe('onBeforeShow', this._onBeforeShowPanel.bind(this));
            parentFloatArea.subscribe('onBeforeClose', this._onBeforeClosePanel.bind(this));
         }
         this.setFiltersData(this._options.filters);
      },
      _onBeforeShowPanel: function(){
         this._notify('onBeforeShow');
      },
      _onBeforeClosePanel: function(){
      },
      _setValueToTextContainer: function(tr, filterPoint, index){
         var checkValue = this._checkValue(filterPoint.value),
             text = filterPoint.textValue ? filterPoint.textValue : (checkValue !== undefined ? checkValue + '' : filterPoint.title),
             result = this._notify('onVisualizeFilter', filterPoint.title, text),
             delContainer = $('<td><div class="icon-16 icon-Erase icon-error action-hover ws-invisible"></div></td>'),
             $delDiv = delContainer.find('div'),
             toolTipText = filterPoint.toolTipText,
             self = this,
             span;
         if (result && (typeof result === 'string')) {
            //сразу запоминаем в textValue новый результат из обработчика на визуализацию
            text = filterPoint.textValue = result;
         }

         tr.append($('<td><div class="ws_FilterView__rowText"><span>' + text + '</span></div></td>')).append(delContainer);
         span = $(tr.find('span'));
         //Да, плохо, но по-другому не придумала.
         span.css('max-width', this.getContainer().width() - TEXT_WIDTH_REDUCER);
         self._setToolTip(span, toolTipText);
         $delDiv.bind('click',function(event){
            self.deleteFilter(filterPoint.title);
         });
         tr.bind({
            mouseenter: function(e) {
               $delDiv.removeClass('ws-invisible');
            },
            mouseleave: function(e) {
               $delDiv.addClass('ws-invisible');
            }
         });
         this._notifyOnSizeChanged();
         return text;
      },
      /**
       * @param elem Элемент, у которого ставим подсказку
       * @param text Текст подсказки
       * @private
       */
      _setToolTip: function(elem, text) {
        if(elem.length) {
           if(text) {
              elem.attr('title', text);
           }
           else  {
              elem.removeAttr('title');
           }
        }
      },
      _checkValue : function(value) {
         // 0 и false должны остаться в фильтре
         return (!value && value !== 0 && value !== false) ? undefined : value;
      },
      /**
       * Установить набор фильтров
       * @param {Array} filters - массив с настройками фильтров
       * @see addFilter
       */
      setFiltersData: function(filters){
         if (this._hasFilters) {
            this.dropFilters();
         }
         for (var i = 0, len = filters.length; i < len; i++) {
            this.addFilter(filters[i]);
            this._allFilters[filters[i]] = undefined;
         }
      },
      /**
       * Возвращает набор фильтров
       * @return {Array} массив с настройками фильтров
       */
      getFiltersData: function() {
         var filters = [];
         for (var i = 0, l = this._options.filters.length; i < l; i++) {
            filters.push($ws.core.merge({}, this._options.filters[i]));
         }
         return filters;
      },
      /**
       * Добавить фильтр в набор. Если такой фильтр уже есть, добавления не будет
       * @param {Object} filter - конфигурация фильтра
       * title - обазятельное название фильтра
       * config - настройка для контрола, если в качестве фильтра нужно установить name поля связи
       * и title должны совпадать
       * value - текстовое значение фильтра (не относится к полю связи)
       * toolTipText - необязательный параметр, текстовое значение подсказки
       * textValue - текстовое отображение фильтра. Если был фильтр {'Период': '0'}, то
       * Если обычный фильтр ожидается (title + value), если поле связи, то (title + config)
       * @example
       * Добавляем фильтр Период со значением 0 и текстовым отображением "Весь период"
       * <pre>
       *    filterView.addFilter({
       *       title: 'Период',
       *       value: 0,
       *       textValue: 'Весь период'
       *    })
       * </pre>
       * @example
       * Добавляем контрол Строка(FieldString) в набор фильтров
       * <pre>
       *   var cfg = {
       *     'title': 'Строка',
       *     'config': [ //массив, 1ый элемент - Имя контрола\компонента, 2ой - настройка, конфигурация, опции (_options)
       *        'js!SBIS3.CORE.FieldString', {
       *           'name':  'Строка',
       *           'title': 'Строка',
       *           'element': $('<div class="fl-user"></div>')
       *           'toolTipText': 'Подсказка'
       *     }]
       *  };
       * filterView.addFilter(cfg);
       * </pre>
       */
      addFilter: function(filter){
         var tr = $('<tr class="ws-FilterView__row"></tr>'),
             index = this._findIndexByFilterName(filter.title),
             self = this,
             control,
             cfg;
         if (index >= 0 || !filter.hasOwnProperty('title')) {
            //такой фильтр уже есть, не добавляем
            return;
         }
         this._allFilters[filter.title] = undefined;
         this._options.filters.push(filter);
         cfg = filter.config;
         if (cfg && cfg instanceof Array) {
            this.getLinkedContext().setValue(filter.title, null);
            $ws.require(cfg[0]).addCallbacks(function (arr) {
               var config = cfg[1];
               //Витя Тюрин утверждает, что у контрола должен быть первый parent, который встретится
               // self.getParentByClass($ws.proto.FilterFloatArea) надеюсь моя логика не сломается
               config.parent = self.getParent();
               config.element = config.element || $('<div class="ws-FilterView__userControl"></div>');
               control = new arr[0](config);
               tr.html(control.getContainer().wrap('<td colspan="2">').parent()).addClass('ws-FilterView__userControl');
               control.getContainer().width( self._container.width());
               self._userControls[filter.title] = control;
               self._notify('onAddNewControl', control);
               self._notify('onChange');
               self._notifyOnChangeFilters();
               self._notifyOnSizeChanged();
            },function (e){
               $ws.single.ioc.resolve('ILogger').log('Ошибка при загрузке модуля '+ cfg[0]+ ': ' + e.message);
            });
         } else {
            this._notify('onChange');
            this._notifyOnChangeFilters();
            this._setValueToTextContainer(tr, filter, this._options.filters.length - 1);
         }
         this._$table.append(tr);
         this._notifyOnSizeChanged();
         this._hasFilters = true;
         this._changeLinkView();
      },
      _notifyOnChangeFilters: function(){
         this._notify('onChangeFilters', this.getQuery());
      },
      /**
       * Изменить значение установленного текстового(!) фильтра
       * @param {String} filterName - имя фильтра, который необходимо удалить
       * @param {Object} newFilter - {title, value, textValue, toolTipText} - настройка фильтра, как будто устанавливаем заново @see #addFilter
       */
      changeSimpleFilter: function(filterName, newFilter){
         var index = this._findIndexByFilterName(filterName);
         if (index >= 0 ) {
            this._options.filters[index] = newFilter;
            this.setTextValueForFilter(filterName, newFilter.textValue || newFilter.value, newFilter.toolTipText);
            this._notifyOnSizeChanged();
         }
      },
      /**
       * Удалить указанный фильтр по имени
       * @param {String} filterName - имя фильтра, который необходимо удалить
       */
      deleteFilter: function(filterName){
         var index = this._findIndexByFilterName(filterName),
             arr = [],
             filters = this._options.filters,
             control;
         if (index >= 0) {
            for (var i = 0, len = filters.length; i < len; i++) {
               if (i !== index) {
                  arr.push(filters[i]);
               } else {
                  control = this._userControls[filters[i].title];
                  if (filters[i].hasOwnProperty('config') && control) {
                     if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldLink')) {
                        control.getLinkedContext().removeValue(control.getName());
                        control.dropAllLinks();
                     }
                     control.destroy();
                  }
               }
            }
            $(this._$table.find('tr')[index]).remove();
            this._options.filters = arr;
            this._notifyOnSizeChanged();
            if (!this._options.filters.length){
               this._hasFilters = false;
               this._changeLinkView();
            }
            this._notifyOnChangeFilters();
         }
      },
      /**
       * Удаляет абсолютно все фильтры в контроле
       */
      dropFilters: function(){
         if (this._options.filters.length) {
            this._removeUserControlsFilters(false, true);
            this._options.filters = [];
            this._$table.empty();
            this._hasFilters = false;
            this._changeLinkView();
            this._notifyOnSizeChanged();
            this._notifyOnChangeFilters();
         }
      },
      _removeUserControlsFilters: function(removeTR, removeNotEmpty){
         var  trs = this._$table.find('tr'),
              arr = [],
              control,
              filter;

         for (var i = 0, len = this._options.filters.length; i < len; i++) {
            filter = this._options.filters[i];
            if (filter.config){
               control = this._userControls[filter.title];
               if  (control && (removeNotEmpty || !control.getValue())) {
                  //Стремный хак для ситуации пришедшего value из RequestHistory.  успевает отработать forceRemoveEmptyValues, а это плохо
                  if (filter.value) {
                     filter.value = undefined;
                     arr.push(filter);
                     continue;
                  }
                  if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldLink')) {
                     //Если фильтр удаляют, он больше никому не должен мешать своими значениями в контексте, нагло перебиваем контекст
                     control._context = new $ws.proto.Context();
//                     control.getLinkedContext().removeValue(control.getName());
                     control.dropAllLinks();
                  }
                  if (control) {
                     control.destroy();
                  }
                  delete this._userControls[filter.title];
                  if (removeTR) {
                     $(trs[i]).remove();
                  }
                  continue;
               }
            }
            arr.push(filter);
         }
         this._options.filters = arr;
      },
      /**
       * Удаляет неустановленные фильтры (пустые поля связи)
       */
      forceRemoveEmptyFilters: function(){
         this._removeUserControlsFilters(true, false);
         if (!this._options.filters.length){
            this._hasFilters = false;
            this._changeLinkView();
         }
         this._notifyOnSizeChanged();
         this._notifyOnChangeFilters();
      },
      _findIndexByFilterName: function(filterName){
         var filters = this._options.filters;
         for (var i = 0, len = filters.length; i < len; i++ ) {
            if (filters[i].title === filterName) {
               return i;
            }
         }
         return -1;
      },
      /**
       * Получить текущий набор фильтров
       * @param [withoutUserControls] учитывать значения добавленных контролов (поля связи, строки и тп)
       * @returns {{}}
       */
      getQuery: function(withoutUserControls){
         var filters = this._options.filters,
             title,
             query = {};
         for (var i = 0, len = filters.length; i < len; i++ ) {
            title = filters[i].title;
            if (this._userControls[title] && !withoutUserControls ) {
               query[title] = this._userControls[title].getValue();
            } else {
               if (filters[i].hasOwnProperty('value')) {
                  query[title] = filters[i].value;
               }
            }
         }
         return query;
      },
      /**
       * Получить значение контрола, возвращает значения фильтров без учета фильтров полей связи
       * @returns {Object} набор фильтров
       */
      getValue: function(){
         return this.getQuery(true);
      },
      setValue: function() {
      },
      _changeLinkView: function(){
         this._$link.toggleClass('ws-standartLink', this._hasFilters);
         this._$link.text(this._hasFilters ? this._options.linkText.filledFilterText : this._options.linkText.emptyFilterText);
      },
      /**
       * Установить текстовые значения для ссылки (нажатие на которую вызывает обработчик onClickLink)
       * @param {String} emptyFilterText - текст ссылки, когда фильтров в контроле нет
       * @param {String} filledFilterText - текст ссылки, когда в фильтре есть набранные фильтры
       */
      setLinkTexts: function(emptyFilterText, filledFilterText) {
         this._options.linkText = {
            'emptyFilterText' :  emptyFilterText ||  this._options.linkText.emptyFilterText,
            'filledFilterText' : filledFilterText || this._options.linkText.filledFilterText
         };
         this._changeLinkView();
      },
      /**
       * Возвращает набор названий всех фильтров, которые использовались в этом контроле. Не путать с историей выбора
       */
      getFiltersHistory: function(){
         return this._allFilters;
      },
      /**
       * Получить текущий набор текстовых начений ссылки
       * @returns {Object}
       * @see linkText
       */
      getLinkText: function() {
         return this._options.linkText;
      },
      /**
       * Установка\Смена текстового значения простого фильтра
       * @param filterName - имя фильтра
       * @param textValue - новое текстовое значение
       * @param toolTipText - всплывающая подсказка
       */
      setTextValueForFilter: function(filterName, textValue, toolTipText){
         var index = this._findIndexByFilterName(filterName),
             span;
         if (textValue && (index >=0) && !this._options.filters[index].config) {
            span = $(this.getContainer().find('.ws-FilterView__row')[index]).find('span').text(textValue);
            this._setToolTip(span, toolTipText);
            this._options.filters[index].textValue = textValue;
         }
      },
      /**
       * Получить объект с текстовыми значениями всех фильтров
       * @param {boolean} withUserControls - учитывать фильтры пользовательских контроллов или нет
       * @return {Object} объект вида {'название фильтра' : 'Текстовое значение фильтра', ...}
       */
      getQueryWithTextValues: function(withUserControls){
         var result = {},
             filter;
         for (var i = 0, len = this._options.filters.length; i < len; i++) {
            filter = this._options.filters[i];
            if (!filter.config) {
               result[filter.title] = filter.textValue || filter.value;
            } else if (withUserControls){
               result[filter.title] = this._userControls[filter.title].getStringValue();
            }
         }
         return result;
      },
      /**
       * Получить строку текстовых значений "простых" фильтров (не контроллов)
       * @returns {String} строка текущих текстовых фильтров
       */
      getTextValues: function(){
         var arr = [],
             filter;
         for (var i = 0, len = this._options.filters.length; i < len; i++) {
            filter = this._options.filters[i];
            if (!filter.config) {
               arr.push(filter.textValue || filter.value);
            }
         }
         return arr.join(', ');
      }
   });

   return $ws.proto.FilterView;
});