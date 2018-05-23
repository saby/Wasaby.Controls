/**
 * Created by as.avramenko on 09.08.2016.
 */

define('SBIS3.CONTROLS/Filter/FilterPanel', [
   'Core/core-clone',
   'Core/CommandDispatcher',
   'SBIS3.CONTROLS/CompoundControl',
   'SBIS3.CONTROLS/Mixins/Expandable',
   'WS.Data/Collection/RecordSet',
   'SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/FilterPanel',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/resources/FilterPanelContent',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/resources/FilterPanelItemContentTemplate',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/resources/TemplateChooser',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/resources/TemplateDataRange',
   'SBIS3.CONTROLS/Filter/Panel/components/PanelItem',
   'SBIS3.CONTROLS/Link',
   'SBIS3.CONTROLS/Accordion',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/DetailsList',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/List',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/FavoritesList',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup',
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink',
   'SBIS3.CONTROLS/Filter/Panel/components/DataRange',
   'SBIS3.CONTROLS/Filter/Panel/components/Boolean',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!SBIS3.CONTROLS/Filter/Panel/resources/FilterPanelButton',
   'SBIS3.CONTROLS/ScrollContainer',
   'css!SBIS3.CONTROLS/Filter/Panel/FilterPanel'
], function(coreClone, CommandDispatcher, CompoundControl, Expandable, RecordSet, FilterToStringUtil, dotTplFn, contentTpl, FilterPanelItemContentTemplate) {

   'use strict';
   /**
    * Класс компонента "Панель фильтра с набираемыми параметрами". Реализован по <a href='http://axure.tensor.ru/standarts/v7/%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C_%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%B0_%D1%81_%D0%BD%D0%B0%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%D1%8B%D0%BC%D0%B8_%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%BC%D0%B8.html'>этому стандарту</a>.
    *
    * <br/>
    *
    * <h2>Разметка компонента</h2>
    *
    * Разметку компонента создают только в TMPL-файлах с использованием <a href='/doc/platform/developmentapl/interface-development/component-infrastructure/logicless-template/'>logicless-шаблонизатора</a>.
    *
    * <br/>
    *
    * <h2>Кнопки панели фильтров</h2>
    *
    * <br/>
    *
    * <h3>Кнопка открытия панели</h3>
    *
    * Создание и размещение кнопки открытия панели фильтрации производится самостоятельно. Для этого существуют css-модификаторы компонента {@link SBIS3.CONTROLS/Button/IconButton}.
    * Стили модификаторов описаны в "css!SBIS3.CONTROLS/Filter/Panel/resources/FilterPanelButton".
    * В зависимости от направления, в котором будет открыта панель (см. {@link filterAlign}), на кнопку открытию устанавливают классы "controls-IconButton__filter-left" (открытие панели влево) или "controls-IconButton__filter-right" (открытие панели вправо).
    * Чтобы открыть панель, используйте метод {@link toggleExpanded}.
    *
    * <br/>
    *
    * <h3>Кнопка "Сбросить фильтр"</h3>
    *
    * По умолчанию присутствует в шаблоне компонента. В опции {@link Lib/Control/Control#name name} для неё предустановлено имя "ResetFilterButton". При клике по кнопке выполняется команда {@link resetFilter}.
    * Из пользовательского интерфейса кнопка доступна для взаимодействия, когда в опции {@link items} установлена структура полей фильтра.
    *
    * <br/>
    *
    * <h3>Кнопка "Скрыть панель"</h3>
    *
    * По умолчанию присутствует в шаблоне компонента "Панель фильтрации". При клике по кнопке выполняется команда {@link toggleFilter}.
    *
    * <br/>
    *
    * <h2>Конфигурация фильтров</h2>
    *
    * Структуру полей фильтра устанавливают в опции {@link items}.
    *
    * @author Авраменко А.С.
    * @class SBIS3.CONTROLS/Filter/FilterPanel
    * @public
    * @extends SBIS3.CONTROLS/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/Expandable
    *
    * @demo Examples/FilterPanel/FilterPanelSimple/FilterPanelSimple Чтобы получить доступ к исходного коду компонента, скачайте архив демо-примера.
    */
   var
      ITEM_FILTER_ID          = 'id',
      ITEM_FILTER_VALUE       = 'value',
      ITEM_FILTER_TEXT_VALUE  = 'textValue',
      ITEM_FILTER_RESET_VALUE = 'resetValue',

      FilterPanel = CompoundControl.extend([Expandable], /** @lends SBIS3.CONTROLS/Filter/FilterPanel.prototype */ {
      /**
       * @event onFilterReset Происходит при сбросе фильтра.
       * @remark
       * Значения фильтров будут установлены в resetValue.
       * @param {Object} filter Фильтр.
       */
      /**
       * @event onFilterChange Происходит при изменении фильтра.
       * @param {Object} filter Фильтр.
       */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            expandedClassName: 'controls-FilterPanel_expanded',
            collapsedClassName: 'controls-FilterPanel_collapsed',
            /**
             * @typedef {Object} FilterPanelItem
             * @property {String|Number} id Идентификатор редактора. Является полем фильтрации, в которое будут записаны выбранные значения редактора (см. *value* и *resetValue*). Опция обязательна для конфигурации.
             * @property {String} caption Заголовок редактора. Опция обязательна для конфигурации.
             * @property {Boolean} expanded Признак, что редактор раскрыт. Когда *expanded=true*, то при открытии Панели фильтров редактор будет раскрытым. Опция обязательна для конфигурации.
             * @property {Array|Boolean|*} value Выбранное значение редактора, которое будет записано в поле фильтрации (см. *id*). Опция обязательна для конфигурации.
             * Используйте опцию, чтобы предустановить выбранные значения редактора при открытии панели фильтрации.
             * @property {*} resetValue Значение редактора, которое будет установлено при сбросе фильтра. Опция обязательна для конфигурации.
             * @property {String} textValue Текстовое значение, используемое для отображения в строке выбранных фильтров, когда для редактора используются значения из *resetValue* и *value* (предустановленное). Опция обязательна для конфигурации.
             * @property {String} template Шаблон редактора. Опция обязательна для конфигурации.
             * Возможные значения:
             * <ol>
             *    <li><b>tmpl!SBIS3.CONTROLS/Filter/Panel/resources/TemplateChooser</b><br/>Шаблон, реализующий выборку идентификаторов. Подробнее о редакторе вы можете прочитать {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/Base}.</li>
             *    <li><b>tmpl!SBIS3.CONTROLS/Filter/Panel/resources/TemplateDataRange</b><br/>Шаблон, реализующий выборку из числового диапазона. Подробнее о редакторе вы можете прочитать {@link SBIS3.CONTROLS/Filter/Panel/components/DataRange}.</li>
             *    <li><b>SBIS3.CONTROLS/Filter/Panel/components/Boolean</b> - обыкновенный чекбокс {@link SBIS3.CONTROLS/Filter/Panel/components/Boolean}. Данный редактор поля фильтрации отображается без спойлера (см. {@link SBIS3.CONTROLS/Spoiler}), в связи с чем рекомендуется размещать его в конце списка доступных фильтров.</li>
             * </ol>
             * @property {Object} properties Опции, передаваемые в конфигурацию редактора. Опция обязательна для конфигурации.
             * @property {String} properties.editor Тип редактора. Применяется при использовании шаблона редактора "tmpl!SBIS3.CONTROLS/Filter/Panel/resources/TemplateChooser". Когда опция не установлена, используется класс редактора "Список" (значение list). Опция обязательна для конфигурации.
             * Возможные значения:
             * <ul>
             *     <li>list - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/List}.</li>
             *     <li>dictionary - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList}.</li>
             *     <li>favorites - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/FavoritesList}.</li>
             *     <li>radio - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup}.</li>
             *     <li>fieldLink - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink}.</li>
             *     <li>details - использовать редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/DetailsList}.</li>
             * </ul>
             * @property {Object} properties.properties Объект, в который передают опции для конфигурации контрола {@link SBIS3.CONTROLS/FieldLink}, на основе которого создан редактор {@link SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink}. Опция обязательна для конфигурации.
             * Описание контрола и список его опций вы можете найти <a href='/docs/js/SBIS3/CONTROLS/FieldLink/'>здесь</a> и <a href='/doc/platform/developmentapl/interface-development/components/textbox/field-link/selector-action/'>здесь</a>.
             * @property {Object} properties.items Набор данных, по которому будет построен список значений. Актуально для редакторов типа "SBIS3.CONTROLS.FilterPanelChooser.*". Опция обязательна для конфигурации.
             */
            /**
             * @cfg {WS.Data/Collection/RecordSet|Array.<FilterPanelItem>} Устанавливает конфигурацию редакторов и структуру полей фильтра.
             * @remark
             * Когда значение опции установлено через {@link WS.Data/Collection/RecordSet}, то при изменении значения в любой из записей RecordSet'а изменяется соответствующее значение в контексте панели фильтрации.
             * @see setItems
             * @see getItems
             */
            items: null,
            /**
             * @cfg {String} Устанавливает направление открытия панели фильтрации.
             * @variant left Панель открывается влево.
             * @variant right Панель открывается вправо.
             */
            filterAlign: 'left',
            /**
             * @cfg {String} Устанавливает режим формирования результирующего фильтра (см. {@link filter}).
             * @remark
             * Структура полей фильтрации описывается в опции {@link items}.
             * @variant full Результирующий фильтр формируется из всех полей фильтрации.
             * @variant onlyChanges Результирующий фильтр формируется только из полей, для которых текущее значение (value) не равняется значению сброшенного фильтра (resetValue).
             */
            filterMode: 'onlyChanges',
            /**
             * @cfg {Object} Устанавливает результирующий фильтр, сформированный по структуре {@link items}.
             * @remark
             * Данная опция доступна только на чтение. Фильтр формируется исключительно через {@link items}.
             * @see getFilter
             */
            filter: {},
            /**
             * @cfg {String} Устанавливает текстовое описание фильтра.
             * @see getTextValue
             * @see setTextValue
             */
            textValue: ''
         },
         _filterRecordSet: null,
         _contentInitialized: false,
         _filterAccordion: null,
         _onFilterItemChangeFn: null
      },
      _modifyOptions: function() {
         var
            cfg = FilterPanel.superclass._modifyOptions.apply(this, arguments);
         cfg._contentTpl = contentTpl;
         cfg._accordionItemContentTpl = FilterPanelItemContentTemplate;
         return cfg;
      },
      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'resetFilter', this._resetFilter);
         CommandDispatcher.declareCommand(this, 'resetFilterField', this._resetFilterField);
         this._onFilterItemChangeFn = this._onFilterItemChange.bind(this);
         this._publish('onFilterChange', 'onFilterReset');
      },
      init: function() {
         this.subscribe('onExpandedChange', this._onExpandedChange);
         FilterPanel.superclass.init.apply(this, arguments);
         // На момент инициализицаии компонента items может вообще не быть (разработчик устанавливает их позже через setItems).
         if (this._options.items) {
            this._initializeFilter();
            if (this.isExpanded()) {
               this._contentInitialized = true;
               this._initializeFilterItems();
            }
         }
      },
      _initializeFilterItems: function() {
         this._filterAccordion = this.getChildControlByName('FilterAccordion');
         this._filterAccordion.setItems(this._filterRecordSet);
         this._updateResetFilterButtons();
      },
      _updateState: function(updateTextValue, updateFilter) {
         if (updateTextValue) {
            this.setTextValue(this._prepareTextValue());
         }
         if (updateFilter) {
            this._updateFilterProperty();
         }
      },
      _onFilterItemChange: function(event, model, index, changes) {
         this._updateState(changes.textValue !== undefined, changes.value !== undefined);
         this._updateResetFilterButtons();
      },
      _updateResetFilterButtons: function() {
         var
            accordion = this._filterAccordion,
            disableResetButton = true,
            withoutChanges;
         if (this._contentInitialized) {
            this._filterRecordSet.each(function (item) {
               withoutChanges = FilterToStringUtil.isEqualValues(item.get(ITEM_FILTER_VALUE), item.get(ITEM_FILTER_RESET_VALUE));
               if (!withoutChanges && disableResetButton) {
                  disableResetButton = false;
               }
               accordion._getItemContainer(accordion._getItemsContainer(), item)
                  .find('.controls-Spoiler__resetFilterField')
                  .toggleClass('ws-hidden', withoutChanges);
            });
            this.getChildControlByName('ResetFilterButton').setEnabled(!disableResetButton);
         }
      },
      _updateFilterProperty: function() {
         this._options.filter = this._prepareFilter();
         this._notify('onFilterChange', this.getFilter());
         this._notifyOnPropertyChanged('filter');
      },
      _initializeFilter: function() {
         this._filterRecordSet = this._options.items instanceof Array ? new RecordSet({ rawData: this._options.items, idProperty: ITEM_FILTER_ID }) : this._options.items;
         this._updateFilterProperty();
         this._filterRecordSet.subscribe('onCollectionItemChange', this._onFilterItemChangeFn);
         this.setTextValue(this._prepareTextValue());
      },
      _prepareFilter: function() {
         var
            value, filter = {};
         if (this._options.filterMode === 'onlyChanges') {
            this._filterRecordSet.each(function(item) {
               value = item.get(ITEM_FILTER_VALUE);
               if (!FilterToStringUtil.isEqualValues(value, item.get(ITEM_FILTER_RESET_VALUE))) {
                  filter[item.get(ITEM_FILTER_ID)] = value;
               }
            });
         } else {
            this._filterRecordSet.each(function (item) {
               filter[item.get(ITEM_FILTER_ID)] = item.get(ITEM_FILTER_VALUE);
            });
         }
         return filter;
      },
      /**
       * Возвращает значение результирующего фильтра.
       * @returns {Object}
       * @see filter
       */
      getFilter: function() {
         return this._options.filter;
      },
      setFilter: function() {
         throw new Error('Свойство "filter" работает только на чтение. Менять его надо через метод setItems');
      },
      /**
       * Устанавливает текстовое описание фильтра.
       * @param {String} textValue
       * @see getTextValue
       * @see textValue
       */
      setTextValue: function(textValue) {
         if (this._options.textValue !== textValue) {
            this._options.textValue = textValue;
            this._notifyOnPropertyChanged('textValue');
         }
      },
      /**
       * Возвращает текстовое описание фильтра.
       * @return {String} textValue
       * @see setTextValue
       * @see textValue
       */
      getTextValue: function() {
         return this._options.textValue;
      },
      _prepareTextValue: function() {
         var
            itemValue,
            valueArray = [];
         this._filterRecordSet.each(function(item) {
            itemValue = item.get(ITEM_FILTER_TEXT_VALUE);
            if (itemValue) {
               valueArray.push(itemValue);
            }
         });
         return valueArray.join(', ');
      },
      _onExpandedChange: function(event, expanded) {
         if (expanded && !this._contentInitialized) {
            this._initializeContent();
         }
      },
      /**
       * Возвращает структуру полей фильтра.
       * @returns {*}
       * @see items
       * @see setItems
       */
      getItems: function() {
         return this._options.items;
      },
      /**
       * Устанавливает структуру полей фильтра.
       * @param {Array.<FilterPanelItem>} items
       * @see items
       * @see getItems
       */
      setItems: function(items) {
         this._options.items = items;
         this._destroyFilter();
         this._initializeContent();
      },
      _destroyFilter: function() {
         if (this._filterRecordSet) {
            this._filterRecordSet.unsubscribe('onCollectionItemChange', this._onFilterItemChangeFn);
         }
         if (this._filterAccordion) {
            this._filterAccordion.destroy();
            this._filterAccordion = null;
         }
      },
      _initializeContent: function() {
         this._getContentContainer().html(this._options._contentTpl(this._options));
         this.reviveComponents();
         this._initializeFilter();
         // Поведение должно быть аналогично тому, что в методе init у FilterPanel:
         // проставляем флаг инициализации сразу после оживления верстки и расчёта фильтра
         this._contentInitialized = true;
         this._initializeFilterItems();
      },
      /**
       * Сбрасывает результирующий фильтр (см. {@link filter}).
       * @remark
       * При выполнении команды происходит событие {@link onFilterReset}.
       * @see resetFilterField
       * @command resetFilter
       */
      _resetFilter: function() {
         // Отключаем нотификацию об изменениях, т.к. иначе событие onFilterChange будет стрелять на сброс каждого поля
         // Слушать изменения нельзя. Компонент работает с контекстом и рекордсетом. Если слушать изменения, то нотификация в контекст не произойдет, т.к. рекордсет будет тот же самый.
         this._filterRecordSet.setEventRaising(false);
         this._filterRecordSet.each(function(item) {
            // До 3.17.20 метод установки значения в контекст оборачивался в debounce и изменения property прилетали в обратном порядке.
            // Приходилось менять местами установку textValue и value, чтобы в итоге изменения property происходили правильно.
            // item.set(ITEM_FILTER_VALUE, cFunctions.clone(item.get(ITEM_FILTER_RESET_VALUE)));
            // item.set(ITEM_FILTER_TEXT_VALUE, '');
            // С 3.17.20 debounce убран и теперь порядок, в котором обновляются property, правильный. Костыль можно убрать.
            this._resetItemFilterFields(item);
         }.bind(this));
         this._filterRecordSet.setEventRaising(true);
         // После сброса - сами вызываем пересчёт текущего состояния фильтра и его текстового описания со всеми нотификациями
         this._updateState(true, true);
         // Сама перерисовка нужна, т.к. выше мы отключаем eventRaising и проекция, смотрящая на этот рекордсет будет перегенерирована с новыми hash'ами.
         if (this._filterAccordion) {
            this._filterAccordion.redraw();
            this._updateResetFilterButtons();
         }
         this._notify('onFilterReset', this.getFilter());
      },
      _resetItemFilterFields: function(item) {
         var
            resetValues = {};
         resetValues[ITEM_FILTER_VALUE] = coreClone(item.get(ITEM_FILTER_RESET_VALUE));
         resetValues[ITEM_FILTER_TEXT_VALUE] = '';
         item.set(resetValues);
      },
      /**
       * Сбрасывает поле результирующего фильтра (см. {@link filter}).
       * @param {String} fieldName
       * @see resetFilter
       * @command resetFilterField
       */
      _resetFilterField: function(fieldName) {
         this._resetItemFilterFields(this._filterRecordSet.at(this._filterRecordSet.getIndexByValue(ITEM_FILTER_ID, fieldName)))
      },
      _getContentContainer: function() {
         return $('.controls-FilterPanel__contentContainer', this.getContainer());
      },
      destroy: function() {
         this._filterRecordSet.unsubscribe('onCollectionItemChange', this._onFilterItemChangeFn);
         FilterPanel.superclass.destroy.apply(this, arguments);
      }
   });

   return FilterPanel;

});
