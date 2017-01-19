/**
 * Created by am.gerasimov on 21.11.2016.
 */

define('js!SBIS3.CONTROLS.SuggestView',
    [
       'js!SBIS3.CORE.CompoundControl',
       'tmpl!SBIS3.CONTROLS.SuggestView',
       'js!SBIS3.CONTROLS.TabControl',
       'Core/helpers/collection-helpers',
       'js!SBIS3.CONTROLS.IItemsControl'
    ], function(CompoundControl, dotTplFn, TabControl, cHelpers, IItemsControl) {

       'use strict';

       var DELEGATED_EVENTS = [
          'onDrawItems',
          'onDataLoad',
          'onBeforeDataLoad',
          'onDataLoadError',
          'onItemActivate',
          'onItemsReady'
       ];

       var SHOW_ALL_BUTTON_NAME = 'showAllButton';

       /**
        * Компонент, который умеет отобажать набор списков в автодополнении.
        * Если передать несколько списков, тогда будут отображаться вкладки.
        * Если список один - то вкладки скрываются и отображается просто список.
        *
        * @class SBIS3.CONTROLS.SuggestView
        * @extends SBIS3.CONTROLS.CompoundControl
        *
        * @author Герасимов Александр Максимович
        *
        * @mixes SBIS3.CONTROLS.IItemsControl
        *
        * @ignoreOptions tooltip alwaysShowExtendedTooltip loadingContainer observableControls pageSize usePicker filter saveFocusOnSelect
        * @ignoreOptions allowEmptySelection allowEmptyMultiSelection templateBinding includedTemplates resultBindings footerTpl emptyHTML groupBy
        * @ignoreMethods getTooltip setTooltip getExtendedTooltip setExtendedTooltip setEmptyHTML setGroupBy itemTpl
        *
        * @control
        * @public
        * @category Lists
        */
       var SuggestView = CompoundControl.extend([IItemsControl],/** @lends SBIS3.CONTROLS.SuggestView.prototype */ {
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                /**
                 * @typedef {object} Item
                 * @property {String} align Устанавливает выравнивание вкладки. Доступные значения:
                 * <ul>
                 *     <li>'' - выравнивание вкладки справа (значение по умолчанию);</li>
                 *     <li>left - выравнивание вкладки слева;</li>
                 * </ul>
                 * @property {String} content Устанавливает xhtml-вёрстку вкладки.
                 * @property {String} title Устанавливает текст вкладки.
                 * @property {String} searchParam Имя параметра фильтрации для поиска
                 * @translatable title
                 */
                /**
                 * @cfg {Item[]} Устанавливает набор элементов, который описывает закладки и связанные с ними области.
                 * @remark
                 * Для настройки содержимого вкладок и областей нужно учитывать, что задано в опциях {@link tabsDisplayField} и {@link selectedKey}.
                 * Например, если задали &lt;opt name=&quot;tabsDisplayField&quot;&gt;title&lt;/opt&gt;, то и для текста вкладки задаем опцию &lt;opt name=&quot;title&quot;&gt;Текст вкладки&lt;/opt&gt;
                 * Если задали &lt;opt name=&quot;keyField&quot;&gt;id&lt;/opt&gt;, то и для вкладки задаем ключ опцией &lt;opt name=&quot;id&quot;&gt;id1&lt;/opt&gt;
                 */
                items: [],
                /**
                 * @cfg {String} Устанавливает идентификатор выбранной вкладки.
                 * @remark
                 * Для задания выбранного элемента необходимо указать значение {@link SBIS3.CONTROLS.ItemsControlMixin#keyField ключевого поля} элемента коллекции.
                 * @see SBIS3.CONTROLS.ItemsControlMixin#keyField
                 */
                selectedKey: null,
                /**
                 * @cfg {String} Устанавливает поле элемента коллекции, из которого отображать данные.
                 * @example
                 * <pre class="brush:xml">
                 *     <option name="tabsDisplayField">caption</option>
                 * </pre>
                 * @see keyField
                 * @see items
                 */
                displayField: null,
                /**
                 * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
                 * @remark
                 * Выбранный элемент в коллекции задаётся указанием ключа элемента {@link selectedKey}.
                 * @example
                 * <pre class="brush:xml">
                 *     <option name="keyField">id</option>
                 * </pre>
                 * @see items
                 * @see displayField
                 */
                keyField: null
             },
             _tabControl: null,
             _activeView: null
          },

          $constructor: function() {
             /* Метод, прокидывающий события из view */
             this._notifyDelegatedEvents = this._notifyDelegatedEvents.bind(this);
          },

          init: function() {
             SuggestView.superclass.init.apply(this, arguments);

             var tabControl = this.getChildControlByName('SuggestTabControl'),
                 tabButtons = this.getChildControlByName('TabButtons'),
                 switchableArea = this.getChildControlByName('SwitchableArea'),
                 self = this,
                 searchParam, lastSearchParam, lastActiveView;

             function getActiveView() {
                return switchableArea.getItemById(getActiveTabId()).getChildControlByName('view');
             }

             function getSearchParam() {
                return tabButtons.getItems().getRecordById(getActiveTabId()).get('searchParam');
             }

             function getActiveTabId() {
                return tabControl.getSelectedKey();
             }

             function tabChange() {
                self._activeView = getActiveView();
                searchParam = getSearchParam();
                self._toggleDelegateEvents(true);
                self.sendCommand('changeSearchParam', searchParam);
             }

             this._tabControl = tabControl;
             tabChange();

             tabControl.subscribe('onSelectedItemChange', function() {
                lastSearchParam = searchParam;
                lastActiveView = self._activeView;

                self._toggleDelegateEvents(false);

                tabChange();

                /* Чтобы при смене вкладки не делать лишний запрос, если фильтр не поменялся */
                if(lastActiveView.getFilter()[lastSearchParam] !== self._activeView.getFilter()[searchParam]) {
                   self.sendCommand('applySearch', true);
                }
             });
          },

          /* Т.к. кнопка 'Показать всё' отображается для каждого списка отдельно,
             то для неё поиск надо производить именно в списке */
          getChildControlByName: function(name) {
             if(name === SHOW_ALL_BUTTON_NAME) {
                return this.getActiveView().getChildControlByName(name);
             } else {
                return SuggestView.superclass.getChildControlByName.call(this, name);
             }
          },

          hasChildControlByName: function(name) {
             if(name === SHOW_ALL_BUTTON_NAME) {
                return this.getActiveView().hasChildControlByName(name);
             } else {
                return SuggestView.superclass.hasChildControlByName.call(this, name);
             }
          },
          /******************************************************************************/

          _toggleDelegateEvents: function(subscribe) {
             var activeView = this.getActiveView();

             cHelpers.forEach(DELEGATED_EVENTS, function(key) {
                this[subscribe? 'subscribeTo' : 'unsubscribeFrom'](activeView, key, this._notifyDelegatedEvents);
             }, this);
          },

          _notifyDelegatedEvents: function(e) {
             var args = [].slice.call(arguments, 1);
             args.unshift(e.name);
             e.setResult(this._notify.apply(this, args));
          },

          _modifyOptions: function() {
             var opts = SuggestView.superclass._modifyOptions.apply(this, arguments);
             if(opts.items.length === 1) {
                opts.className += ' controls-suggestView__singleTab';
             }
             return opts;
          },

          /**
           * Возвращает текущий отображаемый список.
           * @example
           * <pre>
           *    fieldLink.getList().getActiveView().setDataSource(mySource);
           * </pre>
           * @returns {SBIS3.CONTROLS.TabControl}
           */
          getActiveView: function() {
             return this._activeView;
          },

          /**
           * Возвращает компонент отображащий вкладки.
           * @example
           * <pre>
           *    fieldLink.getList().getTabControl().setSelectedKey('myTab');
           * </pre>
           * @returns {SBIS3.CONTROLS.TabControl}
           */
          getTabControl: function() {
             return this._tabControl;
          },

          //region SBIS3.CONTROLS.IItemsControl

          getItems: function() {
             return this.getActiveView().getItems();
          },

          setItems: function(items) {
             this.getActiveView().setItems(items);
          },

          setFilter: function(filter, noLoad) {
             this.getActiveView().setFilter(filter, noLoad);
          },

          getFilter: function() {
             return this.getActiveView().getFilter();
          },

          setSorting: function(sorting, noLoad) {
             this.getActiveView().setSorting(sorting, noLoad);
          },

          getSorting: function() {
             return this.getActiveView().getSorting();
          },

          reload: function() {
             return this.getActiveView().reload();
          },

          setDataSource: function(dataSource, noLoad) {
             this.getActiveView().getDataSource(dataSource, noLoad);
          },

          getDataSource: function() {
             return this.getActiveView().getDataSource();
          },

          _hasNextPage: function(hasMore, offset) {
             return this.getActiveView()._hasNextPage(hasMore, offset);
          },

          setItemTpl: function(itemTpl) {
             this.getActiveView().setItemTpl(itemTpl);
          },

          getItemTpl: function() {
             return this.getActiveView().getProperty('itemTpl');
          },

          setIdProperty: function() {
             this.getActiveView().setIdProperty(idProperty);
          },

          getIdProperty: function() {
             return this.getActiveView().getProperty('idProperty');
          },

          setDisplayProperty: function(displayProperty) {
             this.getActiveView().setDisplayProperty(displayProperty);
          },

          //endregion SBIS3.CONTROLS.IItemsControl

          //region SBIS3.CONTROLS.DecorableMixin

          setHighlightText: function(text, redraw) {
             this.getActiveView().setHighlightText(text, redraw);
          },

          setHighlightEnabled: function(enabled) {
             this.getActiveView().setHighlightEnabled(enabled);
          },

          //endregion SBIS3.CONTROLS.DecorableMixin

          //region SBIS3.CONTROLS.ListView

          setInfiniteScroll: function(type, noLoad) {
             this.getActiveView().setInfiniteScroll(type, noLoad);
          },

          getColumns: function() {
             return this.getActiveView().getColumns();
          },

          setColumns: function(columns) {
             this.getActiveView().setColumns(columns);
          }

          //endregion SBIS3.CONTROLS.ListView
       });

       return SuggestView;

    });