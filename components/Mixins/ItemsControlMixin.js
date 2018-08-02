define('SBIS3.CONTROLS/Mixins/ItemsControlMixin', [
   'Core/core-clone',
   "Core/Deferred",
   "Core/IoC",
   "Core/core-merge",
   "WS.Data/Source/Memory",
   "WS.Data/Collection/RecordSet",
   "WS.Data/Query/Query",
   "WS.Data/Collection/ObservableList",
   "WS.Data/Display/Display",
   "WS.Data/Collection/IBind",
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "tmpl!SBIS3.CONTROLS/Mixins/ItemsControlMixin/resources/ItemsTemplate",
   "tmpl!SBIS3.CONTROLS/Mixins/ItemsControlMixin/resources/defaultItemTemplate",
   "WS.Data/Utils",
   'Core/markup/ParserUtilities',
   "Core/Sanitize",
   "Lib/LayoutManager/LayoutManager",
   "Core/core-instance",
   "SBIS3.CONTROLS/Utils/InformationPopupManager",
   "Core/helpers/Function/forAliveOnly",
   'Core/helpers/String/escapeHtml',
   "SBIS3.CONTROLS/Utils/SourceUtil",
   "Core/helpers/Object/isEmpty",
   "Core/helpers/Function/debounce",
   "Lib/Control/Control",
   "WS.Data/Display/Collection",
   "WS.Data/Display/Enum",
   "WS.Data/Display/Flags"
], function (
   coreClone,
   Deferred,
   IoC,
   cMerge,
   MemorySource,
   RecordSet,
   Query,
   ObservableList,
   Projection,
   IBindCollection,
   TemplateUtil,
   ItemsTemplate,
   defaultItemTemplate,
   Utils,
   ParserUtilities,
   Sanitize,
   LayoutManager,
   cInstance,
   InformationPopupManager,
   forAliveOnly,
   escapeHtml,
   SourceUtil,
   isEmpty,
   debounce,
   baseControl) {

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }
   var createDefaultProjection = function(items, cfg) {
      var proj, projCfg = {};
      projCfg.idProperty = cfg.idProperty || ((cfg.dataSource && typeof cfg.dataSource.getIdProperty === 'function') ? cfg.dataSource.getIdProperty() : '');
      if (cfg.itemsSortMethod) {
         projCfg.sort = cfg.itemsSortMethod;
      }
      if (cfg.itemsFilterMethod) {
         projCfg.filter = cfg.itemsFilterMethod;
      }
      if (cfg.loadItemsStrategy == 'merge') {
         projCfg.unique = true;
      }
      proj = Projection.getDefaultDisplay(items, projCfg);
      return proj;
   },

   prepareGroupId = function(item, groupId, cfg) {
      //делаем id группы строкой всегда, чтоб потом при обращении к id из верстки не ошибаться
      return groupId + '';
   },

   getGroupId = function(item, cfg) {
      return cfg.groupBy.method ? cfg.groupBy.method.apply(this, arguments) : item.get(cfg.groupBy.field);
   },

   applyGroupingToProjection = function(projection, cfg) {
      if (!isEmpty(cfg.groupBy) && cfg.easyGroup) {
         var
            method = function(item) {
               var
                  groupId = cfg._getGroupId(item, cfg);
               if (groupId !== false) {
                  groupId = cfg._prepareGroupId(item, groupId, cfg);
               }
               return groupId;
            };
         projection.setGroup(method);
      }
      else {
         projection.setGroup(null);
      }
      return projection;
   },
   applyFilterToProjection = function(projection, cfg) {
      projection.setFilter(cfg.itemsFilterMethod);
   },

   _oldGroupByDefaultMethod = function (record, at, last, item) {
      var curField = record.get(this._options.groupBy.field),
         result = curField !== this._previousGroupBy;
      this._previousGroupBy = curField;
      return result;
   },

   getPropertyValue = function(itemContents, field) {
      //todo Как только в сборку добавят модуль controls, то вместо этого метода нужно использовать
      //js!Controls/List/resources/utils/ItemsUtil метод getPropertyValue
      if (typeof itemContents == 'string') {
         return itemContents;
      }
      else {
         return Utils.getItemPropertyValue(itemContents, field);
      }
   },

   canApplyGrouping = function(projItem, cfg) {
      // todo сильносвязанный код. Если пустой projItem, значит мы сюда попали из onCollectionAdd и единственная добавляемая запись - это сама группа
      // https://online.sbis.ru/opendoc.html?guid=c02d2545-1afa-4ada-8618-7a21eeadc375
      // Если сортировка не задана - то разрешена группировка всех записей - и листьев и узлов
      return !isEmpty(cfg.groupBy) && (cfg._itemsProjection.getSort().length === 0 || !projItem || !projItem.isNode || !projItem.isNode());
   },

   getGroupTemplate = function(cfg) {
      return cfg._groupTemplate;
   },

   groupItemProcessing = function(groupId, records, item, cfg, groupHash) {
      if (cfg._canApplyGrouping(item, cfg)) {
         var
            groupBy = cfg.groupBy,
            groupTemplate = cfg._getGroupTemplate(cfg);
         if (groupTemplate) {
            var
               tplOptions = {
                  columns : coreClone(cfg.columns || []),
                  items: cfg._items,
                  multiselect : cfg.multiselect,
                  hierField: cfg.hierField + '@',
                  parentProperty: cfg.parentProperty,
                  nodeProperty: cfg.nodeProperty,
                  item: item.getContents(),
                  groupContentTemplate: TemplateUtil.prepareTemplate(groupBy.contentTemplate || ''),
                  groupId: groupId,
                  groupHash: groupHash,
                  groupCollapsing: cfg._groupCollapsing
               };
            tplOptions.colspan = tplOptions.columns.length + cfg.multiselect;

            records.push({
               tpl: TemplateUtil.prepareTemplate(groupTemplate),
               data: tplOptions
            })
         }
      }
   },

   getRecordsForRedraw = function(projection, cfg) {
      var
         records = [];
      if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
         var needGroup = false, groupId, groupHash;
         projection.each(function (item, index) {
            if (cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
               groupId = item.getContents();
               groupHash = item.getHash();
               needGroup = true;
            }
            else {
               if (!isEmpty(cfg.groupBy) && cfg.easyGroup) {
                  if (needGroup && groupId) {
                     cfg._groupItemProcessing(groupId, records, item, cfg, groupHash);
                     needGroup = false;
                  }
               }
               records.push(item);
            }
         });
      }
      return records;
   },
   buildTplArgs = function(cfg) {
      var tplOptions = {},
          self = this,
          timers = {},
          itemTpl, itemContentTpl, logger;

      tplOptions.escapeHtml = escapeHtml;
      tplOptions.Sanitize = Sanitize;
      tplOptions.idProperty = cfg.idProperty;
      tplOptions.displayField = cfg.displayProperty;
      tplOptions.displayProperty = cfg.displayProperty;
      tplOptions.templateBinding = cfg.templateBinding;
      tplOptions.getPropertyValue = cfg._propertyValueGetter;

      /* Для логирования */
      if(typeof window === 'undefined') {
         logger = IoC.resolve('ILogger');
         tplOptions.timeLogger = function timeLogger(tag, start) {
            if(start) {
               timers[tag] = new Date();
            } else {
               logger.log(self._moduleName || cfg.name, tag + ' ' + ((new Date()) - timers[tag]));
               delete timers[tag];
            }
         };
      }

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
   canServerRenderOther = function(cfg) {
      return !cfg.itemTemplate;
   },
   findIdProperty  = function(json){
      var itemFirst = json[0];
      if (itemFirst) {
         return Object.keys(json[0])[0];
      }
   },
   JSONToRecordset  = function(json, idProperty) {
      return new RecordSet({
         rawData : json,
         idProperty : idProperty
      })
   },
   extendedMarkupCalculate = function(markup, cfg) {
      return ParserUtilities.buildInnerComponentsExtended(markup, cfg);
   };
   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    *
    * Далее приведена последовательность событий, происходящих при взаимодействии с источником данных компонента:
    *
    * 1. Перед выполнением запроса к источнику данных - {@link onBeforeDataLoad}.
    * 2. При успешном выполнении запроса: {@link onDataLoad} &#8594; {@link onItemsReady}.
    * 3. При ошибке выполнения запроса: {@link onDataLoadError}.
    *
    * @mixin SBIS3.CONTROLS/Mixins/ItemsControlMixin
    * @public
    * @author Крайнов Д.О.
    */
   var ItemsControlMixin = /**@lends SBIS3.CONTROLS/Mixins/ItemsControlMixin.prototype  */{
       /**
        * @event onDrawItems Происходит после отрисовки всех элементов коллекции.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @example
        * <pre>
        *     Menu.subscribe('onDrawItems', function() {
        *        if (Menu.getItemInstance(2).getCaption() == 'Входящие') {
        *           Menu.getItemInstance(2).destroy();
        *        }
        *     });
        * </pre>
        * @see items
        * @see displayProperty
        */
       /**
        * @event onBeforeDataLoad Происходит перед выполнением запроса к источнику данных компонента.
        * @remark
        * В обработчике события Вы можете изменить параметры, с которыми впоследствии будет выполнен запрос.
        * Конфигурацию источника данных устанавливают в опции {@link dataSource}.
        * Выполнение запроса можно инициировать методом {@link reload}.
        * В <a href="/docs/js/SBIS3/CONTROLS/ItemsControlMixin/">описании миксина</a> приведена последовательность событий, происходящих при взаимодействии с источником данных компонента.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {Object} filters Параметры фильтрации. Они используются в качестве условия для отбора возвращаемых записей. Значение параметра определяется опцией {@link filter}.
        * @param {Array.<Object>} sorting Параметры сортировки записей, возвращаемых в результате выполнения запроса. Значение параметра  определяется опцией {@link sorting}.
        * @param {Number} offset Количество записей в источнике данных, которые будут пропущены перед формированием результирующей выборки. Значение параметра определяется методом {@link setOffset} или с помощью аргумента offset в методе {@link reload}.
        * @param {Number} limit Количество записей, возвращаемых из источника данных в результате выполнения запроса. Значение определяется опцией {@link pageSize}.
        * @example
        * <pre>
        *    myView.subscribe('onBeforeDataLoad', function(eventObject, filters, sorting, offset, limit) {
        *
        *       // Устанавливаем новое значение для поля, по которому отбираются записи.
        *       filters['SomeField'] = newFieldValue;
        *
        *       // Устанавливаем новые параметры сортировки.
        *       sorting = newSortingValue;
        *
        *       // В итоге запрос к источнику данных компонента будет выполнен с новыми значениями.
        *    });
        * </pre>
        * @see onDataLoad
        * @see reload
        */

       /**
        * @event onDataLoad Происходит после успешного выполнения запроса к источнику данных компонента.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {WS.Data/Collection/RecordSet} dataSet Результирующих набор записей.
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
       * @event onDataLoadError Происходит в случае ошибки при выполнении запроса к источнику данных компонента.
       * @remark
       * В результате выполнения метода бизнес-логики была получена ошибка.
       * В случае разрыва соеднинения с БД (сервером) сообщение об ошибке не выводится.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {HTTPError} error HTTP-статус.
       * @return {Boolean} Из обработчика события можно возвращать следующие результаты:
       * <ol>
       *    <li>true. Ответ интерпретируется так, что ошибка была обработана, и в пользовательском интерфейсе не требуется создавать сообщение об ошибке.</li>
       *    <li>false. В пользовательском интерфейсе создаётся сообщение с описанием ошибки.</li>
       * </ol>
       * @example
       * <pre>
       *    myView.subscribe('onDataLoadError', function(eventObject, error) {
       *       eventObject.setResult(true);
       *       TextBox.setText('Ошибка при загрузке данных');
       *    });
       * </pre>
       */
      /**
       * @event onItemsReady Происходит при готовности экземпляра коллекции {@link WS.Data/Collection/IList}.
       * @remark
       * Например когда представлению задается Source и нужно подписаться на события List, который вернется в результате запроса
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    myView.subscribe('onItemsReady', function(event) {
       *       var items = this.getItems();
       *       items.subscribe('onCollectionChange', function() {
       *          alert('Collection is changed')
       *       })
       *    });
       * </pre>
       */
      $protected: {
         _itemData : null,
         _groupHash: {},
         _itemsInstances: {},
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _revivePackageParams: {},
         _options: {
            _getGroupTemplate: getGroupTemplate,
            _groupCollapsing: {},
            _itemsTemplate: ItemsTemplate,
            _propertyValueGetter: getPropertyValue,
            _canServerRender: false,
            _canServerRenderOther : canServerRenderOther,
            _serverRender: false,
            _defaultItemTemplate: defaultItemTemplate,
            _defaultItemContentTemplate: defaultItemTemplate,
            _prepareGroupId: prepareGroupId,
            _getGroupId: getGroupId,
            _createDefaultProjection : createDefaultProjection,
            _buildTplArgsSt: buildTplArgs,
            _buildTplArgs : buildTplArgs,
            _getRecordsForRedrawSt: getRecordsForRedraw,
            _getRecordsForRedraw: getRecordsForRedraw,
            _applyGroupingToProjection: applyGroupingToProjection,
            _applyFilterToProjection: applyFilterToProjection,

            _groupItemProcessing: groupItemProcessing,
            /*TODO ременные переменные для группировки*/
            _canApplyGrouping: canApplyGrouping,

            /**
             * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
             * @deprecated Используйте опцию {@link idProperty}.
             */
            keyField : null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента.
             * @example
             * <pre class="brush:xml">
             *     <option name="idProperty">Идентификатор</option>
             * </pre>
             * @see items
             * @see displayProperty
             * @see setDataSource
             * @see SBIS3.CONTROLS/Mixins/Selectable#selectedKey
             * @see SBIS3.CONTROLS/Mixins/Selectable#setSelectedKey
             * @see SBIS3.CONTROLS/Mixins/Selectable#getSelectedKey
             */
            idProperty : null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, из которого отображать данные.
             * @deprecated Используйте опцию {@link displayProperty}.
             */
            displayField: null,
            /**
             * @cfg {String} Имя поля, данные которого будут по умолчанию отображены в шаблоне элемента коллекции.
             * @remark
             * Например, для списочного контрола {@link SBIS3.CONTROLS/ListView} по умолчанию предустановлен шаблон, по которому происходит построение каждой записи списка.
             * В этом шаблоне выводится содержимое того поля записи, которое установлено в опции **displayProperty**.
             * Поэтому для списка класса SBIS3.CONTROLS/ListView использование опции актуально в тех случаях, когда применяется шаблон по умолчанию.
             * Для любых других контролов, в которые подмешан миксин SBIS3.CONTROLS.ItemControlMixin, опция displayProperty может быть использована по-другому.
             * @see setDisplayProperty
             */
            displayProperty: null,
             /**
              * @cfg {Array.<Object>} Набор отображаемых данных.
              * @remark
              * Чтобы компонент смог показать items, необходимо задать значения опциям {@link idProperty} и {@link displayProperty}.
              * 
              * <pre>
              *     <SBIS3.CONTROLS.DataGridView name="superView" idProperty="id" displayProperty="title">
              *         <ws:items>
              *             <ws:Array>
              *                 <ws:Object id="{{ 1 }}" title="Разработка" />
              *                 <ws:Object id="{{ 2 }}" title="Задача в разработку" />
              *                 <ws:Object id="{{ 3 }}" title="Ошибка в разработку" />
              *             </ws:Array>
              *         </ws:items>
              *         ...
              *     </SBIS3.CONTROLS.DataGridView>
              * </pre>
              * 
              * Те же данные вы можете задать в JS-модуле методом {@link setItems}. Например,
              * <pre>
              * var items = [
              *     {
              *        id: 1,
              *        title: 'Все'
              *     },{
              *        id: 2,
              *        title: 'Снять'
              *     },{
              *        id: 3,
              *        title: 'Инвертировать'
              *     }
              * ];
              * component.setItems(items);
              * </pre>
              * 
              * Чтобы сделать данные иерархическими, компоненту требуется задать иерархические поля в опциях {@link SBIS3.CONTROLS/Mixins/TreeMixin#parentProperty}, {@link SBIS3.CONTROLS/Mixins/TreeMixin#nodeProperty} и {@link SBIS3.CONTROLS/Mixins/TreeMixin#hasChildrenProperty}.
              * А затем добавить эти поля в items. Например,
              * <pre>
              *     <SBIS3.CONTROLS.Tree.DataGridView 
              *         name="superView"
              *         idProperty="id"
              *         displayProperty="title"
              *         parentProperty="section"
              *         nodeProperty="isFolder"
              *         hasChildrenProperty="hasChild">
              *         <ws:items>
              *             <ws:Array>
              *                 <ws:Object id="{{ 1 }}" title="Разработка" section="null" isFolder="{{ true }}" hasChild="{{ true }}" />
              *                 <ws:Object id="{{ 2 }}" title="Задача в разработку" section="{{ 1 }}" isFolder="null" hasChild="{{ false }}" />
              *                 <ws:Object id="{{ 3 }}" title="Ошибка в разработку" section="{{ 1 }}" isFolder="null" hasChild="{{ false }}" />
              *             </ws:Array>
              *         </ws:items>
              *         ...
              *     </SBIS3.CONTROLS.Tree.DataGridView>
              * </pre>
              * 
              * @see setItems
              * @see getDataSet
              * @see idProperty
              * @see displayProperty
              * @see parentProperty
              * @see dataSource
              */
            items: null,
            /**
             * @cfg {DataSource|WS.Data/Source/ISource|Function|Object} Устанавливает источник данных компонента.
             * @remark
             * Данные, полученные из источника, будут отображены в компоненте при вызове метода {@link reload}.
             * Опцию dataSource нельзя биндить, поскольку значения setDataSource и getDataSource имеют разные форматы. 
             * Подробнее читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/component-infrastructure/databinding/ статье}.
             * @example
             * <b>Пример 1.</b> Чтобы установить конфигурацию источника данных через JS-код компонента, необходимо его инициализировать и установить с помощью метода {@link setDataSource}.
             * <pre>
             *    // SbisService - это переменная, в которую импортирован класс источника данных из массива зависимостей компонента
             *    var myDataSource = new SbisService({ // Инициализация источника данных
             *        endpoint: {
             *
             *           // устанавливаем объект БЛ
             *           contract: 'Отчеты'
             *        },
             *
             *        // устанавливаем списочный метод
             *        binding: {
             *           query: 'Список'
             *        },
             *
             *        // устанавливаем поле первичного ключа
             *        idProperty: '@Идентификатор'
             *    });
             *    myView.setDataSource(myDataSource); // Устанавливаем представлению новый источник данных
             * </pre>
             *
             * <b>Пример 2.</b> Конфигурация источника данных через вёрстку компонента.
             * Первый способ основан на использовании объекта со следующими свойствами:
             * <ul>
             *    <li>module - название класса источника данных;</li>
             *    <li>options - конфигурация источника данных.</li>
             * </ul>
             * Аналогичная предыдущему примеру конфигурация будет выглядеть следующим образом:
             * <pre>
             *    <options name="dataSource">
             *       <option name="module" value="WS.Data/Source/SbisService"></option>
             *       <options name="options">
             *          <options name="endpoint">
             *             <option name="contract" value="Отчеты"></option>
             *          </options>
             *          <options name="binding">
             *             <option name="query" value="Список"></option>
             *          </options>
             *          <option name="idProperty" value="@Идентификатор"></option>
             *       </options>
             *    </options>
             * </pre>
             *
             * <b>Пример 3.</b> Конфигурация источника данных через вёрстку компонента.
             * Второй способ основан на использовании функции, которая возвращает экземпляр класса источника.
             * <pre>
             *    <option name="dataSource" type="function">Examples/MyArea/MyComponent:prototype.getMyDataSource</option>
             * </pre>
             * Функция должна возвращать объект с конфигурацией источника данных.
             * <pre>
             *    getMyDataSource: function() {
             *       return new SbisService({
             *          endpoint: {
             *             contract: 'Отчеты'
             *          },
             *          binding: {
             *             query: 'Список'
             *          },
             *          idProperty: '@Идентификатор'
             *       });
             *    }
             * </pre>
             * @see setDataSource
             * @see getDataSource
             * @see items
             */
            dataSource: undefined,
             /**
              * @cfg {Number} Устанавливает количество записей, запрашиваемых с источника данных.
              * @remark
              * Опция определяет количество запрашиваемых записей от источника данных как при построении контрола, так и при осуществлении подгрузки.
              * Для иерархических структур при пейджинге по скроллу опция также задаёт количество подгружаемых записей кликом по кнопке "Ещё".
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
             *
             * @property {String} field Поле группировки.
             * Необязательная для использования опция.
             * Когда значение опции *field* не установлено, обязательна для конфигурации опция *method*.
             *
             * @property {Function} method Метод группировки элементов коллекции.
             * Необязательная для использования опция.
             * <br/>
             * Аргументы функции:
             * <ul>
             *    <li>item - обрабатываемый элемент коллекции, экземпляр класса {@link WS.Data/Entity/Model}.</li>
             *    <li>index - порядковый номер элемента коллекции.</li>
             * </ul>
             * Из функции возвращают уникальный идентификатор группы.
             * По нему определяется: нужно ли создавать заголовок перед элементом коллекции.
             * Заголовок создаётся в случае, когда идентификатор заголовка отличен от идентификатора заголовка предыдущего элемента коллекции.
             * <br/>
             * Когда опция *method* не установлена, обязательная для конфигурации опция *field*.
             * В этом случае будет использован стандартный платформенный метод, который в качестве идентификатора группы возвращает значение поля группировки (см. *field*).
             *
             * @property {String} template Устаревшая опция шаблона, используйте *contentTemplate*.
             *
             * @property {String} contentTemplate Шаблон содержимого заголовка группы.
             * Шаблон будет помещен в платформенный контейнер визуального отображения заголовка группы.
             * Шаблон - это XHTML-файл, внутри допускается использование конструкций шаблонизатора.
             * В объекте *it* шаблонизатора доступны для использования два свойства:
             * <ul>
             *     <li>groupId - идентификатор группы (см. *method*).</li>
             *     <li>item - обрабатываемый элемент коллекции, экземпляр класса {@link WS.Data/Entity/Model}.</li>
             * </ul>
             * Порядок использования шаблона (при конфигурации через XTHML):
             * <ol>
             *     <li>Подключите файл шаблона в массив зависимостей компонента, импортируйте его в переменную.</li>
             *     <li>В компоненте в секции *_options* создайте переменную, в значение которой передайте импортированный шаблон.</li>
             *     <li>Передайте значение опции в конфигурацию *groupBy* в опцию *contentTemplate*.</li>
             * </ol>
             */
            /**
             * @cfg {GroupBy} Устанавливает группировку элементов коллекции.
             * @remark
             * Данный механизм позволяет группировать элементы коллекции в списках любых типов.
             * Подробнее о группировках вы можете прочитать в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/groups/ этой статье}.
             * Для правильной работы группировки данные от источника должны поступить {@link sorting отсортированными} по полю группировки (см. подопцию *field*}.
             * Изменить группировку элементов коллекции можно с помощью метода {@link setGroupBy}.
             *
             * Поле для группировки не должно быть булевым. Если требуется группировка по такому полю,
             * предлагается отдать в настройки groupBy метод вида:
             * <pre>
             *    _recentGroupMethod: function(item) {
             *       return '' + item.get('IsFavorite');
             *    },
             * </pre>
             * Дополнительное описание о группировке и демо-примеры вы можете найти <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/groups/'>здесь</a>.
             * @example
             * 1. Подключение шаблона группировки:
             * <pre>
             *    define('Examples/MyArea/MyComponent', [ ..., "tmpl!Examples/MyArea/MyComponent/resources/myTpl"], ...);
             * </pre>
             * 2. Настройка группировки:
             * <pre>
             *     <options name="groupBy">
             *         <option name="field">ДатаВходаСотрудника</option> <!-- Так будет использована стандартная функция группировки элементов коллекции -->
             *         <option name="contentTemplate" value="html!MyArea.MyComponent/resources/myTpl"></option>
             *     </options>
             *     <option name="easyGroup">true</option> <!-- Временная обязательная опция для быстрой отрисовки списков с группировкой -->
             * </pre>
             */
            groupBy : {},
            /**
             * @cfg {Content} Устанавливает отображаемый контент при отсутствии данных.
             * @remark
             * Опция устанавливает содержимое, отображаемое как при абсолютном отсутствии данных, так и в результате {@link groupBy фильтрации}.
             * Это может быть как обычный текст, так и пользовательский контрол или компонент.
             * @example
             * <pre class="brush:xml">
             *     <option name="emptyHTML">Нет данных</option>
             * </pre>
             * @translatable
             * @see items
             * @see setDataSource
             * @see groupBy
             */
            emptyHTML: '',
            /**
             * @cfg {Object} Устанавливает фильтр данных.
             * @example
             * Фильтрация будет произведена по полям creatingDate и documentType, значения для которых берутся из контекста из полей selectedDocumentDate и selectedDocumentType соответственно.
             * <pre class="brush:xml">
             *     <options name="filter">
             *        <option name="creatingDate" bind="selectedDocumentDate"></option>
             *        <option name="documentType" bind="selectedDocumentType"></option>
             *     </options>
             * </pre>
             */
            filter: {},
            /**
             * @cfg {Array.<Object>} Устанавливает сортировку данных.
             * @remark
             * Формат объекта:
             * <ul>
             *     <li>ключ - это поле, по которому производится сортировка;</li>
             *     <li>значение - тип сортировки. ASC - по возрастанию, DESC  - по убыванию.</li>
             * </ul>
             * @example
             * <pre class="brush:xml">
             *     <options name="sorting" type="array">
             *        <options>
             *           <option name="date" value="ASC"></option>
             *        </options>
             *        <options>
             *           <option name="name" value="DESC"></option>
             *        </options>
             *     </options>
             * </pre>
             */
            sorting: [],
            /**
             * @cfg {String} Устанавливает стратегию действий с подгружаемыми в список записями
             * @variant merge - мержить, при этом записи с одинаковыми id схлопнутся в одну
             * @variant append - добавлять, при этом записи с одинаковыми id будут выводиться в списке
             *
             */
            loadItemsStrategy: 'append',
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
             * @cfg {String|function} Устанавливает шаблон, который будет отображаться под элементами коллекции.
             * @example
             * <pre>
             *    <div>
             *       <component data-component="SBIS3.CONTROLS/Link">
             *          <option name="caption">+ Документ</option>
             *       </component>
             *    </div>
             * </pre>
             */
            footerTpl: undefined,
            /**
             * @cfg {String} Устанавливает шаблон отображения содержимого каждого элемента коллекции.
             * @remark
             * При создании элемента данный шаблон будет автоматически помещён в контейнер со служебными атрибутами.
             */
            itemContentTpl : null,
            /**
             * @cfg {String} Устанавливает шаблон отображения каждого элемента коллекции.
             * @remark
             * В любом месте шаблона можно сделать вызов
             * <pre>
             * {{=it.defaultItemTpl(it)}}
             * </pre>
             * вызвав стандартный шаблон содержимого элемента.
             * @example
             * <pre>
             *    <div class="docs-listViewItem">
             *       {{=it.item.get("title")}}
             *    </div>
             * </pre>
             */
            itemTpl : null,
            /**
             * @cfg {Function|null} Устанавливает метод сортировки элементов коллекции.
             * @remark
             * Принимает два объекта вида {item:ProjectionItem, collectionItem: Model, index: Number, collectionIndex: Number} и должен вернуть -1|0|1.
             * @example
             * 1. Конфигурация в разметке компонента:
             * <pre>
             *      <option name="itemsSortMethod" type="function">SBIS3.Demo.Handlers.sort</option>
             * </pre>
             * 2.Объявление функции:
             * <pre>
             *    sort: function(obj1, obj2) {
             *       return obj1.index - obj2.index;
             *    }
             * </pre>
             * @see setItemsSortMethod
             * @see WS.Data/Display/Collection#setSort
             */
            itemsSortMethod: null,
            itemsFilterMethod: undefined,
            /**
             * @cfg {boolean} Устанавливает быструю отрисовку списков с группировкой.
             * Подробнее см. в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/fast-drawing/#_3">разделе</a>.
             */
            easyGroup: false,
            task1173770359: false
         },
         _loader: null

      },

      around: {
         _modifyOptions : function(parentFnc, cfg, parsedCfg) {
            if (cfg.displayField) {
               IoC.resolve('ILogger').log('ItemsControl', 'Опция displayField является устаревшей, используйте displayProperty');
               cfg.displayProperty = cfg.displayField;
            }
            if (cfg.keyField) {
               IoC.resolve('ILogger').log('ItemsControl', 'Опция keyField является устаревшей, используйте idProperty');
               cfg.idProperty = cfg.keyField;
            }
            var newCfg = parentFnc.call(this, cfg), proj, items;
            if (newCfg.items) {
               if (parsedCfg._itemsProjection) {
                  newCfg._itemsProjection = parsedCfg._itemsProjection;
                  newCfg._items = parsedCfg._items;
                  /*TODO убрать этот код с переходом на легкие инстансы. В текущей реализации методы не могут нормально сериализоваться при построении на сервере*/
                  applyGroupingToProjection(newCfg._itemsProjection, newCfg);
                  newCfg._applyFilterToProjection(newCfg._itemsProjection, newCfg);
               } else {
                  if (newCfg.items instanceof Array) {
                     if (!newCfg.idProperty) {
                        var key = findIdProperty(newCfg.items);
                        newCfg.idProperty = key;
                        parsedCfg.idProperty = key;
                     }
                     items = JSONToRecordset(cfg.items, newCfg.idProperty);
                     newCfg._items = items;
                     parsedCfg._items = items;
                  }
                  else {
                     newCfg._items = newCfg.items;
                     parsedCfg._items = newCfg.items;
                  }
                  proj = newCfg._createDefaultProjection(newCfg._items, newCfg);
                  proj = newCfg._applyGroupingToProjection(proj, newCfg);
                  newCfg._itemsProjection = proj;
                  parsedCfg._itemsProjection = proj;
               }

               if (cfg._canServerRender && cfg._canServerRenderOther(cfg)) {
                  if (isEmpty(cfg.groupBy) || (cfg.easyGroup)) {
                     newCfg._serverRender = true;
                     newCfg._records = cfg._getRecordsForRedraw(cfg._itemsProjection, cfg);
                     if (cfg._items && cInstance.instanceOfModule(cfg._items, 'WS.Data/Collection/RecordSet')) {
                        newCfg._resultsRecord = cfg._items.getMetaData().results;
                     }
                     newCfg._itemData = cfg._buildTplArgs(cfg);
                  }
               }
            }

            return newCfg;
         }
      },

      $constructor: function () {
         this._publish('onDrawItems', 'onDataLoad', 'onDataLoadError', 'onBeforeDataLoad', 'onItemsReady', 'onPageSizeChange');
         this._revivePackageParams = {
            revive: false,
            light: true,
            processed: true
         };

         var debouncedDrawItemsCallback = debounce(forAliveOnly(this._drawItemsCallback, this), 0);
         // FIXME сделано для правильной работы медленной отрисовки
         this._drawItemsCallbackDebounce = forAliveOnly(function() {
            debouncedDrawItemsCallback();
            this._drawItemsCallbackSync();
         }, this);

         if (typeof this._options.pageSize === 'string') {
            this._options.pageSize = this._options.pageSize * 1;
         }
         this._checkIdProperty();
         this._bindHandlers();
         this._prepareItemsConfig();

         if (this._options.itemTemplate) {
            IoC.resolve('ILogger').error('3.7.5 ItemsControl', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Задан itemTemplate');
         }
         if (!isEmpty(this._options.groupBy) && !this._options.easyGroup) {
            IoC.resolve('ILogger').error('3.7.5 ItemsControl', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Используется GroupBy без easyGroup: true');
         }
         if (this._options.userItemAttributes) {
            IoC.resolve('ILogger').error('3.7.5 userItemAttributes', 'Option is no longer available since version 3.7.4.200. Use ItemTpl');
         }

      },

      _getItemsTemplate: function() {
         return this._options._itemsTemplate;
      },

      //В композите элементы добавляются по другому шаблону. Решится с перходом на VDOM
      _getItemsTemplateForAdd: function() {
         return this._options._itemsTemplate;
      },

      _prepareItemsConfig: function() {
         if (this._options.dataSource) {
            this._dataSource =  SourceUtil.prepareSource.call(this, this._options.dataSource);
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
            if (this._options.pageSize && (this._options.items.length > this._options.pageSize)) {
               IoC.resolve('ILogger').log('ListView', 'Опция pageSize работает только при запросе данных через dataSource');
            }
            if (!this._options.idProperty) {
               this._options.idProperty = findIdProperty(this._options.items)
            }

            /*TODO опасная правка. Суть: Некоторые вместе с массивом задают сорс, а мы затираем переданный сорс
            * смотрим если сорс уже задан, то итемы просто превращаем в рекордсет, а сорс оставляем*/
            if (this._dataSource) {
               this._options._items = JSONToRecordset(this._options.items, this._options.idProperty);
               this._options._itemsProjection = this._options._createDefaultProjection.call(this, this._options._items, this._options);
               this._options._itemsProjection = this._options._applyGroupingToProjection(this._options._itemsProjection, this._options);
               this._setItemsEventHandlers();
               this._notify('onItemsReady');
               this._itemsReadyCallback();
            }
            else {
               this._dataSource = new MemorySource({
                  data: coreClone(this._options.items),
                  idProperty: this._options.idProperty
               });
            }
         }
      },


      _prepareConfig : function(sourceOpt, itemsOpt) {
         if (sourceOpt) {
            this._dataSource =  SourceUtil.prepareSource.call(this, sourceOpt);
         }

         if (itemsOpt) {
            if (itemsOpt instanceof Array) {
               if (!this._options.idProperty) {
                  this._options.idProperty = findIdProperty(itemsOpt);
               }
               this._options._items = JSONToRecordset(itemsOpt, this._options.idProperty);
            }
            else {
               this._options._items = itemsOpt;
            }
            if (this._options._itemsProjection) {
               this._unsetItemsEventHandlers();
               this._options._itemsProjection.destroy();
            }
            this._options._itemsProjection = this._options._createDefaultProjection.call(this, this._options._items, this._options);
            this._options._itemsProjection = this._options._applyGroupingToProjection(this._options._itemsProjection, this._options);
            this._setItemsEventHandlers();
            this._notify('onItemsReady');
            this._itemsReadyCallback();
         }

         this._checkIdProperty();
      },

      _checkIdProperty: function() {
         if (this._options.idProperty) {
            return;
         }

         var items = this.getItems();
         if (items && items.getIdProperty) {
            IoC.resolve('ILogger').info('ItemsControl', 'Option idProperty is undefined in control ' + this.getName());
         }
      },

      /**
       * Метод получения проекции по ID итема
       */
      _getItemProjectionByItemId: function(id) {
         return this._getItemsProjection() ? this._getItemsProjection().getItemBySourceItem(this.getItems().getRecordById(id)) : null;
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

      _getGroupContainers: function(groupId) {
         var containers = $([]);
         if (this._getItemsProjection()) {
            var items = this._getGroupItems(groupId);
            for (var i = 0; i < items.length; i++) {
               containers.push(this._getDomElementByItem(items[i]).get(0))
            }
         }

         return containers;
      },

      _toggleGroup: function(groupId, flag) {
         this._options._groupCollapsing[groupId] = flag;
         var containers = this._getGroupContainers(groupId),
            groupSelector = '.controls-GroupBy[data-group=\'' + groupId + '\']',
            groupContainer;
         containers.toggleClass('ws-hidden', flag);
         groupContainer = $(groupSelector, this._container);
         groupContainer.find('.controls-GroupBy__separatorCollapse').toggleClass('controls-GroupBy__separatorCollapse__collapsed', flag);
         // Если строка группы зафиксирована в заголвоке, то обновляем не только ее копию, но и оригинал в заголовке.
         if (groupContainer.hasClass('ws-sticky-header__tr-copy')) {
            this._container.closest('.ws-sticky-header__wrapper')
               .find('>.ws-sticky-header__header-container ' + groupSelector + ' .controls-GroupBy__separatorCollapse')
               .toggleClass('controls-GroupBy__separatorCollapse__collapsed', flag);
         }
         this._drawItemsCallbackDebounce();
      },

      expandGroup: function(groupId) {
         this._toggleGroup(groupId, false);
      },
      collapseGroup: function(groupId) {
         this._toggleGroup(groupId, true);
      },
      toggleGroup: function(groupId) {
         this[this._isGroupCollapsed(groupId) ? 'expandGroup' : 'collapseGroup'].call(this, groupId);
      },
      _isGroupCollapsed: function (groupId) {
         return this._options._groupCollapsing[groupId];
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
         data.itemsTemplate = this._getItemsTemplate();
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
            this._itemData = coreClone(buildArgsMethod.call(this, this._options));
         } else {
            this._updateItemData(this._itemData);
         }
         return this._itemData;
      },

      _updateItemData: function(itemData) {
         /*Method must be implemented*/
      },

      _redrawItems : function(notRevive) {
         this._groupHash = {};
         var
            $itemsContainer = this._getItemsContainer();
         //в контролах типа комбобокса этого контейнера может не быть, пока пикер не создан
         if ($itemsContainer) {
            var
               itemsContainer = $itemsContainer.get(0),
               data = this._prepareItemsData(),
               markup, extMarkup;

            data.tplData = this._prepareItemData();
            //Отключаем придрот, который включается при добавлении записи в список, который здесь нам не нужен
            extMarkup = extendedMarkupCalculate(this._getItemsTemplate()(data), this._options);
            markup = extMarkup.markup;
            //TODO это может вызвать тормоза
            var comps = this._destroyInnerComponents($itemsContainer, this._options.easyGroup);
            if (markup.length) {
               itemsContainer.innerHTML = markup;
            }
            else {
               if (this._options.easyGroup) {
                  itemsContainer.innerHTML = '';
               }
            }
            for (var i = 0; i < comps.length; i++) {
               if (comps[i]) {
                  comps[i].destroy();
               }

            }
            this._toggleEmptyData(this._needShowEmptyData(data.records));

         }
         /* Класс вешаем после отрисовки, но до события onDrawItems,
            почему так:
            в событии onDrawItems могут производить замеры высоты/ширины,
            а без этого класса к списку применяются стили для состояния, когда он "пустой" (например устанавливается минимальная высота),
            что портит расчёты. */
         this._container.addClass('controls-ListView__dataLoaded').removeClass('controls-ListView__dataNotLoaded');

         if (notRevive) {
            this._revivePackageParams.revive = true;
            this._revivePackageParams.light = false;
         }
         else {
            this._reviveItems();
         }
      },

      _needShowEmptyData: function(items) {
         return !(items && items.length);
      },

      _redrawItem: function(item) {
         var needToRevive = this._redrawItemInner(item);
         this._revivePackageParams.revive = this._revivePackageParams.revive || needToRevive;
         this._revivePackageParams.light = this._revivePackageParams.light && (item.getContents().getId() != this._options.selectedKey);
      },

      _redrawItemInner: function(item) {
         var
            needToRevive = false,
            markup, markupExt,
            targetElement = this._getDomElementByItem(item),
            inlineStyles = targetElement.attr('style') || '',
            projection = this._getItemsProjection(),
            data;

         //todo В VDOM обновление хлебных крошек будет происходить без использования jquery
         if (targetElement.length) {
            if (targetElement.hasClass('controls-HierarchyDataGridView__path')) {
               this._redrawHierarchyPathItem(item);
               return needToRevive;
            }
            data = this._prepareItemData();
            data.projItem = item;
            data.item = item.getContents();

            // Вычисляем drawHiddenGroup при перерисовке item'а, т.к. в текущей реализации это единственный способ скрыть элемент, если он расположен в свернутой группе
            if (this._options.groupBy && this._options.easyGroup) {
               data.drawHiddenGroup = !!this._options._groupCollapsing[projection.getGroupByIndex(projection.getIndex(item))];
            }

            //TODO: выпилить вместе декоратором лесенки
            if (data.decorators && data.decorators.ladder) {
               data.decorators.ladder.setRecord(data['item']);
            }

            //TODO для плитки. Надо переопределить шаблоны при отрисовке одного элемента, потому что по умолчанию будет строка таблицы
            //убирается по задаче https://inside.tensor.ru/opendoc.html?guid=4fd56661-ec80-46cd-aca1-bfa3a43337ae&des=

            var calcData = this._calculateDataBeforeRedraw(data, item);
            var dot;
            if (data.itemTpl) {
               dot = calcData.itemTpl;
            }
            else {
               dot = calcData.defaultItemTpl;
            }

            markupExt = extendedMarkupCalculate(dot(calcData), this._options);
            markup = markupExt.markup;
            /*TODO посмотреть не вызывает ли это тормоза*/
            var comps = this._destroyInnerComponents(targetElement, true);

            if (inlineStyles) {
               targetElement.replaceWith($(markup).attr('style', inlineStyles));
            } else {
               /**
                * Если фокус стоит внутри строки - мы его потеряем
                * Также мы потеряем фокус если он НА строке.
                */
               if (targetElement.get(0) === document.activeElement || targetElement.find($(document.activeElement)).length > 0){
                  this._getElementToFocus().focus();
               }
               targetElement.get(0).outerHTML = markup;
            }

            for (var i = 0; i < comps.length; i++) {
               if (comps[i]) {
                  comps[i].destroy();
               }
            }
            needToRevive = markupExt.hasComponents;

            if (!isEmpty(this._options.groupBy)) {
               this._groupFixOnRedrawItemInner(item, targetElement);
            }
         }
         return needToRevive;
      },

      _redrawHierarchyPathItem: function(item) {},

      //TODO надо избавиться от этого метода
      //если в списке есть группировка, при переносе в папку записи, следующей за ней
      //не происходит события move, а только меняется запись
      //мы просто перерисовываем ее, а должны еще перерисовать группу
      _groupFixOnRedrawItemInner: function(item) {
         var targetElement = this._getDomElementByItem(item);
         var behElement;
         if (!this._options._canApplyGrouping(item, this._options)) {
            //если внутрь папки
            behElement = targetElement.prev();
            //если предыдущий группировка, то переносим ее
            if (behElement.length && behElement.hasClass('controls-GroupBy')) {
               targetElement.after(behElement);
               //если группа оказалась пустая, удаляем ее
               var behNextElement = behElement.next();
               if (behNextElement.length && !behNextElement.hasClass('js-controls-ListView__item')) {
                  behElement.remove();
               }
            }
         }
      },

      _calculateDataBeforeRedraw: function(data) {
         return data;
      },

      _removeItems: function (items) {
         for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var targetElement = this._getDomElementByItem(item);
            if (targetElement.length) {
               this._clearItems(targetElement);
               /*TODO С этим отдельно разобраться*/

               var targetElementNode = targetElement.get(0);
               targetElementNode.parentNode.removeChild(targetElementNode);
               /* TODO внештатная ситуация, при поиске могли удалить папку/путь, сейчас нет возможности найти это в гриде и удалить
                  поэтому просто перерисуем весь грид. Как переведём группировку на item'ы, это можно удалить */
            } else if(this._isSearchMode && this._isSearchMode() && item.isNode && item.isNode()) { // FIXME "Грязная проверка" на наличие метода в .220, код удалится в .230
               this.redraw();
               return;
            }
         }
      },

      _removeItemsLight: function(items) {
         for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var targetElement = this._getDomElementByItem(item);
            if (targetElement.length) {
               this._clearItems(targetElement);
               var targetElementNode = targetElement.get(0);
               //ie не умеет targetElementNode.remove() делаем кроссбраузерно, не через jquery
               targetElementNode.parentNode.removeChild(targetElementNode);
            }
         }
      },

      _getSourceNavigationType: function(){
         if (this.getDataSource()) {
            return this.getDataSource().getOptions().navigationType;
         }
      },

      _getItemsForRedrawOnAdd: function(itemsArray) {
         var
            itemsToAdd = [],
            items = coreClone(itemsArray),
            groupId, groupHash;

         if (items.length && cInstance.instanceOfModule(items[0], 'WS.Data/Display/GroupItem')) {
            if (items.length > 1) {
               groupId = items[0].getContents();
               groupHash = items[0].getHash();
               //todo Переделать, чтобы группы скрывались функцией пользовательской фильтрации
               if (groupId !== false) {
                  this._options._groupItemProcessing(groupId, itemsToAdd, items[1], this._options, groupHash);
               }
               items.splice(0, 1);
               itemsToAdd = itemsToAdd.concat(items);
            }
         }
         else {
            itemsToAdd = items;
         }


         return itemsToAdd;
      },

      _optimizedInsertMarkup: function(markup, config) {
         var container = config.container;
         if (config.inside) {
            container.get(0).insertAdjacentHTML(config.prepend ? 'afterBegin' : 'beforeEnd', markup);
         } else {
            container[config.prepend ? 'before' : 'after'](markup);
         }
      },

      _addItems: function(newItems, newItemsIndex, prevDomNode) {
         var
            i, groupId,
            projection = this._getItemsProjection();
         this._itemData = null;
         if (newItems && newItems.length) {
            if (this._options.groupBy) {
               if (cInstance.instanceOfModule(newItems[0], 'WS.Data/Display/GroupItem')) {
                  groupId = newItems[0].getContents();
               } else {
                  groupId = projection.getGroupByIndex(projection.getIndex(newItems[0]));
               }
            }
            if (this._isSlowDrawing(this._options.easyGroup)) {
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
                  data,
                  markup, markupExt,
                  itemsToDraw;

               itemsToDraw = this._getItemsForRedrawOnAdd(newItems);
               if (itemsToDraw.length) {
                  data = {
                     records: itemsToDraw,
                     tplData: this._prepareItemData()
                  };
                  // Вычисляем drawHiddenGroup при перерисовке item'а, т.к. в текущей реализации это единственный способ скрыть элемент, если он расположен в свернутой группе
                  data.tplData.drawHiddenGroup = !!this._options._groupCollapsing[groupId];
                  markupExt = extendedMarkupCalculate(this._getItemsTemplateForAdd()(data), this._options);
                  markup = markupExt.markup;
                  this._optimizedInsertMarkup(markup, this._getInsertMarkupConfig(newItemsIndex, newItems, prevDomNode));
                  this._revivePackageParams.revive = this._revivePackageParams.revive || markupExt.hasComponents;
                  this._revivePackageParams.light = false;
               }
            }
            this._afterAddItems();
         }
      },

      _afterAddItems: function() {},

      //Выделяем отдельный метод _getInsertMarkupConfigICM т.к. в TreeView метод _getInsertMarkupConfig переопределяется,
      //а в TreeCompositeView в зависимости от вида отображения нужно звать разные методы, в режиме плитки нужно звать
      //стандартный метод _getInsertMarkupConfigICM а в режиме таблицы переопределённый метод из TreeView
      _getInsertMarkupConfig: function(newItemsIndex, newItems, prevDomNode) {
         return this._getInsertMarkupConfigICM.apply(this, arguments);
      },

      _getInsertMarkupConfigICM: function(newItemsIndex, newItems, prevDomNode) {
         var
            inside = true,
            prepend = false,
            container = this._getItemsContainer(),
            projection = this._getItemsProjection(),
            prevItem, lastItemsIndex;
         // todo: Пока VirtualScroll работает не на проекции - мы вызываем вставку через _addItems в позицию "0",
         // пересчитывать его нельзя, иначе получим реальный индекс в проекции
         if (!this._virtualScrollController) {
            // При некоторых последовательностях изменений проекции индекс, определенный для вставки может стать устаревшим.
            // Пересчитываем этот индекс: https://online.sbis.ru/opendoc.html?guid=fa48e9e0-e9ab-40fc-ae41-58e13f652b3a
            newItemsIndex = projection.getIndex(newItems[0]);
         }
         prevItem = projection.at(newItemsIndex - 1);
         lastItemsIndex = projection.getCount() - newItems.length;

         // TODO: тут зависимость от virtualscrolling, которой быть не должно
         if (this._virtualScrollController && this._virtualScrollController._currentWindow[1] > 0) {
            lastItemsIndex = this._virtualScrollController._currentWindow[1] + 1;
         }

         // Если предыдущий элемент - группа, которую не нужно рисовать (groupId === "false"), то элемент вставлять нужно в самое начало
         // https://online.sbis.ru/opendoc.html?guid=c4bfa6df-6518-4ea1-b8d4-66fce5b524f5
         if (newItemsIndex === 1 && cInstance.instanceOfModule(prevItem, 'WS.Data/Display/GroupItem') && prevItem.getContents() === false) {
            prepend = true;
         } else if (newItemsIndex == 0 || newItemsIndex == lastItemsIndex) {
            prepend = newItemsIndex == 0;
            // Если добавляется первый в списке элемент + это узел + включена группировка (для узлов группы не рисуются), то
            // предыдущим элементом будет группа, которая фактически не рисуется, а значит и DOM элемент будет не найден, а
            // значит и вставлять будет не куда, поэтому просто возводим флаг prepend, а контейнер оставляем обычный ItemsContainer.
            // https://online.sbis.ru/opendoc.html?guid=d650908a-1785-4726-aa70-b13786574865
         } else if (!this._canApplyGrouping(newItems[0]) && cInstance.instanceOfModule(prevItem, 'WS.Data/Display/GroupItem')) {
            prepend = newItemsIndex == 1;
         } else {
            inside = false;
            container = prevDomNode || this._getDomElementByItem(prevItem);
         }
         return {
            inside: inside,
            prepend: prepend,
            container: container
         }
      },

      _getDomElementByItem : function(item) {
         var container;
         if (cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
            container = this._getItemsContainer().find('.controls-GroupBy[data-group-hash="' + item.getHash() + '"]');
         }
         else {
            container = this._getRecordElemByItem(item);
         }
         return container;
      },

      _getRecordElemByItem: function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-hash="' + item.getHash() + '"]');
      },

      _reviveItems : function(lightVer, silent) {
         this.reviveComponents().addCallback(this._onReviveItems.bind(this, lightVer, silent)).addErrback(function(e){
            throw e;
         });
      },

      _onReviveItems: function(lightVer, silent){
         if (!silent) {
            this._notifyOnDrawItems(lightVer);
         }
      },

      _notifyOnDrawItems: function(lightVer) {
         this._notify('onDrawItems');
         this._drawItemsCallbackDebounce(lightVer);
      },

      _clearItems: function (container) {
         /*TODO переписать*/
         container = container || this._getItemsContainer();
         /*Удаляем компоненты-инстансы элементов*/
         if (!isEmpty(this._itemsInstances)) {
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

      /*TODO easy параметр для временной поддержки группировки в быстрой отрисовке*/

      _destroyInnerComponents: function(container, easy) {
         var compsArray = this._destroyControls(container, easy);

         if (!easy) {
            container.get(0).innerHTML = '';
         }

         //Очищаем список инстансов, после удаления элеменов коллекции
         this._itemsInstances = {};

         return compsArray;
      },

      /*TODO easy параметр для временной поддержки группировки в быстрой отрисовке*/
      _destroyControls: function(container, easy){
         var compsArray = [],
            destroyed = false;
         $('[data-component]', container).each(function (i, item) {
            var inst = item.wsControl;
            if (inst) {
               if (!easy) {
                  // true - не завершать пакет (ControlBatchUpdater) на дестрой. Иначе сработает onBringToFront и переведет активность раньше времени
                  // https://inside.tensor.ru/opendoc.html?guid=ec5c1d84-a09c-49b2-991a-779a7004a15b&des=
                  if (!destroyed) {
                     baseControl.ControlBatchUpdater.beginBatchUpdate('AreaAbstract_destroy');
                  }
                  inst.destroy(true);
                  destroyed = true;
               }
               else {
                  compsArray.push(inst);
               }
            }
         });
         if (destroyed) {
            baseControl.ControlBatchUpdater.endBatchUpdate('AreaAbstract_destroy');
         }
         return compsArray;
      },

      //TODO проверка для режима совместимости со старой отрисовкой
      /*TODO easy параметр для временной поддержки группировки в быстрой отрисовке*/
      _isSlowDrawing: function(easy) {
         var result = !!this._options.itemTemplate;
         if (easy) {
            return result;
         }
         else {
            return result || !isEmpty(this._options.groupBy);
         }
      },

      before : {
         init: function() {
            if (this._options.pageSize) {
               this._limit = this._options.pageSize;
            }
         }
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
            else if (this._dataSource && !(this._options.dataSource && this._options.dataSource.firstLoad === false)) {
               this.reload();
            }
            if (this._options._serverRender) {
               this._notifyOnDrawItems();
               this._container.addClass('controls-ListView__dataLoaded').removeClass('controls-ListView__dataNotLoaded');
            }
         },
         destroy : function() {
            this._cancelLoading();
            this._unsetItemsEventHandlers();
            if (this._options._items) {
               this._options._items = null;
            }
            if (this._options._itemsProjection) {
               this._options._itemsProjection.destroy();
               this._options._itemsProjection = null;
            }
            this._clearItems();
            this._itemData = null;
            this._dataSource = null;
         }
      },

      /**
       * Возвращает отображаемую контролом коллекцию, сделанную на основе источника данных
       * @param {WS.Data/Source/ISource} source
       * @returns {WS.Data/Collection/IList}
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
         this._onBeforeCollectionChange = onBeforeCollectionChange.bind(this);
         this._onAfterCollectionChange = onAfterCollectionChange.bind(this);
         /*this._onCurrentChange = onCurrentChange.bind(this);*/
      },

      _setItemsEventHandlers: function() {
         this.subscribeTo(this._options._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.subscribeTo(this._options._itemsProjection, 'onBeforeCollectionChange', this._onBeforeCollectionChange);
         this.subscribeTo(this._options._itemsProjection, 'onAfterCollectionChange', this._onAfterCollectionChange);
      },

      _unsetItemsEventHandlers: function () {
         this.unsubscribeFrom(this._options._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.unsubscribeFrom(this._options._itemsProjection, 'onBeforeCollectionChange', this._onBeforeCollectionChange);
         this.unsubscribeFrom(this._options._itemsProjection, 'onAfterCollectionChange', this._onAfterCollectionChange);
      },
       /**
        * Устанавливает источник данных.
        * @remark
        * Когда устанавливается источник данных, при этом также установлено значение в опции {@link items}, то поведение контрола:
        * <ol>
        *     <li>Сначала данные контрола отрисовываются из *items*.</li>
        *     <li>Затем данные будут обновлены новыми, которые получены от источника данных.</li>
        * </ol>
        * @param {DataSource|WS.Data/Source/ISource} source Новый источник данных.
        * @param {Boolean} noLoad Признак, с помощью которого устанавливается необходимость запроса нового набора данных по установленному источнику.
        * Если параметр установлен в значение true, то данные не будут подгружены, а также не произойдут события {@link onDataLoad}, {@link onItemsReady} или {@link onDataLoadError}.
        * @example
        * <pre>
        *     define( 'SBIS3.MyArea.MyComponent',
        *        [ // Массив зависимостей компонента
        *           ... ,
        *           'WS.Data/Source/Memory' // Подключаем класс для работы со статическим источником данных
        *        ],
        *        function(
        *           ...,
        *           MemorySource // Импортируем в переменную класс для работы со статическим источником данных
        *        ){
        *           ...
        *           var arrayOfObj = [ // Формируем набор "сырых" данных
        *              {'@Заметка': 1, 'Содержимое': 'Пункт 1', 'Завершена': false},
        *              {'@Заметка': 2, 'Содержимое': 'Пункт 2', 'Завершена': false},
        *              {'@Заметка': 3, 'Содержимое': 'Пункт 3', 'Завершена': true}
        *           ];
        *           var dataSource = new MemorySource({ // Производим инициализацию статического источника данных
        *              data: arrayOfObj,                // Передаём набор "сырых" данных
        *              idProperty: '@Заметка'           // Устанавливаем поле первичного ключа в источнике данных
        *           });
        *           this.getChildControlByName('ComboBox 1').setDataSource(ds1); // Устанавливаем источник представлению данных
        *        }
        *     );
        * </pre>
        * @see dataSource
        * @see getDataSource
        * @see items
        * @see onDataLoad
        * @see onDataLoadError
        * @see onItemsReady
        * @see onDrawItems
        */
      setDataSource: function (source, noLoad) {
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
         if (!compatibilityMode) {
            Utils.logger.stack('SBIS3.CONTROLS/Mixins/ItemsControlMixin Получение DataSet явялется устаревшим функционалом используйте getItems()', 1);
         }
         return this._options._items;
      },
      /**
       * Перевычитывает модель из источника данных, мержит изменения к текущим данным и перерисовывает запись
       * @param {Number} id Идентификатор модели
       * @param {Object|WS.Data/Entity/Model} meta Мета информация
       * @returns {*}
       */
      reloadItem: function(id, meta) {
         var
            self = this,
            currentItem = this.getItems().getRecordById(id);
         if (this.getDataSource() && currentItem) {
            return this.getDataSource().read(id, meta).addCallback(function(newItem) {
               currentItem.merge(newItem);
            });
         } else {
            return Deferred.success();
         }
      },
      /**
       * @name SBIS3.CONTROLS/Mixins/ItemsControlMixin#reload
       * Перезагружает набор записей компонента с последующим обновлением отображения.
       * @remark
       * При вызове метода происходят события {@link onBeforeDataLoad} &#8594; {@link onDataLoad} &#8594; {@link onItemsReady}, а в случае ошибки &#8594; {@link onDataLoadError}
       * Метод автоматически вызывается в следующих случаях:
       * <ul>
       *    <li>при смене сортировки (см. {@link setSorting});</li>
       *    <li>при изменении количества записей на одной странице (см. {@link setPageSize});</li>
       *    <li>при изменении параметров фильтрации (см. {@link setFilter});</li>
       *    <li>при инициализации компонента.</li>
       * </ul>
       * @param {Object} filter Параметры фильтрации.
       * @param {String|Array.<Object.<String,Boolean>>} sorting Параметры сортировки.
       * @param {Number} offset Смещение первого элемента выборки.
       * @param {Number} limit Максимальное количество элементов выборки.
       * @example
       * <pre>
       *    myDataGridView.reload(
       *       { // Устанавливаем параметры фильтрации: требуются записи, в которых поля принимают следующие значения
       *          iata: 'SVO',
       *          direction: 'Arrivals',
       *          state: 'Landed',
       *          fromCity: ['New York', 'Los Angeles']
       *       },
       *       [ // Устанавливаем параметры сортировки: сначала производится сортировка по полю direction, а потом - по полю state
       *          {direction: false}, // Поле direction сортируется по возрастанию
       *          {state: true} // Поле state сортируется по убыванию
       *       ],
       *       50, // Устанавливаем смещение: из всех подходящих записей отбор результатов начнём с 50-ой записи
       *       20 // Требуется вернуть только 20 записей
       *    );
       * </pre>
       */
      reload: propertyUpdateWrapper(function (filter, sorting, offset, limit, deepReload, resetPosition) {
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
             this._notify('onBeforeDataLoad', this._getFilterForReload.apply(this, arguments), this.getSorting(), this._offset, this._limit);
             def = this._callQuery(this._getFilterForReload.apply(this, arguments), this.getSorting(), this._offset, this._limit)
                .addCallback(forAliveOnly(function (list) {
                   self._toggleIndicator(false);
                   self._notify('onDataLoad', list);
                   self._onDataLoad(list);
                   if (
                      this.getItems()
                      && (list.getModel() === this.getItems().getModel())
                      && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
                      && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this.getItems().getAdapter()).constructor)
                   ) {
                      this._setNewDataAfterReload(list);
                      self._drawItemsCallbackDebounce();
                   } else {
                      this._unsetItemsEventHandlers();
                      this._options._items = list;
                      this._options._itemsProjection = this._options._createDefaultProjection.call(this, this._options._items, this._options);
                      this._options._itemsProjection = this._options._applyGroupingToProjection(this._options._itemsProjection, this._options);
                      this._setItemsEventHandlers();
                      this._notify('onItemsReady');
                      this._itemsReadyCallback();
                      self.redraw();
                   }

                   self._checkIdProperty();

                   this._dataLoadedCallback(resetPosition);
                   //self._notify('onBeforeRedraw');
                   return list;
                }, self))
                .addErrback(function(error) {
                   if(!self.isDestroyed()) {
                      self._loadErrorProcess(error);
                   }
                   /* Если не прокинуть ошибку дальше, то далее в цепочке будут срабатывать
                      callback'и, а не errback'и */
                   return error;
                });
             this._loader = def;
          } else {
             if (this._options._itemsProjection) {
                this._redraw();
             }
             def = new Deferred();
             def.callback();
          }

         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('sorting');
         this._notifyOnPropertyChanged('offset');
         this._notifyOnPropertyChanged('limit');

         return def;
      }),

      _setNewDataAfterReload: function (list) {
         var meta = list.getMetaData();
         //TODO временный фикс. Прикладники используют memory source и пихают итоги в изначальный рекордсет.
         //однако при релоаде списка приходит новый рекордсет из memory в котором нет итогов и прочего
         //это должно решаться на уровне source в будущем
         if (cInstance.instanceOfModule(this.getDataSource(), 'WS.Data/Source/Memory')) {
            meta = cMerge(this._options._items.getMetaData(), list.getMetaData());
         }
         this._options._items.setMetaData(meta);
         this._options._items.assign(list);
      },

      _onDataLoad: function(){

      },

      _loadErrorProcess: function(error) {
        var self = this;
         if (!error.canceled) {
            this._toggleIndicator(false);
            if (this._notify('onDataLoadError', error) !== true && !error._isOfflineMode) {//Не показываем ошибку, если было прервано соединение с интернетом
               InformationPopupManager.showMessageDialog(
                 {
                    message: error.message,
                    opener: self,
                    status: 'error'
                 }
               );
               error.processed = true;
            }
         }
         return error;
      },

      _getFilterForReload: function() {
         return this._options.filter;
      },

      _getPropertyValue: function() {
         return this._options._propertyValueGetter.apply(this, arguments);
      },

      _callQuery: function (filter, sorting, offset, limit, direction) {
         if (!this._dataSource) {
            return;
         }

         var query = this._getQueryForCall(filter, sorting, offset, limit, direction);

         return this._dataSource.query(query).addCallback((function(dataSet) {
            if (this._options.idProperty && this._options.idProperty !== dataSet.getIdProperty()) {
               dataSet.setIdProperty(this._options.idProperty);
            }
            return dataSet.getAll();
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
          } else if (this._options.pageSize) {
             this._limit = Number(this._options.pageSize);
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
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize(), undefined, true);
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
         IoC.resolve('ILogger').log('ListView', 'Метод _isLoading() будет удален в 3.7.4 используйте isLoading()');
         return this.isLoading();
      },
      /**
       *
       * @returns {*|Boolean}
       */
      isLoading: function(){
         return this._loader && !this._loader.isReady(true);
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
      /**
       * Возвращает элементы коллекции.
       * @returns {WS.Data/Collection/RecordSet}
       * @see setItems
       */
      getItems : function() {
         return this._options._items;
      },
      _getItemsProjection: function() {
         return this._options._itemsProjection;
      },
       /**
        * Устанавливает новый набор элементов коллекции.
        * @param {Array.<Object>} items Набор новых данных, по которому строится отображение.
        * @example
        * Для списка устанавливаем набор данных из трёх записей. Опция idProperty установлена в значение id, а parentProperty - parent.
        * <pre>
        * myView.setItems([{
        *
        *    // Поле с первичным ключом
        *    id: 1,
        *    title: 'Сообщения'
        * },{
        *    id: 2,
        *    title: 'Прочитанные',
        *    parent: 1 // Поле иерархии
        * },{
        *    id: 3,
        *    title: 'Непрочитанные',
        *    parent: 1
        * }]);
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
          this._prepareConfig(undefined, items);

          this._dataLoadedCallback(); //TODO на это завязаны хлебные крошки, нужно будет спилить

          if (items instanceof Array) {
             if (this._options.pageSize && (items.length > this._options.pageSize)) {
                IoC.resolve('ILogger').log('ListView', 'Опция pageSize работает только при запросе данных через dataSource');
             }
             if (!this._options.idProperty) {
                this._options.idProperty = findIdProperty(this._options.items)
             }
             this._dataSource = new MemorySource({
                data: this._options.items,
                idProperty: this._options.idProperty
             });
          }
          else {
             this._notifyOnPropertyChanged('items');
          }
          this.redraw();
      },

      _drawItemsCallbackSync: function(){
         this._needToRedraw = true;
      },

      _drawItemsCallback: function () {
         /*Method must be implemented*/
      },
      /**
       * Производит перерисовку списка без повторного получения данных от источника данных.
       * @param {*}
       * @see redrawItem
       */
      redraw: function(notRevive) {
         /*notRevive - врмеенный параметр для внутренних механизмов*/
         this._itemData = null;
         if (this._isSlowDrawing(this._options.easyGroup)) {
            this._oldRedraw();
         }
         else {
            if (this._getItemsProjection()) {
               this._redrawItems(notRevive);
            }
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
       * @param {*}
       * @see redraw
       */
      redrawItem: function(item, projItem) {
         this._itemData = null;
         if (!this._isSlowDrawing(this._options.easyGroup)) {
            projItem = projItem || this._getItemProjectionByItemId(item.getId());
            //Если элемента в проекции нет, то и не надо перерисовывать запись
            if (projItem) {
               this._redrawItem(projItem);
               this._notifyOnDrawItems();
               this._reviveItems(item.getId() != this._options.selectedKey);
            }
         }
         else {
            this._oldRedrawItemInner(item, projItem);
            this._reviveItems(item.getId() != this._options.selectedKey);
         }
      },

      _oldRedrawItemInner: function(item, projItem, callback) {
         projItem = projItem || this._getItemProjectionByItemId(item.getId());
         var
            targetElement = this._getElementByModel(item),
            newElement = this._createItemInstance(projItem);/*раньше здесь звался _drawItem, но он звал лишнюю группировку, а при перерисовке одного итема она не нужна*/
         this._addItemAttributes(newElement, projItem);
         this._clearItems(targetElement);
         targetElement.after(newElement).remove();
         return true;
      },

      _getElementByModel: function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + item.getId() + '"]');
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
         if (!isEmpty(groupBy) && this._canApplyGrouping(item)) {
            resultGroup = groupBy.method.apply(this, [item.getContents(), at, last, item, this._options]);
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
                  columns : coreClone(this._options.columns || []),
                  multiselect : this._options.multiselect,
                  hierField: this._options.hierField + '@',
                  parentProperty: this._options.parentProperty,
                  nodeProperty: this._options.nodeProperty
               },
               targetContainer,
               itemInstance, groupTemplateFnc;
         targetContainer = this._getTargetContainer(item);
         tplOptions.item = item;
         tplOptions.colspan = tplOptions.columns.length + this._options.multiselect;
         groupTemplateFnc = TemplateUtil.prepareTemplate(groupBy.template);
         itemInstance = this._buildTplItem(projItem, groupTemplateFnc(tplOptions));
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
       * Устанавливает группировку элементов коллекции.
       * @remark
       * Если нужно, чтобы стандартаная группировка для элемента не вызывалась - нужно обязательно переопределить (передать) все опции (field, method, template, render), иначе в группировку запишутся стандартные параметры.
       * Всем элементам группы добавляется css-класс "controls-GroupBy".
       * Дополнительное описание о группировке и демо-примеры вы можете найти <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/groups/index/'>здесь</a>.
       * @param {GroupBy} group Параметры группировки.
       * @param {Boolean} redraw Произвести перерисовку списка после изменения параметров группировки.
       * @see groupBy
       * @see getGroupBy
       */
      setGroupBy : function(group, redraw){
         //TODO может перерисовку надо по-другому делать
         this._options.groupBy = group;
         // запросим данные из источника
         if (!isEmpty(this._options.groupBy) && !this._options.easyGroup){
            if (!this._options.groupBy.hasOwnProperty('method')){
               this._options.groupBy.method = _oldGroupByDefaultMethod;
            }
            if (!this._options.groupBy.hasOwnProperty('template')){
               this._options.groupBy.template = this._getGroupTpl();
            }
            if (!this._options.groupBy.hasOwnProperty('render')){
               this._options.groupBy.render = this._groupByDefaultRender;
            }

         }
         if (this._options.easyGroup && this._getItemsProjection()) {
            applyGroupingToProjection(this._getItemsProjection(), this._options);
         }
         if (redraw){
            this._redraw();
         }
      },
      /**
       * Возвращает параметры группировки элементов коллекции.
       * @remark
       * Дополнительное описание о группировке и демо-примеры вы можете найти <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/groups/index/'>здесь</a>.
       * @return {GroupBy}
       * @see groupBy
       * @see setGroupBy
       */
      getGroupBy : function() {
         return this._options.groupBy;
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
            var container = childControls[i].getContainer();
            //контейнера у контрола может не оказаться, многие создают контролы из кода без привязки к DOM например Action
            //проверим наличие контейнера, это заведомо не тот контрол, который нам нужен
            if (container && container.hasClass('controls-ListView__item')) {
               var hash = container.attr('data-hash');
               //Проверяем на то, что найденный элемент принадлежит именно текущему инстансу, а не вложенным.
               if (this._getItemsProjection().getByHash(hash)) {
                  this._itemsInstances[hash] = childControls[i];
               }
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
         if (isEmpty(this._itemsInstances)) {
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
        *     Menu.getItemInstance(3).setCaption('SomeNewCaption');
        * </pre>
        * @see getItems
        * @see setItems
        * @see items
        * @see getItemsInstances
        */
      getItemInstance: function (id) {
         var projItem = this._getItemProjectionByItemId(id);
         if (!projItem) {
            return undefined;
         }
         var instances = this.getItemsInstances();
         return instances[projItem.getHash()];
      },
      //TODO Сделать публичным? И перенести в другое место
      _hasNextPage: function (hasMore, offset) {
         offset = offset === undefined ? this._offset : offset;
         //n - приходит true, false || общее количество записей в списочном методе
         var hasNextPage = typeof (hasMore) !== 'boolean' ? hasMore > (offset + this._options.pageSize) : !!hasMore;
         if (this._getSourceNavigationType() == 'Offset') {
            return hasNextPage;
         } else {
            //Если offset отрицательный, значит запрашивали последнюю страницу
            return offset < 0 ? false : hasNextPage;
         }
      },
      _scrollTo: function scrollTo(target, toBottom, depth) {
         if (typeof target === 'string') {
            target = $(target);
         }
         LayoutManager.scrollToElement(target, toBottom, depth);
      },

      //TODO этот метод более общий чем _scrollToItem надо все места перевести на этот метод
      _scrollToProjItem: function(item, toBottom, depth) {
         var container = this._getDomElementByItem(item);
         if (container) {
            this._scrollTo(container, toBottom, depth);
         }
      },
      _scrollToItem: function(itemId, toBottom, depth) {
         var itemContainer  = $('.controls-ListView__item[data-id="' + itemId + '"]', this._getItemsContainer());
         if (itemContainer.length) {
            this._scrollTo(itemContainer, toBottom, depth);
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
       * @see dataSource
       * @see setDataSource
       */
      getDataSource: function(){
         return this._dataSource;
      },
      /**
       * Устанавливает шаблон для каждого элемента коллекции.
       * @param {String} tpl Шаблон отображения каждого элемента коллекции
       * @example
       * <pre>
       *    <div class="listViewItem" style="height: 30px;">\
       *       {{=it.item.get("title")}}\
       *    </div>
       * </pre>
       */
      setItemTpl: function(tpl) {
         this._options.itemTpl = tpl;
      },


      /**
       * Устанавливает поле элемента коллекции, которое является идентификатором записи
       * @deprecated Используйте метод {@link setIdProperty}.
       */
      setKeyField: function(keyField) {
         IoC.resolve('ILogger').log('ItemsControl', 'Метод setKeyField устарел, используйте setIdProperty');
         this.setIdProperty(keyField);
      },

      /**
       * Устанавливает поле элемента коллекции, которое является идентификатором записи
       * @example
       * <pre class="brush:xml">
       *     <option name="idProperty">Идентификатор</option>
       * </pre>
       * @see items
       * @see displayProperty
       * @see setDataSource
       * @param {String} idProperty
       */
      setIdProperty: function(idProperty) {
         this._options.idProperty = idProperty;
      },

      /**
       * Устанавливает поле элемента коллекции, из которого отображать данные
       * @deprecated Используйте метод {@link setDisplayProperty}.
       */
      setDisplayField: function(displayField) {
         IoC.resolve('ILogger').log('ItemsControl', 'Метод setDisplayField устарел, используйте setDisplayProperty');
         this._options.displayProperty = displayField;
      },

      /**
       * Устанавливает поле элемента коллекции, из которого отображать данные
       * @example
       * <pre class="brush:xml">
       *     <option name="displayProperty">Название</option>
       * </pre>
       * @remark
       * Данные задаются либо в опции {@link items}, либо методом {@link setDataSource}.
       * Источник данных может состоять из множества полей. В данной опции необходимо указать имя поля, данные
       * которого нужно отобразить.
       * @see idProperty
       * @see items
       * @see setDataSource
       * @param {String} displayProperty
       */
      setDisplayProperty: function(displayProperty) {
         this._options.displayProperty = displayProperty;
      },

      /**
       * Задаёт шаблон отображения содержимого каждого элемента коллекции
       * @param {String} tpl Шаблон отображения содержимого каждого элемента коллекции
       * @example
       * <pre>
       *    {{=it.item.get("title")}}
       * </pre>
       */
      setItemContentTpl: function(tpl) {
         this._options.itemContentTpl = tpl;
      },


      _getScrollContainer: function() {

      },
      _dataLoadedCallback: function () {

      },
      _itemsReadyCallback: function() {

      },
      _isCommonParent: function(upperRow, lowerRow){
         var upperRowParent = upperRow.attr('data-parent-hash'),
             lowerRowParent = lowerRow.attr('data-parent-hash');
         return upperRow.length ? (upperRowParent === lowerRowParent) : true;
      },
      _isNeedToRedraw: function(){
         // Проверяем _needToRedraw для поддержки старой медленной отрисовки
         // Если быстрая отрисовка - считаем, что перерисовка необходима
         return !!this._getItemsContainer() && (!this._isSlowDrawing(this._options.easyGroup) || this._needToRedraw);
      },

      _changeItemProperties: function(item, property) {
         if (this._isSlowDrawing(this._options.easyGroup)) {
            return this._oldRedrawItemInner(item.getContents(), item);
         }
         else {
            return this._redrawItemInner(item);
         }
      },

      _getItemContainerByIndex: function(parent, at) {
         return parent.find('> .controls-ListView__item:eq(' + at + ')');
      },

      _getItemContainer: function(parent, item) {
         var projItem = this._getItemProjectionByItemId(item.get(this._options.idProperty));
         return projItem ? parent.find('[data-hash="' + projItem.getHash() + '"]') : $();
      },



      /*TODO старый код связанный с медленной отрисовкой*/
      _oldRedraw: function () {
         var records;

         if (this._options._items) {
            this._clearItems();
            this._needToRedraw = false;
            records = this._options._getRecordsForRedraw.call(this, this._options._itemsProjection, this._options, true);
            this._toggleEmptyData(!records.length);
            this._drawItems(records);
         }
         /*класс для автотестов*/
         this._container.addClass('controls-ListView__dataLoaded').removeClass('controls-ListView__dataNotLoaded');
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
         } else if (this._options.itemTpl) {
            return this._options.itemTpl;
         } else {
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

               //старая отрисовка, если не нашли элемент в проекции, то и не надо его рисовать
               if (projItem) {
                  this._drawAndAppendItem(projItem, curAt, i === items.length - 1);
                  if (curAt && curAt.at) {
                     curAt.at++;
                  }
               }
            }
            this.reviveComponents().addCallback(this._notifyOnDrawItems.bind(this)).addErrback(function(e){
               throw e;
            });
         } else {
            this._notifyOnDrawItems();
         }
      },

      _normalizeItems: function (items) {
         if (!cInstance.instanceOfMixin(items, 'WS.Data/Collection/IList')) {
            return items;
         }
         var result = [];
         items.each(function(item) {
            result.push(item);
         });
         return result;
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
            args['escapeHtml'] = escapeHtml;
            buildedTpl = dotTemplate(args);
            //TODO нашлись умники, которые в качестве шаблона передают функцию, возвращающую jquery
            //в 200 пусть поживут, а в новой отрисовке, отпилим у них
            if (buildedTpl instanceof $) {
               buildedTpl = buildedTpl.get(0).outerHTML;
            }
            if (buildedTpl.hasOwnProperty('html')) {
               return $(buildedTpl.html);
            }
            return $(ParserUtilities.buildInnerComponents(buildedTpl, this._options));
         } else {
            throw new Error('Ошибка в itemTemplate');
         }
      },

      _canApplyGrouping: function(projItem) {
         // Если сортировка не задана - то разрешена группировка всех записей - и листьев и узлов
         return !isEmpty(this._options.groupBy) && (this._options._itemsProjection.getSort().length === 0 || !projItem.isNode || !projItem.isNode());
      },

      _getGroupItems: function(groupId) {
         return this._getItemsProjection().getGroupItems(groupId);
      },

      _addItem: function (projItem, at, withoutNotify) {
         var
            item = projItem.getContents(),
            canApplyGrouping = this._canApplyGrouping(projItem),
            previousGroupBy = this._previousGroupBy;//После добавления записи восстанавливаем это значение, чтобы не сломалась группировка
         /*TODO отдельно обрабатываем случай с группировкой*/
         var flagAfter = false;
         if (canApplyGrouping) {
            var
               meth = this._options.groupBy.method,
               prev = this._options._itemsProjection.getPrevious(projItem),
               next = this._options._itemsProjection.getNext(projItem);
            if (prev) {
               meth.call(this, prev.getContents(), undefined, undefined, prev, this._options);
            }
            meth.call(this, item, undefined, undefined, projItem, this._options);
            if (next && !meth.call(this, next.getContents(), undefined, undefined, next, this._options)) {
               flagAfter = true;
            }
         }
         /**/
         var target = this._getTargetContainer(item),
            template = this._getItemTemplate(projItem),
            newItemContainer = this._buildTplItem(projItem, template);
         this._addItemAttributes(newItemContainer, projItem);
         this._insertItemContainer(item, newItemContainer, target, at, prev, flagAfter);
         if (canApplyGrouping) {
            this._group(projItem, {at: at});
            this._previousGroupBy = previousGroupBy;
         }
         //для старой отрисовки всегда оживляем компоненты в конце отрисовки
         this._revivePackageParams.revive = true;
         this._revivePackageParams.light = false;
         if (!withoutNotify) {
            this._notifyOnDrawItems();
         }
      },

      _insertItemContainer: function(item, itemContainer, target, at, prev, flagAfter) {
         var
             meth = this._options.groupBy.method,
             currentItemAt = at > 0 ? this._getItemContainerByIndex(target, at - 1) : null;
         if (flagAfter) {
            itemContainer.insertBefore(this._getItemContainerByIndex(target, at));
         } else if (currentItemAt && currentItemAt.length) {
            if (prev) {
               meth && meth.call(this, prev.getContents(), undefined, undefined, prev, this._options);
            }
            itemContainer.insertAfter(currentItemAt);
         } else if(at === 0) {
            this._previousGroupBy = undefined;
            itemContainer.prependTo(target);
         } else {
            itemContainer.appendTo(target);
         }
      },

      _addItemAttributes: function (container, item) {
         var strKey = item.getContents().getId();
         if (strKey == null) {
            strKey += '';
         }
         container.attr('data-id', strKey).addClass('controls-ListView__item');
         container.attr('data-hash', item.getHash());
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
               if (at.at == 0) {
                  targetContainer.prepend(itemBuildedTpl);
               }
               else {
                  atContainer = $('> .controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at);
                  if (atContainer.length) {
                     atContainer.before(itemBuildedTpl);
                  } else {
                     targetContainer.append(itemBuildedTpl);
                  }
               }
            }
         }
         else {
            targetContainer.append(itemBuildedTpl);
         }
      },
      _onCollectionReplace: function(items) {
         var i, needToRevive = false;
         for (i = 0; i < items.length; i++) {
            needToRevive = this._changeItemProperties(items[i]) || needToRevive;
         }
         this._revivePackageParams.revive = this._revivePackageParams.revive || needToRevive;
         this._revivePackageParams.light = false;
      },
      _onCollectionReset: function() {
         this.redraw(true);
      },
      _onCollectionRemove: function(items, notCollapsed) {
         if (items.length) {
            this._removeItems(items);
         }
      },
      _onCollectionAddMoveRemove: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         this._onCollectionRemove(oldItems, action === IBindCollection.ACTION_MOVE);
         if (newItems.length) {
            this._addItems(newItems, newItemsIndex)
         }
         this._toggleEmptyData(!this._options._itemsProjection.getCount());
      },
      /**
       * Устанавливает метод сортировки элементов на клиенте.
       * @param {Function} sort функция сортировка элементов, если передать undefined сортировка сбросится
       * @see WS.Data/Display/Collection:setSort
       */
      setItemsSortMethod: function(sort){
         this._options.itemsSortMethod = sort;
         if(this._options._itemsProjection) {
            this._options._itemsProjection.setSort(sort);
         }
      },
      /**
       * Устанавливает метод фильтрации элементов на клиенте.
       * @param {Function} filter функция фильтрации элементов, если передать undefined фильтрация сбросится
       * @see WS.Data/Display/Collection:setFilter
       */
      setItemsFilterMethod: function(filter) {
         this._options.itemsFilterMethod = filter;
         if(this._options._itemsProjection) {
            this._options._applyFilterToProjection(this._getItemsProjection(), this._options);
         }
      },
      /**
       * Возвращает последний элемент по проекции
       * @return {WS.Data/Entity/Model}
       */
      getLastItemByProjection: function(){
         if(this._options._itemsProjection && this._options._itemsProjection.getCount()) {
            return this._options._itemsProjection.at(this._options._itemsProjection.getCount()-1).getContents();
         }
      },
      /**
       * Обработчик для обновления проперти. В наследниках itemsControlMixin иногда требуется по особому обработать изменение проперти.
       * @param item
       * @param property
       * @private
       */
      _onUpdateItemProperty: function(item, property) {
         var needToRevive;
         if (this._isNeedToRedraw()) {
            needToRevive = this._changeItemProperties(item, property);
            this._revivePackageParams.revive = this._revivePackageParams.revive || needToRevive;
            if (cInstance.instanceOfModule(item, 'WS.Data/Entity/Model')) {
               this._revivePackageParams.light = this._revivePackageParams.light && (item.getContents().getId() != this._options.selectedKey);
            }
         }
      },

      _afterCollectionChange: function() {}
   };

   var
      onBeforeCollectionChange = function() {
         //У Лехи Мальцева не всегда соблюдается 100% последовательность before / change / after
         //поэтому сброс в before делаем только тогда когда был соотве after
         if (this._revivePackageParams.processed) {
            this._revivePackageParams = {
               light: true,
               revive: false,
               processed: false
            };
         }
      },

      onCollectionItemChange = function(eventObject, item, index, property) {
         //Вызываем обработчик для обновления проперти. В наследниках itemsControlMixin иногда требуется по особому обработать изменение проперти.
         this._onUpdateItemProperty(item, property);
      },
      /**
       * Обрабатывает событие об изменении коллекции
       * @param {Core/EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {WS.Data/Display/CollectionItem[]} newItems Новые элементы коллеции.
       * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {WS.Data/Display/CollectionItem[]} oldItems Удаленные элементы коллекции.
       * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (this._isNeedToRedraw()) {
            if (newItems.length > 0) {
               //TODO проекция отдает неправильные индексы выписана ошибка https://online.sbis.ru/opendoc.html?guid=ccb6214b-70ab-45d3-b5e3-e2e15ddeb639&des=
               newItemsIndex = this._getItemsProjection().getIndex(newItems[0]);
            }
	         switch (action) {
	            case IBindCollection.ACTION_ADD:
               case IBindCollection.ACTION_MOVE:
               case IBindCollection.ACTION_REMOVE:
                  if (action === IBindCollection.ACTION_MOVE && (!isEmpty(this._options.groupBy) || this._isSearchMode())) {
                     this.redraw(); //TODO костыль, пока не будет группировки на стороне проекции.
                  } else {
                     this._onCollectionAddMoveRemove.apply(this, arguments);
                  }
	               break;

               case IBindCollection.ACTION_CHANGE:
                  newItems.forEach(function(item, i) {
                     onCollectionItemChange.call(this, event, item, newItemsIndex + i, newItems.properties);
                  }, this);
                  break;

	            case IBindCollection.ACTION_REPLACE:
	               this._onCollectionReplace(newItems);
	               break;

	            case IBindCollection.ACTION_RESET:
	               this._onCollectionReset();
	               break;
	         }
      	}
      },
      onAfterCollectionChange = function() {
         if (this._revivePackageParams.revive !== false) {
            this._reviveItems(this._revivePackageParams.light)
         }
         else {
            this._notifyOnDrawItems(this._revivePackageParams.light);
         }
         this._revivePackageParams.processed = true;
         this._afterCollectionChange();
      };
   return ItemsControlMixin;

});
