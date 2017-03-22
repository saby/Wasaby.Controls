/**
 * Created by am.gerasimov on 21.11.2016.
 */

define('js!SBIS3.CONTROLS.SuggestView',
    [
       'js!SBIS3.CORE.CompoundControl',
       'tmpl!SBIS3.CONTROLS.SuggestView',
       'js!SBIS3.CONTROLS.TabControl',
       'Core/ParallelDeferred',
       'Core/IoC',
       'js!SBIS3.CONTROLS.IItemsControl'
    ], function(CompoundControl, dotTplFn, TabControl, ParallelDeferred, IoC, IItemsControl) {

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
       var VIEW_NAME = 'view';

       /**
        * Компонент, который умеет отобажать набор списков в автодополнении.
        * Если передать несколько списков, тогда будут отображаться вкладки.
        * Если список один - то вкладки скрываются и отображается просто список.
        *
        * @class SBIS3.CONTROLS.SuggestView
        * @extends SBIS3.CORE.CompoundControl
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
                displayProperty: null,
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
                idProperty: null
             },
             _tabControl: null,
             _tabButtons: null,
             _activeView: null,
             _switchableArea: null
          },

          $constructor: function() {
             /* Метод, прокидывающий события из view */
             this._notifyDelegatedEvents = this._notifyDelegatedEvents.bind(this);
          },

          init: function() {
             SuggestView.superclass.init.apply(this, arguments);

             var self = this;
             this._viewsIterator(function(view) {
                DELEGATED_EVENTS.forEach(function (key) {
                   self.subscribeTo(view, key, self._notifyDelegatedEvents);
                });
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

          _notifyDelegatedEvents: function(e, list) {
             var args = [].slice.call(arguments, 1),
                 isLoaded = true,
                 data, items;

             args.unshift(e.name);

             /* Т.к. контроллер следит за событием onDataLoad, то им надо стрелять один раз,
              когда все списки згрузились */
             if(e.name === 'onDataLoad') {
                this._viewsIterator(function(view) {
                   isLoaded &= !view.isLoading();
                });

                /* Не прокидываем событие выше, пока не загрузились все списки */
                if(!isLoaded) {
                   return;
                }

                /* Т.к. у нас списков несколько, чтобы работала правильно смена раскладки надо отдавать пустой рекордсет,
                   только если рекордсеты всех списков пустые, иначе отдаём рекордсет списка, в котором есть записи */
                this._viewsIterator(function(view) {
                   if(data) {
                      return;
                   }

                   if(list.getCount()) {
                      data = list;
                   }

                   if(!data) {
                      items = view.getItems();
                      if (items && items.getCount()) {
                         data = items;
                      }
                   }
                });

                args.splice(1, 1, data || list);
             }

             e.setResult(this._notify.apply(this, args));
          },

          _modifyOptions: function() {
             var opts = SuggestView.superclass._modifyOptions.apply(this, arguments);
             if(opts.items.length === 1) {
                opts.className += ' controls-suggestView__singleTab';
             }
             if (opts.displayField) {
                IoC.resolve('ILogger').log('SuggestView', 'Опция displayField является устаревшей, используйте displayProperty');
                opts.displayProperty = opts.displayField;
             }
             if (opts.keyField) {
                IoC.resolve('ILogger').log('SuggestView', 'Опция keyField является устаревшей, используйте idProperty');
                opts.idProperty = opts.keyField;
             }
             return opts;
          },

          //region _private

          _getSwitchableArea: function() {
             return this._switchableArea || (this._switchableArea = this.getChildControlByName('SwitchableArea'));
          },

          _getTabButtons: function() {
             return this._tabButtons || (this._tabButtons = this.getChildControlByName('TabButtons'));
          },

          /* Итератор для перебора списков */
          _viewsIterator: function(callback) {
             this._getSwitchableArea().getItems().forEach(function(elem, index) {
                callback(elem.getChildControlByName(VIEW_NAME), this._getTabButtons().getItems().at(index).getRawData());
             }.bind(this));
          },

          /* Подготавливает фильтр для передачи view,
             устанавливает searchValue, применяет разворот */
          _prepareFilter: function(filter, viewFilter, searchParam) {
             var searchValue;

             function processFilter(filter, value, field) {
                if(value) {
                   filter[field] = value;
                } else {
                   delete filter[field];
                }
             }

             this._viewsIterator(function(view, tabOpts) {
                /* Нахдим актуальное значение для поиска */
                if(!searchValue && filter[tabOpts.searchParam]) {
                   searchValue = filter[tabOpts.searchParam];
                }
                /* Чтобы удалить старое значение фильтра */
                delete viewFilter[tabOpts.searchParam];
             });

             processFilter(viewFilter, searchValue, searchParam);
             processFilter(viewFilter, filter['Разворот'], 'Разворот');
             processFilter(viewFilter, filter['usePages'], 'usePages');

             return viewFilter;
          },

          //endregion _private

          /**
           * Возвращает текущий отображаемый список.
           * @example
           * <pre>
           *    fieldLink.getList().getActiveView().setDataSource(mySource);
           * </pre>
           * @returns {SBIS3.CONTROLS.TabControl}
           */
          getActiveView: function() {
             return this._getSwitchableArea().getItemById(this.getTabControl().getSelectedKey()).getChildControlByName(VIEW_NAME);
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
             return this._tabControl || (this._tabControl = this.getChildControlByName('SuggestTabControl'));
          },

          //region SBIS3.CONTROLS.IItemsControl

          getItems: function() {
             return this.getActiveView().getItems();
          },

          setItems: function(items) {
             this.getActiveView().setItems(items);
          },

          setFilter: function(filter, noLoad) {
             this._viewsIterator(function(view, tabOpts) {
                view.setFilter(this._prepareFilter(filter, view.getFilter(), tabOpts.searchParam), noLoad);
             }.bind(this));
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

          reload: function(filter) {
             var reloadDef = new ParallelDeferred(),
                 args = [].slice.call(arguments, 1),
                 self = this;

             this._viewsIterator(function(view, tabOpts) {
                args.unshift(this._prepareFilter(filter || {}, view.getFilter(), tabOpts.searchParam));
                reloadDef.push(view.reload.apply(view, args));
                args.shift();
             }.bind(this));


             /* По стандарту, если в текущей открытой вкладке нет записей,
                то надо переключать на вкладку в которой записи есть */
             return reloadDef.done().getResult().addCallback(function(res) {
                if(!self.getActiveView().getItems().getCount()) {
                   var founded = false;

                   self._viewsIterator(function(view, tabOpts) {
                      if(!founded && view.getItems().getCount()) {
                         founded = true;
                         self.getTabControl().setSelectedKey(tabOpts[self._options.idProperty]);
                      }
                   });
                }
                return res;
             });
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

          setIdProperty: function(idProperty) {
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
             this._viewsIterator(function(view) {
                view.setHighlightText(text, redraw);
             });
          },

          setHighlightEnabled: function(enabled) {
             this._viewsIterator(function(view) {
                view.setHighlightEnabled(enabled);
             });
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