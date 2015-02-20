define("js!SBIS3.CORE.MovePlugin", ["js!SBIS3.CORE.DataViewAbstract", "js!SBIS3.CORE.DragAndDropPlugin", "js!SBIS3.CORE.DialogConfirm", "js!SBIS3.CORE.FloatArea", "js!SBIS3.CORE.Dialog" ],
   function(DataViewAbstract, DragAndDropPlugin, DialogConfirm, FloatArea, Dialog){
   (function(){
      'use strict';

      $ws._const.DataViewAbstractViewPlugin = {
         recordsMoveOffset: {
            left: 5,
            top: 5
         }
      };

      var MOVEABLE_AREA_HEIGHT = 7; //Высота подсвечиваемого места у записи сверху или снизу для изменения порядка

      $ws.proto.DataViewAbstract.extendPlugin(DragAndDropPlugin);

      /**
       * @class   $ws.proto.DataViewAbstract.MovePlugin
       * @extends $ws.proto.DataViewAbstract
       * @plugin
       */
      $ws.proto.DataViewAbstract.MovePlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.MovePlugin.prototype */{
         /**
          * @event onBeforeMoveDialogShow Перед тем, как будет показан диалог перемещения
          * <wiTag class=HierarchyView page=2>
          * Событие происходит перед тем, как будет показан диалога перемещения.
          * @return {$ws.proto.RecordSet|$ws.proto.Deferred|*} Если передать:
          * <ol>
          * <li>$ws.proto.RecordSet - переопределить стандартный RecordSet, который отображает диалог перемещения.</li>
          * <li>$ws.proto.Deferred - ждем, когда закончится асинхронное событие, и в диалог передаётся результат выполнения.</li>
          * <li>Любой другой тип данных - RecordSet набирается стандартным образом.</li>
          * </ol>
          */
         $withoutCondition: [ '_initActionsFlags' ],
         $protected: {
            _options: {
               /**
                * @cfg {Boolean} Разрешено ли перемещение записей
                * <wiTag group="Управление">
                * <wiTag class=HierarchyView page=2>
                * <wiTag class=TreeView page=1>
                * Возможно ли в этом браузере перемещать записи.
                * А также возможно ли перемещение в другие браузеры и контролы.
                * Необходимо учесть, что для корректной работы перемещения записей метод БЛ должен быть настроен
                * соответствующим образом: для дерева и иерархического представления вид фильтра - "Иерархические структуры".
                *
                * Кнопку перемещения записей можно разместить в {@link $ws.proto.DataViewAbstract.ToolbarPlugin#toolbarButtons панели инструментов}.
                * @example
                * <pre>
                *     <option name="allowMove">true</option>
                * </pre>
                * @group Record Actions
                */
               allowMove: false,
               /**
                * @cfg {Boolean} Использовать текущий фильтр при перемещении
                * <wiTag group="Управление">
                * <wiTag class=HierarchyView page=2>
                * <wiTag class=TreeView page=1>
                * @example
                * <pre>
                *     <option name="useCurrentFilterOnMove">true</option>
                * </pre>
                * @see allowMove
                */
               useCurrentFilterOnMove: false,
               /**
                * @cfg {Boolean} Перенос записей в другое представление данных
                * <wiTag group="Управление">
                * <wiTag class=HierarchyView page=2>
                * <wiTag class=TreeView page=1>
                * @example
                * <pre>
                *     <option name="dragRecordsToOtherBrowser">true</option>
                * </pre>
                * @see allowMove
                */
               dragRecordsToOtherBrowser: false
            },
            _drag: {
               rootBlock: undefined                //Блок, на который нужно навести для бросания в корень
            },
            _isMoveAcceptable: false,              //Признак доступности перемещения записей мышью
            _initialCount: ''                      //Начальное количество перемещаемых записей
         },
         $constructor: function(){
            this._publish('onDragStart', 'onDragMove', 'onDragStop', 'onDragOut', 'onDragIn', 'onPrepareFilterOnMove', 'onDragTry', 'onBeforeMoveDialogShow');
            this._keysWeHandle[$ws._const.key.m] = true;
            if (!this._options.display.readOnly && this._options.allowMove) {
               this._registerShortcut($ws._const.key.m, $ws._const.modifiers.control, this.moveRecords);
               if (this._options.display.showToolbar) {
                  if (this._toolbarReady) {
                     if (this._toolbarReady.isReady()) {
                        this._addMoveButton();
                     } else {
                        this._toolbarReady.addCallback(function(){
                           this._addMoveButton();
                        }.bind(this));
                     }
                  } else {
                     this.getParent().waitChildControlByName('ws-toolbar-' + this.getId()).addCallback(function(toolbar){
                        this._addMoveButton();
                        return toolbar;
                     }.bind(this));
                  }
               }
               if (this.isTree()) {
                  this._registerShortcut($ws._const.key.left, $ws._const.modifiers.shift, this._moveRecordsToParentOrChildren.bind(this, true));
                  this._registerShortcut($ws._const.key.right, $ws._const.modifiers.shift, this._moveRecordsToParentOrChildren.bind(this, false));
               }
               this._notify('onNewAction', {
                  title: 'Переместить',
                  icon: $ws._const.theme ? 'sprite:icon-16 icon-Move icon-primary' : 'move.png',
                  name: 'move',
                  callback: 'move',
                  weight: 60
               });
            }
         },
         $condition: function(){
            return (this._options.allowMove || this._options.display.sequenceNumberColumn) && !this._options.display.readOnly;
         },
         _addMoveButton: function(){
            var btn = this._options.display.toolbarButtons.move,
                id = 'move',
                img = 'sprite:icon-16 icon-Move icon-primary',
                title = 'Переместить выбранные записи (Ctrl+M)',
                handlers = {
                   onActivated: this.moveRecords.bind(this)
                },
                cfg;
            if (btn === true) {
               cfg = {
                  name: id,
                  id: id,
                  caption: ' ',
                  displayCaption: false,
                  tooltip: title,
                  visible: true,
                  img: img,
                  handlers: handlers
               };
               this._toolbar.addButton(cfg);
            } else if (btn === false) {
               cfg = {
                  id: id,
                  imgSrc: img,
                  caption: title,
                  handlers: handlers
               };
               this._toolbar.getMenu().addItem(cfg);
            }
         },
         _initActionsFlags: function(){
            this._actions.move = this._options.allowMove && !this._options.display.readOnly && $.proxy(this._moveOnCurrentBranch, this);
         },
         _moveOnCurrentBranch: function(row){
            var selectedRecords = this.getSelection(),
                selectedCount = selectedRecords.length;
            if(selectedCount > 0 && this._notify('onDragStart', selectedRecords) !== false){
               var key, record;
               if(row instanceof Object && 'jquery' in row){
                  key = row.attr('rowkey');
                  record = this._currentRecordSet.getRecordByPrimaryKey(key);
               } else {
                  if(!row){
                     row = this.getActiveRecord();
                  }
                  if(row instanceof $ws.proto.Record){
                     key = row.getKey();
                     record = row;
                  }
               }
               if(key && record && record.get(this._hierColumnIsLeaf)){
                  if(this._notify('onDragStop', selectedRecords, this._isIdEqual(key, this._rootNode) ? key : record, true) !== false){
                     this.move(key, []);
                  }
               }
            }
         },
         _checkAllowMoveForRecord: function(filter, record){
            if (this._options.readOnly || !record.get(this._hierColumnIsLeaf) || !this.getSelection(true).length){
               filter.push('move');
            }
         },
         _dataBind: function(){
            if(!this._options.allowMove){
               return;
            }
            //грязный хак, для того, чтобы не показывалась кнопка перемещения, если этого не нужно.
            //т.к. плагин написан для DataViewAbstract, а опции записи есть только у TableView и его наследников
            if(typeof(this._additionalFilterRowOptions) == 'function' && this.isHierarchyMode())
               this._additionalFilterRowOptions = this._additionalFilterRowOptions.callNext(this._checkAllowMoveForRecord);
         },
         _showMoveDialog: function(instance, selectedRecords){
            var self = this,
                selectedCount = selectedRecords.length,
                isHierarchy = $ws.proto.HierarchyViewAbstract && this instanceof $ws.proto.HierarchyViewAbstract,
                dialogConf = {
                   resizable: false
                },
                floatAreaConf = {
                   autoHide: true,
                   direction: 'left',
                   isStack: true,
                   side: 'right',
                   target: $ws._const.$body
                },
                configuration = {
                  opener: self,
                  template: 'replaceRecordDialog',
                  handlers: {
                     onReady: function() {
                        var replacingBrowser = this.getChildControlByName('ws-browser-replace'),
                           replacingWindow = this,
                           moveTo = function(to, parents) {
                              var moveToParents = replacingBrowser.getItemParents(to);
                              self.move(to, parents, moveToParents);
                           },
                           setDataOnReady = function() {
                              var columnObj = replacingBrowser.getColumns()[0],
                                 titleColumn = self._options.display.titleColumn,
                                 filterFix = {};
                              filterFix[self._hierColumnParentId] = self._rootNode;

                              columnObj.title = titleColumn;
                              columnObj.field = titleColumn;

                              replacingBrowser.setHierarchyField(self._hierColumnParentId, titleColumn);
                              replacingBrowser.setColumns([columnObj]);
                              replacingBrowser.setData(instance);
                              replacingBrowser.setRootNode(self._rootNode, true);
                              replacingBrowser.setQuery($ws.core.merge(instance.getUpdatedQuery(), filterFix)).addCallback(
                                 function() {
                                    replacingBrowser.showBranch(self._rootNode);
                                 }
                              );
                           };
                        replacingBrowser.setSource(instance.getSource());

                        // добавляем проверку, готов ли рекордсет
                        if (replacingBrowser.getRecordSet().isLoaded()) {
                           setDataOnReady();
                        } else {
                           replacingBrowser.subscribe('onReady', setDataOnReady.bind(self));
                        }
                        replacingBrowser.subscribe('onSelectionConfirm', function(event, records) {
                           var parent = records.length === 0 ? self._rootNode : records[0].get(self._hierColumnParentId),
                              parents = [];
                           while ((parent + '') !== (self._rootNode + '') && !isHierarchy) {
                              if (!self._expanded[parent]) {
                                 self._expanded[parent] = true;
                                 parents.push(parent);
                              }
                              parent = this.getRecordSet().getRecordByPrimaryKey(parent).get(self._hierColumnParentId);
                           }
                           if (self._notify('onDragStop', selectedRecords, records.length === 0 ? self._rootNode : records[0], true) !== false) {
                              self.move(records.length === 0 ? self._rootNode : records[0].getKey(), parents);
                           }
                           replacingWindow.close();
                        });
                        this.getChildControlByName('replace').subscribe('onActivated', function() {
                           var parent = replacingBrowser.getActiveRecord() ? replacingBrowser.getActiveRecord().get(self._hierColumnParentId) : self._rootNode,
                              parents = [],
                              newParentRecord;
                           while ((parent + '') !== (self._rootNode + '') && !isHierarchy) {
                              if (!self._expanded[parent]) {
                                 self._expanded[parent] = true;
                                 parents.push(parent);
                              }
                              parent = replacingBrowser.getRecordSet().getRecordByPrimaryKey(parent).get(self._hierColumnParentId);
                           }
                           newParentRecord = replacingBrowser.getActiveRecord();
                           if (self._notify('onDragStop', selectedRecords, newParentRecord ? newParentRecord : self._rootNode, true) !== false) {
                              moveTo(newParentRecord ? newParentRecord.getKey() : self._rootNode, parents);
                           }
                           replacingWindow.close();
                        });
                     },
                     onAfterShow: function() {
                        this.setTitle('Переместить ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в');
                        $ws.core.setCursor(true);
                     },
                     onAfterClose: $.proxy(self._mouseMonitor, self)
                  }
               };
            if (this._options.moveMode === 'newFloatArea') {
               new FloatArea($ws.core.merge(configuration, floatAreaConf));
            } else {
               new Dialog($ws.core.merge(configuration, dialogConf));
            }
         },
         /**
          * Перемещает выбранные записи в указанную
          */
         moveRecords: function() {
            if (!this._options.allowMove) {
               return;
            }
            if (this.isEnabled()) {
               var toRecord = this.getActiveRecord(),
                   selectedRecords = this.getSelection(),
                   selectedCount = selectedRecords.length,
                   replacedRecordsInCurrentBranch = true,
                   isHierarchy = $ws.proto.HierarchyViewAbstract && this instanceof $ws.proto.HierarchyViewAbstract,
                   self = this;

               if (selectedCount > 0 && this._notify('onDragStart', selectedRecords) !== false) {
                  if (isHierarchy) { // в дереве всегда спрашиваем куда переместить
                     var parentOfFirstRecord = selectedRecords[0].get(this._hierColumnParentId);
                     for (var j = 1; j < selectedCount; j++) { // проверяем все ли записи лежат в одном разделе
                        if (selectedRecords[j].get(this._hierColumnParentId) !== parentOfFirstRecord) {
                           replacedRecordsInCurrentBranch = false;
                        }
                     }
                     if (replacedRecordsInCurrentBranch && !(toRecord && (parentOfFirstRecord === toRecord.get(this._hierColumnParentId) || parentOfFirstRecord === toRecord.getKey() ||
                           parentOfFirstRecord === self._currentRootId))) {
                        replacedRecordsInCurrentBranch = false;
                     }
                  }
                  if (replacedRecordsInCurrentBranch) {
                     $ws.core.setCursor(false);
                     this._useKeyboard = true;
                     var result = self._notify('onBeforeMoveDialogShow');
                     if (result instanceof $ws.proto.RecordSet) {
                        self._showMoveDialog(result, selectedRecords);
                     } else if (result instanceof $ws.proto.Deferred) {
                        result.addCallback(function (instance) {
                           self._showMoveDialog(instance, selectedRecords);
                        });
                     } else {
                        var dataSource = $ws.core.merge({}, this._initialSource);
                        dataSource.firstRequest = false;
                        dataSource.usePages = dataSource.filterParams.usePages = '';
                        dataSource.handlers = {};
                        var filter = this._options.useCurrentFilterOnMove ? this.getQuery() : $ws.core.merge({}, this._initialFilter),
                            eventResult = this._notify('onPrepareFilterOnMove', filter);
                        if (typeof(eventResult) === 'object' && Object.prototype.toString.call(eventResult) === '[object Object]') {
                           filter = eventResult;
                        }
                        dataSource.filterParams = filter;
                        dataSource.filterParams['ВидДерева'] = 'Только узлы';
                        dataSource.filterParams[self._hierColumnParentId] = self._rootNode;
                        //если в фильтре ['_ЕстьДочерние']=false, то приходят неправильные данные
                        //поэтому ручками ставим true
                        dataSource.filterParams['_ЕстьДочерние'] = true;
                        dataSource.filterParams.usePages = '';
                        $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function (instance) {
                           self._showMoveDialog(instance, selectedRecords);
                        });
                     }
                  } else {
                     this._confirmMoveRecords();
                  }
               }
            }
         },
         /**
          * Показывает диалог с подтверждением
          * @param {$ws.proto.Record} [toRecord] Куда переносятся записи
          * @private
          */
         _confirmMoveRecords: function(toRecord){
            var self = this,
                selectedRecords = this.getSelection();
            if(this._notify('onDragStart', selectedRecords) !== false){
               $ws.core.setCursor(false);
               this._useKeyboard = true;
               new DialogConfirm({
                  resizable: false,
                  opener: self,
                  message: 'Переместить выбранные записи (' + selectedRecords.length + ') в текущий раздел?',
                  handlers: {
                     onConfirm: function(event, result){
                        if(result === true){
                           var parentRecord = self._currentRootId;
                           if(toRecord){
                              if(toRecord.get(self._hierColumnIsLeaf))
                                 parentRecord = toRecord;
                              else{
                                 parentRecord = toRecord.get(self._hierColumnParentId);
                              parentRecord = self._isIdEqual(parentRecord, self._rootNode) ? parentRecord : self._currentRecordSet.getRecordByPrimaryKey(parentRecord);
                              }
                           }
                           if(self._notify('onDragStop', selectedRecords, parentRecord, true) !== false){
                              var id = parentRecord instanceof $ws.proto.Record ? parentRecord.getKey() : parentRecord;
                           self.move(self._isIdEqual(parentRecord, self._rootNode) ? self._rootNode : id);
                           }
                           self._mouseMonitor.apply(self);
                           self.removeSelection();
                        }
                     }
                  }
               });
               $ws.core.setCursor(true);
            }
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
         /**
          * Функция-обработчик кнопки опций строки "переместить"
          * @param {$ws.proto.Record} record Запись, для которой показываются опции строки
          * @private
          */
         _moveSelectedRecordsToCurrent: function(record){
            this._confirmMoveRecords(record);
         },
         /**
          * <wiTag class=HierarchyView page=3>
          * Перемещает выбранные записи в папку с переданным идентификатором (parent).
          * @param {Number|String} parent идентификтор элемента, в который необходимо переместить записи
          * @param {Array} parents массив узлов, которые нужно открыть после перемещения
          * @param {Array} [moveToParents] массив записей - родителей записи, куда нужно перенести выбранные записи
          * @example
          * <pre>
          *    // переместить отмеченные записи в корень
          *    dataView.move(null);
          * </pre>
          */
         move: function(parent, parents, moveToParents){
            if(!this._options.allowMove){
               return;
            }
            if(parent === 'null'){
               parent = null;
            }
            var records = this.getSelection(),
                  self = this,
                  parentRecord,
                  toParents = moveToParents || this._getItemParents(parent),
                  isTree = $ws.proto.TreeView && this instanceof $ws.proto.TreeView,
                  toMap = {};
            parents = parents || [];

            parents.push(parent);
            for(var i = 0, len = toParents.length; i < len; ++i){
               toMap[toParents[i]] = true;
            }
            var continueMove = function(){
               for(i = 0, len = records.length; i < len; ++i){
                  var key = records[i].getKey();
                  if(key == parent || (key in toMap)){
                     $ws.helpers.alert('Вы не можете переместить запись саму в себя!', {}, self);
                     return;
                  }
                  if (isTree) {
                     parents.push(records[i].get(self._hierColumnParentId));
                  }
               }

               if(isTree){
                  if(!self._expanded[parent]){
                     self._expanded[parent] = true;
                     parents.push(parent);
                  }
               }

               var moveRecords = function(){
                        var dMultiResult = new $ws.proto.ParallelDeferred(),
                              errors = [],
                              afterRender = function(){
                                 if (self.getCurrentRootNode() != parent && this.getTurn() === '') {
                                    self.showBranch(parent);
                                 } else {
                                    self.unsubscribe('onAfterRender', afterRender);
                                    self.setActiveRow(self._body.find('[rowkey="'+records[0].getKey()+'"]'));
                                 }
                              };
                        $ws.core.setCursor(false);
                        for(var i = 0, l = records.length; i < l; i++){
                           records[i].set(self._hierColumnParentId, parent);
                           dMultiResult.push(records[i].update().addErrback(function(error){
                              errors.push(error.message);
                           }));
                        }
                        dMultiResult.done();
                        dMultiResult.getResult().addBoth(function(){
                           if (errors.length !== 0) {
                              $ws.helpers.alert('В процессе перемещения возникли ошибки: \n ' + errors.join(' ;\n '), {}, self);
                           }
                           self._isUpdatingRecords = false;
                           if(!self._expanded[parent] && (parent != self._rootNode || self._options.display.showRoot)){
                              self._activeElement = undefined;
                              self._hovered = parent;
                           }
                           self.removeSelection();
                           if(self._options.mode === 'navigationMode' && isTree){
                              self._closeOtherBranches(parent);
                           }
                           if(!isTree){
                              self.subscribe('onAfterRender', afterRender);
                           }
                           self._onRecordUpdated(isTree, parents);
                           $ws.core.setCursor(true);
                        });
                     },
                     checkParentForMove = function(){
                        if(parentRecord.get(self._hierColumnIsLeaf) === true){
                           moveRecords();
                        } else {
                           $ws.helpers.alert('Вы не можете перемещать в лист! Выберите другую запись для перемещения!', {}, self);
                        }
                     };

               self._isUpdatingRecords = true;
               if(parent === self._rootNode){
                  moveRecords();
               } else {
                  try{
                     parentRecord = self._currentRecordSet.getRecordByPrimaryKey(parent);
                     checkParentForMove();
                  } catch(e){
                     self._currentRecordSet.readRecord(parent).addCallback(function(record){
                        parentRecord = record;
                        checkParentForMove();
                     });
                  }
               }
            };
            var dragTryResult = this._notify('onDragTry', records, parent);
            if (dragTryResult instanceof $ws.proto.Deferred) {
               dragTryResult.addCallback(continueMove);
            } else if(dragTryResult !== false){
               continueMove();
            }
         },
         /**
          * Добавляет обработчик на задатие левой кнопки мыши
          * @private
          */
         _initEvents: function(){
            var parent = this._browserContainer.parent();
            this._addDragContainer('[rowkey]', parent);
         },
         /**
          * Возвращает данные для драг-н-дропа
          * @param {jQuery} target Элемент, над которым находится мышь
          * @returns {Array|Boolean}
          * @private
          */
         _dragStart: function(target){
            var textFound = false,
                records;
            for(var i = 0; i < target[0].childNodes.length; ++i){
               if(target[0].childNodes[i].nodeType == $ws._const.nodeType.TEXT_NODE){
                  textFound = true;
                  break;
               }
            }
            if(target.closest('a').length === 1){
               textFound = true;
            }
            if(!textFound){
               return false;
            }
            var record = this._dropRecord(target);
            if(!record){
               return false;
            }
            this.setActiveElement(target.closest('.ws-browser-table-row'), false, true);
            records = this.getSelection();
            if (this._options.display.sequenceNumberColumn && !this._options.allowMove) {
               //В случае изменения порядка вернется только активная запись
               records = [this.getActiveRecord()];
            }
            //Инициализируем количество записей для перемещения
            this._initialCount = records.length;
            return records;
         },
         /**
          * Обрабатывает начало переноса данных
          * @private
          */
         _dragStarted: function(){
            this._useKeyboard = true;
         },
         /**
          * Создаёт блок, при кидании на который записи будут кинуты в корень
          * @private
          */
         _dragCreateRootBlock: function(){
            this._drag.rootBlock = $('<div class="ws-browser-drag-root" rowkey="null">' +
                  '<div class="ws-browser-drag-root-title"><div class="ws-browser-cell-container ws-browser-hierarchy-cell-container" style="padding-left: 3px;"><div class="ws-browser-hierarchy-expander icon-24 icon-Folder icon-primary rule_icon_brws"></div><div class="rule_name">Корень</div></div></div>')
                  .appendTo(this._browserContainer.children())
                  .hover(function(){ //:hover может не работать из-за нажатой клавиши мыши
                     $(this).addClass('ws-browser-row-hover');
                  }, function(){
                     $(this).removeClass('ws-browser-row-hover');
                  });
            this._onResizeHandler();
         },
         /**
          * Удаляет блок, при кидании на который записи будут кинуты в корень
          * @private
          */
         _dragRemoveRootBlock: function(){
            if(this._drag.rootBlock){
               this._drag.rootBlock.remove();
               this._drag.rootBlock = undefined;
               this._onResizeHandler();
            }
         },
         /**
          * Очищает выделение на строке, в которую хотели бросать данные
          * @param {jQuery} row
          * @private
          */
         _dragRemoveHighlight: function(row){
            if (this._options.allowMove) {
               row.removeClass('ws-browser-want-drag');
               this._isMoveAcceptable = false;
            }
         },
         /**
          * Добавляет выделение на строку, в которую хотели бросать данные
          * @param {jQuery} row
          * @private
          */
         _dragAddHighlight: function(row){
            if(this._options.allowMove && this._isMoveAcceptable && row.hasClass('ws-browser-table-row')){
               row.addClass('ws-browser-want-drag');
            }
         },
         _isDragAcceptable: function(target, data, from, record){
            return this._isMoveAvailable(target, data, from, record);
         },
         _isCorrectDrop: function(data, isCorrect) {
            //Если проверка на перенос равна false, проверем на наличие перемещения по порядковым номерам
            return (this._isMoveAcceptable = isCorrect) || this._options.display.sequenceNumberColumn;
         },
         /**
          * Проверяет, можно ли перенести данные в указанный блок
          * @param {jQuery} target Элемент, над которым находится мышь
          * @param {*} data Данные
          * @param {$ws.proto.Control} from Из какого контрола тащим данные
          * @param {$ws.proto.Record} record Куда будем кидать данные
          * @returns {Boolean}
          * @private
          */
         _isMoveAvailable: function (target, data, from, record) {
            if(!record){
               return false;
            }
            var key = record.getKey(),
                  i, len;
            if(from === this){
               for(i = 0, len = data.length; i < len; ++i){
                  if(data[i].getKey() == key){
                     return false;
                  }
               }
            }
            if( this.isHierarchyMode() ){
               var tempKey = key;
               while(tempKey && !this._isIdEqual(tempKey, this._rootNode)){
                  for(i = 0, len = data.length; i < len; ++i){
                     if(data[i].getKey() == tempKey){
                        return false;
                     }
                  }
                  tempKey = record.get(this._hierColumnParentId);
                  if(this._currentRecordSet.contains(tempKey)){
                     record = this._currentRecordSet.getRecordByPrimaryKey(tempKey);
                  }
                  else if(!this._isIdEqual(tempKey, this._rootNode)){
                     if(tempKey != this._currentRootId){
                        return false;
                     }
                     break;
                  }
               }
            }
            return true;
         },
         /**
          * Создаёт блок, который позволяет бросать записи в корень
          * @returns {$ws.proto.Record}
          * @private
          */
         _createRootRecord: function () {
            var record = new $ws.proto.Record({
               colDef: this._currentRecordSet.getColumns(),
               row: [],
               parentRecordSet: this._currentRecordSet
            });
            if (this.isHierarchyMode()) {
               record.setKey(this._rootNode, this._currentRecordSet.getPkColumnIndex());
            }
            return record;
         },
         /**
          * Убирает визуализацию изменения порядка записей
          * @private
          */
         _clearDragHighlight: function ( ) {
            this._body.find('.ws-browser-table-row').removeClass('ws-drop-top-row ws-drop-bottom-row ws-drop-top-row-only ws-drop-place');
            this._drag.flowObject.find('.ws-dragged-count').text(this._initialCount);
         },
         /**
          * Возвращает блок, в который можно было бы кинуть данные
          * @param {jQuery} target Элемент, над которым находится мышь
          * @param {Object} event  Событие
          * @returns {jQuery}
          * @private
          */
         _dropBlock: function(target, event){
            var isHierarchyMode = this.isHierarchyMode();
            //Визуализация вынесена сюда по причине определения точного нахождения указателя
            if (this._options.display.sequenceNumberColumn && (!isHierarchyMode || (isHierarchyMode && this._turn !== 'OnlyLeaves'))) {
               var targetTR = target.closest('.ws-browser-table-row'),
                   activeTR = this.getActiveRow(),
                   activeTRKey = activeTR.attr('rowkey'),
                   targetTRKey = targetTR.attr('rowkey'),
                   rs = this.getRecordSet(),
                   isHighlighted = false,
                   hasNeighbor = false,
                   recordAbove,
                   recordBellow,
                   targetRecord,
                   neighborRecord,
                   neighborTRKey,
                   isDragTop,
                   options,
                   neighborTR;
               //Если навели на запись отличную от той которую перемещаем
               if (targetTR.length > 0 && targetTRKey !== activeTRKey && targetTR.closest('#'+this.getId()).length > 0) {
                  this._clearDragHighlight();
                  options = targetTR[0].getBoundingClientRect();
                  isDragTop = event.clientY <= options.top + MOVEABLE_AREA_HEIGHT;
                  //Предполагаемо хотим переместить выше или ниже записи, на которую навели
                  if (isDragTop || event.clientY >= options.top + options.height - MOVEABLE_AREA_HEIGHT) {
                     targetRecord = rs.getRecordByPrimaryKey(targetTRKey);
                     //Соседняя запись записи, на которую навели
                     neighborTR = $(targetTR[(isDragTop ? 'prev' : 'next') + 'All']().filter('[rowkey]')[0]);
                     if (neighborTR.length > 0) {
                        hasNeighbor = true;
                        neighborTRKey = neighborTR.attr('rowkey');
                        neighborRecord = rs.getRecordByPrimaryKey(neighborTRKey);
                     }
                     if (isDragTop) {
                        recordAbove = targetRecord;
                        recordBellow = neighborRecord;
                     } else {
                        recordAbove = neighborRecord;
                        recordBellow = targetRecord;
                     }
                     if (this._notify('onBeforeChangeOrder', this.getActiveRecord(), recordAbove, recordBellow) !== false) {
                        if (hasNeighbor) {
                           //Соседняя запись существует и она не является перемещаемой записью
                           if (neighborTRKey !== activeTRKey && !this._isChildRecord(neighborTRKey, activeTRKey) &&
                                 $(this._getNearestRow(activeTR, isDragTop)).attr('rowkey') !== neighborTRKey) {
                              targetTR.addClass((isDragTop ? 'ws-drop-top-row' : 'ws-drop-bottom-row') + ' ws-drop-place');
                              neighborTR.addClass(isDragTop ? 'ws-drop-bottom-row' : 'ws-drop-top-row');
                              isHighlighted = true;
                           }
                        } else if (!this._isChildRecord(targetTRKey, activeTRKey)) {
                           targetTR.addClass((isDragTop ? 'ws-drop-top-row-only' : 'ws-drop-bottom-row') + ' ws-drop-place');
                           isHighlighted = true;
                        }
                        if (isHighlighted) {
                           //Количество записей на иконке перемещения в случае изменения порядка в любом случае будет равно 1
                           //т. к. изменяем порядок только у активной записи
                           this._drag.flowObject.find('.ws-dragged-count').text('1');
                        }
                     }
                  }
               } else {
                  //Убираем в представлении данных место под перемещение если вдруг увели мышь вне
                  this._clearDragHighlight();
               }
               return targetTR;
            }
            if(isHierarchyMode){
               return target.closest('.ws-browser-table-row, .ws-browser-drag-root, .ws-browser-container');
            }
            return target.closest('.ws-browser-container');
         },
         /**
          * Является ли запись дочерней для указанной
          * @param {String} rowkey Идентификатор дочерней записи
          * @param {String} parentKey Идентификатор родительской записи
          * @return {Boolean}
          * @private
          */
         _isChildRecord: function (rowkey, parentKey) {
            var isChildRecord = false,
                parents;
            if (this.isHierarchyMode()) {
               parents = this._getItemParents(rowkey);
               for (var i = 0, l = parents.length; i < l; i++) {
                  if (parents[i] === parentKey) {
                     isChildRecord = true;
                     break;
                  }
               }
            }
            return isChildRecord;
         },
         /**
          * Запись, над которой находится мышь. Или корень
          * @param {jQuery} target Элемент, над которым находится курсор мыши
          * @returns {$ws.proto.Record|Boolean}
          * @private
          */
         _dropRecord: function(target) {
            var row = target.closest('.ws-browser-table-row, .ws-browser-container'),
                  rowkey = row.attr('rowkey');
            if ((this.isHierarchyMode() && this._isIdEqual(rowkey, this._rootNode)) || row.is(this._browserContainer)) {
               return this._createRootRecord();
            }
            if (!this._currentRecordSet.contains(rowkey)) {
               return false;
            }
            return this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         },
         /**
          * Возвращает запись, в которую можно перенести данные
          * @param {jQuery} target Элемент, над которым сейчас находится курсор мыши
          * @returns {$ws.proto.Record|Boolean}
          * @private
          */
         _dropTarget: function(target){
            var record = this._dropRecord(target);
            if( !this.isHierarchyMode() || record && (record.get(this._hierColumnIsLeaf) || this._isIdEqual(record.getKey(), this._rootNode)) ){
               return record;
            }
            return false;
         },
         /**
          * Обрабатывает окончание переноса записей
          * {Array} records записи, которые пытаются переместить
          * {String} to Ключи записи, в которую пытаются переместить
          * @private
          */
         _dragEnd: function(records, to){
            var record = to ? this._currentRecordSet.getRecordByPrimaryKey(to) : undefined;
            if(record && !record.isBranch()){
               //если пытаются переместить в лист, поднимем событие, так как в метод move мы даже не попадем
               this._notify('onDragTry', records, to);
               this._clearDragHighlight();
            }
            this._useKeyboard = false;

            if (this._options.display.rowOptions && to !== 'null') {
               this._initRowOptions();
               if (to && this._currentRecordSet.contains(to)) {
                  this._showRowOptions(this._body.find('[rowkey="' + to + '"]')[0]);
               }
            }
         },
         /**
          * Обрабатывает перенос записей в этот браузер
          * @param {jQuery} to Элемент, в который переносят записи
          * @param {Array} records Записи, которые переносят
          * @param {$ws.proto.Control} from Из какого контрола переносят записи
          * @private
          */
         _drop: function(to, records, from){
            if (this === from) {
               var tr = to.closest('.ws-browser-table-row'),
                   isChangeSequenceNumber = tr.hasClass('ws-drop-place'),
                   target;
               if (this._isMoveAcceptable && !isChangeSequenceNumber) {
                  //перемещаем в папку только если это разрешено в данный момент
                  target = this._dropTarget(to);
                  if(target){
                     this.move(target.getKey());
                  }
               } else if (isChangeSequenceNumber) {
                  //Если в данный момент разрешено изменение порядка, собираем необходимые праметры для отправки запроса и выполняем его
                  var activeRecord = this.getActiveRecord(),
                      rs = this.getRecordSet(),
                      targetKey = tr.attr('rowkey'),
                      column = this._options.display.sequenceNumberColumn,
                      activeNumber = activeRecord.get(column),
                      targetNumber = rs.getRecordByPrimaryKey(targetKey).get(column),
                      self = this,
                      methodSuffix,
                      eventSuffix,
                      nextKey,
                      params,
                      nextTr,
                      prevTr;
                  if (tr.hasClass('ws-drop-bottom-row')) {
                     methodSuffix = 'После';
                     eventSuffix = 'Down';
                     nextTr = $(tr.nextAll().filter('[rowkey]')[0]);
                     if (nextTr.length) {
                        nextKey = nextTr.attr('rowkey');
                        if (targetNumber > rs.getRecordByPrimaryKey(nextKey).get(column)) {
                           methodSuffix = 'До';
                        }
                        if (nextTr.attr('parentId') === targetKey) {
                           methodSuffix = 'До';
                           eventSuffix ='Up';
                           targetKey = nextKey;
                        }
                     } else if (activeNumber > targetNumber) {
                        methodSuffix = 'До';
                     }
                  } else {
                     methodSuffix = 'До';
                     eventSuffix ='Up';
                     prevTr = $(tr.prevAll().filter('[rowkey]')[0]);
                     if ((prevTr.length && rs.getRecordByPrimaryKey(prevTr.attr('rowkey')).get(column) > targetNumber) ||
                           activeNumber < targetNumber) {
                        methodSuffix = 'После';
                     }
                  }
                  params = {
                     'Объект': this.getDataSource().readerParams.linkedObject,
                     'ИдО': this._getComplexKey(activeRecord.getKey()),
                     'ПорядковыйНомер': column,
                     'Иерархия': this.isHierarchyMode() ? rs.getHierarchyField() : null
                  };
                  params['ИдО' + methodSuffix] = this._getComplexKey(targetKey);
                  this._clearDragHighlight();
                  this._sequenceNumberObject.call(
                        'Вставить' + methodSuffix,
                        params,
                        $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function() {

                           self._hideRowOptions();
                           self._notify('onRecord' + eventSuffix, activeRecord);
                           self.reload();

                        });
               }
            }
         },
         /**
          * Можно ли вынести записи из этого браузера
          * @returns {Boolean}
          * @private
          */
         _canDragOut: function(){
            return this._options.dragRecordsToOtherBrowser;
         },
         /**
          * Можно ли внести записи в этот браузер
          * @param {Array} data Записи
          * @param {$ws.proto.Control} from Откуда переносят записи
          * @returns {Boolean}
          * @private
          */
         _dragIn: function(data, from){
            if (this._options.display.rowOptions) {
               this._hideRowOptions();
               this._uninitRowOptions();
            }
            return from === this || this._canDragOut();
         },
         /**
          * Обрабатывает внос записией в браузер
          * @param {Array} data Записи
          * @param {$ws.proto.Control} from Откуда переносят записи
          * @private
          */
         _draggedIn: function(data, from){
            this._container.addClass('drag-over');
            if(this.isHierarchyMode() && !this._options.display.showRoot && this._notify('onDragMove', data, this._createRootRecord(), from) === true){
               this._dragCreateRootBlock();
            }
         },
         /**
          * Обрабатывает вынос записией из браузера
          * @private
          */
         _draggedOut: function(){
            this._container.removeClass('drag-over');
            this._dragRemoveRootBlock();
         },
         /**
          * Возвращает высоту дополнительных частей браузера. Здесь может быть блок, который используется для переноса записей в корень
          * @param {Number} height Уже посчитанная высота остальных частей
          * @returns {Number}
          * @private
          */
         _getAdditionalHeight: function(height){
            return height + (this._drag && this._drag.rootBlock ? this._drag.rootBlock.outerHeight() : 0);
         },
         /**
          * Лежат ли указанные записи в одной папке
          * @param {Array} records Записи
          * @returns {Boolean}
          * @private
          */
         _checkRecordsInOneFolder: function(records){
            var parent = records[0].get(this._hierColumnParentId);
            for(var i = 1, len = records.length; i < len; ++i){
               if(!this._isIdEqual(parent, records[i].get(this._hierColumnParentId))){
                  return false;
               }
            }
            return true;
         },
         /**
          * Перемещает выбранную/выделенные записи в родительскую/соседнюю запись
          * @param {Boolean} isParent Нужно ли перемещать к родителю
          * @private
          */
         _moveRecordsToParentOrChildren: function(isParent){
            var records,
               parentKey,
               children,
               moveKey,
               moveInfo;
            if(this.isEnabled()){
               records = this.getSelection();
               if(records.length && this._checkRecordsInOneFolder(records)){
                  if(this._notify('onDragStart', records) !== false){
                     parentKey = records[0].get(this._hierColumnParentId);
                     if(isParent){
                        moveKey = this._currentRecordSet.getRecordByPrimaryKey(parentKey).get(this._hierColumnParentId);
                     }
                     else{
                        children = this._currentRecordSet.recordChilds(parentKey);
                        for(var i = 0, len = children.length; i < len; ++i){
                           if(this._isIdEqual(children[i], records[0].getKey())){
                              if(i > 0){
                                 moveKey = children[i - 1];
                                 break;
                              }
                              else{
                                 return;
                              }
                           }
                        }
                     }
                     if(this._isIdEqual(moveKey, this._rootNode)){
                        moveInfo = this._rootNode;
                     }
                     else{
                        moveInfo = this._currentRecordSet.getRecordByPrimaryKey(moveKey);
                     }
                     if(moveKey !== undefined && this._notify('onDragStop', records, moveInfo, true) !== false){
                        this.move(moveKey);
                     }
                  }
               }
               else{
                  $ws.helpers.alert('Данная операция доступна только для записей, лежащих в одной папке.', {}, this);
               }
            }
         }
      });
   })();

});
