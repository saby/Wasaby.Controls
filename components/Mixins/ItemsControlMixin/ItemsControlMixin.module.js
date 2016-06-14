define('js!SBIS3.CONTROLS.ItemsControlMixin', [
   'js!SBIS3.CONTROLS.Data.Source.Memory',
   'js!SBIS3.CONTROLS.Data.Source.SbisService',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Query.Query',
   'js!SBIS3.CORE.MarkupTransformer',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Projection.Projection',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'html!SBIS3.CONTROLS.ItemsControlMixin/resources/ItemsTemplate',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Model',
   'Core/ParserUtilities'
], function (MemorySource, SbisService, RecordSet, Query, MarkupTransformer, ObservableList, Projection, IBindCollection, Collection, TemplateUtil, ItemsTemplate, Utils, Model, ParserUtilities) {

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }
   var createDefaultProjection = function(items, cfg) {
      var proj = Projection.getDefaultProjection(items);
      if (cfg.itemsSortMethod) {
         proj.setSort(cfg.itemsSortMethod);
      }
      return proj;
   },
   getRecordsForRedraw = function(projection) {
      var
         records = [];
      if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
         projection.each(function (item) {
            records.push(item);
         });
      }
      return records;
   },
   buildTplArgs = function(cfg) {
      var tplOptions = {}, itemTpl, itemContentTpl;


      tplOptions.displayField = cfg.displayField;
      tplOptions.templateBinding = cfg.templateBinding;

      if (cfg.itemContentTpl) {
         itemContentTpl = cfg.itemContentTpl;
      }
      else {
         itemContentTpl = cfg._defaultItemContentTemplate;
      }
      tplOptions.itemContent = TemplateUtil.prepareTemplate(itemContentTpl);
      if (cfg.itemTpl) {
         itemTpl = cfg.itemTpl;
      }
      else {
         itemTpl = cfg._defaultItemTemplate;
      }
      tplOptions.itemTpl = TemplateUtil.prepareTemplate(itemTpl);
      tplOptions.defaultItemTpl = TemplateUtil.prepareTemplate(cfg._defaultItemTemplate);

      if (cfg.includedTemplates) {
         var tpls = cfg.includedTemplates;
         tplOptions.included = {};
         for (var j in tpls) {
            if (tpls.hasOwnProperty(j)) {
               tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
            }
         }
      }
      return tplOptions;
   },
   findKeyField  = function(json){
      var itemFirst = json[0];
      if (itemFirst) {
         return Object.keys(json[0])[0];
      }
   },
   JSONToRecordset  = function(json, keyField) {
      return new RecordSet({
         rawData : json,
         idProperty : keyField
      })
   };
   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.ItemsControlMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var ItemsControlMixin = /**@lends SBIS3.CONTROLS.ItemsControlMixin.prototype  */{
       /**
        * @event onDrawItems После отрисовки всех элементов коллекции
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @example
        * <pre>
        *     Menu.subscribe('onDrawItems', function(){
        *        if (Menu.getItemsInstance(2).getCaption() == 'Входящие'){
        *           Menu.getItemsInstance(2).destroy();
        *        }
        *     });
        * </pre>
        * @see items
        * @see displayField
        */
       /**
        * @event onDataLoad При загрузке данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {SBIS3.CONTROLS.DataSet} dataSet Набор данных.
        * @example
        * <pre>
        *     myComboBox.subscribe('onDataLoad', function(eventObject) {
        *        TextBox.setText('Загрузка прошла успешно');
        *     });
        * </pre>
        * @see items
        * @see setDataSource
        * @see getDataSource
        */
      /**
       * @event onDataLoadError При ошибке загрузки данных
       * @remark
       * Событие сработает при получении ошибки от любого метода БЛ, вызванного стандартным способом.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {HTTPError} error Произошедшая ошибка.
       * @return {Boolean} Если вернуть:
       * <ol>
       * <li>true, то будет считаться, что ошибка обработана, и стандартное поведение отменяется.</li>
       * <li>Если не возвращать true, то выведется alert с описанием ошибки.</li>
       * </ol>
       * @example
       * <pre>
       *    myView.subscribe('onDataLoadError', function(event, error){
       *       event.setResult(true);
       *       TextBox.setText('Ошибка при загрузке данных');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeDataLoad Перед загрузкой данных
       * @remark
       * Событие сработает перед запросом к источнику данных
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    myView.subscribe('onBeforeDataLoad', function(event, error){
       *       var filter = this.getFilter();
       *       filter['myParam'] = myValue;
       *       this.setFilter(filter, true)
       *    });
       * </pre>
       */
      /**
       * @event onItemsReady при готовности экземпляра коллекции iList
       * @remark
       * Например когда представлению задается Source и нужно подписаться на события List, который вернется в результате запроса
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    myView.subscribe('onItemsReady', function(event){
       *       var items = this.getItems();
       *       items.subscribe('onCollectionChange', function(){
       *          alert('Collection is changed')
       *       })
       *    });
       * </pre>
       */
      $protected: {
         _itemData : null,
         _groupHash: {},
         _itemsProjection: null,
         _items : null,
         _itemsInitializedBySource: false,
         _itemsInstances: {},
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            _canServerRender: false,
            _serverRender: false,
            _defaultItemTemplate: '',
            _defaultItemContentTemplate: '',
            _createDefaultProjection : createDefaultProjection,
            _buildTplArgsSt: buildTplArgs,
            _buildTplArgs : buildTplArgs,
            _getRecordsForRedrawSt: getRecordsForRedraw,
            _getRecordsForRedraw: getRecordsForRedraw,
            /**
             * @cfg {String} Поле элемента коллекции, которое является идентификатором записи
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента.
             * @example
             * <pre class="brush:xml">
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             * @see displayField
             * @see setDataSource
             * @see SBIS3.CONTROLS.Selectable#selectedKey
             * @see SBIS3.CONTROLS.Selectable#setSelectedKey
             * @see SBIS3.CONTROLS.Selectable#getSelectedKey
             */
            keyField : null,
            /**
             * @noShow
             * @deprecated На текущий момент отрисовка изменившихся данных осуществляется автматически. Опция будет удалена в 3.7.4.100.
             */
            autoRedraw: true,
            /**
             * @cfg {String} Поле элемента коллекции, из которого отображать данные
             * @example
             * <pre class="brush:xml">
             *     <option name="displayField">Название</option>
             * </pre>
             * @remark
             * Данные задаются либо в опции {@link items}, либо методом {@link setDataSource}.
             * Источник данных может состоять из множества полей. В данной опции необходимо указать имя поля, данные
             * которого нужно отобразить в выпадающем списке.
             * @see keyField
             * @see items
             * @see setDataSource
             */
            displayField: null,
             /**
              * @cfg {Array.<Object.<String,String>>} Масив объектов. Набор исходных данных, по которому строится отображение
              * @name SBIS3.CONTROLS.ItemsControlMixin#items
              * @remark
              * !Важно: данные для коллекции элементов можно задать либо в этой опции,
              * либо через источник данных методом {@link setDataSource}.
              * @example
              * <pre class="brush:xml">
              *     <options name="items" type="array">
              *        <options>
              *            <option name="id">1</option>
              *            <option name="title">Пункт1</option>
              *         </options>
              *         <options>
              *            <option name="id">2</option>
              *            <option name="title">Пункт2</option>
              *         </options>
              *         <options>
              *            <option name="id">3</option>
              *            <option name="title">ПунктПодменю</option>
              *            <!--необходимо указать это полем иерархии для корректной работы-->
              *            <option name="parent">2</option>
              *            <option name="icon">sprite:icon-16 icon-Birthday icon-primary</option>
              *         </options>
              *      </options>
              *      <option name="hierField">parent</option>
              * </pre>
              * @see keyField
              * @see displayField
              * @see setDataSource
              * @see getDataSet
              * @see hierField
              */
            items: null,
            /**
             * @cfg {DataSource|SBIS3.CONTROLS.Data.Source.ISource|Function} Набор исходных данных, по которому строится отображение
             * @noShow
             * @see setDataSource
             */
            dataSource: undefined,
             /**
              * @cfg {Number} Количество записей, запрашиваемых с источника данных
              * @remark
              * Опция определяет количество запрашиваемых записей с источника даныых как при построении контрола, так и
              * при осуществлении подгрузки.
              * Для иерархических структур при пейджинге по скроллу опция также задаёт количество подгружаемых записей
              * кликом по кнопке "Ещё".
              * !Важно: в базе данных как листья, так и узлы являются записями. Поэтому необходимо учитывать, что в
              * количество записей считаются и узлы, и листья. Т.е. подсчёт идёт относительно полностью развёрнутого
              * представления данных. Например, узел с тремя листьями - это 4 записи.
              * </ul>
              * @example
              * <pre class="brush:xml">
              *     <option name="pageSize">10</option>
              * </pre>
              * @see setPageSize
              */
            pageSize: undefined,
            /**
             * @typedef {Object} GroupBy
             * @property {String} field Поле записи
             * @property {Function} method Метод группировки
             * @property {String} template Шаблон вёрстки (устаревший)
             * @property {String} contentTpl Шаблон вёрстки
             * @property {Function} render Функция визуализации
             */
            /**
             * @cfg {GroupBy} Настройка группировки записей
             * @remark
             * Если задать только поле записи(field), то будет группировать по типу лесенки (Пример 1).
             * Т.е. перед каждым блоком с одинаковыми данными будет создавать блок, для которого можно указать шаблон
             * Внимание! Для правильной работы группировки данные уже должны прийти отсортированные!
             * @example
             * 1:
             * <pre class="brush:xml">
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *    </options>
             * </pre>
             * Пример с указанием метода группировки:
             * <pre class="brush:xml">
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *         <option name="method" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myGroupBy</option>
             *    </options>
             * </pre>
             */
            groupBy : {},
            /**
             * @cfg {Function} Пользовательский метод добавления атрибутов на элементы коллекции
             * @noShow
             * @deprecated На текущий момент для быстрой отрисовки атрибуты задаются непосредственно в шаблоне. Опция будет удалена в 3.7.4.100.
             */
            userItemAttributes : null,
            /**
             * @cfg {String|HTMLElement|jQuery} Отображаемый контент при отсутствии данных
             * @example
             * <pre class="brush:xml">
             *     <option name="emptyHTML">Нет данных</option>
             * </pre>
             * @remark
             * Опция задаёт текст, отображаемый как при абсолютном отсутствии данных, так и в результате {@link groupBy фильтрации}.
             * @translatable
             * @see items
             * @see setDataSource
             * @see groupBy
             */
            emptyHTML: '',
            /**
             * @cfg {Object} Фильтр данных
             * @example
             * <pre class="brush:xml">
             *     <options name="filter">
             *        <option name="creatingDate" bind="selectedDocumentDate"></option>
             *        <option name="documentType" bind="selectedDocumentType"></option>
             *     </options>
             * </pre>
             */
            filter: {},
            /**
             * @cfg {Array} Сортировка данных. Задается массивом объектов, в котором ключ - это имя поля, а значение ASC - по возрастанию, DESC  - по убыванию
             * @example
             * <pre class="brush:xml">
             *     <options name="sorting" type="Array">
             *        <option name="date" value="ASC"></option>
             *        <option name="name" value="DESC"></option>
             *     </options>
             * </pre>
             */
            sorting: [],
            /**
             * @cfg {Object.<String,String>} соответствие опций шаблона полям в рекорде
             * @example
             * <pre>
             *    {{?it.item.get(it.templateBinding.photoFldName)}}
             *       <img src="{{=it.item.get(it.templateBinding.photoFldName).url}}" />
             *    {{?}}
             * </pre>
             */
            templateBinding: {},
            /**
             * @cfg {Object.<String,String>} подключаемые внешние шаблоны, ключу соответствует поле it.included.<...> которое будет функцией в шаблоне
             * @example
             * <pre>
             *    {{=it.includedTemplates.userTemplate(it)}}
             * </pre>
             */
            includedTemplates: {},
            /**
             * @cfg {String|function} Шаблон элементов, которые будт рисоваться под даннными.
             * @remark
             * Например, для отрисовки кнопки " + Документ ".
             * Если задан, то под всеми(!) элементами появится контейнер с содержимым этого шаблона
             * @example
             * <pre>
             *    <div>\
             *       <component data-component="SBIS3.CONTROLS.Link">\
             *          <option name="caption">+ Документ</option>\
             *       </component>\
             *    </div>
             * </pre>
             */
            footerTpl: undefined,
            /**
             * @cfg {String} Шаблон отображения содержимого каждого элемента коллекции
             * @example
             * <pre>
             *    {{=it.item.get("title")}}
             * </pre>
             */
            itemContentTpl : null,
            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * @example
             * <pre>
             *    <div class="listViewItem" style="height: 30px;">\
             *       {{=it.item.get("title")}}\
             *    </div>
             * </pre>
             */
            itemTpl : null,
            /**
             * @cfg {Function|null} Метод используется для сортировки элементов, принимает два
             * объекта вида {item:ProjectionItem, collectionItem: Model, index: Number, collectionIndex: Number} и
             * должен вернуть -1|0|1
             * @example
             * <pre>
             *      <option name="itemsSortMethod" type"function">SBIS3.Demo.Handlers.sort</option>
             * </pre>
             * <pre>
             *    sort: function(obj1, obj2) {
             *       return obj1.index - obj2.index
             *    }
             * </pre>
             * @see setItemsSortMethod
             * @see SBIS3.CONTROLS.Data.Projection.Collection#setSort
             */
            itemsSortMethod: undefined
         },
         _loader: null

      },

      around: {
         _modifyOptions : function(parentFnc, cfg) {
            var newCfg = parentFnc.call(this, cfg);
            newCfg._itemsTemplate = ItemsTemplate;
            if (newCfg.items) {
               if (newCfg.items instanceof Array) {
                  if (!newCfg.keyField) {
                     newCfg.keyField = findKeyField(newCfg.items);
                  }
                  newCfg._items = JSONToRecordset(cfg.items, newCfg.keyField);
               }
               else {
                  newCfg._items = cfg.items;
               }
               newCfg._itemsProjection = cfg._createDefaultProjection(cfg._items, cfg);
               if (cfg._canServerRender && !cfg.userItemAttributes && !cfg.itemTemplate && Object.isEmpty(cfg.groupBy)) {
                  newCfg._serverRender = true;
                  newCfg._itemData = cfg._buildTplArgs(cfg);
                  newCfg._records = cfg._getRecordsForRedraw(cfg._itemsProjection, cfg);
               }
            }

            return newCfg;
         }
      },

      $constructor: function () {
         this._publish('onDrawItems', 'onDataLoad', 'onDataLoadError', 'onBeforeDataLoad', 'onItemsReady', 'onPageSizeChange');
         if (typeof this._options.pageSize === 'string') {
            this._options.pageSize = this._options.pageSize * 1;
         }
         if (!this._options.keyField) {
            $ws.single.ioc.resolve('ILogger').log('Option keyField is undefined in control ' + this.getName());
         }
         this._bindHandlers();
         this._prepareItemsConfig();

         if (this._options.itemTemplate || this._options.userItemAttributes) {
            $ws.single.ioc.resolve('ILogger').log('ItemsControl', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Заданы itemTemplate или userItemAttributes');
         }

      },

      _prepareItemsConfig: function() {
         if (this._options.dataSource) {
            this._dataSource = this._prepareSource(this._options.dataSource);
         }
         /*Если уже вычислили все в modifyoptions а иначе все это стрельнет после reload*/
         if (this._options._itemsProjection) {
            this._setItemsEventHandlers();
            this._notify('onItemsReady');
            this._itemsReadyCallback();
            this._dataLoadedCallback();
         }
         /*TODO Поддержка совместимости. Раньше если были заданы items массивом создавался сорс, осталась куча завязок на это*/
         if (this._options.items instanceof Array) {
            if (!this._options.keyField) {
               this._options.keyField = findKeyField(this._options.items)
            }
            this._dataSource = new MemorySource({
               data: this._options.items,
               idProperty: this._options.keyField
            });
         }
      },


      _prepareConfig : function(sourceOpt, itemsOpt) {
         var keyField = this._options.keyField;

         if (!keyField) {
            $ws.single.ioc.resolve('ILogger').log('Option keyField is undefined in control ' + this.getName());
         }

         if (sourceOpt) {
            this._dataSource = this._prepareSource(sourceOpt);
         }

         if (itemsOpt) {
            if (itemsOpt instanceof Array) {
               if (!this._options.keyField) {
                  this._options.keyField = findKeyField(itemsOpt);
               }
               this._options._items = JSONToRecordset(itemsOpt, this._options.keyField);
            }
            else {
               this._options._items = itemsOpt;
            }
            this._options._itemsProjection = this._options._createDefaultProjection.call(this, this._options._items, this._options);
            this._setItemsEventHandlers();
            this._notify('onItemsReady');
            this._itemsReadyCallback();
         }
      },

      /**
       * Метод получения проекции по ID итема
       */
      _getItemProjectionByItemId: function(id) {
         return this._options._itemsProjection.getItemBySourceItem(this._options._items.getRecordById(id));
      },

      /**
       * Метод получения проекции по hash итема
       */
      _getItemProjectionByHash: function(hash) {
         return this._getItemsProjection().getByHash(hash);
      },

      /*переписанные методы для однопроходной отрисовки begin*/
      /*данные для отрисовки итемов через шаблон*/

      _groupByDefaultMethod: function (prevItem, item, field) {
         var
            curField = item.get(field),
            prevField = prevItem.get(field);
         return curField != prevField;
      },

      _prepareItemsData : function() {
         return {
            records : this._options._getRecordsForRedraw.call(this, this._options._itemsProjection, this._options)
         }
      },

      _prepareFullData: function() {
         //TODO копипаст
         var
            data,
            itemTpl = this._getItemTemplate();

         data = {
            items : this._options._getRecordsForRedraw(this._options._itemsProjection, this._options)
         };

         data.itemTemplate = TemplateUtil.prepareTemplate(itemTpl);
         data.itemsTemplate = this._options._itemsTemplate;
         return data;
      },

      _buildTplArgs : function() {
         return this._options._buildTplArgs.apply(this, arguments);
      },

      _prepareItemData: function() {
         var buildArgsMethod;
         if (this._options._canServerRender) {
            buildArgsMethod = this._options._buildTplArgs;
         }
         else {
            buildArgsMethod = this._buildTplArgs;
         }
         if (!this._itemData) {
            this._itemData = $ws.core.clone(buildArgsMethod.call(this, this._options));
         }
         return this._itemData;
      },

      _redrawItems : function() {
         this._groupHash = {};
         var
            $itemsContainer = this._getItemsContainer(),
            itemsContainer = $itemsContainer.get(0),
            data = this._prepareItemsData(),
            markup;

         data.tplData = this._prepareItemData();
         //TODO опять же, перед полной перерисовкой данные лесенки достаточно сбросить, чтобы она правильно отработала
         //Отключаем придрот, который включается при добавлении записи в список, который здесь нам не нужен
         var ladder = this._decorators && this._decorators.getByName('ladder');
         ladder && ladder.setIgnoreEnabled(true);
         ladder && ladder.reset();
         markup = ParserUtilities.buildInnerComponents(MarkupTransformer(this._options._itemsTemplate(data)), this._options);
         ladder && ladder.setIgnoreEnabled(false);
         //TODO это может вызвать тормоза
         this._destroyInnerComponents($itemsContainer);
         if (markup.length) {
            if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9) { // Для IE8-9 у tbody innerHTML - readOnly свойство (https://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx)
               $itemsContainer.append(markup);
            } else {
               itemsContainer.innerHTML = markup;
            }
         }
         this._toggleEmptyData(!(data.records && data.records.length) && this._options.emptyHTML);
         this._reviveItems();
         this._container.addClass('controls-ListView__dataLoaded');
      },

      _redrawItem: function(item) {
         var
            markup,
            targetElement = this._getDomElementByItem(item),
            itemContainer,
            data;
         if (targetElement.length) {
            data = this._prepareItemData();
            data.projItem = item;
            data.item = item.getContents();
            var dot;
            if (data.itemTpl) {
               dot = data.itemTpl;
            }
            else {
               dot = data.defaultItemTpl;
            }
            markup = ParserUtilities.buildInnerComponents(MarkupTransformer(dot(data)), this._options);
            /*TODO посмотреть не вызывает ли это тормоза*/
            this._clearItems(targetElement);
            /*TODO С этим отдельно разобраться*/

            targetElement.after(markup).remove();
            itemContainer = this._getDomElementByItem(item);
            this._ladderCompare([itemContainer.prev(), itemContainer, itemContainer.next()]);
            this._reviveItems();
            this._notifyOnDrawItems();
         }
      },

      _removeItem: function (item) {
         var targetElement = this._getDomElementByItem(item);
         if (targetElement.length) {
            this._clearItems(targetElement);
            /*TODO С этим отдельно разобраться*/

            this._ladderCompare([targetElement.prev(), targetElement.next()]);

            /*TODO Особое поведение при группировке*/
            if (!Object.isEmpty(this._options.groupBy)) {
               var prev = targetElement.prev();
               if (prev.length && prev.hasClass('controls-GroupBy')) {
                  var next = targetElement.next();
                  if (!next.length || next.hasClass('controls-GroupBy')) {
                     prev.remove();
                  }
               }
            }

            targetElement.remove();
         }
      },

      _getItemsForRedrawOnAdd: function(items) {
         return items;
      },

      _optimizedInsertMarkup: function(container, markup, prepend) {
         if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9) { // В IE8-9 insertAdjacentHTML ломает верстку при вставке
            container[prepend ? 'prepend' : 'append'](markup);
         } else {
            container.get(0).insertAdjacentHTML(prepend ? 'afterBegin' : 'beforeEnd', markup);
         }
      },

      _addItems: function(newItems, newItemsIndex) {
         this._itemData = null;
         var i;
         if (newItems && newItems.length) {
            if (this._isSlowDrawing()) {
               for (i = 0; i < newItems.length; i++) {
                  this._addItem(
                     newItems[i],
                     newItemsIndex + i,
                     true
                  );
                  this._notifyOnDrawItems();
               }
            }
            else {
               var
                  ladderDecorator,
                  itemsToDraw,
                  data,
                  markup,
                  item,
                  container, firstHash, lastHash, itemsContainer;

               /*TODO Лесенка*/
               if (this._options.ladder) {
                  ladderDecorator = this._decorators.getByName('ladder');
                  ladderDecorator && ladderDecorator.setMarkLadderColumn(true);
               }
               /*TODO Лесенка*/

               itemsToDraw = this._getItemsForRedrawOnAdd(newItems);
               if (itemsToDraw.length) {
                  data = {
                     records: itemsToDraw,
                     tplData: this._prepareItemData()
                  };
                  markup = ParserUtilities.buildInnerComponents(MarkupTransformer(this._options._itemsTemplate(data)), this._options);

                  itemsContainer = this._getItemsContainer();
                  if (newItemsIndex == 0) {

                     /*TODO Лесенка*/
                     if (this._options.ladder) {
                        firstHash = itemsToDraw[0].getHash();
                        var lastElem = $('.js-controls-ListView__item', itemsContainer).first();
                        if (lastElem.length) {
                           lastHash = lastElem.attr('data-hash');
                        }
                        else {
                           lastHash = itemsToDraw[itemsToDraw.length - 1].getHash();
                        }
                     }
                     /*TODO Лесенка*/

                     // TODO. Костыль для редактирования по месту. Написан тут, т.к. необходимо его убрать (решение не универсальное).
                     // https://inside.tensor.ru/opendoc.html?guid=8fe37872-c08b-4a7b-9c9f-d04f531cc45b
                     this._optimizedInsertMarkup(itemsContainer, markup, this._options._items.getCount() > 1);
                  }
                  else {
                     if ((newItemsIndex) == (this._options._itemsProjection.getCount() - newItems.length)) {
                        this._optimizedInsertMarkup(itemsContainer, markup, false);
                     }
                     else {
                        item = this._options._itemsProjection.at(newItemsIndex - 1);
                        container = this._getDomElementByItem(item);
                        container.after(markup);
                     }

                     /*TODO Лесенка*/
                     if (this._options.ladder) {
                        firstHash = $(container).attr('data-hash');
                        var nextCont = $(container).next('.js-controls-ListView__item');
                        if (nextCont.length) {
                           lastHash = $(nextCont).attr('data-hash');
                        }
                        else {
                           lastHash = itemsToDraw[itemsToDraw.length - 1].getHash();
                        }
                     }
                     /*TODO Лесенка*/

                  }

                  /*TODO Лесенка суть - надо пробежать по только что добавленным контейнерам и вызвать для них ladderCompare*/
                  if (this._options.ladder) {
                     var
                        rows = $('.js-controls-ListView__item', itemsContainer),
                        ladderRows = [], start = false;

                     for (i = 0; i < rows.length; i++) {
                        if ($(rows[i]).attr('data-hash') == firstHash) {
                           start = true;
                        }
                        if (start) {
                           ladderRows.push($(rows[i]));
                        }
                        if ($(rows[i]).attr('data-hash') == lastHash) {
                           start = false;
                           //Над i + 1 элементом изменилась запись, для него тоже нужна лесенка
                           if ($(rows[i + 1]).length){
                              ladderRows.push($(rows[i + 1]));
                           }
                           break;
                        }
                     }
                     this._ladderCompare(ladderRows);
                     /*TODO Лесенка*/
                  }

                  this._reviveItems();

                  /*TODO Лесенка*/
                  if (this._options.ladder) {
                     ladderDecorator && ladderDecorator.setMarkLadderColumn(false);
                  }
                  /*TODO Лесенка*/
               }
               this._notifyOnDrawItems();
            }
         }
      },

      _getDomElementByItem : function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-hash="' + item.getHash() + '"]')
      },

      _reviveItems : function() {
         this.reviveComponents().addCallback(this._notifyOnDrawItems.bind(this)).addErrback(function(e){
            throw e;
         });
      },

      _notifyOnDrawItems: function() {
         this._notify('onDrawItems');
         this._drawItemsCallback();
      },

      _clearItems: function (container) {
         /*TODO переписать*/
         container = container || this._getItemsContainer();
         /*Удаляем компоненты-инстансы элементов*/
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};
         if (container.length){
            var itemsContainers;
            //В случае, когда это полная перерисовка, надо дестроить контролы только в итемах и группировках
            if (container.get(0) == this._getItemsContainer().get(0)) {
               itemsContainers = $('.controls-ListView__item, .controls-GroupBy', container.get(0));
               /*Удаляем вложенные компоненты*/
               this._destroyControls(itemsContainers);

               /*Удаляем сами items*/
               itemsContainers.remove();
            }
            else {
               this._destroyControls(container);
            }

         }
      },

      _destroyInnerComponents: function(container) {
         this._destroyControls(container);
         if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9) { // Для IE8-9 у tbody innerHTML - readOnly свойство (https://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx)
            container.empty();
         } else {
            container.get(0).innerHTML = '';
         }
         if (container.get(0) === this._getItemsContainer().get(0)) {
            this._itemsInstances = {};
         }
      },

      _destroyControls: function(container){
         $('[data-component]', container).each(function (i, item) {
            var inst = item.wsControl;
            if (inst) {
               inst.destroy();
            }
         });
      },

      //TODO проверка для режима совместимости со старой отрисовкой
      _isSlowDrawing: function() {
         return !!this._options.itemTemplate || !!this._options.userItemAttributes || !Object.isEmpty(this._options.groupBy);
      },

      /*переписанные методы для однопроходной отрисовки end*/
      after : {
         _modifyOptions: function (opts) {
            opts.footerTpl = TemplateUtil.prepareTemplate(opts.footerTpl);
            return opts;
         },
         init : function(){
            if (this._options._items) {
               if (!this._options._serverRender) {
                  this.redraw()
               }
            }
            else if (this._dataSource) {
               this.reload();
            }
            if (this._options.pageSize) {
               this._limit = this._options.pageSize;
            }
            if (this._options._serverRender) {
               this._notifyOnDrawItems();
            }
         },
         destroy : function() {
            this._unsetItemsEventHandlers();
            if (this._options._itemsProjection) {
               this._options._itemsProjection.destroy();
               this._options._itemsProjection = null;
            }
            this._clearItems();
         }
      },

      _prepareSource: function(sourceOpt) {
         var result;
         switch (typeof sourceOpt) {
            case 'function':
               result = sourceOpt.call(this);
               break;
            case 'object':
               if ($ws.helpers.instanceOfMixin(sourceOpt, 'SBIS3.CONTROLS.Data.Source.ISource')) {
                  result = sourceOpt;
               }
               if ('module' in sourceOpt) {
                  var DataSourceConstructor = require(sourceOpt.module);
                  result = new DataSourceConstructor(sourceOpt.options || {});
               }
               break;
         }
         return result;
      },

      /**
       * Возвращает отображаемую контролом коллекцию, сделанную на основе источника данных
       * @param {SBIS3.CONTROLS.Data.Source.ISource} source
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       * @private
       */
      _convertDataSourceToItems: function (source) {
         return new ObservableList({
            source: source
         });
      },


      _bindHandlers: function () {
         /*this._onBeforeItemsLoad = onBeforeItemsLoad.bind(this);
         this._onAfterItemsLoad = onAfterItemsLoad.bind(this);
         this._dataLoadedCallback = this._dataLoadedCallback.bind(this);*/
         this._onCollectionChange = onCollectionChange.bind(this);
         this._onCollectionItemChange = onCollectionItemChange.bind(this);
         /*this._onCurrentChange = onCurrentChange.bind(this);*/
      },

      _setItemsEventHandlers: function() {
         this.subscribeTo(this._options._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.subscribeTo(this._options._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
      },

      _unsetItemsEventHandlers: function () {
         this.unsubscribeFrom(this._options._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.unsubscribeFrom(this._options._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
      },
       /**
        * Метод установки источника данных.
        * @remark
        * Данные могут быть заданы либо этим методом, либо опцией {@link items}.
        * @param source Новый источник данных.
        * @param noLoad Установить новый источник данных без запроса на БЛ.
        * @example
        * <pre>
        *     define(
        *     'SBIS3.MY.Demo',
        *     'js!SBIS3.CONTROLS.Data.Source.Memory',
        *     function(MemorySource){
        *        //коллекция элементов
        *        var arrayOfObj = [
        *           {'@Заметка': 1, 'Содержимое': 'Пункт 1', 'Завершена': false},
        *           {'@Заметка': 2, 'Содержимое': 'Пункт 2', 'Завершена': false},
        *           {'@Заметка': 3, 'Содержимое': 'Пункт 3', 'Завершена': true}
        *        ];
        *        //источник статических данных
        *        var ds1 = new MemorySource({
        *           data: arrayOfObj,
        *           idProperty: '@Заметка'
        *        });
        *        this.getChildControlByName("ComboBox 1").setDataSource(ds1);
        *     })
        * </pre>
        * @see dataSource
        * @see onDrawItems
        * @see onDataLoad
        */
      setDataSource: function (source, noLoad) {
          this._unsetItemsEventHandlers();
          this._itemsInitializedBySource = false;
          this._prepareConfig(source);
          if (!noLoad) {
             return this.reload();
          }
      },
      /**
       * Метод получения набора данных, который в данный момент установлен в представлении.
       * @example
       * <pre>
       *     var dataSet = myComboBox.getDataSet(),
       *     count = dataSet.getCount();
       *     if (count > 1) {
	   *        title.setText('У вас есть выбор: это хорошо!');
       *     }
       * </pre>
       * @see dataSource
       * @see setDataSource
       * @see onDrawItems
       * @see onDataLoad
       */

      /*TODO поддержка старого API*/
      getDataSet: function(compatibilityMode) {
         if(!compatibilityMode) {
            Utils.logger.stack('SBIS3.CONTROLS.ItemsControlMixin Получение DataSet явялется устаревшим функционалом используйте getItems()', 1);
         }
         return this._options._items;
      },
       /**
        * Метод перезагрузки данных.
        * Можно задать фильтрацию, сортировку.
        * @param {String} filter Параметры фильтрации.
        * @param {String} sorting Параметры сортировки.
        * @param offset Элемент, с которого перезагружать данные.
        * @param {Number} limit Ограничение количества перезагружаемых элементов.
        */
      reload: propertyUpdateWrapper(function (filter, sorting, offset, limit) {
         var
            def,
            self = this,
            filterChanged = typeof(filter) !== 'undefined',
            sortingChanged = typeof(sorting) !== 'undefined',
            offsetChanged = typeof(offset) !== 'undefined',
            limitChanged = typeof(limit) !== 'undefined';

         this._cancelLoading();
         if (filterChanged) {
            this.setFilter(filter, true);
         }
          if (sortingChanged) {
             this.setSorting(sorting, true);
          }
          this._offset = offsetChanged ? offset : this._offset;
          this._limit = limitChanged ? limit : this._limit;

          if (this._dataSource) {
             this._toggleIndicator(true);
             this._notify('onBeforeDataLoad');
             def = this._callQuery(this._getFilterForReload.apply(this, arguments), this.getSorting(), this._offset, this._limit)
                .addCallback($ws.helpers.forAliveOnly(function (list) {
                   self._toggleIndicator(false);
                   self._notify('onDataLoad', list);

                   if (this._itemsInitializedBySource) {
                      this._options._items.setMetaData(list.getMetaData());
                      this._options._items.assign(list);
                      if(!self._options.autoRedraw) {
                         self.redraw();
                      } else {
                         self._drawItemsCallback();
                      }
                   } else {
                      this._options._items = list;
                      this._options._itemsProjection = this._options._createDefaultProjection.call(this, this._options._items, this._options);
                      this._setItemsEventHandlers();
                      this._notify('onItemsReady');
                      this._itemsReadyCallback();
                      this._itemsInitializedBySource = true;
                      self.redraw();
                   }

                   this._dataLoadedCallback();

                   if (self._options.infiniteScroll === 'up'){
                      var firstItem = self._options._itemsProjection.at(0);
                      if (firstItem) {
                         self._scrollToItem(firstItem.getContents().getId());
                      }
                   }
                   //self._notify('onBeforeRedraw');
                   return list;
                }, self))
                .addErrback($ws.helpers.forAliveOnly(function (error) {
                   if (!error.canceled) {
                      self._toggleIndicator(false);
                      if (self._notify('onDataLoadError', error) !== true) {
                         $ws.helpers.message(error.message.toString().replace('Error: ', ''));
                         error.processed = true;
                      }
                   }
                   return error;
                }, self));
             this._loader = def;
          } else {
             if (this._options._itemsProjection) {
                this._redraw();
             }
             def = new $ws.proto.Deferred();
             def.callback();
          }

         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('sorting');
         this._notifyOnPropertyChanged('offset');
         this._notifyOnPropertyChanged('limit');

         return def;
      }),

      _getFilterForReload: function() {
         return this._options.filter;
      },

      _callQuery: function (filter, sorting, offset, limit) {
         if (!this._dataSource) {
            return;
         }
         var query = this._getQueryForCall(filter, sorting, offset, limit);

         return this._dataSource.query(query).addCallback((function(dataSet) {
            if (this._options.keyField && this._options.keyField !== dataSet.getIdProperty()) {
               dataSet.setIdProperty(this._options.keyField);
            }
            var recordSet = dataSet.getAll();
            recordSet.setMetaData(this._prepareMetaData(dataSet));
            return recordSet;
         }).bind(this));
      },

      _getQueryForCall: function(filter, sorting, offset, limit){
         var query = new Query();
         query.where(filter)
            .offset(offset)
            .limit(limit)
            .orderBy(sorting);
         return query;
      },

      _prepareMetaData: function(dataSet) {
         /*  надо создавать дефолтную модель, а не внедренную, т.к. в модели recordSet'a
             могут быть расчитываемые поля, которые ожидают что в модели будут гарантированно какие-то данные */
         var meta = dataSet.hasProperty('m') ?
             (new Model({
                rawData: dataSet.getProperty('m'),
                adapter: dataSet.getAdapter()
             })).toObject() :
             {};

         meta.results = dataSet.getProperty('r');
         meta.more = dataSet.getTotal();
         meta.path = dataSet.getProperty('p');

         return meta;
      },

      _toggleIndicator:function(){
         /*Method must be implemented*/
      },
      _toggleEmptyData:function() {
         /*Method must be implemented*/
      },
       /**
        * Метод установки количества элементов на одной странице.
        * @param {Number} pageSize Количество записей.
        * @param {Boolean} noLoad установить кол-во записей без запроса на БЛ.
        * @example
        * <pre>
        *     myListView.setPageSize(20);
        * </pre>
        * @remark
        * Метод задаёт/меняет количество записей при построении представления данных.
        * В случае дерева и иерархии:
        * <ul>
        *    <li>при пейджинге по скроллу опция также задаёт количество подгружаемых записей кликом по кнопке "Ещё";</li>
        *    <li>как листья, так и узлы являются записями, количество записей считается относительно полностью
        *    развёрнутого представления данных. Например, узел с тремя листьями - это 4 записи.</li>
        * </ul>
        * @see pageSize
        */
      setPageSize: function(pageSize, noLoad){
         this._options.pageSize = pageSize;
         this._dropPageSave();
         this._notify('onPageSizeChange', this._options.pageSize);
         if(!noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, pageSize);
         }
      },
      /**
       * Метод получения количества элементов на одной странице.
       * @see pageSize
       */
      getPageSize: function() {
         return this._options.pageSize
      },
      /**
       * Получить текущий фильтр в наборе данных
       * @returns {Object|*|ItemsControlMixin._filter}
       */
      getFilter: function() {
         return this._options.filter;
      },
      /**
       * Установить фильтр на набор данных
       * @param {Object} filter
       * @param {Boolean} noLoad установить фильтр без запроса на БЛ
       */
      setFilter: function(filter, noLoad){
         this._options.filter = filter;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         } else {
            this._notifyOnPropertyChanged('filter');
         }
      },
      /**
       * Получает текущую сортировку
       * @returns {Array}
       */
      getSorting: function() {
         return this._options.sorting;
      },
      /**
       * Устанавливает текущую сортировку
       */
      setSorting: function(sorting, noLoad) {
         this._options.sorting = sorting;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         }
      },
      /**
       * Получить текущий сдвиг навигации
       * @returns {Integer}
       */
      getOffset: function() {
         return this._offset;
      },
      /**
       * Устанавливает текущий сдвиг навигации
       */
      setOffset: function(offset) {
         this._offset = offset;
      },
      //переопределяется в HierarchyMixin
      _setPageSave: function(pageNum){
      },
      //переопределяется в HierarchyMixin
      _dropPageSave: function () {
      },
      /**
       * @deprecated метод будет удален в 3.7.4 используйте isLoading()
       * @private
       */
      _isLoading: function () {
         $ws.single.ioc.resolve('ILogger').log('ListView', 'Метод _isLoading() будет удален в 3.7.4 используйте isLoading()');
         return this.isLoading();
      },
      isLoading: function(){
         return this._loader && !this._loader.isReady();
      },
      //TODO Сделать публичным? вроде так всем захочется делать
      /**
       * После использования нужно присвоить null переданному loader самостоятельно!
       * @param loader
       * @private
       */
      _cancelLoading: function () {
         if (this.isLoading()) {
            this._loader.cancel();
         }
         this._loader = null;
      },
      //TODO поддержка старого - обратная совместимость
      getItems : function() {
         return this._options._items;
      },
      _getItemsProjection: function() {
         return this._options._itemsProjection;
      },
       /**
        * Метод установки либо замены коллекции элементов, заданных опцией {@link items}.
        * @param {Object} items Набор новых данных, по которому строится отображение.
        * @example
        * <pre>
        *     setItems: [
        *        {
        *           id: 1,
        *           title: 'Сообщения'
        *        },{
        *           id: 2,
        *           title: 'Прочитанные',
        *           parent: 1
        *        },{
        *           id: 3,
        *           title: 'Непрочитанные',
        *           parent: 1
        *        }
        *     ]
        * </pre>
        * @see items
        * @see addItem
        * @see getItems
        * @see onDrawItems
        * @see onDataLoad
        */
       setItems: function (items) {
          this._options.items = items;
          this._unsetItemsEventHandlers();
          this._options._items = null;
          this._itemsInitializedBySource = false;
          this._prepareConfig(undefined, items);
          this._notify('onDataLoad', this.getItems()); //TODO на это событие завязались. аккуратно спилить
          this._dataLoadedCallback(); //TODO на это завязаны хлебные крошки, нужно будет спилить
          this.redraw();

      },

      _drawItemsCallback: function () {
         /*Method must be implemented*/
      },
      /**
       * Метод перерисвоки списка без повторного получения данных
       */
      redraw: function() {
         this._itemData = null;
         if (this._isSlowDrawing()) {
            this._oldRedraw();
         }
         else {
            this._redrawItems();
         }
      },
      _redraw: function () {
         this.redraw();
      },
      _destroySearchBreadCrumbs: function(){
      },



      //метод определяющий в какой контейнер разместить определенный элемент
      _getTargetContainer: function (item) {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function () {
         return this._container;
      },

      /**
       * Метод перерисовки определенной записи
       * @param {Object} item Запись, которую необходимо перерисовать
       */
      redrawItem: function(item, projItem) {
         projItem = projItem || this._getItemProjectionByItemId(item.getId());
         var
            targetElement = this._getElementByModel(item),
            newElement = this._createItemInstance(projItem);/*раньше здесь звался _drawItem, но он звал лишнюю группировку, а при перерисовке одного итема она не нужна*/
         this._addItemAttributes(newElement, projItem);
         this._clearItems(targetElement);
         targetElement.after(newElement).remove();
         this.reviveComponents();
         this._notifyOnDrawItems();
      },

      _getElementByModel: function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + item.getKey() + '"]');
      },



      /**
       *
       * Из метода группировки можно вернуть Boolean - рисовать ли группировку
       * или Объект - {
       *    drawItem - рисовать ли текущую запись
       *    drawGroup - рисовавть ли группировку перед текущей записью
       * }
       * @param item
       * @param at
       */
      _group: function(item, at, last){
         var groupBy = this._options.groupBy,
               resultGroup,
               drawGroup,
               drawItem = true;
         if (this._canApplyGrouping(item)) {
            resultGroup = groupBy.method.apply(this, [item.getContents(), at, last, item]);
            drawGroup = typeof resultGroup === 'boolean' ? resultGroup : (resultGroup instanceof Object && resultGroup.hasOwnProperty('drawGroup') ? !!resultGroup.drawGroup : false);
            drawItem = resultGroup instanceof Object && resultGroup.hasOwnProperty('drawItem') ? !!resultGroup.drawItem : true;
            if (drawGroup){
               this._drawGroup(item.getContents(), at, last, item)
            }
         }
         return drawItem;
      },
      _drawGroup: function(item, at, last, projItem){
         var
               groupBy = this._options.groupBy,
               tplOptions = {
                  columns : $ws.core.clone(this._options.columns || []),
                  multiselect : this._options.multiselect,
                  hierField: this._options.hierField + '@'
               },
               targetContainer,
               itemInstance;
         targetContainer = this._getTargetContainer(item);
         tplOptions.item = item;
         tplOptions.colspan = tplOptions.columns.length + this._options.multiselect;
         itemInstance = this._buildTplItem(projItem, groupBy.template(tplOptions));
         //Навесим класс группировки и удалим лишний класс на item, если он вдруг добавился
         itemInstance.addClass('controls-GroupBy')
            .removeClass('controls-ListView__item');
         this._appendItemTemplate(item, targetContainer, itemInstance, at);
         //Сначала положим в дом, потом будем звать рендеры, иначе контролы, которые могут создать в рендере неправмльно поймут свою ширину
         if (groupBy.render && typeof groupBy.render === 'function') {
            groupBy.render.apply(this, [item, itemInstance, last]);
         }

      },
      /**
       * Установка группировки элементов. Если нужно, чтобы стандартаная группировка для этого элемента не вызывалась -
       * нужно обязательно переопределить(передать) все опции (field, method, template, render) иначе в группировку запишутся стандартные параметры.
       * @remark Всем элементам группы добавляется css-класс controls-GroupBy
       * @param group
       * @param redraw
       */
      setGroupBy : function(group, redraw){
         //TODO может перерисовку надо по-другому делать
         this._options.groupBy = group;
         // запросим данные из источника
         if (!Object.isEmpty(this._options.groupBy)){
            if (!this._options.groupBy.hasOwnProperty('method')){
               this._options.groupBy.method = this._oldGroupByDefaultMethod;
            }
            if (!this._options.groupBy.hasOwnProperty('template')){
               this._options.groupBy.template = this._getGroupTpl();
            }
            if (!this._options.groupBy.hasOwnProperty('render')){
               this._options.groupBy.render = this._groupByDefaultRender;
            }

         }
         if (redraw){
            this._redraw();
         }
      },
      _getGroupTpl : function(){
         throw new Error('Method _getGroupTpl() must be implemented');
      },
      _groupByDefaultRender: function(){
         throw new Error('Method _groupByDefaultRender() must be implemented');
      },

      _fillItemInstances: function () {
         var childControls = this.getChildControls();
         for (var i = 0; i < childControls.length; i++) {
            if (childControls[i].getContainer().hasClass('controls-ListView__item')) {
               var id = childControls[i].getContainer().attr('data-id');
               this._itemsInstances[id] = childControls[i];
            }
         }

      },
       /**
        * Метод получения элементов коллекции.
        * @returns {*}
        * @example
        * <pre>
        *     var ItemsInstances = Menu.getItemsInstances();
        *     for (var i = 0; i < ItemsInstances.length; i++){
        *        ItemsInstances[i].setCaption('Это пункт меню №' + ItemsInstances[i].attr('data-id'));
        *     }
        * </pre>
        */
      getItemsInstances: function () {
         if (Object.isEmpty(this._itemsInstances)) {
            this._fillItemInstances();
         }
         return this._itemsInstances;
      },
       /**
        * Метод получения контрола по идентификатору элемента коллекции.
        * @param {String|Number|*} id Идентификатор элемента коллекции.
        * @returns {*} Возвращает:
        * <ul>
        *    <li>для группы радиокнопок - соответствующую радиокнопку;</li>
        *    <li>для группы флагов - соответствующий флаг;</li>
        *    <li>для меню - соответствующий элемент меню.</li>
        * </ul>
        * @example
        * <pre>
        *     Menu.getItemsInstance(3).setCaption('SomeNewCaption');
        * </pre>
        * @see getItems
        * @see setItems
        * @see items
        * @see getItemInstances
        */
      getItemInstance: function (id) {
         var instances = this.getItemsInstances();
         return instances[id];
      },
      //TODO Сделать публичным? И перенести в другое место
      _hasNextPage: function (hasMore, offset) {
         offset = offset === undefined ? this._offset : offset;
         //n - приходит true, false || общее количество записей в списочном методе
         //Если offset отрицательный, значит запрашивали последнюю страницу
         return offset < 0 ? false : (typeof (hasMore) !== 'boolean' ? hasMore > (offset + this._options.pageSize) : !!hasMore);
      },
      _scrollTo: function scrollTo(target, container) {
         var scrollContainer = container || this._getScrollContainer(),
             scrollContainerOffset = scrollContainer.offset(),
             targetOffset;

         if (typeof target === 'string') {
            target = $(target);
         }

         targetOffset = target.offset();

         if( (targetOffset.top - scrollContainerOffset.top - scrollContainer.scrollTop()) < 0) {
            target[0].scrollIntoView(true);
         } else if ( (targetOffset.top + target.height() - scrollContainerOffset.top - scrollContainer.scrollTop()) > scrollContainer[0].clientHeight) {
            target[0].scrollIntoView(false);
         }
      },
      _scrollToItem: function(itemId) {
         var itemContainer  = $(".controls-ListView__item[data-id='" + itemId + "']", this._getItemsContainer());
         if (itemContainer.length) {
            this._scrollTo(itemContainer);
         }
      },
      /**
       * Установить что отображается при отсутствии записей.
       * @param html Содержимое блока.
       * @example
       * <pre>
       *     DataGridView.setEmptyHTML('Нет записей');
       * </pre>
       * @see emptyHTML
       */
      setEmptyHTML: function (html) {
         this._options.emptyHTML = html;
      },

      /**
       * Возвращает источник данных.
       * @returns {*}
       */
      getDataSource: function(){
         return this._dataSource;
      },

      _getScrollContainer: function() {

      },
      _dataLoadedCallback: function () {

      },
      _itemsReadyCallback: function() {

      },

      _ladderCompare: function(rows){
         var ladderDecorator = this._decorators.getByName('ladder');
         if (ladderDecorator && ladderDecorator.isIgnoreEnabled()){
            return;
         }
         //TODO придрот - метод нужен только для адекватной работы лесенки при перемещении элементов местами
         for (var i = 1; i < rows.length; i++){
            var upperRow = $(rows[i - 1]).length ? $('.controls-ladder', rows[i - 1]) : undefined,
                lowerRow = $(rows[i]).length ? $('.controls-ladder', rows[i]) : undefined,
               needHide;
            if (lowerRow) {
               for (var j = 0; j < lowerRow.length; j++) {
                  needHide = upperRow ? (upperRow.eq(j).html() == lowerRow.eq(j).html()) : false;
                  lowerRow.eq(j).toggleClass('ws-invisible', needHide);
               }
            }
         }
      },
      _isNeedToRedraw: function(){
         //Проверяем _needToRedraw для поддержки старой медленной отрисовки
      	return !!this._getItemsContainer() && this._needToRedraw;
      },

      _changeItemProperties: function(item, property) {
         if (this._isSlowDrawing()) {
            this.redrawItem(item.getContents(), item);
         }
         else {
            this._redrawItem(item);
         }
      },

      _getItemContainerByIndex: function(parent, at) {
         return parent.find('> .controls-ListView__item:eq(' + at + ')');
      },

      _getItemContainer: function(parent, item) {
         return parent.find('>[data-id="' + item.getId() + '"]');
      },



      /*TODO старый код связанный с медленной отрисовкой*/
      _oldRedraw: function () {
         var records;

         if (this._options._items) {
            this._clearItems();
            this._needToRedraw = false;
            records = this._options._getRecordsForRedraw.call(this, this._options._itemsProjection, this._options);
            this._toggleEmptyData(!records.length && this._options.emptyHTML);
            this._drawItems(records);
         }
         /*класс для автотестов*/
         this._container.addClass('controls-ListView__dataLoaded');
      },
      _drawItem: function (item, at, last) {
         var
            itemInstance;
         //Запускаем группировку если она есть. Иногда результат попадает в группровку и тогда отрисовывать item не надо
         if (this._group(item, at, last) !== false) {
            itemInstance = this._createItemInstance(item);
            this._addItemAttributes(itemInstance, item);
         }
         return itemInstance;
      },

      _drawAndAppendItem: function(item, at, last) {
         var
            itemInstance = this._drawItem(item, at, last);
         if (itemInstance) {
            this._appendItemTemplate(item, this._getTargetContainer(item.getContents()), itemInstance, at);
         }
      },


      _getItemTemplate: function (item) {
         if (this._options.itemTemplate) {
            return this._options.itemTemplate;
         }
         else {
            return this._options._defaultItemTemplate;
         }
      },

      _drawItems: function (items, at) {
         var
            curAt = at;
         if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
               var projItem;
               if (items[i].getContents) {
                  projItem = items[i]
               }
               else {
                  projItem = this._options._itemsProjection.getItemBySourceItem(items[i]);
               }

               this._drawAndAppendItem(projItem, curAt, i === items.length - 1);
               if (curAt && curAt.at) {
                  curAt.at++;
               }
            }
            this.reviveComponents().addCallback(this._notifyOnDrawItems.bind(this)).addErrback(function(e){
               throw e;
            });
         } else {
            this._notifyOnDrawItems();
         }
      },

      /*TODO второй параметр нужен для поддержи старой группировки*/
      _buildTplItem: function(item, altTpl){
         var itemTpl, dotTemplate;
         if (altTpl !== undefined) {
            itemTpl = altTpl;
         }
         else {
            itemTpl = this._getItemTemplate(item);
         }
         dotTemplate = TemplateUtil.prepareTemplate(itemTpl);

         if (typeof dotTemplate == 'function') {
            var args = this._prepareItemData(), buildedTpl;
            args['projItem'] = item;
            args['item'] = item.getContents();
            buildedTpl = dotTemplate(args);
            //TODO нашлись умники, которые в качестве шаблона передают функцию, возвращающую jquery
            //в 200 пусть поживут, а в новой отрисовке, отпилим у них
            if (buildedTpl instanceof $) {
               buildedTpl = buildedTpl.get(0).outerHTML;
            }
            return $(ParserUtilities.buildInnerComponents(MarkupTransformer(buildedTpl), this._options));
         } else {
            throw new Error('Ошибка в itemTemplate');
         }
      },

      _canApplyGrouping: function(projItem) {
         var
             itemParent = projItem.getParent && projItem.getParent();
         return !Object.isEmpty(this._options.groupBy) && (!itemParent || itemParent.isRoot());
      },

      _addItem: function (projItem, at, withoutNotify) {
         var
            item = projItem.getContents(),
            ladderDecorator = this._decorators.getByName('ladder'),
            canApplyGrouping = this._canApplyGrouping(projItem),
            previousGroupBy = this._previousGroupBy;//После добавления записи восстанавливаем это значение, чтобы не сломалась группировка
         ladderDecorator && ladderDecorator.setMarkLadderColumn(true);
         /*TODO отдельно обрабатываем случай с группировкой*/
         var flagAfter = false;
         if (canApplyGrouping) {
            var
               meth = this._options.groupBy.method,
               prev = this._options._itemsProjection.getPrevious(projItem),
               next = this._options._itemsProjection.getNext(projItem);
            if(prev)
               meth.call(this, prev.getContents(), undefined, undefined, prev);
            meth.call(this, item, undefined, undefined, projItem);
            if (next && !meth.call(this, next.getContents(), undefined, undefined, next)) {
               flagAfter = true;
            }
         }
         /**/
         var target = this._getTargetContainer(projItem),
            currentItemAt = at > 0 ? this._getItemContainerByIndex(target, at - 1) : null,
            template = this._getItemTemplate(projItem),
            newItemContainer = this._buildTplItem(projItem, template),
            rows;
         this._addItemAttributes(newItemContainer, projItem);
         if (flagAfter) {
            newItemContainer.insertBefore(this._getItemContainerByIndex(target, at));
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else if (currentItemAt && currentItemAt.length) {
            meth && meth.call(this, prev.getContents(), undefined, undefined, prev);
            newItemContainer.insertAfter(currentItemAt);
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else if(at === 0) {
            this._previousGroupBy = undefined;
            newItemContainer.prependTo(target);
            rows = [newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else {
            newItemContainer.appendTo(target);
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next()];
         }
         if (canApplyGrouping) {
            this._group(projItem, {at: at});
            this._previousGroupBy = previousGroupBy;
         }
         ladderDecorator && ladderDecorator.setMarkLadderColumn(false);
         this._ladderCompare(rows);
         if (!withoutNotify) {
            this._notifyOnDrawItems();
         }
      },

      _addItemAttributes: function (container, item) {
         var strKey = item.getContents().getId();
         if (strKey == null) {
            strKey += '';
         }
         container.attr('data-id', strKey).addClass('controls-ListView__item');
         container.attr('data-hash', item.getHash());
         if (this._options.userItemAttributes && this._options.userItemAttributes instanceof Function) {
            this._options.userItemAttributes(container, item.getContents());
         }
      },

      _createItemInstance: function (item) {
         return this._buildTplItem(item, this._getItemTemplate(item));
      },
      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl, at) {
         if (at && (typeof at.at !== 'undefined')) {
            var atContainer = at.at !== 0 && $('.controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at-1);
            if (atContainer.length) {
               atContainer.after(itemBuildedTpl);
            }
            else {
               atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at);
               if (atContainer.length) {
                  atContainer.before(itemBuildedTpl);
               } else {
                  targetContainer.append(itemBuildedTpl);
               }
            }
         }
         else {
            targetContainer.append(itemBuildedTpl);
         }
      },
      _onCollectionReplace: function(items) {
         var i;
         for (i = 0; i < items.length; i++) {
            this._changeItemProperties(items[i]);
            /*this._redrawItem(
               items[i]
            );*/
         }
      },
      _onCollectionRemove: function(items, notCollapsed) {
         var i;
         for (i = 0; i < items.length; i++) {
            this._removeItem(
               items[i]
            );
         }
      },
      _onCollectionAddMoveRemove: function(event, action, newItems, newItemsIndex, oldItems) {
         this._onCollectionRemove(oldItems, action === IBindCollection.ACTION_MOVE);
         var ladderDecorator = this._decorators.getByName('ladder');
         //todo опять неверно вызывается ladderCompare, используем костыль, чтобы этого не было
         if ((action === IBindCollection.ACTION_MOVE) && ladderDecorator){
            ladderDecorator.setIgnoreEnabled(true);
         }
         if (newItems.length) {
            this._addItems(newItems, newItemsIndex)
         }
         if ((action === IBindCollection.ACTION_MOVE) && ladderDecorator){
            ladderDecorator.setIgnoreEnabled(false);
         }
         this._toggleEmptyData(!this._options._itemsProjection.getCount());
         //this._view.checkEmpty(); toggleEmtyData
         this.reviveComponents(); //надо?
         this._drawItemsCallback();
      },
      /**
       * Устанавливает метод сортировки элементов на клиенте.
       * @param {Function} sort функция сортировка элементов, если передать undefined сортировка сбросится
       * @see SBIS3.CONTROLS.Data.Projection.Collection:setSort
       */
      setItemsSortMethod: function(sort){
         this._options.itemsSortMethod = sort;
         if(this._options._itemsProjection) {
            this._options._itemsProjection.setSort(sort);
         }
      },
      /**
       * Возвращает последний элемент по проекции
       * @return {SBIS3.CONTROLS.Data.Model}
       */
      getLastItemByProjection: function(){
         if(this._options._itemsProjection && this._options._itemsProjection.getCount()) {
            return this._options._itemsProjection.at(this._options._itemsProjection.getCount()-1).getContents();
         }
      }
   };

   var
      onCollectionItemChange = function(eventObject, item, index, property){
         if (this._isNeedToRedraw()) {
            this._changeItemProperties(item, property);
            this._drawItemsCallback();
         }
      },
      /**
       * Обрабатывает событие об изменении коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem[]} newItems Новые элементы коллеции.
       * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem[]} oldItems Удаленные элементы коллекции.
       * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems) {
         if (this._isNeedToRedraw()) {
	         switch (action) {
	            case IBindCollection.ACTION_ADD:
               case IBindCollection.ACTION_MOVE:
               case IBindCollection.ACTION_REMOVE:
                  if (action === IBindCollection.ACTION_MOVE && !Object.isEmpty(this._options.groupBy)) {
                     this.redraw(); //TODO костыль, пока не будет группировки на стороне проекции.
                  } else {
                     this._onCollectionAddMoveRemove.apply(this, arguments);
                  }
	               break;

	            case IBindCollection.ACTION_REPLACE:
	               this._onCollectionReplace(newItems);
	               this.reviveComponents();
                  this._drawItemsCallback();
	               break;

	            case IBindCollection.ACTION_RESET:
	               this.redraw();
	               break;
	         }
      	}
      };
   return ItemsControlMixin;

});