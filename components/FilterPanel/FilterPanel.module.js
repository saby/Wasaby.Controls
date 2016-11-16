/**
 * Created by as.avramenko on 09.08.2016.
 */

define('js!SBIS3.CONTROLS.FilterPanel', [
   "Core/core-functions",
   "Core/CommandDispatcher",
   "Core/helpers/functional-helpers",
   "js!SBIS3.CONTROLS.CompoundControl",
   "js!SBIS3.CONTROLS.Expandable",
   'js!WS.Data/Collection/RecordSet',
   "js!SBIS3.CONTROLS.FilterPanelItem",
   "js!SBIS3.CORE.MarkupTransformer",
   "js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil",
   "tmpl!SBIS3.CONTROLS.FilterPanel",
   "tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelContent",
   "tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelItemContentTemplate",
   "tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser",
   "tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange",
   "tmpl!SBIS3.CONTROLS.FilterPanel/resources/FilterPanelSpoilerRightPartTitleTemplate",
   "js!SBIS3.CONTROLS.Link",
   "js!SBIS3.CONTROLS.Accordion",
   "js!SBIS3.CONTROLS.FilterPanelChooser",
   "js!SBIS3.CONTROLS.FilterPanelDataRange",
   "js!SBIS3.CONTROLS.FilterPanelBoolean",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.ScrollContainer"
], function( cFunctions, CommandDispatcher, fHelpers, CompoundControl, Expandable, RecordSet, FilterPanelItem, MarkupTransformer, FilterToStringUtil, dotTplFn, contentTpl, FilterPanelItemContentTemplate) {

   'use strict';

   /**
    * Контрол, представляющий собой панель фильтрации.
    * @author Авраменко Алексей Сергеевич
    * @class SBIS3.CONTROLS.FilterPanel
    * @public
    * @extends SBIS3.CONTROLS.CompoundControl
    */

   var
      ITEM_FILTER_ID          = 'id',
      ITEM_FILTER_VALUE       = 'value',
      ITEM_FILTER_TEXT_VALUE  = 'textValue',
      ITEM_FILTER_RESET_VALUE = 'resetValue',

      FilterPanel = CompoundControl.extend([Expandable], /** @lends SBIS3.CONTROLS.FilterPanel.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            expandedClassName: 'controls-FilterPanel_expanded',
            collapsedClassName: 'controls-FilterPanel_collapsed',
            /**
             * @typedef {Object} FilterPanelItem
             * @property {String|Number} id Идентификатор поля фильтрации
             * @property {String} caption Описание, используемое в редакторе поля фильтрации
             * @property {Boolean} expanded Признак: true - редактор поля фильтрации создается в развернутом состоянии, false - в свёрнутом
             * @property {*} value Текущее значение фильтра, это значение будет записываться в поле фильтрации по идентификатору id
             * @property {*} resetValue Значение поля фильтрации, устанавливаемое при сбросе
             * @property {String} textValue Тестовое значение поля фильтра
             * @property {String} template Шаблон редактора поля фильтрации.
             * Возможные значения:
             * <ol>
             *    <li><b>tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser</b><br/>Шаблон, реализующий выборку идентификаторов, по которым будет формироваться значение поля фильтрации</li>
             *    <li><b>tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange</b><br/>Шаблон, реализующий выборку из числового диапазона</li>
             * </ol>
             * Также доступно использование в качестве редактора обыкновенный CheckBox, для чего необходимо установить следующее значение template:
             *    <b>js!SBIS3.CONTROLS.FilterPanelBoolean</b><br/>
             * Внимание! Данный редактор поля фильтрации отображается без спойлера, в связи с чем рекомендуется размещать его в конце списка доступных фильтров.
             * @property {Object} properties Опции, передаваемые в редактор поля фильтрации
             */
            /**
             * @cfg {Array.<FilterPanelItem>} Структура, по которой строится панель фильтрации
             */
            items: null,
            /**
             * @cfg {String} Направление открытия панели фильтрации
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>left - открывается влево;</li>
             *    <li>right - открывается вправо.</li>
             * </ol>
             * @variant 'left'
             * @variant 'right'
             */
            filterAlign: 'left',
            /**
             * @cfg {String} Режим формирования результирующего фильтра
             * Возможные значения:
             * <ol>
             *    <li>full - результирующий фильтр формируется из всех полей;</li>
             *    <li>onlyChanges - результирующий фильтр формируется только из полей, отличающихся от изначального значения (resetValue).</li>
             * </ol>
             * @variant 'full'
             * @variant 'onlyChanges'
             */
            filterMode: 'onlyChanges',
            /**
             * @cfg {Object} Фильтр, сформированный по структуре, заданной в опции items
             * Внимание! Данная опция доступна только на чтение. Фильтр формируется исключительно через items.
             */
            filter: {},
            /**
             * @cfg {String} Тестовое описание фильтра
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
         this._initializeFilter();
         if (this.isExpanded()) {
            this._initializeFilterItems();
            this._contentInitialized = true;
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
      getFilter: function() {
         return this._options.filter;
      },
      setFilter: function() {
         throw new Error('Свойство "filter" работает только на чтение. Менять его надо через метод setItems');
      },
      setTextValue: function(textValue) {
         if (this._options.textValue !== textValue) {
            this._options.textValue = textValue;
            this._notifyOnPropertyChanged('textValue');
         }
      },
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
      getItems: function() {
         return this._options.items;
      },
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
      _resetFilter: function() {
         this._filterRecordSet.each(function(item) {
            item.set(ITEM_FILTER_VALUE, cFunctions.clone(item.get(ITEM_FILTER_RESET_VALUE)));
            item.set(ITEM_FILTER_TEXT_VALUE, '');
         });
         this._notify('onFilterReset', this.getFilter());
      },
      _resetFilterField: function(fieldName) {
         var
            item = this._filterRecordSet.at(this._filterRecordSet.getIndexByValue(ITEM_FILTER_ID, fieldName));
         item.set(ITEM_FILTER_VALUE, cFunctions.clone(item.get(ITEM_FILTER_RESET_VALUE)));
         item.set(ITEM_FILTER_TEXT_VALUE, '');
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
