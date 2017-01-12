/**
 * Created by as.avramenko on 09.08.2016.
 */

define('js!SBIS3.CONTROLS.FilterPanel', [
   'Core/core-functions',
   'Core/CommandDispatcher',
   'Core/helpers/functional-helpers',
   'js!SBIS3.CONTROLS.CompoundControl',
   'js!SBIS3.CONTROLS.Expandable',
   'js!WS.Data/Collection/RecordSet',
   'js!SBIS3.CONTROLS.FilterPanelItem',
   'js!SBIS3.CORE.MarkupTransformer',
   'js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
   'tmpl!SBIS3.CONTROLS.FilterPanel',
   'tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelContent',
   'tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelItemContentTemplate',
   'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
   'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange',
   'tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelSpoilerRightPartTitleTemplate',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Accordion',
   'js!SBIS3.CONTROLS.FilterPanelChooser.DetailsList',
   'js!SBIS3.CONTROLS.FilterPanelChooser.List',
   'js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList',
   'js!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList',
   'js!SBIS3.CONTROLS.FilterPanelChooser.RadioGroup',
   'js!SBIS3.CONTROLS.FilterPanelChooser.FieldLink',
   'js!SBIS3.CONTROLS.FilterPanelDataRange',
   'js!SBIS3.CONTROLS.FilterPanelBoolean',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.ScrollContainer'
], function( cFunctions, CommandDispatcher, fHelpers, CompoundControl, Expandable, RecordSet, FilterPanelItem, MarkupTransformer, FilterToStringUtil, dotTplFn, contentTpl, FilterPanelItemContentTemplate) {

   'use strict';
   /**
    * Класс контрола "Панель фильтрации".
    * <br/>
    * При создания компонента допускается использование только <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/'>logicless-шаблонизатора</a>.
    * Т.е. разметка компонента описывается в TMPL-файле.
    * <br/>
    * При взаимодействии с контекстом привязка производится односторонняя.
    * <br/>
    * Создание и размещение кнопки открытия панели фильтрации остается на совести разработчиков. Рекомендуется использовать контрол {@link SBIS3.CONTROLS.IconButton}.
    * В зависимости от направления, в котором будет открыта панель (см. {@link filterAlign}), кнопку открытию устанавливают классы "controls-IconButton__filter-left" или "controls-IconButton__filter-right".
    * Чтобы открыть панель фильтрации, используйте метод {@link toggleExpanded}.
    *
    * @author Авраменко Алексей Сергеевич
    * @class SBIS3.CONTROLS.FilterPanel
    * @public
    * @extends SBIS3.CONTROLS.CompoundControl
    *
    * @mixes SBIS3.CONTROLS.Expandable
    *
    * @demo SBIS3.CONTROLS.Demo.TestFilterPanel Временный демонстрационный пример без возможности редактировать контрол SBIS3.CONTROLS.FilterPanel. Расширенная версия демонстрационного примера с возможностью редактирования будет доступна позже.
    */
   var
      ITEM_FILTER_ID          = 'id',
      ITEM_FILTER_VALUE       = 'value',
      ITEM_FILTER_TEXT_VALUE  = 'textValue',
      ITEM_FILTER_RESET_VALUE = 'resetValue',

      FilterPanel = CompoundControl.extend([Expandable], /** @lends SBIS3.CONTROLS.FilterPanel.prototype */ {
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
             * @property {String|Number} id Идентификатор поля фильтрации.
             * @property {String} caption Описание, используемое в редакторе поля фильтрации.
             * @property {Boolean} expanded Признак: true - редактор поля фильтрации создается в развернутом состоянии, false - в свёрнутом.
             * @property {*} value Текущее значение фильтра. Это значение будет записываться в поле фильтрации по идентификатору id.
             * @property {*} resetValue Значение сброшенного фильтра.
             * @property {String} textValue Тестовое значение поля фильтра.
             * @property {String} template Шаблон редактора поля фильтрации.
             * Возможные значения:
             * <ol>
             *    <li><b>tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser</b><br/>Шаблон, реализующий выборку идентификаторов, по которым будет формироваться значение поля фильтрации. Подробнее о редакторе вы можете прочитать {@link SBIS3.CONTROLS.FilterPanelChooser}.</li>
             *    <li><b>tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange</b><br/>Шаблон, реализующий выборку из числового диапазона. Подробнее о редакторе вы можете прочитать {@link SBIS3.CONTROLS.FilterPanelDataRange}.</li>
             *    <li><b>js!SBIS3.CONTROLS.FilterPanelBoolean</b> - обыкновенный чекбокс {@link SBIS3.CONTROLS.FilterPanelBoolean}. Данный редактор поля фильтрации отображается без спойлера, в связи с чем рекомендуется размещать его в конце списка доступных фильтров.</li>
             * </ol>
             * @property {Object} properties Опции, передаваемые в редактор.
             * @property {String} properties.editor Тип редактора. Применяется при использовании шаблона редактора "tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser". Когда опция не установлена, используется класс редактора "Список" (значение list).
             * Возможные значения:
             * <ul>
             *     <li>list - использовать редактор {@link SBIS3.CONTROLS.FilterPanelChooser.List}.</li>
             *     <li>dictionary - использовать редактор {@link SBIS3.CONTROLS.FilterPanelChooser.DictionaryList}.</li>
             *     <li>favorites - использовать редактор {@link SBIS3.CONTROLS.FilterPanelChooser.FavoritesList}.</li>
             *     <li>radio - использовать редактор {@link SBIS3.CONTROLS.FilterPanelChooser.RadioGroup}.</li>
             *     <li>fieldLink - использовать редактор {@link SBIS3.CONTROLS.FilterPanelChooser.FieldLink}.</li>
             * </ul>
             * @property {Object} properties.properties Объект, в который передают опции для конфигурации контрола SBIS3.CONTROLS.FieldLink, на основе которого создан редактор {@link SBIS3.CONTROLS.FilterPanelChooser.FieldLink}.
             * Описание контрола и список его опций вы можете найти <a href='https://wi.sbis.ru/docs/SBIS3/CONTROLS/FieldLink/'>здесь</a> и <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/field-link/dictionary/'>здесь</a>.
             * @property {Object} properties.items Набор данных, по которому будет построен список значений. Актуально для редакторов типа {@link SBIS3.CONTROLS.FilterPanelChooser}.
             */
            /**
             * @cfg {WS.Data/Collection/RecordSet|Array.<FilterPanelItem>} Устанавливает структуру полей фильтра.
             * @remark
             * Когда значение опции установлено через RecordSet, то при изменении значения в любой из записей изменяется соответствующее значение в контексте панели фильтрации.
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
         _filterInitialized: false,
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
               this._initializeFilterItems();
               this._contentInitialized = true;
            }
         }
      },
      _initializeFilterItems: function() {
         this._filterAccordion = this.getChildControlByName('FilterAccordion');
         this._filterAccordion.setItems(this._filterRecordSet);
         this._updateResetFilterButtons();
      },
      _onFilterItemChange: function(event, model, index, changes) {
         if (changes.value !== undefined) {
            this._updateFilterProperty();
            if (this._contentInitialized) {
               this._updateResetFilterButtons();
            }
         } else if (changes.textValue !== undefined) {
            this.setTextValue(this._prepareTextValue());
         }
      },
      _updateResetFilterButtons: function() {
         var
            accordion = this._filterAccordion,
            disableResetButton = true,
            withoutChanges;
         this._filterRecordSet.each(function(item) {
            withoutChanges = FilterToStringUtil.isEqualValues(item.get(ITEM_FILTER_VALUE), item.get(ITEM_FILTER_RESET_VALUE));
            if (!withoutChanges && disableResetButton) {
               disableResetButton = false;
            }
            accordion._getItemContainer(accordion._getItemsContainer(), item)
               .find('.controls-Spoiler__resetFilterField')
               .toggleClass('ws-hidden', withoutChanges);
         });
         this.getChildControlByName('ResetFilterButton').setEnabled(!disableResetButton);
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
         this._filterInitialized = true;
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
         if (this._filterAccordion) {
            this._filterAccordion.destroy();
            this._filterAccordion = null;
         }
      },
      _initializeContent: function() {
         this._getContentContainer().html(MarkupTransformer(this._options._contentTpl(this._options)));
         this.reviveComponents();
         this._initializeFilter();
         this._initializeFilterItems();
         this._contentInitialized = true;
      },
      /**
       * Сбрасывает результирующий фильтр (см. {@link filter}).
       * @remark
       * При выполнении команды происходит событие {@link onFilterReset}.
       * @see resetFilterField
       * @command resetFilter
       */
      _resetFilter: function() {
         this._filterRecordSet.each(function(item) {
            item.set(ITEM_FILTER_TEXT_VALUE, ''); // Вначале нужно поменять текстовое описание и лишь потом фильтр, т.к. при onFilterChange должно быть уже правильное текстовое значение
            item.set(ITEM_FILTER_VALUE, cFunctions.clone(item.get(ITEM_FILTER_RESET_VALUE)));
         });
         this._notify('onFilterReset', this.getFilter());
      },
      /**
       * Сбрасывает поле результирующего фильтра (см. {@link filter}).
       * @param {String} fieldName
       * @see resetFilter
       * @command resetFilterField
       */
      _resetFilterField: function(fieldName) {
         var
            item = this._filterRecordSet.at(this._filterRecordSet.getIndexByValue(ITEM_FILTER_ID, fieldName));
         item.set(ITEM_FILTER_TEXT_VALUE, ''); // Вначале нужно поменять текстовое описание и лишь потом фильтр, т.к. при onFilterChange должно быть уже правильное текстовое значение
         item.set(ITEM_FILTER_VALUE, cFunctions.clone(item.get(ITEM_FILTER_RESET_VALUE)));
      },
      _getContentContainer: function() {
         return $('.controls-FilterPanel__contentContainer', this.getContainer());
      },
      _getHeadContainer: function() {
         return $('.controls-FilterPanel__headContainer', this.getContainer());
      }
   });

   return FilterPanel;

});
