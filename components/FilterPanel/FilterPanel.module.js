/**
 * Created by as.avramenko on 09.08.2016.
 */

define('js!SBIS3.CONTROLS.FilterPanel', [
   'js!SBIS3.CONTROLS.CompoundControl',
   'js!SBIS3.CONTROLS.Expandable',
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
   'js!SBIS3.CONTROLS.FilterPanelChooser',
   'js!SBIS3.CONTROLS.FilterPanelDataRange',
   'js!SBIS3.CONTROLS.FilterPanelBoolean',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.ScrollContainer'
], function(CompoundControl, Expandable, FilterPanelItem, MarkupTransformer, FilterToStringUtil, dotTplFn, contentTpl, FilterPanelItemContentTemplate) {

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
             * @cfg {Object} Фильтр, сформированный по структуре, заданной в опции items.
             * Внимание! Данная опция доступна только на чтение. Фильтр формируется исключительно через items.
             */
            filter: {}
         },
         _filterInitialized: false,
         _filterAccordion: null,
         _onFilterItemChangeFn: null,
         _notifyOnFilterChange: true
      },
      _modifyOptions: function() {
         var
            cfg = FilterPanel.superclass._modifyOptions.apply(this, arguments);
         cfg._contentTpl = contentTpl;
         cfg._accordionItemContentTpl = FilterPanelItemContentTemplate;
         return cfg;
      },
      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'resetFilter', this._resetFilter);
         $ws.single.CommandDispatcher.declareCommand(this, 'resetFilterField', this._resetFilterField);
         this._onFilterItemChangeFn = this._onFilterItemChange.bind(this);
         this._publish('onFilterChange', 'onFilterReset');
      },
      init: function() {
         this.subscribe('onExpandedChange', this._onExpandedChange);
         FilterPanel.superclass.init.apply(this, arguments);
         setTimeout($ws.helpers.forAliveOnly(function() {
            if (this.isExpanded() && !this._filterInitialized) { // Защита от повторной инициализации (если фильтр был инициализирован через setItems)
               this._initializeFilter();
            }
         }, this).bind(this), 1);
      },
      _onFilterItemChange: function(event, model, index, changes) {
         var
            filter = $ws.core.clone(this.getFilter());
         if (changes.value !== undefined) {
            filter[model.get(ITEM_FILTER_ID)] = changes.value;
            this._updateFilterProperty(filter);
            this._updateResetFilterButtons();
         }
      },
      _updateResetFilterButtons: function() {
         var
            accordion = this._filterAccordion,
            disableResetButton = true,
            withoutChanges;
         accordion.getItems().each(function(item) {
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
      _updateFilterProperty: function(filter) {
         this._options.filter = filter;
         if (this._notifyOnFilterChange) {
            this._notify('onFilterChange', filter);
         }
         this._notifyOnPropertyChanged('filter');
      },
      _initializeFilter: function() {
         var
            items, filter = {};
         this._filterAccordion = this.getChildControlByName('FilterAccordion');
         items = this._filterAccordion.getItems();
         if (items) {
            items.each(function (item) {
               filter[item.get(ITEM_FILTER_ID)] = item.get(ITEM_FILTER_VALUE);
            });
            this._updateFilterProperty(filter);
            this._updateResetFilterButtons();
            this._filterAccordion.getItems().subscribe('onCollectionItemChange', this._onFilterItemChangeFn);
         }
         this._filterInitialized = true;
      },
      getFilter: function() {
         return this._options.filter;
      },
      setFilter: function() {
         throw new Error('Свойство "filter" работает только на чтение. Менять его надо через метод setFilterStructure');
      },
      _onExpandedChange: function(event, expanded) {
         if (expanded && !this._filterInitialized) {
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
         this._filterInitialized = false;
      },
      _initializeContent: function() {
         this._getContentContainer().html(MarkupTransformer(this._options._contentTpl(this._options)));
         this.reviveComponents();
         this._initializeFilter();
      },
      _setNotifyOnFilterChange: function(flag) {
         this._notifyOnFilterChange = !!flag;
      },
      _resetFilter: function() {
         this._setNotifyOnFilterChange(false);
         this._filterAccordion.getItems().each(function(item) {
            item.set(ITEM_FILTER_VALUE, $ws.core.clone(item.get(ITEM_FILTER_RESET_VALUE)));
         });
         this._setNotifyOnFilterChange(true);
         this._notify('onFilterReset', this.getFilter());
      },
      _resetFilterField: function(fieldName) {
         var
            items = this._filterAccordion.getItems(),
            item = items.at(items.getIndexByValue(ITEM_FILTER_ID, fieldName));
         item.set(ITEM_FILTER_VALUE, $ws.core.clone(item.get(ITEM_FILTER_RESET_VALUE)));
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
