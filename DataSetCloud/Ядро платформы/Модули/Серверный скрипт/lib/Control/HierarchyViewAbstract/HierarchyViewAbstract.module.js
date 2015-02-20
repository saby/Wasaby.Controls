/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 0:56
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.HierarchyViewAbstract', ['js!SBIS3.CORE.TableView', 'js!SBIS3.CORE.DataViewAbstract',
                                               'js!SBIS3.CORE.PathSelector', 'js!SBIS3.CORE.Control' ],
      function( TableView, DataViewAbstract, PathSelector, Control ) {

   'use strict';

   $ws.single.DependencyResolver.register('SBIS3.CORE.HierarchyViewAbstract', function(config){
      var deps = {};

      if(config && config.display && config.display.showPathSelector) {
         deps['js!SBIS3.CORE.PathSelector'] = 1;
      }

      return Object.keys(deps);
   }, 'SBIS3.CORE.DataViewAbstract/SBIS3.CORE.TableView');

   var createBatchUpdateWrapperNoWaitDeferred = Control.ControlBatchUpdater.createBatchUpdateWrapperNoWaitDeferred;

   /**
    * @event onDragStart Перед началом перемещения
    * Событие, происходящее перед началом перемещения записи.
    * @param {$ws.proto.EventObject} Дескриптор события.
    * @param {Array} selectedRecords Перемещаемые записи.
    * @return Если вернули false, то не будет перемещать.
    * @example
    * <pre>
    *    dataView.subscribe('onDragStart', function(event, records){
    *       if(records.length > 1)
    *          event.setResult(false);
    *    });
    * </pre>
    */
   /**
    * @event onDragStop При завершении перемещения
    * Событие, происходящее при завершении перемещения записей в папку.
    * @param {$ws.proto.EventObject} Дескриптор события.
    * @param {Array} selectedRecords Перемещаемые записи.
    * @param {$ws.proto.Record} record Запись, в которую будут перемещены записи.
    * @return Если вернули false, то не будет перемещать.
    * @example
    * <pre>
    *    dataView.subscribe('onDragStop', function(event, records, toRecord){
    *       if(toRecord.get("Запрещено"))
    *          event.setResult(false);
    *    });
    * </pre>
    */
   /**
    * @event onConvert При переключении из иерархии в дерево.
    * Событие при нажатии на иконку переключения из иерархии в дерево в тулбаре
    * Особенности. Если при переключении в дерево, в дереве больше 1000 записей,
    * выдается подсказка, что не все данные могут быть отображены
    * При переключении фактически уничтожается иерархическое представление и создается новое - дерево.
    * Оно имеет тот же контекст, те же фильтры, сохраняет пользовательские обработчики (те, что имеют wsHandlerPath) и
    * все обработчики onConvert
    * ВАЖНО! Обработчики, навешанные из кода, не сохраняются! Для того, чтобы иметь заново подписаться на свои обработчики
    * нужно подписаться на onConvert и продублировать подписание на нужные события
    */
   /**
    * @class $ws.proto.HierarchyViewAbstract
    * @extends $ws.proto.TableView
    */
   $ws.proto.HierarchyViewAbstract = TableView.extend(/** @lends $ws.proto.HierarchyViewAbstract.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String}Режим редактирования папки
             * <wiTag group="Управление">
             * @variant newDialog Dialog
             * @variant newFloatArea Float area
             */
            editBranchMode: 'newDialog',
            /**
             * <wiTag group="Отображение">
             * @cfg {String} Имя шаблона диалога редактирования узла (только для иерархии)
             * Задаёт диалог редактирования папки.
             * @editor ExternalComponentChooser
             */
            editBranchDialogTemplate: '',
            /**
             * @cfg {String} Шаблон редактирования узла, который открывают из всплывающей панели
             * <wiTag group="Отображение">
             * Задает диалог редактирования узла, который открывают из всплывающей панели.
             * @editor ExternalComponentChooser
             */
            editFullScreenBranchTemplate: undefined,
            /**
             * @cfg {String} Тип выбираемых записей
             * <wiTag class=HierarchyView group="Управление">
             * Опция задает тип записей, которые можно выбирать в данном иерархическом браузере.
             * <pre>
             *    dataView.setSelectionType('all');
             * </pre>
             * @variant node Только узлы
             * @variant leaf Только листья
             * @variant all Любые, по умолчанию
             * @see setSelectionType
             */
            selectionType: 'all',
            /**
             * @cfg {String} Действие при активации папки
             * <wiTag class=TreeView group="Управление">
             * Опция задаёт действие при клике на ссылку в строке папки.
             * @variant open Открыть папку
             * @variant edit Редактировать папку
             */
            folderLinkAction: 'open',
            display: {
               /**
                * @cfg {String} Поле иерархии
                * <wiTag group="Данные">
                * Имя поля, в котором хранятся данные о положении папки в иерархии (поле с типом иерархия в таблице).
                * Изменяется с помощью метода setHierarchyField
                * <pre>
                *    dataView.setHierarchyField('Сотрудник.Раздел', 'Сотрудник.ФИО');
                * </pre>
                * @editor BLFieldsChooser
                */
               hierColumn: 'Раздел',
               /**
                * @cfg {String} Поле с названием иерархии
                * <wiTag group="Данные">
                * Имя поля, значение которого будет выведено в качестве имени папки.
                * Изменяется с помощью метода setHierarchyField
                * <pre>
                *    dataView.setHierarchyField('Сотрудник.Раздел', 'Сотрудник.ФИО');
                * </pre>
                *
                * @editor BLFieldsChooser
                */
               titleColumn: 'Название',
               ///Это никак не Display дальше
               /**
                * @cfg {Boolean} Загрузка по частям
                * <wiTag group="Данные">
                * Необходимо ли загружать данные по частям.
                * Возможные значения:
                * <ol>
                *    <li>false - использовать полную загрузку;</li>
                *    <li>true - использовать загрузку по частям.</li>
                * </ol>
                * При отключенной загрузке по частям данные грузятся в начале полным списком один раз, при открытии
                * папки данные не перезапрашиваются.
                * При включенной загрузке по частям загружается только содержимое отображаемой папки.
                */
               partiallyLoad: false,
               /**
                * @cfg {String} Заголовок корня
                * <wiTag group="Отображение" >
                * Имя папки, обозначающей корень.
                * Если передать пустое значение, то поставится иконка домика.
                * <pre>
                *    dataView.setRootName("Все сотрудники");
                * </pre>
                * @see setRootName
                */
               rootName: 'Все',
               /**
                * @cfg {Number|String} Идентификатор корня
                * <wiTag group="Данные">
                * Ключ записи, начиная с которой мы хотим отображать иерархию, для отображения не всех данных, а конкретной ветки.
                * Получить текущее значение можно методом getRootNode
                * <pre>
                *    dataView.getRootNode();
                * </pre>
                * Для иерархического представления получить ключ текущей открытой папки можно методом getCurrentRootNode
                * <pre>
                *    dataView.getCurrentRootNode();
                * </pre>
                * Изменить корень можно с помощью метода setRootNode
                * <pre>
                *    dataView.setRootNode('123');
                * </pre>
                */
               rootNode: null,
               /**
                * @cfg {Boolean} Фиксированный разворот
                * <wiTag group="Управление">
                * Запрещает изменять начальное состояние отображения (не даёт переключать режим отображения Ctrl+B/Ctrl+V)
                * @see expand
                * @see applyTurn
                */
               fixedExpand: false,
               /**
                * @cfg {String} Разворот
                * <wiTag group="Отображение">
                * Опция задаёт режим разворота.
                * @variant '' Без разворота
                * @variant items Только листья
                * @variant folders С узлами и листьями
                * @see fixedExpand
                * @see applyTurn
                */
               expand: '',
               /**
                * @typedef {Object} ShowPathVariants
                * @property {Boolean} true Отображать панель переключения между папками
                * @property {Boolean} false Не отображать панель переключения между папками
                * @property {String} inHead Отображать хлебные крошки в первой колонке заголовка иерархического представления
                */
                /**
                * @cfg {ShowPathVariants} Отображать ли путь
                * <wiTag group="Отображение">
                * Необходимо ли отображение панели переключения между папками.
                * @see rootName
                */
               showPathSelector: true
            },
            /**
             * @cfg {Object} Опции для toolbar
             * <wiTag noShow>
             */
            optionsSaver: {}
         },
         // поля иерархии: ссылка на родителя и признак узла
         _hierColumnParentId: 'Раздел',
         _hierColumnIsLeaf: 'Раздел@',
         _hierColumnHasChild: 'Раздел$',
         //Изменяемые параметры, обычно в ходе перезагрузки
         _loaded: {},                     //Флаги загруженности веток дерева
         _currentRootId: null,            //Текущий отображаемый узел
         _wayRS: undefined,               //RecordSet, который получает путь до узла для showBranch
         _wayRSDeferred: undefined,       //Deferred, ответственный за первую загрузку _wayRS
         _rootNode: null,                 //Текущий корневой узел
         _pathSelector: undefined,        //Контрол PathSelector, используется для иерархии
         _titleColumnIndex: -1,           //Индекс параметров конфигурации колонки заголовка папки
         _rowTemplates: [undefined, undefined],  //Шаблоны для создания строк, нулевой - для листа, первый - для папки
         _selectAfterPathLoad: true,             //Выделять ли запись после загрузки пути в дереве
         _isInsertOnFolderInTree: false,  //Признак того, что нажали Insert/Ctrl+Insert на папке
         _expanded: {},                   //Флаги с открытыми ветками дерева
         _showAllRoots: false,            //Показывать ли все корни из рекордсета
         _rowOptionsContainer: 'ws-browser-row-options-container ws-browser-hierarchy-row-options-container',
         _systemParams: {
            "ВидДерева": "",
            "HierarchyField": "",
            "Разворот": "",
            "ПутьКУзлу": "",
            "ЗаголовокИерархии": "",
            "_ЕстьДочерние": false
         },
         _pageSaver: {
            'null' : 0
         },
         //КЛАВИШИ обрабатываемые данным классом
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.down,
            $ws._const.key.up,
            $ws._const.key.del,
            $ws._const.key.insert,
            $ws._const.key.f3,
            $ws._const.key.esc,
            $ws._const.key.pageUp,
            $ws._const.key.minus,
            $ws._const.key.pageDown,
            $ws._const.key.space,
            $ws._const.key.q,
            $ws._const.key.n,
            $ws._const.key.b,
            $ws._const.key.v,
            $ws._const.key.m,
            $ws._const.key.backspace
         ]
      },
      $constructor : function(){
         $ws.single.CommandDispatcher.declareCommand(this, 'newFolder', this._insertRecordFolder);
         $ws.single.CommandDispatcher.declareCommand(this, 'newChildItem', this._insertChildRecordItem);
         $ws.single.CommandDispatcher.declareCommand(this, 'newChildFolder', this._insertChildRecordFolder);
         this._currentRootId = this._rootNode;
         if (this._emptyDataBlock && (this._options.display.showPathSelector || !this.isHierarchy() ) && this._options.display.showHead !== true){
            if (this._options.display.hasZebra){
               this._emptyDataBlock.addClass('ws-browser-empty-border');
            }
         }
         this._publish('onDragStart', 'onDragMove', 'onDragStop', 'onConvert');
      },
      /**
       * При переключении из иерархию в дерево, не нужно менять контекст
       * @returns {boolean}
       * @private
       */
      _resetContext: function(){
         return !(this._options.optionsSaver && this._options.optionsSaver.isConverted);
      },
      _collectTemplatesToPreload: function() {
         var
            parentTemplates = $ws.proto.HierarchyViewAbstract.superclass._collectTemplatesToPreload.apply(this, arguments),
            myResult = [];
         if (this._options.editBranchMode in DataViewAbstract.PRELOAD_ENABLED_MODES) {
            myResult = [ this._options.editBranchDialogTemplate, this._options.editFullScreenBranchTemplate ];
         }
         return parentTemplates.concat(myResult);
      },

      /**
       * <wiTag group="Управление" noShow>
       * Возвращает имя колонки, отвечающей за название в случае иерархии
       * @returns {string}
       */
      getTitleName: function(){
         return this._options.display.titleColumn;
      },
      /**
       * <wiTag group="Управление" noShow>
       * Возвращает текущий отображаемый узел
       * @deprecated Будет удален полностью в 3.7, используйте {@link $ws.single.HierarchyViewAbstract#getCurrentRootNode}
       * @returns {null|$ws.proto.HierarchyViewAbstract._currentRootId|$ws.proto.HierarchyViewAbstract._currentRootId}
       */
      getCurrentRootId: function(){
         return this._currentRootId;
      },
      /**
       * Обновляет служебные поля, необходимые для получения иерархических значений.
       * @param {String} hierColumn Новое значение поля иерархии
       * @private
       */
      _updateHierColumnParams: function(hierColumn){
         this._hierColumnParentId = hierColumn;
         this._hierColumnIsLeaf = hierColumn + "@";
         this._hierColumnHasChild = hierColumn + "$";
      },
      /**
       * Метод проверяет конфиг и проставляет нужные переменные
       */
      _configChecking: function(){
         this._updateHierColumnParams(this._options.display.hierColumn);
         $ws.proto.HierarchyViewAbstract.superclass._configChecking.apply(this, arguments);
         if(this._options.display.rootNode !== null){
            if(typeof(this._options.display.rootNode) === 'object' ){
               var context = this.getLinkedContext(),
                  rootNodeField = this._options.display.rootNode.fieldName;
               if(context.getValue !== undefined && context.getValue(rootNodeField) !== undefined) {
                  this._rootNode = context.getValue(rootNodeField);
               }
            } else {
               this._rootNode = this._options.display.rootNode;
            }
            //если корень не поумолчанию, то проставим его в системные параметры, так как они проинициализировались раньше
            this._systemParams[this._hierColumnParentId] = this._rootNode;
         }
      },
      /**
       * Вызывается в DataViewAbstract при проверке конфигурации _confingChecking
       * @private
       */
      _initSystemParams: function(){
         $ws.proto.HierarchyViewAbstract.superclass._initSystemParams.apply(this, arguments);
         this._systemParams['ВидДерева'] = 'С узлами и листьями';
         if(this._options.selectionType === 'node' || this._options.display.viewMode === 'foldersTree'){
            this._options.filterParams['ВидДерева'] = 'Только узлы';
            this._systemParams['ВидДерева'] = 'Только узлы';
         }
         this._systemParams.HierarchyField = this._options.filterParams.HierarchyField || this._hierColumnParentId;

         this._systemParams[this._hierColumnParentId] = this._rootNode;
         this._systemParams['Разворот'] = this._options.display.partiallyLoad ? 'Без разворота' : 'С разворотом';
         this._systemParams['ЗаголовокИерархии'] = this._options.display.titleColumn;
         this._systemParams['ПутьКУзлу'] = true;
      },
      /**
       * Обработчик, который определяет, куда вставлять запись
       * @param {jQuery} row Строчка, по которой произошёл клик
       * @param {Event} [event] Событие
       * @return {String|null|Boolean}
       * @protected
       */
      _insertRowPosition: function(row, event){
         if( event && event.altKey ){
            return false;
         }
         return this._currentRootId;
      },
      _initActionsFlags: function(){
         $ws.proto.HierarchyViewAbstract.superclass._initActionsFlags.apply(this, arguments);
         var self = this,
            addFunction = function(row, event, isBranch) {
               var parent = self._insertRowPosition(row, event);
               if( parent !== false ){
                  self._showRecordDialog({parentId: parent, isBranch: isBranch});
               }
            };
         if(this._options.allowAdd !== false && !this._options.display.readOnly) {
            if(this._options.editDialogTemplate) {
               this._actions.addItem = function(row, event) {
                  addFunction(row, event, false);
               };
            }
            if(this._options.editBranchDialogTemplate) {
               this._actions.addFolder = function(row, event) {
                  addFunction(row, event, true);
               };
            }
         }
         if(!this._actions.edit && this._options.editBranchDialogTemplate && this._options.allowEdit !== false){
            this._actions.edit = this._actionEdit.bind(this);
         }
      },
      /**
       * <wiTag group="Данные">
       * Заменяет набор данных, управляемых с помощью табличного браузера
       * @param {$ws.proto.RecordSet} data Новый набор данных
       * @param {boolean} [useInitialRecordSet] восстановить путь из старого рекордсета
       * @example
       * <pre>
       *    $ws.helpers.newRecordSet("Сотрудник", "Список").addCallback(function(recordSet){
       *       dataView.setData(recordSet);
       *    });
       * </pre>
       */
      setData: function(data, useInitialRecordSet){
         $ws.proto.HierarchyViewAbstract.superclass.setData.apply(this, arguments);
         var self = this,
               hierarchySetting = function(){
                  var wayToBranch;
                  data.setHierarchyField(self._hierColumnParentId);
                  if (self.isHierarchy() && self._pathSelector) {
                     self._pathSelector.setPath([]);
                     if (self._turn === '') {
                        wayToBranch = self._findWay(self._currentRootId, useInitialRecordSet);
                     }
                  }
                  self._currentRootId = wayToBranch ? self._currentRootId : self._rootNode;
               };
         if(this._parent && !this._parent.isReady()){
            if(this._setDataHandler)
               this._parent.unsubscribe('onReady', this._setDataHandler);
            this._setDataHandler = this._setDataHandler.callNext(hierarchySetting);
            this._parent.subscribe('onReady', this._setDataHandler);
         }
         else{
            hierarchySetting();
         }
      },
      /**
       * Разворачивает браузер при смене фильтра через метод
       * @param {Object} filter Новый фильтр
       * @param {String} fieldValue Значение разворота
       * @protected
       */
      _expandFromFilter: function(filter, fieldValue){
      },
      _prepareQueryFilter: function(filter){
         var queryFilter = $ws.proto.HierarchyViewAbstract.superclass._prepareQueryFilter.apply(this, arguments);
         for(var i in queryFilter){
            if(queryFilter.hasOwnProperty(i)){
               if(i == this._hierColumnParentId){
                  this._systemParams[i] = queryFilter[i];
                  this._currentRootId = queryFilter[i];
               } else if(i === 'Разворот' && filter.hasOwnProperty(i) && this._options.display.expand === ''){
                  this._systemParams[i] = queryFilter[i];
                  this._expandFromFilter(queryFilter, queryFilter[i]);
               }
            }
         }
         this._loaded = {};
         return queryFilter;
      },
      /**
       * Подготавливает источник данных
       * @private
       */
      _prepareDataSource: function(){
         $ws.proto.HierarchyViewAbstract.superclass._prepareDataSource.apply(this, arguments);
         var dataSource = this._options.dataSource;

         if (!(dataSource instanceof Object))
            return;

         var toMerge = {
            usePages: this._options.display.expand ? '' : this._options.display.usePaging
         };
         if(this._options.display.expand)
            this._expandAll(this._options.display.expand === 'folders', true);

         if(this._options.dataSource.filterParams[this._hierColumnParentId] === "") // запрашиваемый узел всегда должен уйти правильно
            this._options.dataSource.filterParams[this._hierColumnParentId] = this._rootNode;
         $ws.core.merge(dataSource, toMerge);
         this._currentRootId = this._rootNode;
         if(dataSource.firstRequest){
            this._loaded[this._rootNode] = true;
         }
      },
      /**
       * Конфигурирует источник данных
       * @private
       */
      _initDataSource: function(){
         $ws.proto.HierarchyViewAbstract.superclass._initDataSource.apply(this, arguments);
         this._drawPathSelector();
      },
      /**
       * Находит путь к узлу по его id
       * @param {Number} idpr идентификатор строки
       * @param {boolean} [useInitialRecordSet] искать путь в старом рекордсете
       */
      _findWay: function(idpr, useInitialRecordSet){
         if(this._pathSelector) {
            var wayToBranch = useInitialRecordSet ? this._initialRecordSet.getWay() : this._currentRecordSet.getWay(),
                way = [],
                record;

            if (wayToBranch) {
               while((idpr || idpr === 0) && idpr != this._rootNode && wayToBranch !== null){
                  try{
                     record = wayToBranch.getRecordByPrimaryKey(idpr);
                  }catch(e){
                     try {
                        record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
                     } catch(e) {
                        //Если не нашли нужный раздел, то оставляем домик и высветится - нет данных
                        way.unshift({'title': '', 'id': null});
                        break;
                     }
                  }
                  way.unshift({'title': record.get(this._options.display.titleColumn), 'id': record.getKey()});
                  idpr = record.get(this._hierColumnParentId);
               }
               this._pathSelector.setPath(way);
            }
         }
         return wayToBranch;
      },
      _pathRecordSetLoaded: function(eventState, recordSet, isSuccess){
         if(isSuccess){
            //Мы загрузили путь до узла
            var path = this._wayRS.getWay(),
                record,                                            //Текущая запись из рекордсета
                tempKey,                                           //Идентификатор, по которому будут загружаться записи
                tempWay = [];                                      //Временный массив для складирования данных PathSelector'а

            if(this._rootNode && path !== null && !path.contains(this._rootNode)) {
               this._wayRSDeferred.callback();
            }
            else {
               if (!path) {
                  $ws.single.ioc.resolve('ILogger').error('HierarchyViewAbstract', 'Requires way ("p") in request result');
                  return;
               }

               path.rewind();
               var wasRoot = !this._rootNode; //Был ли найден корневой узер
               while((record = path.next()) !== false){//В дереве делаем массив ключей, которые нужно будет подгрузить
                  var key = record.getKey();
                  if(record.get(this._hierColumnIsLeaf) === false && wasRoot){
                     break;
                  }
                  if(this._rootNode == key){
                     wasRoot = true;
                  }

                  //Используем только ключи, которые между рутом и первой скрытой папкой после рута
                  if(wasRoot){
                     tempWay.push({'title': record.get(this._options.display.titleColumn), 'id': key});
                  }
               }
               this._currentRootId = tempKey = (!tempWay.length ? this._rootNode : tempWay[tempWay.length - 1].id);
               this._hovered = this._wayRS.getLoadingId();
               this._activeElement = undefined;
               this._systemParams[this._hierColumnParentId] = tempKey;
               var deferred = this._currentRecordSet.loadNode(tempKey, true,
                     this._pageSaver[this._currentRootId] ? this._pageSaver[this._currentRootId] : 0);
               this._wayRSDeferred.dependOn(deferred);
            }
         } else {
            this._wayRSDeferred.errback('Не загружается путь у HierarchyViewAbstract: ' + this._id);
         }
      },
      /**
       * Создаёт специальный рекордсет, нужный, чтобы загружать путь до узла
       * @param {Number} rowkey идентификатор строки
       */
      _createPathRecordSet: function(rowkey){
         var dataSource = $ws.core.merge({}, this._initialSource),
               self = this;
         this._wayRSDeferred = new $ws.proto.Deferred();
         dataSource.firstRequest = true;
         dataSource.filterParams[this._hierColumnParentId] = rowkey;
         dataSource.filterParams["ПутьКУзлу"] = true;
         dataSource.filterParams["ЗаголовокИерархии"] = this._options.display.titleColumn;
         dataSource.pageNum = this._pageSaver[rowkey] ? this._pageSaver[rowkey] : 0;
         dataSource.handlers = {
            'onAfterLoad': $.proxy(self._pathRecordSetLoaded, self)
         };
         $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance){
            self._wayRS = instance;
         });
         return this._wayRSDeferred;
      },
      /**
       * <wiTag group="Управление" >
       * Разворачивает указанную ветку по id парента
       * @param {Number} rowkey идентификатор парента
       * @param {Boolean} [noSelection] флаг того, что указанную запись не нужно выделять
       * @returns {$ws.proto.Deferred|undefined}
       * @example
       * <pre>
       *    dataView.showBranch("123");
       * </pre>
       */
      showBranch: createBatchUpdateWrapperNoWaitDeferred('Browser.showBranch', function(rowkey, noSelection){
         var page = this._pageSaver[rowkey];
         if(this._options.display.partiallyLoad && rowkey != this._rootNode &&
               !this._currentRecordSet.contains(rowkey)){//Если мы не знаем, где расположена запись - нужно узнать
            this._showBranchAfterPathLoad(rowkey, noSelection);
            if(!this._wayRS)
               return this._createPathRecordSet(rowkey);
            else{
               this._wayRSDeferred = new $ws.proto.Deferred();//надо пересоздать при перезагрузке
               return this._wayRS.loadNode(rowkey, true, page ? page : 0);
            }
         }
         else{
            return this._showActiveFolderOrElement(rowkey, noSelection);
         }
      }),
      /**
       * Действия, которые нужно сделать при загрузке пути
       */
      _showBranchAfterPathLoad: function(){
      },
      /**
       * <wiTag group="Отображение">
       * Получить признак развернута ли папка по id парента.
       * @param {Number} rowkey Идентификатор парента.
       * @returns {Boolean} Открыта ли папка с указанным ключом (rowkey) в текущий момент.
       * Возможные значения:
       * <ol>
       *    <li>true - папка с указанным ключом сейчас открыта;</li>
       *    <li>false - закрыта.</li>
       * </ol>
       * @example
       * Проверить открыта ли сейчас папка с ключом 123, если нет, то открыть.
       * <pre>
       *    if(!dataView.isShow("123"))
       *       dataView.showBranch("123");
       * </pre>
       */
      isShow: function(rowkey){
         return rowkey === this._currentRootId;
      },
      /**
       * Разворачивает указанную ветку по id парента или делает активным, если указана не папка
       * @param {Number} rowkey идентификатор парента
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showActiveFolderOrElement: createBatchUpdateWrapperNoWaitDeferred('Browser._showActiveFolderOrElement', function(rowkey, noSelection){
         return this._showBranchHierarchy(rowkey, noSelection);
      }),
      /**
       * Разворачивает указанную ветку иерархии по id парента
       * @param {Number} rowkey
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @param {Boolean} byLosded необходимо ли перерисовать по уже загруженным данным, актуально только для иерархии
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showBranchHierarchy: createBatchUpdateWrapperNoWaitDeferred('Browser._showBranchHierarchy', function(rowkey, noSelection, byLoaded){
         var way = [],
               idpr = rowkey,
               record,
               fldBranchName = this._hierColumnIsLeaf,
               fldParentIdname = this._hierColumnParentId,
               page = this._pageSaver[rowkey];

         this._systemParams[this._hierColumnParentId] = rowkey;
         if(this._options.display.partiallyLoad && !byLoaded){
            var parentRowkey = rowkey;
            if(this._rootNode != parentRowkey && this._currentRecordSet.contains(parentRowkey)){
               record = this._currentRecordSet.getRecordByPrimaryKey(parentRowkey);
               if(!record.get(this._hierColumnIsLeaf)){
                  parentRowkey = record.get(this._hierColumnParentId) || null;
               }
            }
            if(!this._isIdEqual(this._currentRootId, parentRowkey)){
               this._hovered = rowkey;
               this._currentRootId = parentRowkey;
               this._activeElement = undefined;
               return this._currentRecordSet.loadNode(parentRowkey, !(this._currentRecordSet.contains(parentRowkey) || this._isIdEqual(this._rootNode, parentRowkey)), page ? page : 0);
            }
            else if(!noSelection){
               this.setActiveElement(this._body.find('[rowkey="' + rowkey + '"]'));
            }
         }
         else{
            //Запись может быть в другом рекордсете
            var
                  wayToBranch = this._currentRecordSet.getWay(),
                  self = this,
                  getRecord = function(rowKey){
                     if(self._currentRecordSet.contains(rowKey)){
                        return self._currentRecordSet.getRecordByPrimaryKey(rowKey);
                     }
                     else if(wayToBranch.contains(rowKey)){
                        return wayToBranch.getRecordByPrimaryKey(rowKey);
                     }
                     return undefined;
                  };
            if(idpr && idpr != this._rootNode){
               if(!getRecord(idpr))
                  return undefined;//Запись не содержится в рекордсетах = выходим

               if(!byLoaded){
                  record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
                  if(!record.get(fldBranchName))//Если это не папка, то возвращаемся на уровень вверх
                     idpr = record.get(fldParentIdname) || null;
               }
            }
            this._currentRootId = idpr;
            //this._hovered = rowkey;
            var hasHiddenFolder = undefined;
            while(idpr && idpr != this._rootNode){//Идём до верха, запоминаем путь
               record = getRecord(idpr);
               way.unshift({'title': record.get(this._options.display.titleColumn), 'id': idpr});
               if(record.get(this._hierColumnIsLeaf) === false){
                  hasHiddenFolder = idpr;
               }
               idpr = record.get(fldParentIdname) || null;
            }
            if(hasHiddenFolder !== undefined){
               for(var i = 0; i < way.length; ++i){
                  if(way[i].id === hasHiddenFolder){
                     this._currentRootId = (i > 0 ? way[i - 1].id : this._rootNode);
                     if(!noSelection){
                        this._hovered = way[i];
                     }
                     while(way.length !== i + 1){
                        way.pop();
                     }
                     break;
                  }
               }
            }
            if(this._pathSelector)
               this._pathSelector.setPath(way);

            this._hovered = rowkey;
            if(byLoaded){
               this._currentFilter[this._hierColumnParentId] = rowkey;
               this._currentRecordSet.setCurrentNode(rowkey);
            }
            this._drawBody();
            this._updatePager();
         }
         return undefined;
      }),
      _drawBody: function(){
         $ws.proto.TableView.superclass._drawBody.apply(this, arguments);
         this._container.find('.ws-browser-no-table-row-last').removeClass('ws-browser-no-table-row-last').addClass('ws-browser-table-row-last');
      },
      /**
       * Думает, что нужно перезагрузить после изменения записей
       * @param {Array} records Удалённые записи
       * @protected
       */
      _reloadAfterRecordsChange: function(records){
         if(this._pathSelector)
            this._pathSelector.updateLast();
         this._currentRecordSet.updatePages();
         var node;
         if( this._options.display.partiallyLoad ){
            node = this._currentRootId;
         }
         else{
            node = this._rootNode;
         }
         this._currentRecordSet.loadNode(node, undefined, this._currentRecordSet.getPageNumber(), !this._options.display.partiallyLoad);
      },
      /**
       * Начало обработчика изменения записи
       * @returns {Boolean}
       * @protected
       */
      _onRecordUpdatedBegin: function(){
         this._minimized = false;
         this._isShowSelection = false;
         this._initialRecordSet = false;
         this._notify('onRecordsChanged');
         if(this._isUpdatingRecords)
            return false;
         if(this._pathSelector)
            this._pathSelector.updateLast();
         return true;
      },
      /**
       * Обработчик на добавление записи в рекордсете
       * @param {Boolean} full перезагружать ли всё дерево
       * @param {Array} parents узел, начиная с которого необходимо перезагрузить дерево
       */
      _onRecordUpdated: function(full, parents){
         if(!this._onRecordUpdatedBegin() || this._notifyOnAfterInsert(parents)){
            return;
         }
         if(this._options.reloadAfterChange){ // Если нужно перегружаться - попросим рекордсет
   //         var node = this.getActiveRecord().get(this._hierColumnParentId);
            var node;
            if(this._options.display.partiallyLoad){
               if(full === true){
                  node = [];
                  var map = {},
                        added = {};
                  for(var j = 0, len = parents.length; j < len; ++j){
                     if(!added[parents[j]]){
                        added[parents[j]] = true;
                        map[parents[j]] = true;
                        node.push(parents[j]);
                     }
                  }
                  for(var i in this._expanded){
                     if(this._expanded.hasOwnProperty(i)){
                        var tempKey = i,
                              record;
                        while(true){
                           if(tempKey in map && (this._expanded[tempKey] || (tempKey == this._rootNode &&
                                 !this._options.display.showRoot)) && added[i] === undefined){
                              added[i] = true;
                              node.push(i);
                              break;
                           }
                           if(!tempKey || tempKey == this._rootNode){
                              break;
                           }
                           record = this._currentRecordSet.contains(tempKey) &&
                                 this._currentRecordSet.getRecordByPrimaryKey(tempKey);
                           if(!record){
                              break;
                           }
                           tempKey = record.get(this._hierColumnParentId);
                        }
                     }
                  }
                  if(node.length === 0){
                     return;
                  }
               }
               else{
                  if(this.isHierarchyMode()){
                     node = this._getNodeForRecordUpdate(parents);
                     this._systemParams[this._hierColumnParentId] = node;
                  }
                  else{
                     node = null;
                  }
               }
            }
            else{
               node = this._rootNode || null;
            }
            this._currentRecordSet.loadNode(node, !this._options.display.partiallyLoad, this._currentRecordSet.getPageNumber(),
                  !this._options.display.partiallyLoad);
   //         this._currentRecordSet.loadNode(node, true);
         } else // иначе просто вызовем отрисовку на текущем наборе данных
            this._drawBody();
      },
      /**
       * возвращает узел, в котором добавили/отредактировали запись
       */
      _getNodeForRecordUpdate: function(){
         return this._currentRootId;
      },
      /**
       * <wiTag group="Управление" >
       * Применить разворот.
       * @param {Boolean|String} mode true - разворачивать с папками, false - без папок
       * @param {Boolean} [noLoad] Если передать true, то не будет загружать данные
       * @example
       * <pre>
       *    dataView.applyTurn(true);
       * </pre>
       * @see expand
       */
      applyTurn: createBatchUpdateWrapperNoWaitDeferred('DataViewAbstract.applyTurn', function(mode, noLoad){
         this._toggleTurn(mode, noLoad);
      }),
      /**
       * Применяет/отменяет разворот
       * @param {Boolean|String} mode Режим отображения
       * @param {Boolean} noLoad Если указать true, то загрузки не будет
       * @protected
       */
      _toggleTurn: function(mode, noLoad){
      },
      /**
       * Возвращает false, если нужно другое отображение текста в футере
       * @returns {Boolean}
       * @protected
       */
      _isDefaultPagingText: function(){
         return true;
      },
      _mapColumns: function(){
         $ws.proto.HierarchyViewAbstract.superclass._mapColumns.apply(this, arguments);
         var columns = this._options.display.columns,
               num = 0;
         if(columns){
            for(var i in columns){
               if(columns.hasOwnProperty(i)){
                  var cur = columns[i];
                  this._columnMap[num].useForFolder = cur.useForFolder ? cur.useForFolder : false;
                  if(this._columnMap[num].field === this._options.display.titleColumn){
                     this._titleColumnIndex = num;
                  }
                  num++;
               }
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Скрывает/показывает указанную колонку.
       * Принимает признак что нужно сделать - скрыть или показать колонку
       * @param {String|Object} columnField имя поля или набор полей, к которому(ым) привязана колонка, которую нужно скрыть или показать
       * @param {Boolean} toggle скрыть или показать колонку
       * @example
       * <pre>
       *    dataView.toggleColumn("Документ.Приоритет", false);
       *
       *    dataView.toggleColumn({
       *       "Документ.Приоритет": false,
       *       "Документ.Порядок": true
       *    });
       * </pre>
       */
      toggleColumn : function(columnField, toggle){
         // Нельзя скрывать колонку с названием иерархии
         if (toggle === undefined && columnField && typeof columnField === 'object' && this._options.display.titleColumn in columnField) {
            delete columnField[this._options.display.titleColumn];
         }
         if (columnField === this._options.display.titleColumn || Object.isEmpty(columnField)) {
            return;
         }

         $ws.proto.HierarchyViewAbstract.superclass.toggleColumn.apply(this, arguments);
      },
      /**
       * Происходит при обновлении пути в PathSelector'е
       */
      _onPathSelectorChange: function(event, id){
      },
      /**
       * Метод отрисовки пути
       */
      _drawPathSelector: function(){
         var rootName = this._options.display.rootName,
             $headDiv;
         //TODO перенести _drawPathSelctor и setColumns в HierarchyView
         if(this._options.display.showPathSelector && this._pathSelector === undefined){
            //Нужно обновить стили, относящиеся к содержимому блока заголовка (включить полосочку, если в заголовке что-то есть, или данные есть)
            this._headerContentFlags['pathSelector'] = true;
            this._updateHeaderContentStyles();

            var self = this,
                  container = $('<div class="ws-BrowserPathSelector"><div></div></div>'),
                  dataSource = $ws.core.merge({}, this._initialSource);
            if(this._headContainer.length === 0){
               this._rootElement.find('div:first').prepend(
                     this._headContainer = $('<div class="ws-browser-head-container" />'));

            }
            if (this._options.display.showHead && this._options.display.showPathSelector === 'inHead' ) {
               //Поставим 100% ширину на контейнер
               container.addClass('ws-PathInHead');
               $headDiv = this._head.find('.ws-browser-header-cell:first');
               $headDiv.removeClass('ws-browser-auto ws-browser-right')
                  .addClass('ws-browser-left')
                  .empty()
                  .append(container);
            } else {
               this._headContainer.prepend(container);
            }
            dataSource.context = this.getLinkedContext();
            this._pathSelector = new PathSelector({
               element: container.find('div'),
               rootNodeCaption: rootName,
               rootNodeId: this._rootNode === null ? -1 : this._rootNode,           //$ws.core.extend bug
               rootNodeView: rootName ? 'text' : 'icon',
               dataSource: dataSource,
               className: 'ws-PathSelector__container',
               titleColumn: this._options.display.titleColumn,
               folderIcon: this._options.display.hierarchyIcons,
               hierarchyField: this._hierColumnParentId,
               handlers: {
                  'onPathChange': this._onPathSelectorChange.bind(this)
               }
            });
            this._pathSelector.setEnabled(self.isEnabled());
            if(self._currentRecordSet){
               this._pathSelector.setBrowserRecordSet(self._currentRecordSet);
            }
            if(self._turn === '' && self._currentRecordSet){
               self._findWay(self._currentRootId);
            }
         }
      },
      setColumns: function(){
         var self = this;
         $ws.proto.HierarchyViewAbstract.superclass.setColumns.apply(this, arguments);
         if(this._pathSelector !== undefined && this._options.display.showPathSelector === 'inHead' ){
            this._dReady.addCallback(function(){
               //Обнуляем и перестраиваем PathSelector.
               self._pathSelector.destroy();
               self._pathSelector = undefined;
               self._drawPathSelector();
            });
         }
      },
      /**
       * Добавляет событие движения мыши для отрисовки опций строки
       */
      _initEvents: function(){
         var self = this,
               rowkey,
               parent = this._body.parent()[0];

         $('.ws-browser-checkbox-holder', parent).live('click', function(event){
            self._selectAndSetActiveElement(event);
            event.stopImmediatePropagation();
            return false;
         });

         $ws.proto.HierarchyViewAbstract.superclass._initEvents.apply(this, arguments);

         if(this._options.useSelection){
            if(this._options.useHoverRowAsActive){
               this._data.addClass("ws-browser-active-hover");
               $('[rowkey]', parent).live('mouseenter', function(){
                  if(!self._useKeyboard){
                     if(self._activeElement && 'jquery' in self._activeElement)
                        self._activeElement.removeClass("ws-browser-item-over");
                     self._activeElement = $(this);
                     self._hovered = self._activeElement.attr('rowkey') === 'null' ? null : self._activeElement.attr('rowkey');
                     self._activeElement.addClass("ws-browser-item-over");
                  }
               });
               $(this._container).live('mouseleave', function(){
                  if(!self._useKeyboard && self._activeElement && 'jquery' in self._activeElement)
                     self._activeElement.removeClass("ws-browser-item-over");
               });
            } else
               this._data.addClass("ws-browser-hover");
         }
      },
      /**
       * <wiTag group="Данные" >
       * Возвращает признак, отображается ли браузер в "иерархическом" режиме
       * @returns {Boolean}
       * @example
       * <pre>
       *    if(dataView.isHierarchyMode())
       *       dataView.showBranch("11");
       *    else
       *       dataView.reload();
       * </pre>
       */
      isHierarchyMode: function(){
         return true;
      },
      /**
       * Обрабатывает открытие папки по клику (двойному клику, в зависимости от режима)
       * @param {String} rowkey Ключ записи
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _clickOnFolder: function(rowkey, record){
         //reimplemented in HierarchyView & TreeView
      },
      /**
       * Этакое действие при отчаянном кликаньи на папке. Зависит от настроек: либо открываем папку, либо редактируем
       * @param {jQuery} row Строка
       * @param {String} key Ключ
       * @param {$ws.proto.Record} record Запись
       * @private
       */
      _activateFolder: function(row, key, record){
         if( this._options.folderLinkAction === 'open' && !(this._options.display.fixedExpand && this._turn !== '')){
            this._clickOnFolder(key, record);
         }
         else{
            this._elementActivated(row);
         }
      },
      /**
       * Обработчик двойного клика по строке. Редактирование должно начинаться, если это не папки или это режим одного клика
       * @param {jQuery} row Строка
       * @param {$ws.proto.Record} record Запись
       * @param {String} tableHeadName Название колонки
       * @param {String} rowColumnName Поле колонки
       * @param {Boolean} isBadHref  - если был клик по правильной ссылке пользователя, то не вызываем диалог редактирования
       * @protected
       */
      _dblClickHandler: function(row, record, tableHeadName, rowColumnName, isBadHref){
         var flag = this._handlersNotifier('onRowDoubleClick', row, record, tableHeadName, rowColumnName);
         if(!isBadHref && flag !== false){
            if (this._selectMode) {
               this.confirmSelection();
            }
            if(this._options.mode !== 'oneClickMode' && this._options.mode !== 'navigationMode'){
               var isFolder = (record ? record.get(this._hierColumnIsLeaf) === true : false);
               if(isFolder){
                  this._activateFolder(row, record ? record.getKey() : null, record);
               }
               else{
                  this._elementActivated(row);
               }
            }
         }
         return flag;
      },
      /**
       * Обработчик одиночного клика по строке. В случае режима одного клика папка откроется, а не-папка начнёт редактироваться
       * @param {jQuery} row Строка
       * @param {$ws.proto.Record} record Запись
       * @param {String} tableHeadName Название колонки
       * @param {String} rowColumnName Поле колонки
       * @param {Boolean} isBadHref  - если был клик по правильной ссылке пользователя, то не вызываем диалог редактирования
       * @protected
       */
      _oneClickHandler: function(row, record, tableHeadName, rowColumnName, isBadHref){
         var flag = this._handlersNotifier('onRowClick', row, record, tableHeadName, rowColumnName),
            isFolder = row.attr('rowkey') == 'null';
         if(!isBadHref && flag !== false && (this._options.mode === 'oneClickMode' || this._options.mode === 'navigationMode')) {
            if (!isFolder) {
               isFolder = (record ? record.get(this._hierColumnIsLeaf) === true : false);
         }
            if((isFolder &&  !(this._options.editBranchMode === "newFloatArea" && this._isRecordFloatAreaOpen && this._options.editBranchDialogTemplate)) || this._options.mode === 'navigationMode'){
               this._activateFolder(row, record ? record.getKey() : null, record);
            }
            else{
               this._elementActivated(row);
            }
         }
         return flag;
      },
      /**
       * Обработчик создания записи
       * @command newItem
       */
      _insertRecordItem: function(filter){
         this._showRecordDialog({parentId: this._currentRootId, isBranch: false}, filter);
      },
      /**
       * Обработчик создания папки
       * @command newFolder
       */
      _insertRecordFolder: function(filter){
         return this._showRecordDialog({parentId: this._currentRootId, isBranch: true}, filter);
      },
      /**
       * Обработчик создания дочерней записи для контрола "Дерево"
       * Создаёт дочерний элемент в текущей папке. Если активная запись папка, то в ней;
       * если  лист, то в той же папке, что и этот лист.
       * @command newChildItem
       */
      _insertChildRecordItem: function(filter){
         var activeRecord = this.getActiveRecord();
         if(activeRecord !== false && activeRecord.get(this._hierColumnIsLeaf) === true){
            return this._showRecordDialog({isBranch: false, parentId: activeRecord.getKey()}, filter);
         }
         return false;
      },
      /**
       * Обработчик создания дочерней папки для контрола "Дерево"
       * Создаёт дочерний элемент в текущей папке. Если активная запись папка, то в ней;
       * если  лист, то в той же папке, что и этот лист.
       * @command newChildFolder
       */
      _insertChildRecordFolder: function(filter){
         var activeRecord = this.getActiveRecord();
         if(activeRecord !== false && activeRecord.get(this._hierColumnIsLeaf) === true){
            return this._showRecordDialog({isBranch: true, parentId: activeRecord.getKey()}, filter);
         }
         return false;
      },
      /**
       * Возвращает нормальное отображение браузера, без режима ctrl+b / ctrl+v
       * @param {Boolean} [noLoad] не загружать после установки параметров
       */
      _clearExpandAll: function(noLoad){
         var idprColumn = this._hierColumnParentId,
               filter = this.getQuery();
         this._expanded = {};
         filter["Разворот"] = this._options.display.partiallyLoad ? "Без разворота" : "С разворотом";
         this._systemParams["Разворот"] = filter["Разворот"];
         this._currentFilter["Разворот"] = filter["Разворот"];
         filter['ВидДерева'] = 'С узлами и листьями';
         this._systemParams['ВидДерева'] = 'С узлами и листьями';
         var ar = this.getActiveRecord();
         if(ar)
            this._currentRootId = ar.get(idprColumn);

         filter[this._hierColumnParentId] = this._options.display.partiallyLoad ? this._currentRootId : this._rootNode;
         this._systemParams[this._hierColumnParentId] = filter[this._hierColumnParentId];
         this._currentRecordSet.setUsePages(this._options.display.usePaging);
         if(this._paging){
            this._paging.show();
         }
         if(this._pathSelector){
            this._pathSelector.setEnabled(true);
         }
         if(!noLoad){
            this._runQuery(filter, true);
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить массив ключей родителей записи с указанным ключом.
       * @param {String} rowkey Идентификатор записи.
       * @return {Array} Массив предков.
       * @example
       * <pre>
       *    var parents = dataView.getItemParents("123");
       *    dataView.showBranch(parents[0]);
       * </pre>
       */
      getItemParents: function(rowkey){
         return this._getItemParents(rowkey);
      },
      /**
       * Возвращает предков элемента
       * @param {String} rowkey Идентификатор записи
       * @return {Array} Массив предков
       * @protected
       */
      _getItemParents: function(rowkey){
         var result = [rowkey],
               record;
         while(rowkey && rowkey != this._rootNode && this._currentRecordSet.contains(rowkey)){
            record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
            rowkey = record.get(this._hierColumnParentId);
            result.push(rowkey);
         }
         return result;
      },
      _prepareCreateFilter: function(recordId, createFilter, parentId, isBranch, isCopy){
         //если передали фильтр, то возьмем для создания его, если нет, возьмем текущий фильтр
         var filter = createFilter || $ws.proto.HierarchyViewAbstract.superclass._prepareCreateFilter.apply(this, arguments);
         delete filter["Раздел"];
         filter[this._hierColumnParentId] = {
            'hierarchy': [
               parentId,   // Превращение иерархии в массив идет на уровне сериализации
               (isBranch ? true : null)
            ]
         };
         return filter;
      },
      /**
       * Открывает новую вкладку браузера, в которой будет редактироваться запись
       * @param {Object} recordConfig Параметры записи, для которой открывается окно
       * @param {Boolean} [url] адрес по которому будет редактироваться запись
       * @param {String} [anotherEditMode] использовать чуть другой режим редактирования для этой записи
       */
      _openEditWindow: function(recordConfig, url, anotherEditMode){
         var   parentId = recordConfig.parentId,
               pageURL = url ? url : this.generateEditPageURL(recordConfig.recordId, recordConfig.isBranch, parentId, recordConfig.isCopy, url),
               editMode = anotherEditMode || (recordConfig.isBranch ? this._options.editBranchMode : this._options.editMode);
         this._openEditWindowByUrl(pageURL, editMode, recordConfig.recordId);
      },
      /**
       * Показывает диалог редактирования для указанной записи
       * @param {$ws.proto.Record} record Запись
       * @private
       */
      _showDialogForRecord: function(record){
         this._showRecordDialog({recordId: record.getKey(), isBranch: record.get(this._hierColumnIsLeaf)});
      },
      /**
       * Отображает диалог редактирования записи. Сам
       * @param {Object} recordConfig Параметры записи
       * @param {Object} createRecordFilter фильтр для инициализации новой записи
       */
      _showRecordDialog: function(recordConfig, createRecordFilter){
         if(this.isEnabled() && this._checkShowDialog(recordConfig.recordId, createRecordFilter, recordConfig.isBranch, recordConfig.parentId))
            return false;
         var editMode = recordConfig.isBranch ? this._options.editBranchMode : this._options.editMode,
            editTemplate = recordConfig.isBranch ? this._options.editBranchDialogTemplate : this._options.editDialogTemplate,
            editFullScreenTemplate = recordConfig.isBranch ? this._options.editFullScreenBranchTemplate : this._options.editFullScreenTemplate;
         if(editTemplate !== ''){
            this._editRecordWithMode(recordConfig, editMode, editTemplate, editFullScreenTemplate, createRecordFilter);
            return true;
         }
         return false;
      },
      /**
       * Возвращает деферред, в котором получаем запись по указанным параметрам (может создавать запись)
       * @param {Object} recordConfig Параметры записи, содержит recordId
       * @param {Object}  createRecordFilter фильтр для инициализации новой записи
       * @return {$ws.proto.Deferred}
       * @protected
       */
      _getRecordFromConfig: function(recordConfig, createRecordFilter){
         return this._readRecord(recordConfig.recordId, createRecordFilter, recordConfig.parentId, recordConfig.isBranch, recordConfig.isCopy);
      },
      /**
       * Вычитывает или создаёт запись с указанными параметрами
       * @param {String|undefined} recordId Идентфикатор записи. Если undefined - создаём запись
       * @param {String} parentId Идентификатор родительской записи
       * @param {Object} createFilter фильтр для инициализации новой записи
       * @param {Boolean} isBranch Является ли запись папкой
       * @param {Boolean} isCopy Нужно ли копировать запись
       * @return {$ws.proto.Deferred} Деферред готовности записи, он передаёт первым параметром запись
       */
      _readRecord: function(recordId, createFilter, parentId, isBranch, isCopy){
         var self = this;
         if(recordId === undefined){
            var filter = self._prepareCreateFilter.apply(self, arguments);
            filter[self._hierColumnParentId] = {
               'hierarchy': [
                  parentId,   // Превращение иерархии в массив идет на уровне сериализации
                  (isBranch ? true : null)
               ]
            };
            var newRecord = self._notify('onBeforeCreate', parentId, isBranch ? true : null, filter);
            if (newRecord === false) {
               return false;
            }
            if(newRecord instanceof $ws.proto.Deferred){
               var waitRecord = new $ws.proto.Deferred();
               newRecord.addCallbacks(function(result){
                  if(result instanceof $ws.proto.Record)
                     waitRecord.callback(result);
                  else {
                     if(result && Object.prototype.toString.call(result) == "[object Object]")
                        filter = $ws.core.merge(filter, result);
                     filter["ВызовИзБраузера"] = true;
                     self._currentRecordSet.createRecord(filter).addCallbacks(function(record){
                        waitRecord.callback(record);
                     }, function(error){
                        waitRecord.errback(error);
                     });
                  }
               }, function(error){
                  waitRecord.errback(error);
               });
               return waitRecord;
            } else if(newRecord instanceof $ws.proto.Record){
               return new $ws.proto.Deferred().callback(newRecord);
            } else {
               if(newRecord && Object.prototype.toString.call(newRecord) == "[object Object]")
                  filter = $ws.core.merge(filter, newRecord);
               filter["ВызовИзБраузера"] = true;
               return self._currentRecordSet.createRecord(filter);
            }
         }
         else if(isCopy === true) {
            return self._currentRecordSet.copyRecord(recordId);
         }
         else{
            var editableRecord = self._notify('onBeforeRead', recordId);
            if(editableRecord instanceof $ws.proto.Deferred)
               return editableRecord;
            else if(editableRecord instanceof $ws.proto.Record)
               return new $ws.proto.Deferred().callback(editableRecord);
            else
               return self._currentRecordSet.readRecord(recordId);
         }
      },
      /**
       * Составляет адрес страницы для редактирования по объекту - информации о записи
       * @param {Object} recordConfig Информация о записи
       * @return {String|Boolean}
       * @protected
       */
      _generateEditPageURL: function(recordConfig){
         return this.generateEditPageURL(recordConfig.recordId, recordConfig.isBranch, recordConfig.parentId, recordConfig.isCopy);
      },
      /**
       * <wiTag class="TableView" page=9 group="Данные" >
       * <wiTag group="Данные" page=4>
       * Собирает параметры для редактирования записи в строку. Возвращает false, если нельзя редактировать
       * @param {String} [recordId] Идентификатор записи
       * @param {String} [isBranch] Признак узла
       * @param {String} [parentId] Идентификатор родительской записи
       * @param {String} [isCopy] копируем или редактируем
       * @param {String} [url] Опциональный путь, если он есть, то к нему только прибавляются параметры
       * @param {String} [changedRecordValues] хэш-меп значений, которые уже изменены в записи и которые нужно перенести на страницу редактирования
       * @return {String | Boolean}
       * @example
       * <pre>
       *    var url = dataView.generateEditPageURL("11", true, null, false, document.location.host + "/Edit.html");
       * </pre>
       */
      generateEditPageURL: function(recordId, isBranch, parentId, isCopy, url, changedRecordValues, fullTemplate){
         if(isBranch && this._options.editBranchDialogTemplate || !isBranch && this._options.editDialogTemplate){
            var editMode = isBranch ? this._options.editBranchMode : this._options.editMode,
               editDialogName = fullTemplate,
               handlers = {
                  onBeforeRead :  this._handlersPath("onBeforeRead"),
                  onBeforeUpdate : this._handlersPath("onBeforeUpdate"),
                  onBeforeShowPrintReports : this._handlersPath("onBeforeShowPrintReports"),
                  onPrepareReportData : this._handlersPath("onPrepareReportData"),
                  onSelectReportTransform : this._handlersPath("onSelectReportTransform")
               };
            if (recordId === undefined) {
               handlers["onBeforeCreate"] = this._handlersPath("onBeforeCreate");
               handlers["onBeforeInsert"] = this._handlersPath("onBeforeInsert");
            }
            if (!editDialogName){
               if (isBranch){
                  editDialogName = (editMode == 'newFloatArea' && this._options.editFullScreenBranchTemplate) ? this._options.editFullScreenBranchTemplate
                        : this._options.editBranchDialogTemplate;
               }
               else{
                 editDialogName = (editMode == 'newFloatArea' && this._options.editFullScreenTemplate) ? this._options.editFullScreenTemplate
                        : this._options.editDialogTemplate;
               }
            };
            var params = {
               recordId : recordId,
               isBranch : isBranch,
               parentId : parentId,
               isCopy : isCopy,
               editDialogTemplate : editDialogName,
               id : this.getId(),
               readOnly : this._options.display.readOnly || false,
               dataSource : this._options.dataSource,
               filter : this.getQuery(),
               handlers : handlers,
               columnParentId : this._hierColumnParentId,
               changedRecordValues : changedRecordValues,
               history: editMode === 'thisWindow'
            };
            if(!this._options.display.partiallyLoad){
               params.filter[this._hierColumnParentId] = this._currentRootId;
            }
            return $ws.helpers.generatePageURL(params, editMode === "thisPage");
         } else
            return false;
      },

      /**
       * Очищает дополнительные состояния: развороты, выбор пути и т..д
       * @protected
       */
      _clearAdditionalStates: function(){
      },
      /**
       * <wiTag group="Отображение">
       * Очищает содержимое набора данных таблицы и обновляет отображение.
       * @example
       * <pre>
       *    dataView.clear();
       * </pre>
       */
      clear: function(){
         var curRecordSet = this.getRecordSet();
         if(curRecordSet.getRecordCount() !== 0){
            this.resetFilter(true);
            this._clearAdditionalStates();
         }
         $ws.proto.HierarchyViewAbstract.superclass.clear.apply(this, arguments);
      },
      /**
       * Разрушает экземпляр класса
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    control.destroy();
       * </pre>
       */
      destroy: function() {
         if(this._pathSelector && this._pathSelector.destroy)
            this._pathSelector.destroy();
         $ws.proto.HierarchyViewAbstract.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает значение признака какие типы записей можно выбирать из браузера:
       * <ol>
       *    <li>"node" - узлы;</li>
       *    <li>"leaf" - листья;</li>
       *    <li>"all" - узлы и листья.</li>
       * </ol>
       * @param {String} type Тип записей, доступных для выбора.
       * @example
       * <pre>
       *    tableView.setSelectionType('leaf');
       * </pre>
       */
      setSelectionType: function(type){
         this._options.selectionType = type || "all";
         if(this._options.selectionType === "node" || this._options.display.viewMode == 'foldersTree'){
            this._options.filterParams["ВидДерева"] = "Только узлы";
            this._systemParams["ВидДерева"] = "Только узлы";
         }
      },
      /**
       * Тестирует запись на возмозность отображения в браузере, в зависимости от selectionType
       * @param record запись для проверки
       */
      _testSelectedRecord: function(record){
         if(record !== undefined){
            if(this.isHierarchyMode()){
               switch (this._options.selectionType){
                  case "leaf":
                     if(!record.get(this._hierColumnIsLeaf))
                        return true;
                     break;
                  case "node":
                     if(!!record.get(this._hierColumnIsLeaf))
                        return true;
                     break;
                  case "all":
                  default:
                     return true;
               }
            }else{
               return true;
            }
         }
         return false;
      },
      /**
       * Обрабатывает выбор текущий или переданной в параметрах строки
       * @param {jQuery} [element] Элемент, который хотим выделить/снять выделение
       */
      _selectActiveElement: function(element){
         var   self = this,
               row = element || this.getActiveElement(),
               key = row.attr('rowkey');
         key = key === "null" ? null : key;

         if(this._isIdEqual(key, this._rootNode)){
            if(element.hasClass('ws-browser-selected')){
               this.removeSelection();
            }
            else{
               this.selectAll();
            }
         }
         else{
            var record = this._currentRecordSet.getRecordByPrimaryKey(key);
            if(this.isHierarchyMode()){
               switch (this._options.selectionType){
                  case "leaf":
                     if(!record.get(this._hierColumnIsLeaf))
                        this._toggleRowSelection(key);
                     break;
                  case "node":
                     if(!!record.get(this._hierColumnIsLeaf))
                        this._toggleRowSelection(key);
                     break;
                  case "all":
                  default:
                     this._toggleRowSelection(key);
                     break;
               }
            }else
               this._toggleRowSelection(key);
         }
         this._updatePager();
      },
      /**
       * <wiTag group="Данные">
       * Возвращает идентификатор корня иерархического браузера.
       * @returns {Number|String} Идентификатор корня
       * @example
       * <pre>
       *    if(dataView.getRootNode() !== null)
       *       dataView.setRootNode(null);
       * </pre>
       */
      getRootNode: function(){
         return this._rootNode;
      },
      /**
       * <wiTag group="Данные">
       * Получить идентификатор папки, открытой в текущей момент.
       * @returns {Number|String} Идентификатор.
       * @example
       * <pre>
       *    if(dataView.getCurrentRootNode() !== '123')
       *       dataView.showBranch('123');
       * </pre>
       */
      getCurrentRootNode: function(){
         return this._currentRootId;
      },
      /**
       * <wiTag group="Данные">
       * Получить первичный ключ текущей записи, если это папка.
       * Если его нет, то возвращает ключ папки, в которой она лежит.
       * @param {Boolean} addChild Добавляем дочерний элемент к текущей записи или соседа.
       * @returns {Number|String} Первичный ключ текущей записи-папки.
       * @example
       * <pre>
       *    dataView2.setRootNode(dataView.getFolderKeyForActiveRecord());
       * </pre>
       */
      getFolderKeyForActiveRecord: function(addChild){
         var activeRecord = this.getActiveRecord();
         if(activeRecord){
            var key;
            if(activeRecord.get(this._hierColumnIsLeaf) !== true || ( activeRecord.get(this._hierColumnIsLeaf) === true && !addChild )){
               key = activeRecord.get(this._hierColumnParentId);
            }
            else{
               this._isInsertOnFolderInTree = true;
               key = activeRecord.getKey();
            }
            return key;
         }
         else{
            var row = this.getActiveElement();
            if(row){
               var rowkey = row.attr('rowkey');
               if(rowkey === 'null'){
                  rowkey = null;
               }
               return rowkey;
            }
         }
         return this._currentRootId;
      },
      /**
       * Обработчик ресайза окна
       */
      _onResizeHandler: function(event, initiator){
         if (this !== initiator) {
            this._setHeight();
            if(this._pathSelector)
               this._pathSelector['_onResizeHandler']();
         }
         $ws.proto.HierarchyViewAbstract.superclass._onResizeHandler.apply(this, arguments);
      },
      /**
       * <wiTag group="Данные">
       * Установить корневой узел.
       * Установить новое значение идентификатора корня для браузера.
       * @param {Number} node Идентификатор узла.
       * @param {Boolean} [noLoad] Если указать как true, то загрузки данных не будет.
       * @example
       * <pre>
       *    dataView.setRootNode(123);
       * </pre>
       */
      setRootNode: function(node, noLoad){
         var self = this,
             result = new $ws.proto.Deferred();
         this._dReady.addCallback(function(){
            self._rootNode = self._currentRootId = node;
            self._systemParams[self._hierColumnParentId] = self._rootNode;
            self._currentRecordSet.updateInitialParameter(self._hierColumnParentId, node + '');
            if(self._pathSelector !== undefined){
               self._pathSelector.setRootNode(node, noLoad);
            }

            if( noLoad ){
               result.callback();
            }
            else{
               self._expanded = {};
               self._systemParams[self._hierColumnParentId] = node;
               self._expanded[node] = true;
               result.dependOn(self._currentRecordSet.loadNode(node, true, 0, !self._options.display.partiallyLoad ||
                     self._systemParams['Разворот'] === 'С разворотом'));
            }
         });
         return result;
      },
      /**
       * <wiTag group="Отображение">
       * Установить имя корня.
       * Работает для корня, отображаемого в дереве и для первого элемента "пути" иерархического браузера.
       * @param {String} name Та самая строка, которая будет отображаться.
       * @example
       * <pre>
       *    dataView.setRootName("Все сотрудники");
       * </pre>
       */
      setRootName: function(name){
         this._options.display.rootName = name;
         if(this._pathSelector && this._pathSelector instanceof Object){
            this._pathSelector.setRootName(name);
            this._pathSelector.setRootNodeView(name ? 'text' : 'icon');
         }
      },
      /**
       * <wiTag group="Данные">
       * Установить новые поле иерархии и поле с названием иерархии.
       * @param {String} hierColumn Новое поле иерархии.
       * @param {String} titleColumn Новое поле с названием иерархии.
       * @example
       * <pre>
       *    dataView.setHierarchyField('Сотрудник.Раздел', 'Сотрудник.ФИО');
       * </pre>
       */
      setHierarchyField: function(hierColumn,titleColumn){
         if(titleColumn !== undefined)
            this._options.display.titleColumn = titleColumn;
         if(this._options.display.hierColumn !== hierColumn){
            var self = this;
            this._dReady.addCallback(function(){
               var rs = self.getRecordSet();
               if( rs === null || rs.checkHierColumn(hierColumn) === false )
                  return;
               rs.setHierarchyField(hierColumn);
               self._options.display.hierColumn = hierColumn;
               self._updateHierColumnParams(hierColumn);
               if(self._pathSelector instanceof Object){
                  self._pathSelector.setHierarchyField(hierColumn);
               }
            });
         }
      },
      /**
       * <wiTag group="Управление">
       * Изменить статус включенности элемента.
       * Т.е. возможность взаимодейтсвия с ним пользователя.
       * @param {Boolean} enable Статус "включенности" элемента управления.
       * @example
       * <pre>
       *    if(control.isEnabled())
       *       control.setEnabled(false);
       * </pre>
       */
      _setEnabled: function(enable){
         $ws.proto.HierarchyViewAbstract.superclass._setEnabled.apply(this, arguments);
         if(this._pathSelector)
            this._pathSelector.setEnabled(enable);
      },
      /**
       * <wiTag group="Данные">
       * Получить признак того, является ли запись с указанным ключом папкой.
       * @param {String} rowkey Идентификатор записи
       * @returns {Boolean} Является ли запись с указанным ключом папкой.
       * @example
       * <pre>
       *    if(dataView.isRecordFolder(key))
       *       dataView.showBranch(key);
       * </pre>
       */
      isRecordFolder: function(rowkey){
         var record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(record){
            return record.get(this._hierColumnIsLeaf) === true;
         }
         return false;
      },
      /**
       * Возвращает класс для ячейки, ответственный за выравнивание текста в общем случае
       * @param {Object} colDef Настройки колонки
       * @returns {Array}
       * @protected
       */
      _getCellGeneralTextAlign: function(colDef){
         if(colDef.textAlign === 'auto'){
            var className = $ws._const.Browser.type2ClassMap[colDef.type] || colDef.type,
               classes = [];
            if(className)
               classes.push('ws-browser-type-' + className);
            return classes;
         }
         return ['ws-browser-' + colDef.textAlign];
      },
      /**
       * Возвращает классы для ячейки, которые устанавливают выравнивание
       * @param {Object} colDef Настройки колонки
       * @param {Boolean} isBranch Является ли папкой
       * @param {Number} columnIndex Индекс колонки
       * @returns {Array}
       * @protected
       */
      _getCellTextAlign: function(colDef, isBranch, columnIndex){
         var textAlignClasses = !this.isTree() && isBranch && (columnIndex === this._titleColumnIndex || columnIndex === 0 &&
               this._titleColumnIndex === -1) ? ['ws-browser-left'] : this._getCellGeneralTextAlign(colDef),
               verticalAlignClass = this._getCellTextVerticalAlign(colDef);
         if (verticalAlignClass) {
            textAlignClasses.push(verticalAlignClass);
         }
         return textAlignClasses;
      },
      _getCellTextVerticalAlign: function (colDef) {
         var verticalAlignClass;
         if (colDef.textVerticalAlign !== 'middle') {
            verticalAlignClass = 'ws-browser-valign-' + colDef.textVerticalAlign;
         }
         return verticalAlignClass;
      },
      /**
       * Подготавливает данные для отрисовки ячейки таблицы: классы, чекбоксы, отступы и т..д
       * @param {$ws.proto.Record} record Запись
       * @param {Number} level Уроверь вложенности записи
       * @param {String} editMode Режим редактирования записи
       * @param {Number} colDefIdx Номер колонки
       * @param {Boolean} isBranch Является ли запись папкой
       * @returns {Object}
       * @protected
       */
      _cellTemplateOptions: function(record, level, editMode, colDefIdx, isBranch){
         var colDef = this._getColumnConfigByIndex(colDefIdx),
             classes = [ "ws-browser-cell" ],
             key = record.getKey(),
             imw = $ws._const.Browser.iconWidth,
             renderResult = this._renderTD(colDef, record),
             containerClassName = 'ws-browser-cell-container ws-browser-hierarchy-cell-container',
             hasTitle = '',
             data;
         if(this._options.display.cutLongRows) {
            if (!isBranch) {
               classes.push('ws-browser-cell-cut ');
            }
            containerClassName += ' ws-browser-div-cut';
            hasTitle = ' title="' + $ws.helpers.escapeTagsFromStr(renderResult, []) + '"';
         }
         if(colDef.className) {
            classes.push(colDef.className);
         }
         classes = classes.concat(this._getCellTextAlign(colDef, isBranch, colDefIdx));
         if(typeof(colDef.render) === 'function') {
            data = renderResult;
         } else if(editMode == 'thisWindow' && this._options.mode === 'oneClickMode'){
            var pageURL = this.generateEditPageURL(key),
               linkContent = (editMode == 'thisWindow' && !isBranch) && pageURL !== false ?
                              ('class="ws-browser-link" href="' + pageURL + '"') :
                              ('class="ws-browser-edit-link" href="javascript:void(0)"');
               data = '<a ' + linkContent + hasTitle + '>'+ renderResult +'</a>';
            } else {
               data = '<span class="ws-browser-text-no-render"' + hasTitle + '>'+renderResult+'</span>';
            }
         return {
            cellClassName: classes.join(' '),
            containerClassName: containerClassName,
            checkbox: this._needShowSelectionCheckbox() && !(this._options.selectionType === 'leaf' && isBranch) && !(this._options.selectionType === 'node' && !isBranch),
            padding: imw * level,
            data: data,
            coldefindex: colDefIdx
         };
      },
      _getColumnConfigByIndex: function(idx){
         return this._columnMap[idx];
      },
      /**
       * Подписывается на клавиатурные сокращения
       * @private
       */
      _initKeys: function(){
         $ws.proto.HierarchyViewAbstract.superclass._initKeys.apply(this, arguments);
         this._registerShortcut($ws._const.key.b, $ws._const.modifiers.control, this._toggleViewKey);
         this._registerShortcut($ws._const.key.insert, [$ws._const.modifiers.control, $ws._const.modifiers.alt], this._insertRecordKey);
      },
      /**
       * Применяет разворот в зависимости от клавиши
       * @param {Object} event jQuery-событие
       * @protected
       */
      _toggleViewKey: function(event){
         //TODO это временный фикс, чтобы корректно отрабатывалась вставка внутрь поля ввода в шаблоне редактирования по месту
         if(this.isEnabled() && !$(event.target).hasClass('input-string-field')){
            this.applyTurn(event.which === $ws._const.key.b);
         }
      },
      /**
       * Обрабатывает клавишу добавления записи
       * @param {Object} event jQuery-событие
       * @returns {Boolean}
       * @protected
       */
      _insertRecordKey: function(event){
         if(this.isEnabled() && !this.isReadOnly() && (event.ctrlKey || this._options.display.viewMode !== 'foldersTree')){
            var editFunction = this._actions[event.ctrlKey ? "addFolder" : "addItem"];
            if(editFunction){
               editFunction(this.getActiveElement(), event);
            }
            return false;
         }
         return true;
      },
      /**
       * Проверяет, нужно ли показывать опцию "редакторировать" для указанной записи
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _isDisableEditOptionForRecord: function(record){
         return (!record || !record.get(this._hierColumnIsLeaf)) && this._options.mode === 'oneClickMode' && !this._selectMode;
      },
      /**
       * Дополнительная фильтрация опций строки для отнаследованных классов
       * @param {Array} filter Названия опций, которые не нужно отображать
       * @param {$ws.proto.Record} record Текущая запись
       * @protected
       */
      _additionalFilterRowOptions: function(filter, record){
         var isBranch;
         $ws.proto.HierarchyViewAbstract.superclass._additionalFilterRowOptions.apply(this, arguments);
         if(record){
            isBranch = record.get(this._hierColumnIsLeaf);
            if((isBranch && !this._options.editBranchDialogTemplate) || (!isBranch && !this._options.editDialogTemplate)){
               filter.push('edit');
            }
         }
      },
      /**
       * Показывать ли все корни из рекордсета.
       * Если установлено, то будет показывать все записи, у которых не может быть найдена родительская запись.
       * @param {Boolean} show
       */
      setShowAllRoots: function(show) {
         this._showAllRoots = show;
      },
      _getNearestRow: function(activeRow, toUp){
         return activeRow[(toUp ? 'prev' : 'next') + 'All']().filter('[parentId="'+activeRow.attr('parentId')+'"]')[0];
      },
      _collectDataSource: function(toUp, pageNum){
         var dataSource = $ws.proto.HierarchyViewAbstract.superclass._collectDataSource.apply(this, arguments);
         dataSource.filterParams['Разворот'] = 'Без разворота';
         return dataSource;
      },
      /**
       * Проверять ли на наличие пейджинга при отображении опций записи на смену порядкового номера
       * @returns {boolean}
       * @private
       */
      _checkOnPaging: function ( ) {
         return this.getPagingMode() !== '' && this.isHierarchy() && this._turn === '';
      },
      _isShowSequenceOptions: function (name) {
         var toShow = $ws.proto.HierarchyViewAbstract.superclass._isShowSequenceOptions.apply(this, arguments);
         if (this._turn === 'OnlyLeaves') {
            toShow = false;
         }
         return toShow;
      },
      _onRecordUpHandler: function ( ) {
         if (this._turn !== 'OnlyLeaves') {
            this._verifySequenceNumber(true);
         }
      },
      _onRecordDownHandler: function ( ) {
         if (this._turn !== 'OnlyLeaves') {
            this._verifySequenceNumber();
         }
      },
      getTurn: function ( ) {
         return this._turn;
      }
   });

   return $ws.proto.HierarchyViewAbstract;

});
