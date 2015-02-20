/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 05.12.12
 * Time: 12:54
 * To change this template use File | Settings | File Templates.
 */

define('js!SBIS3.CORE.AtPlaceEditPlugin', ['js!SBIS3.CORE.TableView', 'js!SBIS3.CORE.Button', 'js!SBIS3.CORE.RecordArea'], function(TableView, Button, RecordArea){

$ws._const.Browser.editAtPlaceWait = 350;

/**
 * @class $ws.proto.TableView.AtPlaceEditPlugin
 * @extends $ws.proto.TableView
 * @plugin
 */
$ws.proto.TableView.AtPlaceEditPlugin = TableView.extendPlugin(/** @lends $ws.proto.TableView.AtPlaceEditPlugin.prototype */{
   /**
    * @typedef {Object} Columns
    * @property {Boolean} allowEditAtThePlace Разрешить редактирование по месту
    * @property {String} maskField Маска отображения данных<br />
    * Условные обозначения:
    * <ol><li>D(day) -  календарный день.</li>
    * <li>M(month) - месяц.</li>
    * <li>Y(year) - год.</li>
    * <li>H(hour) - час.</li>
    * <li>I - минута.</li>
    * <li>S(second) - секунда.</li>
    * <li>U - доля секунды.</li>
    * </ol><br />
    * Опция чувствительна к регистру, для задания значения необходимо использовать только заглавные буквы.<br />
    * Количество символов в маске влияет на количество отображаемых символов.<br />
    * Например, YY будет отображать 2 цифры года, а YYYY - 4 цифры.<br />
    * <pre>mask:'DD.MM.YY HH:II:SS'</pre>
    */
    /**
    * @event onBeforeEditColumn Перед началом редактирования ячейки по месту
    * <wiTag page=6>
    * @returns {null|Array} Если в ответ придёт массив из двух значений, то первый элемент будет считаться новым типом
    * поля, а второй - новой конфигурацией поля.
    * @param {$ws.proto.EventObject} Дескриптор события.
    * @param {$ws.proto.Record} record Запись, которую редактируем по месту.
    * @param {String} type Тип поля ввода.
    * @param {Object} config Конфигурация поля ввода.
    * @example
    * <pre>
    *    dataView.subscribe('onBeforeEditColumn', function(event, record, type, config){
    *       if(config.name === "Примечание")
    *          event.setResult(['Control/FieldText', config]);
    *    });
    * </pre>
    */
   /**
    * @event onFieldChange При изменении поля при редактировании по месту
    * <wiTag page=6>
    * @param {$ws.proto.EventObject} Дескриптор события.
    * @param {$ws.proto.Record} record Запись, которую изменяли (та, что пришла от метода чтения).
    * @param {String} columnField Имя столбца записи, который поменяли.
    * @param {String} columnName Имя колонки браузера, которую поменяли.
    * @param {String} columnValue Новое значение столбца.
    * @param {String} oldColumnValue Старое значение столбца.
    * @example
    * <pre>
    *    dataView.subscribe('onFieldChange', function(event, record, columnField, columnName, columnValue, oldColumnValue){
    *       if(columnName === "Цена")
    *          record.set('Сумма', record.get("Количество")*columnValue);
    *    });
    * </pre>
    */

   /**
    * @event onAfterRecordsSave По завершению сохранения в редактировании по месту, срабатывает вне зависимости от того,
    * была при сохранении ошибка или нет.
    * <wiTag page=6>
    * @param {$ws.proto.EventObject} eventObject  - Описание в классе $ws.proto.Abstract
    * @param {Object} error || result - либо результат выполнения сохранения, либо ошибка, возникшая при сохранении
    * @example
    * <pre>
    *    dataView.subscribe('onAfterRecordsSave', function(event, result){
    *       if (result && result.message) {
    *           $ws.single.ioc.resolve('ILogger').log('AtPlaceEdit-plugin', 'Во время сохранения произошла ошибка: ' + result.message);
    *       }
    *    });
    * </pre>
    */
   /**
    * @event onBeforeSave Перед сохранением по месту
    * происходит перед сохранением записи на БЛ, т.е. перед вызовом Записать
    * <wiTag page=6>
    * @param {$ws.proto.EventObject} eventObject  - Описание в классе $ws.proto.Abstract
    * @param {$ws.proto.Record} record - Редактируемая записи. Замечание: это не та запись, которая лежит в выборке, это запись, вычитанная/созданная с БЛ.
    * @return {Boolean|Array|*} Если передать:
    * <ol>
    * <li>false - Сохранение записи не вызовется.</li>
    * <li>$ws.proto.Deferred - считаем, что разработчик сам вызывает сохранение, поэтому ждем завершения переданного результата и перезагружаем реестр.</li>
    * <li>Любой другой тип данных - запись сохранится на БЛ стандартным способом.</li>
    * </ol>
    * @example
    * <pre>
    *    dataView.subscribe('onBeforeSave', function(event, record){
    *       if (record.get('Завершено')) {
    *           event.setResult(false);
    *           $ws.helpers.alert("Нельзя сохранять завершенный документ.", {}, this);
    *       }
    *    });
    * </pre>
    */
   $withoutCondition: ['_checkEditAtThePlace', '_mapColumns'],
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {Boolean} Созавать или нет новую запись в пустой таблице
             * <wiTag group="Управление" class=TableView page=6>
             * Будет ли создана новая запись при редактировании с помощью шаблона в таблице без записей
             * @group Edit At Place
             */
            addRecordInEmptyTable: true,
            /**
             * @cfg {Boolean} Использовать только редактирование по месту
             * <wiTag group="Управление" class=TableView page=6>
             * Запрещает редактирование записей с помощью диалога.
             * При этом возможно создание записей при помощи указанного диалога редактирования.
             * @group Edit At Place
             */
            editAtThePlaceOnly: false,
            /**
             * @cfg {String} Шаблон редактирования по месту
             * <wiTag group="Управление" page=6>
             * Использовать для редактирования по месту указанный шаблон вместо отрисовки полей по умолчанию.
             * @editor ExternalComponentChooser
             * @group Edit At Place
             */
            editAtThePlaceTemplate: '',
            /**
             * @cfg {Boolean} Использовать добавление по месту
             * <wiTag group="Управление" class=TableView page=6>
             * Включает режим добавления записей по месту.
             * При этом добавление записей с помощью диалога невозможно.
             * @group Edit At Place
             */
            allowAddAtThePlace: false,
            /**
             * @cfg {String} Текст ссылки добавления записи по месту
             * <wiTag group="Управление" page=6>
             * @group Edit At Place
             */
            atPlaceLinkText: 'Новая запись',
            /**
             * @cfg {String} Текст ссылки добавления папки по месту
             * <wiTag group="Отображение" page=6>
             * @group Edit At Place
             */
            atPlaceBranchLinkText: 'Новая папка',
            /**
             * @cfg {String} Тип подсветки редактирования по месту
             * @variant simple Устанавливается по-умолчанию для простого редактирования по месту. Представляет собой просто обводку ячеек при наведении, т.е. визуальную эмуляцию полей ввода. Может быть сменен на complex указание класса ws-browser-complex-edit на контейнере.
             * @variant complex Устанавливается по-умолчанию для сложного редактирования по месту. Представляет собой подчеркивание всех полей строки пунктирной линией снизу. Может быть сменен на simple указанием класса ws-browser-simple-edit на контейнере.
             * <wiTag page=6>
             */
            renderStyle: ''
         }
      },
      _editAtPlaceField: undefined,          //Поле для смены значения в редактировании по месту
      _editAtPlaceRecord: undefined,         //Запись, которая последней редактировалась по месту
      _editAtPlaceTimer: undefined,          //Таймер сохранения записи
      _editAtPlaceChanges: false,            //Имеются ли изменения в редактировании по месту - если да, то мы должны перечитать браузер по окончании процесса
      _editAtPlaceCell: undefined,           //Ячейка, внутри которой происходит редактирование по месту
      _editAtPlaceFocusCallback: undefined,  //Обработчик потери фокуса
      _editAtPlaceCellIndex: undefined,      //Индекс текущей редактируемой колонки
      _editAtPlaceValidationErrors: 0,       //Количество ошибок валидации в текущей строке. Не сохраняем запись, пока не обнулим
      _editAtPlaceValidationMap: {},         //Ассоциативный массив с номерами колонок, не прошедшими валидацию
      _editAtPlaceWithValidationError: false,//Редактируем ли мы сейчас ячейку с ошибкой валидации
      _editAtPlacePreviousValue: undefined,  //Значение в колонке записи до редактирования по месту
      _addAtPlace: false,                    //Флаг того, что сейчас идёт добавление по месту
      _addAtPlaceRow: undefined,             //Строка, для которой сейчас применяется добавление по месту
      _addAtPlaceRecordId: undefined,        //Идентификатор записи, которая была создана добавлением по месту
      _addAtPlaceRecord: undefined,          //Запись, которая сейчас используется в добавлении по месту
      _addAtPlaceLinkRow: undefined,         //Строка с ссылкой добавления по месту
      _editAtPlaceRecordArea: null,          //Область редактирования по месту записи шаблоном
      _firstEditAtPlaceColumn: '',           //Имя первой колонки, редактируемой по месту
      _nextEditFieldId: '',                  //Идентификатор поля в шаблоне редактирования по месту, на которое нужно встать при переключении кнопками вверх/вниз
      _fieldTypesForEdit: {
         'Число целое': 'Field:FieldInteger',
         'Число вещественное': 'Field:FieldNumeric',
         'Деньги': 'Field:FieldMoney',
         'Дата': 'Field:FieldDate',
         'Дата и время': 'Field:FieldDate',
         'Время': 'Field:FieldDate',
         'Логическое': 'Field:FieldCheckbox',
         'Строка': 'Field:FieldString',
         'Текст': 'Field:FieldText',
         'Перечисляемое': 'Field:FieldDropdown',
         'Флаги': 'Area:GroupCheckBox'
      },
      _disabledEditCells: {},                //Ключи записей, у которых выключено редактирование по месту. Если внутри есть объект, то там будуту названия колонок, для которых выключено редактирование по месту
      _allowEditAtThePlace: undefined,       //используется ли редактирование по месту
      _rowTemplates: [undefined, undefined], //Шаблоны для создания строк, нулевой - для листа, первый - для папки
      _editCellsCollection: {},
      _waitDestroy: undefined,
      _isUserCancelled: false,
      _editAtPlaceButtons: false,
      _saving: false,                         // идет ли сейчас сохранение записи, не запускаем новое сохранение, если сейчас сохранение идет
      _tempTemplate: false,
      _isComplexRenderStyle: undefined,
      _editedColumnIndex: undefined,
      _editedRecordKey: undefined
   },
   $condition: function(){
      if (this._allowEditAtThePlace === undefined) {
         return true;
      }
      return this._allowEditAtThePlace;
   },
   $constructor: function(){
      this._publish('onBeforeEditColumn', 'onFieldChange', 'onBeforeSave', 'onAfterRecordsSave');
      this._checkRenderStyle();
      if(this.isHierarchyMode()){
         //Если браузер иерархический, то проверям его параметры редактирования (5 возможных)
         this.subscribe('onAfterRender', this._afterRender);
         //Для дерева и иерархического браузера нарисовать ссылку для добавления записи по месту
         if(this._options.display.allowAddAtThePlace){
            this.subscribe('onAfterRender', this._afterRenderHandler);
            if(this.isTree()){
               //в дереве при открытии папки перерисовывается только ее содержимое и не стреляет onAfterRender, стреляет onFolderOpen
               this.subscribe('onFolderOpen', this._afterRenderHandler);
            }
         }
      }
      if (this._columnMap.length > 0) {
         this._checkEditAtThePlace();
      }
      if (this._options.display.editAtThePlaceOnly) {
         delete this._menuButtons.edit;
      }
      this.subscribe('onDestroy', this._editTdDestroy.bind(this));
      if (this._options.display.rowOptions) {
         this.subscribe('onRowOptions', this._onRowOptions.bind(this));
      }
      this._options.validators.push({
         validator: function(){
            if(Object.isEmpty(this._editAtPlaceValidationMap || {})) {
               return true;
            }
            return 'Неверно заполнено поле';
         }
      });
   },

   _collectTemplatesToPreload: function(previousResult) {
      return previousResult.concat(this._options.display.editAtThePlaceTemplate);
   },

   /**
    * Обрабатывает уничтожение контрола, если мы всё ещё ожидаем завершения редактирования по месту
    * @private
    */
   _editTdDestroy: function(){
      if(this._editAtPlaceTimer || this._editAtPlaceField){
         if(this._editAtPlaceField){
            this._editTdDestroyField();
         }
         else{
            this._editTdClearTimer();
         }
         this._editTdSaveWithConfirm();
      }
   },
   _afterRender: function(event, rowkey, keys, newRows){
      if(this._allowEditAtThePlace){
         var rows = newRows || this._body.children();
         for(var i = 0, len = rows.length; i < len; ++i){
            var   curRow = rows.eq(i),
                  key = curRow.attr('rowkey'),
                  tds =  curRow.children(),
                  isBranch  = curRow.hasClass('ws-browser-folder');
            if(!this._options.display.editAtThePlaceTemplate){
               for (var j = 0, jLen = tds.length; j < jLen; j++ ){
                  if (tds[j].hasAttribute('coldefindex')) {
                     var columnIndex = parseInt(tds[j].getAttribute('coldefindex'), 10);
                     //если у нас колонка иерархии не в списке, ее индекс -1.
                     //такую колонку в принципе нельзя редактировать по месту.
                     if(columnIndex >= 0) {
                        var column = this._columnMap[columnIndex],
                            enabled = this._checkAllowEditAtThePlace(isBranch, column.allowEditAtThePlace),
                            disabledColumns = this._disabledEditCells[key];
                        //Работает очень медленно из-за того, что сама ищет данные, которые я и так могу передать
                        // Добавляю параметр и условия, чтобы ускориться + если поле без привязки - не трогаем
                        if (!enabled && column.field !== '') {
                           this.setCellsEditEnabled(key, false, column.title, tds.eq(j));
                        } else if(disabledColumns !== undefined){
                           // проверим, что никакие колонки или всю строку не задизаблили для редактирования по месту\
                           if(Object.isEmpty(disabledColumns) || disabledColumns[column.title]){
                              this._disableEditCells(tds.eq(j));
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   },
   setAllowEdit: function(allow){
      this._body.find('tr[rowkey]').each(function (indx, elem) {
         this.setCellsEditEnabled($(elem).attr('rowkey'), !!allow);
      }.bind(this));
   },
   _afterRenderHandler: function(){
      var tableBody = this._body.get(0);

      if(this._options.display.rowOptions || !this._options.allowEdit) {
         this._body.find('tr[rowkey]').each(function (indx, elem) {
            var row = $(elem);
            if (row.find('td:last').hasClass('ws-browser-edit-column')) {
               this._rowOptionsElement.addClass('ws-browser-rowOptions-highShadow');
               return false;
            }
            if(!this._options.allowEdit){
               this.setCellsEditEnabled(row.attr('rowkey'), false);
            }
         }.bind(this));
      }
      if (!this._isUserCancelled && this._options.display.addRecordInEmptyTable && this._options.display.editAtThePlaceTemplate && !this._currentRecordSet.getRecordCount()) {
         this._createRowAtThePlace(this._currentRootId || null, false);
      } else {
         this._isUserCancelled = true;
         //Предотвращаем повторное создание строки с addAtPlace-кнопками
         if (!$(tableBody).find('.ws-browser-add-at-place-link-row').length) {
            this._createAddAtPlaceLinkRow(tableBody);
         }
      }

      this._heightChangedIfVisible();
   },
   /**
    * Действия, которые необходимо выполнить перед отрисовкой
    */
   _beforeDrawActions: function() {
      this._editAtPlaceRecord = undefined;
      this._editTdCancel();
      this._editAtPlaceValidationErrors = 0;
      this._editAtPlaceValidationMap = {};
      this._editAtPlaceChanges = false;
      this._addAtPlaceRecord = undefined;
      this._addAtPlace = false;
      //если по какой-то причине мы еще не успели сказать, что редактирование по месту завершено, то скажем об этом сейчас
      //например, если внезапно позвали reload, не дождавшись окончания редактирования по месту
      if (this._editWaitForDialog && !this._editWaitForDialog.isReady()) {
         this._editWaitForDialog.errback();
         this._editWaitForDialog = undefined;
      }
      if(!this._isUserCancelled && this._options.display.addRecordInEmptyTable && this._options.display.editAtThePlaceTemplate && this._options.display.allowAddAtThePlace){
         this._emptyDataBlock.addClass('ws-invisible');
      }
   },
   _checkRenderStyle: function(){
      if(this._isComplexRenderStyle === undefined){
         //если указали, что нужно простое отображение, то запомним,
         // иначе проверим, не указали ли сложное или у нас и правда сложное редактирование по месту
         if(!this._options.renderStyle){
            if(this._container.hasClass('ws-browser-simple-edit')){
               this._options.display.renderStyle = 'simple';
            } else if (this._container.hasClass('ws-browser-complex-edit') || this._options.display.editAtThePlaceTemplate){
               this._options.display.renderStyle = 'complex';
            } else {
               this._options.display.renderStyle = 'simple';
            }
         }
         this._isComplexRenderStyle = this._options.display.renderStyle === 'complex';
      }
   },
   _initDataSource: function(){
      if (this._allowEditAtThePlace === true) {
         this.subscribe('onKeyPressed', this._onKeyPressedOnBrowser);
      }
      this._checkRenderStyle();
      var self = this,
          parent = this._body.parent()[0],
          selector = (this._isComplexRenderStyle ? 'td' : 'td.ws-browser-edit-column') + ' > div',
          clickOnCellHandler = function(event){
             if (self.isEnabled()) {
                //если есть подписчики на событие, то поднимем его.
                if(self.hasEventHandlers('onRowClick')){
                   var cell = $(this).closest('td'),
                       row = cell.closest('[rowkey]'),
                       rowkey = row.attr("rowkey"),
                       record = rowkey && self._currentRecordSet.contains(rowkey) ?
                                self._currentRecordSet.getRecordByPrimaryKey(rowkey) : undefined,
                       cellIndex = cell.attr("coldefindex") ? parseInt(cell.attr("coldefindex"), 10) : undefined,
                       tableHeadName = undefined,
                       rowColumnName = undefined;
                      if(cellIndex !== undefined && self._columnMap && cellIndex >= 0){
                         tableHeadName = self._columnMap[cellIndex].title;
                         rowColumnName = self._columnMap[cellIndex].field;
                      }
                   //поднимем событие на клик по ячейке
                   self._notify('onRowClick', row, record, tableHeadName, rowColumnName, event);
                }
                if(!self.isReadOnly() || self._options.display.editAtThePlaceTemplate){
                   self._onEditColumnClick(event, $(this).closest('td'));
                }
             }
             event.preventDefault();
             event.stopPropagation();
             return false;
          };
      //для случая сложного редактирования по месту подписываемся на клик по всему столбцу, если вдруг строка большая, а данных в ячейке мало
      if(this._isComplexRenderStyle){
         $('td[coldefindex]', parent).live('click', clickOnCellHandler);
      } else {
         // ловим клик по ячейке раньше таблицы
         $(selector, parent).live('click', clickOnCellHandler);
      }
      if(this._options.display.editAtThePlaceTemplate){
         // Дальше идет прекрасный код, который предназначен корректно отловить "уход" фокуса на кнопку закрытия окна,
         // так как onFocusOut в этом случае не происходит...
         var tableParent = self.getTopParent(),
               endEditBeforeClose = function(event){
                  var needSave = !self._addAtPlaceRecord || self._addAtPlaceRecord.isChanged(),
                      allowClose = true,
                      parentWindow = this;
                  //пробуем сохранить запись если она не только что созданная или изменена
                  if($ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')){
                     if (needSave) {
                        self._editAreaSaveRecord.apply(self);
                     } else if(self._addAtPlaceRecord) {
                        self._isUserCancelled = true;
                        self._editAtPlaceValidationErrors = 0;
                        allowClose = false;
                        self._addEditWaitForDialog();
                        self._addAtPlaceCancel();
                        self._editAtPlaceRecord = undefined;
                        self._complexEditAtPlaceDestroyArea();
                        (self._editWaitForDialog || new $ws.proto.Deferred().callback()).addBoth(function(){
                           parentWindow.sendCommand('ok');
                        });
                     }
                  }
                  allowClose = allowClose && (!self._editAtPlaceValidationErrors || !needSave);
                  //позволяем закрывать диалог/панель редактирования либо если нет ошибок, либо если запись добавлена и не изменена
                  allowClose = event.getResult() !== undefined && allowClose ? event.getResult() : allowClose;
                  if(event instanceof $ws.proto.EventObject){
                     event.setResult(allowClose);
                  }
                  return allowClose;
               };
         if (tableParent) {
            // закроем все лазейки для закрытия панели/диалога. Спасибо Виктору Тюрину за переделку механизма работы методов hide и close
            // очередные правки Вити Тюрина и теперь сделаем только через событие, ибо ни один из методов по клику на кнопку закрыти панели/диалога не вызывается в принципе
            if ($ws.helpers.instanceOfModule(tableParent, 'SBIS3.CORE.TemplatedAreaAbstract')) {
               tableParent.subscribe('onBeforeClose', endEditBeforeClose);
            }
         }
      }
   },
   _checkMoveRowOptions: function(){
      return (!$ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea') || this._allowEditAtThePlace === undefined);
   },
   _deleteEditButton: function(buttons){
      buttons = buttons || [];
      if(buttons && this._options.display.editAtThePlaceOnly){
         for(var i = 0, l = buttons.length; i < l; i++){
            if(buttons[i][0] === 'Редактировать (F3)'){
               buttons.splice(i,1);
               break;
            }
         }
      }
      return buttons;
   },
   _getRowOptions: function(actions){
      this._deleteEditButton(actions);
   },
   _rowOptionsFilterConcat: function(filter){
      var hasEdit = false;
      if(this._options.display.editAtThePlaceOnly && !this._selectMode){
         for(var i = 0, l = filter.length; i < l; ++i){
            if(filter[i] === 'edit'){
               hasEdit = true;
               break;
            }
         }
         if (!hasEdit) {
            filter.push('edit');
         }
      }
      return filter;
   },
   _initActionsFlags: function(){
      if(!this._options.display.readOnly && this._options.display.allowAddAtThePlace){
         var self = this;
         if(!this._actions.addItem){
            this._actions.addItem = function() {
               self._createRowAtThePlace(self._currentRootId, false);
            };
         }
         if(!this._actions.addFolder){
            this._actions.addFolder = function() {
               self._createRowAtThePlace(self._currentRootId, true);
            };
         }
         if(!this._actions.edit && !this._options.editDialogTemplate) {
            this._actions.edit = this._actionEdit.bind(this);
         }
      }
   },
   /**
    * Возвращает признак доступности редактирования по месту
    * @param {String} [recordId] Идентификатор запись
    * @param {Object} [filter] фильтр для инициализации новой записи
    * @param {Boolean} [isBranch] Что редактируем: лист или узел
    * @param {Boolean} [parentId] Раздел записи
    */
   _checkShowDialog: function(recordId, filter, isBranch, parentId, controlResult){
      //не дадим запуститься новому редактированию только если есть ошибки в текущем.
      // если пытаются добавить запись по месту или иначе, то сначала завершим текущее, но после обязательно продолжим начатое
      if(this._editAtPlaceValidationErrors || this._editAtPlaceField && (!this._addAtPlace || recordId === undefined && this._options.allowAddAtThePlace)){  // не добавление по месту
         return true;
      }
      //если у нас сложное редактирование по месту и предыдущую запись не изменяли, то даем спокойно переключиться на другую запись
      if(this._editAtPlaceRecordArea && this._editAtPlaceRecord && this._editAtPlaceRecord.isChanged()){
         return true;
      }
      if(recordId === undefined){
         if(this._options.display.allowAddAtThePlace && this._options.allowAdd){
            this._createRowAtThePlace(parentId || null, isBranch, filter);
            return true;
         }
      } else if(this._allowEditAtThePlace && this._options.allowEdit &&
            !(isBranch === true && this._options.editBranchDialogTemplate || this._options.editDialogTemplate)){
         this.editCell(recordId, this._firstEditAtPlaceColumn);
         return true;
      }
      return controlResult || (recordId !== undefined && this._options.display.editAtThePlaceOnly);
   },
   /**
    * Обработка нажатия на колонку с редактированием по месту
    * @param {Object} event Объект события
    * @param {jQuery} td ячейка, по которой кликнули
    */
   _onEditColumnClick: function(event, td) {
      var isBranch = td.closest('tr[rowkey]').hasClass('ws-browser-folder');
      if (this._options.allowEdit && (!this._options.display.editAtThePlaceTemplate || !isBranch)) {
         this._onClickHandler(event);
         this._startEditTd(td);
         event.stopImmediatePropagation();
         event.preventDefault();
         return false;
      }
   },
   _startEditAtPlace: function(record){
      var self = this;
      this._runInBatchUpdate('startEditAtPlace', function() {
         var result = new $ws.proto.Deferred(),
             areaId = this.getId() + record.getKey(),
             editTemplateContainer = $('<div class="ws-hidden" id="' + areaId + '" />'),
             context = new $ws.proto.Context();
         editTemplateContainer.data('fieldIndex', self._editedColumnIndex);
         $('html').append(editTemplateContainer);
         (function(){
            if($ws.helpers.instanceOfModule(self._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')){
               return self._endComplexEditAtPlace(true, true);
            } else {
               return new $ws.proto.Deferred().callback();
            }
         })().addCallback(function(){
            if(self._disabledEditCells[record.getKey()] !== false){
               if (!self.isActive()) {
                  self.setActive(true);
               }
               context.setContextData(record);
               context.setPrevious(self.getLinkedContext());
               var instance = new RecordArea({
                  opener: self,//Здесь нужно указать opener, чтобы, если из этой шаблонной области откроют плавающую панель, и браузер сам лежит в плав. панели,
                               //то родителская панель браузера была бы достижима по цепочке опенеров и парентов, и плавающие панели, открытые из
                               //этой шаблонной области, считались бы дочерними по отношению к плавающей панели, в которой лежит браузер.
                               //Тогда при переходе фокуса с дочернего контрола родительской плав. панели на дочернюю плав. панель,
                               // или другой дочерний контрол в создаваемой шаблонной области, автозакрытия родительской плав. панели не произойдёт, потому что
                               // она увидит, что фокус ушёл на элемент, которому она неявно является opener-ом. Подробнее - см. код обработчика onFocusOut в классе RecordFloatArea.
                  template: self._tempTemplate || self._options.display.editAtThePlaceTemplate,
                  parent: self.getParent(),
                  horizontalAlignment: 'Stretch',
                  verticalAlignment: 'Top',
                  autoWidth: false,
                  autoHeight: false,
                  context: context,
                  element: editTemplateContainer,
                  isNewRecord: self._addAtPlace,
                  readOnly: self._options.display.readOnly,
                  enabled: true,
                  allowChangeEnable: false,
                  page: false,
                  reports: {},
                  handlers : {
                     onReady: function(){
                        self._editAtPlaceRecord = record;
                        self._editAtPlaceRecordArea = this;
                        var tr = self._body.find('tr[rowkey="' + record.getKey() + '"]:first'),
                        //получим количество колонок точное, с учетом колонки под флаг отметки записи
                            colspan = self._body.parent().find('col').length,
                            childControls = this.getChildControls(),
                            l = childControls.length,
                            hasFields = false;
                        //это очень лютый костыль для сложного редактирования по месту. Пока было замечено только на ПиВах, повторяется очень не стабильно и почти всегда на боевом
                        //повторяется у разных людей, почему-то в шаблон сложного редактирования не строятся контролы, мы получаем его пустой. Это попытка это обойти.
                        //мы смотрим есть ли внутри хотя бы одно поле ввода, и если вдруг нет, то перестраиваем шаблон совсем
                        if(l > 0){
                           for(var i = 0; i <= l; i++){
                              if($ws.helpers.instanceOfModule(childControls[i], 'SBIS3.CORE.FieldAbstract') || $ws.helpers.instanceOfModule(childControls[i], 'SBIS3.CORE.FieldLink')){
                                 hasFields = true;
                                 break;
                              }
                           }
                        }
                        if(hasFields){
                           self.setActiveRow(tr);
                           tr.html($('<td colspan = "' + colspan + '"/>').append(editTemplateContainer));
                           editTemplateContainer.removeClass('ws-hidden');
                           tr.addClass('ws-browser-edit-row');

                           self._editAreaInitControls();
                           if(self._isComplexRenderStyle && !self.isReadOnly()){
                              self._createEditAtPlaceButtons(this.getContainer());
                              self._editAtPlaceButtons.removeClass('ws-hidden');
                           }
                           $ws.core.setCursor(true);

                           self.recalcBrowserOnDOMChange();
                           //после пересчета размеров прибьем активную строку сразу гвоздями, чтобы никуда не делась
                           self._toggleFixHover(true);
                        } else {
                           self._editTdCancel();
                           self._createRowAtThePlace(this._currentRootId || null, false);
                        }
                        result.callback();
                     },
                     onKeyPressed: $.proxy(self._editAreaKeyPressed, self),
                     onDestroy: function(){
                        self._tempTemplate = false;
                        self._editAreaDestroyed = true;
                        if (self._waitDestroy && self._waitDestroy instanceof  $ws.proto.Deferred && !self._waitDestroy.isReady()) {
                           self._waitDestroy.callback();
                           self._waitDestroy = undefined;
                        }
                        if(self._editAtPlaceButtons){
                           self._editAtPlaceButtons.addClass('ws-hidden');
                        }
                     },
                     onAfterShow: function(){
                        //по наставлению Вити Тюрина переношу код установки активности шаблона сюда, по словам Вити тут уже точно всегда все просчеты завершились и ничто перебить уже не может
                        if (!(this.isActive() || this.hasActiveChildControl())) {
                           // если область не активна по какой-то причине, например, если предыдущая область редактирования разрушилась позже создания этой,
                           // то сделаем нашу текущую область активной
                           var activeChild = this.getActiveChildControl();
                           this.setActive(true);
                           if(activeChild instanceof $ws.proto.Control){
                              activeChild.setActive(true);
                           }
                        }
                     },
                     onBatchFinished: function(){
                        self.recalcBrowserOnDOMChange();
                        // зафиксируем активную строку после пересчета размеров таблицы, так как иначе этот пересчет все сбросит
                        // и после вызова всех пользовательских обработчиков
                        self._toggleFixHover(true);
                     }
                  }
               });

               self._editAtPlaceRecordArea = instance;
               instance.getReadyDeferred().addErrback(function(error){
                  //Если при загрузке шаблона произошла ошибка, то закончим редактирование по месту
                  self.endEditAtThePlace();
                  return error;
               });
               instance.detectNextActiveChildControl = function(){
                  if(self._nextEditFieldId){
                     try{
                        this.getChildControlById(self._nextEditFieldId).setActive(true, false);
                        self._nextEditFieldId = '';
                     }catch(e){}
                     return true;
                  } else if(this.isNewRecord() && !self._currentRecordSet.getRecordCount() && !self._isUserCancelled){
                     var tableParent = self.getTopParent();
                     if (tableParent) {
                        tableParent.setActive(true);
                     }
                     return true;
                  } else {
                     return $ws.proto.RecordArea.superclass.detectNextActiveChildControl.apply(this, arguments);
                  }
               };
               instance.getZIndex = function(){
                  var parent = self.getTopParent();
                  if (parent !== null && typeof(parent.getZIndex) == 'function') {
                     return parent.getZIndex();
                  } else {
                     return $ws.proto.RecordArea.superclass.getZIndex.apply(this, arguments);
                  }
               };
               self._editAreaDestroyed = false;
            } else {
               //если что-то пошло не так, то снимем индикатор загрузки
               $ws.core.setCursor(true);
            }
         });
         return result;
      });
   },
   _toggleFixHover: function(fix){
      if(this._isComplexRenderStyle){
         if(this._addAtPlaceRow) {
            this._addAtPlaceRow.toggleClass('ws-browser-item-over', fix);
         }
         var activeRow = this.getActiveRow(),
             setSelectionOnActiveRow = fix && !this._addAtPlace;
         if(activeRow){
            activeRow.toggleClass('ws-browser-item-over', setSelectionOnActiveRow);
         }
         this._data.toggleClass('ws-browser-hover', !fix);
         if(!this._options.useHoverRowAsActive){
            if(activeRow){
               activeRow.toggleClass('ws-browser-row-hover', setSelectionOnActiveRow);
            }
            this._data.toggleClass('ws-browser-active-hover', fix);
         }
         if(this._addAtPlace){
            this._addAtPlaceRow.toggleClass('ws-browser-item-over', fix);
         }
         if(this._options.display.showSelectionCheckbox){
            this._container.find('.ws-browser-checkbox').toggleClass('ws-invisible', fix);
         }
      } else{
         this._data.find('.ws-browser-editable-row').toggleClass('ws-browser-row-hover', fix);
      }
      this._useKeyboard = fix;
      if (fix) {
         this._hideRowOptions();
      }
   },
   _onRowOptions: function(event, record){
      if (this._options.display.editAtThePlaceTemplate) {
         if (this._editAtPlaceRecord && record.getKey() == this._editAtPlaceRecord.getKey()) {
            event.setResult(false);
         }
      }
   },
   /**
    * <wiTag group="Управление" class=TableView page=6>
    * Открывает на редактирование запись, с указанным первичным ключом.
    * Если есть редактируемая по месту запись, от отменяет редактирование по месту.
    * Если передан ключ редактируемой по месту записи или не передан вообще, то откроет на редактирование
    * в диалоге/панели эту запись, при этом перенеся все внесенные изменения на диалог/панель.
    * @param {String} [rowkey] Ключ записи, которую нужно открыть на редактирование в диалоге/панели.
    * @group Edit At Place
    * @example
    * <pre>
    *    this.editRecordInFullMode("1524,Номенклатура");
    * </pre>
    */
   editRecordInFullMode: function(rowkey){
      var self = this,
          editDeferred;
      if(this._editAtPlaceRecord && ( this._editAtPlaceRecord.getKey() + '' === rowkey + '' || rowkey === undefined)){
         var changes = {},
             changedFields = this._editAtPlaceRecord.getChangedColumns();
         $ws.helpers.forEach(changedFields, function(value, key){
            changes[key] = self._editAtPlaceRecord.get(key);
         });
         editDeferred = new $ws.proto.Deferred().addCallback(function(dialog){
            dialog.getLinkedContext().setValue(changes);
         });
      }
      this._editTdCancel();
      this.sendCommand('edit', rowkey, editDeferred);
   },
   _editAreaKeyPressed: function(event, e){
      if(Array.indexOf([$ws._const.key.enter, $ws._const.key.esc, $ws._const.key.up, $ws._const.key.down], e.which) !== -1){
         switch(e.which){
            case $ws._const.key.enter:
               this._editAreaKeyEnter();
               break;
            case $ws._const.key.esc:
               var self = this;
               if(this._addAtPlace){
                  this._editTdCancelWithReload();
               } else {
                  this.reload().addCallback(function(result){
                     self._editTdCancel();
                     return result;
                  });
               }
               break;
            case $ws._const.key.up:
               this._editNextRow(false, false);
               break;
            case $ws._const.key.down:
               this._editNextRow(true, false);
               break;
         }
         e.stopPropagation();
         e.preventDefault();
         event.setResult(false);
      }
   },
   /*
    * Сохраняет новую запись, происходит при нажатии кнопки применения изменений и нажатии Enter
    * @return {$ws.proto.Deferred} асинхронный процесс сохранения данных
   */
   _editAreaKeyEnter: function(){
      var rowkey = this._editAtPlaceRecord && this._editAtPlaceRecord.getKey();
      if(!this._saving || this._saving !== rowkey){
         this._saving = rowkey;
         var self = this,
             createNext = self._addAtPlace && !this._container.hasClass('ws-browser-noAutoAdd'),
             isBranch = self._editAtPlaceRecord && self._editAtPlaceRecord.isBranch();
         return this._editAreaSaveRecord(true, true).addCallback(function(res){
            if(createNext){
               self._createRowAtThePlace(self._currentRootId, isBranch);
            }
         }).addBoth(function(){
            self._saving = false;
         });
      }
   },
   _keyTabOnLastField: function(event, e){
      if(e.which == $ws._const.key.tab){
         this._editNextRow(true, true);
         e.stopPropagation();
         e.preventDefault();
         event.setResult(false);
      }
   },
   /*
    * переходит к редактированию следующей/предыдущей строки по месту
    * @param {Boolean} [editNextRow] следующую или предыдущую запись редактировать
    * @param {Boolean} [afterTabKey] обрабатывается ли в данный момент нажатие tab
   */
   _editNextRow: function(editNextRow, afterTabKey){
      var self = this,
          editRow = this._editAtPlaceRecordArea.getContainer().closest('tr.ws-browser-table-row');
      self._editAreaSaveRecord(false, self._addAtPlace).addCallback(function(){
         var nextRow = editRow[editNextRow === false ? 'prev' : 'next']('tr.ws-browser-table-row'),
             columnName;
         if(nextRow.length && !nextRow.hasClass('ws-browser-add-at-place-link-row')){
            if(!self._isComplexRenderStyle){
               columnName = self._columnMap[self._getCellIndex(nextRow.find('.ws-browser-edit-column:first'))].title;
            }
            self.editCell(nextRow.attr('rowkey'), columnName);
         } else {
            self._nextEditFieldId = '';
            if (afterTabKey === true && self._options.display.allowAddAtThePlace && !self._container.hasClass('ws-browser-noAutoAdd')) {
               self._createRowAtThePlace(self._currentRootId, false);
            } else {
               if (self._options.reloadAfterChange || self._addAtPlace) {
                  self.reload();
               } else {
                  self.refresh();
               }
            }
         }
      });
   },
   _editAreaInitControls: function(){
      if($ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')){
         var childs = this._editAtPlaceRecordArea.getChildControls(),
             self = this,
             lastFieldNumber, maxTabindex, fieldTabindex,
             checkControl, parent;
         for(var i = 0, l = childs.length; i < l; i++ ){
            //ловим уход фокуса со всего, вообще совсем со всего
            childs[i].subscribe('onFocusOut', function(event, focus, nextFocusControl){
               var fieldName = this.getName();
               if(!self._editAreaDestroyed && self._editAtPlaceRecord && self._editAtPlaceRecord.hasColumn(fieldName) && self._editAtPlaceRecord.isChanged(fieldName)){
                  self._editAtPlaceCellIndex = self._columnIndex(fieldName);
                  if (self._editAtPlaceCellIndex !== -1) {
                     self._editTdFieldValueChange();
                  }
               }
               var
                  opener = nextFocusControl && nextFocusControl.getTopParent() && nextFocusControl.getTopParent().getOpener(),
                  //Поле ввода может быть inputField у поля связи (если this - поле связи) или просто this
                  inputField = $ws.helpers.instanceOfModule(this, 'SBIS3.CORE.FieldLink') && this.getInputField() || this;
               //Случается, что focus уходит с поля связи на его же строку, тогда ничего делать не надо
               //+ если фокус уходит с поля связи на его диалог выбора записи, то тоже не валидируем
               //Проверим корректный ли opener
               if (inputField == nextFocusControl ||
                   nextFocusControl && nextFocusControl.getOpener && nextFocusControl.getOpener() == inputField ||
                   opener && (opener === this || opener.getParentByClass($ws.proto.RecordArea) === self._editAtPlaceRecordArea)) {
                  return true;
               }

               //TODO: сделать нормальный проход по цепочке парентов и опенеров, как в RecordFloatArea._getOnFocusOutHandler
               //TODO: отрефакторить это все нафиг
               parent = nextFocusControl && nextFocusControl.getTopParent();
               if (parent instanceof $ws.proto.AreaAbstract && parent.getOpener() instanceof $ws.proto.Control && parent !== self.getTopParent()) {
                  checkControl = parent.getOpener();
               } else {
                  checkControl = nextFocusControl;
               }

               if (!self._editAreaDestroyed) {
                  if (!nextFocusControl ||
                      (nextFocusControl !== self && checkControl &&
                      checkControl !== self && //При создании панели редактирования мы указываем опенером браузер, поэтому он может оказаться checkControl-ом,
                                               // если фокус уходит на дочерний контрол панели редактирования. Тогда закрывать панель не нужно.
                      checkControl !== self._editAtPlaceRecordArea && // при показе ошибки мы указываем опенером область редактирования по месту для корректной работы фокуса...
                      checkControl.getParentByClass($ws.proto.RecordArea) !== self._editAtPlaceRecordArea/* && checkControl.getTopParent() === self.getTopParent()*/))
                  {
                     self._editAtPlaceValidationErrors = (self._editAtPlaceRecordArea.validate(false) ? 0 : 1);
                     if ($ws.helpers.instanceOfModule(checkControl, 'SBIS3.CORE.LoadingIndicator')) {
                        //self._editAtPlaceValidationErrors = 0;
                     } else if (!self._addAtPlace || self._addAtPlaceRecord.isChanged()) {
                        self._editAreaSaveRecord.apply(self);
                     } else if (self._currentRecordSet.getRecordCount() || self._isUserCancelled || self._editWaitForDialog instanceof $ws.proto.Deferred){
                        self._editAtPlaceValidationErrors = 0;
                        if (self._addAtPlace && self._addAtPlaceRecord) {
                           self._addAtPlaceCancel();
                        }
                     }
                  }
               }
            });
            // у автодополнения по нажатию enter сохраняем запись
            if($ws.proto.Suggest && childs[i] instanceof $ws.proto.Suggest){
               childs[i].subscribe('onKeyPressed', function(event, e){
                  if (e.which == $ws._const.key.enter) {
                     event.setResult(false);
                  }
               });
            }
            // у полей находим последнее поле, чтобы обработать в нем нажатие tab, и у всех полей запоминаем, котором нажали кнопку вверх/вниз
            // чтобы встать в нужное поле после начала редактирования следующей строки
            if($ws.helpers.instanceOfModule(childs[i], 'SBIS3.CORE.FieldAbstract') || $ws.helpers.instanceOfModule(childs[i], 'SBIS3.CORE.FieldLink')){
               childs[i].subscribe('onKeyPressed', function(event, e){
                  //при начале ввода, если были ошибки валидации, то снимаем отметку невалидности со всех полей
                  if(self._editAtPlaceValidationErrors !== 0){
                     self.clearMark();
                     var childControls = self._editAtPlaceRecordArea.getChildControls();
                     for(var i = 0, l = childControls.length; i < l; i++){
                        if(typeof childControls[i].clearMark === 'function'){
                           childControls[i].clearMark();
                        }
                     }
                  }
                  if(!self._currentRecordSet.getRecordCount() && !self._isUserCancelled) {
                     self._addEditWaitForDialog.apply(self);
                  }
                  if(!self._waitDestroy) {
                     self._waitDestroy = new $ws.proto.Deferred();
                     self.getTopParent().addPendingOperation(self._waitDestroy);
                  }
                  if (e.which == $ws._const.key.up || e.which == $ws._const.key.down) {
                     self._nextEditFieldId = this.getId();
                  }
               });
               fieldTabindex = childs[i].getTabindex();
               if(fieldTabindex && (maxTabindex === undefined || fieldTabindex >= maxTabindex)){
                  maxTabindex = fieldTabindex;
                  lastFieldNumber = i;
               }
            }
         }
         if (lastFieldNumber !== undefined && childs[lastFieldNumber] instanceof $ws.proto.Control) {
            childs[lastFieldNumber].subscribe('onKeyPressed', $.proxy(self._keyTabOnLastField, self));
         }
         if(this._addAtPlace){
         //при изменении записи добавим ожидание завершения редактирования
         //для редактирования добавляется в другом месте, а для создания чуть иначе, из-за удаления созданной записи
            this._editAtPlaceRecord.subscribe('onFieldChange', $.proxy(self._addEditWaitForDialog, self));
         }
      }
   },
   /*
    * возвращает содержимое ячейки
    * @param {Boolean} forseSave сохранять даже если  не было изменений
    * @param {Boolean} reload требуется ли перезагрузка после сохранения
   */
   _editAreaSaveRecord: function(forceSave, reload){
      var self = this,
          rowkey = this._editAtPlaceRecord && this._editAtPlaceRecord.getKey();
      if(forceSave || this._saving === false || this._saving !== rowkey){
         this._saving = rowkey;
         self._editAtPlaceChanges = self._editAtPlaceRecord && (forceSave || self._editAtPlaceRecord.isChanged());
         if(self._editAtPlaceRecordArea.validate()){
            self._editAtPlaceValidationErrors = 0;
            return (function(){
               if (self._editAtPlaceChanges || self._addAtPlace) {
                  var saving = new $ws.proto.Deferred().addCallback(function(){
                     return self._editTdSaveRecord();
                  });
                  self._editAtPlaceRecordArea.waitAllPendingOperations(saving);
                  return saving;
               } else {
                  return new $ws.proto.Deferred().callback();
               }
            })().addBoth(function(result){
               self._saving = false;
               return result;
            }).addCallback(function(){
               self._editAreaDestroyed = true;
               return self._endComplexEditAtPlace(true, true, reload);
            });
         } else {
            self._editAtPlaceValidationErrors = 1;
            self._saving = false;
            if (self._editWaitForDialog && !self._editWaitForDialog.isReady()) {
               self._editWaitForDialog.errback();
               self._editWaitForDialog = undefined;
            }
            //если мы ждем еще и разрушения области, до скажем, что все упало, ибо потом когда будет нужно добавим этот деферред в ожидание
            if (self._waitDestroy && !self._waitDestroy.isReady()) {
               self._waitDestroy.errback();
               self._waitDestroy = undefined;
            }
            return new $ws.proto.Deferred().errback();
         }
      } else {
         return new $ws.proto.Deferred().errback();
      }
   },
   _moveChanges: function(record, moveValues){
      var key = record.getKey(),
          recordFromList = this._currentRecordSet.contains(key) ? this._currentRecordSet.getRecordByPrimaryKey(key) : false,
          columns = record.getColumns(),
          columnName, colDef, columnIdx;
      for(var i = 0, l = columns.length; i < l; i++){
         columnName = columns[i];
         columnIdx = this._columnIndex(columnName);
         if(columnIdx !== -1){
            colDef = this._columnMap[columnIdx];
            this._notify('onFieldChange', record, colDef.field, colDef.title, record.get(colDef.field), recordFromList && recordFromList.hasColumn(colDef.field) ? recordFromList.get(colDef.field) : null);
         }
         if (recordFromList && recordFromList.hasColumn(columnName) && moveValues) {
            recordFromList.set(columnName, record.get(columnName));
         }
      }
   },
   _endComplexEditAtPlace: function(moveChanges, validate, reload){
      var result = new $ws.proto.Deferred();
      if($ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea') && !this._editAtPlaceRecordArea.isDestroyed()){
         if(validate !== true || this._editAtPlaceRecordArea.validate(false)){
            var editedRecord = this._editAtPlaceRecordArea.getRecord(),
                self = this;
            if (!moveChanges) {
               editedRecord.rollback();
            }
            this._moveChanges(editedRecord, moveChanges);
            (function(){
               if((reload !== false && self._options.reloadAfterChange && self._editAtPlaceChanges) || self._addAtPlace){
                  return self.reload();
               } else{
                  self.refresh();
                  return new $ws.proto.Deferred().callback();
               }
            })().addCallback(function(){
               self._complexEditAtPlaceDestroyArea.apply(self);
               self._editAtPlaceRecord = undefined;
               result.callback();
            });
         } else {
            result.errback();
         }
      } else {
         result.callback();
      }
      return result;
   },
   _complexEditAtPlaceDestroyArea: function() {
      this._editAreaDestroyed = true;
      if ($ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')) {
         var fieldIndex = parseInt(this._editAtPlaceRecordArea.getContainer().data("fieldIndex"), 10);
         if(this._editedColumnIndex === fieldIndex && (this._editAtPlaceRecord && this._editAtPlaceRecord.getKey() === this._editedRecordKey)){
            this._editedColumnIndex = undefined;
            this._editedRecordKey = undefined;
         }
         this._editAtPlaceRecordArea.destroy();
      }
      this._editAtPlaceRecordArea = null;
      this._toggleFixHover(false);
   },
   /**
    * прекращает всплытие события при нажатии Enter для сохранения при редактировании по месту
    */
   _onKeyPressedOnBrowser: function(event, e) {
      if (e.which === $ws._const.key.enter && this._editAtPlaceField !== null) {
         e.preventDefault();
         e.stopPropagation();
         event.setResult(false);
      }
   },
   /*
    * для столбцов имеющих редактирование по месту добавить параметр allowEditAtThePlace
    */
   _mapColumns: function() {
      this._firstEditAtPlaceColumn = '';
      this._checkEditAtThePlace();
   },
   _setEnabled: function(){
      this._checkEditAtThePlace();
      var isEditable = !this.isReadOnly() && this.isEnabled(),
          columnsCollection,
          classNameForEdit = this._isComplexRenderStyle ? 'ws-browser-border-edit' : 'ws-browser-edit-column ws-browser-editable',
          colDef = {},
          editableCell,
          disabledCells,
          isEnableForEdit,
          editableRow,
          rowkey;
      for(var i = 0, l = this._columnMap.length; i < l; i++){
         colDef = this._columnMap[i];
         if (colDef.allowEditAtThePlace) {
            columnsCollection = this._body.find('td[coldefindex="' + i + '"]');
            for(var j = 0, k = columnsCollection.length; j < k; j++){
               editableCell = $(columnsCollection[j]);
               editableRow = editableCell.closest('tr.ws-browser-table-row');
               rowkey = editableRow.attr('rowkey');
               if(this._isComplexRenderStyle){
                  editableCell.find('.ws-browser-edit-marker').toggleClass(classNameForEdit, isEditable && this._disabledEditCells[rowkey] !== true);
               } else {
                  disabledCells = this._disabledEditCells[rowkey];
                  isEnableForEdit = !(disabledCells !== undefined && (Object.isEmpty(disabledCells) || disabledCells[colDef.title] === true));
                  editableCell.toggleClass(classNameForEdit, isEditable && isEnableForEdit);
               }
            }
         }
      }
      if(this._options.display.allowAddAtThePlace){
         if(this.isEnabled() && !this.isReadOnly()){
            var tableBody = this._body.get(0);
            if (!$(tableBody).find('.ws-browser-add-at-place-link-row').length) {
               this._createAddAtPlaceLinkRow(tableBody);
            }
         } else if(this._addAtPlaceLinkRow){
            this._addAtPlaceLinkRow.remove();
         }
         this.recalcBrowserOnDOMChange();
      }
   },
   _checkEditAtThePlace: function(){
      if (this._options.display.readOnly === true) {
         this._allowEditAtThePlace = false;
      }
      this._checkRenderStyle();
      if(this._isComplexRenderStyle === false){
         var configColumns = this._options.display.columns,
               recivedColumns = this._currentRecordSet && this._currentRecordSet.getColumns(),
               columns = configColumns ? configColumns : recivedColumns,
               pkColumnIndex = recivedColumns ? this._currentRecordSet.getPkColumnIndex() : undefined;
         //если почему-то колонок нет, то проставим пустой массив
         columns = columns || [];
         this._allowEditAtThePlace = false;
         for(var i = 0, l = columns.length; i < l; i++){
            var cur = columns[i],
                field = cur.field ? cur.field : cur.title,
                fieldType = recivedColumns && recivedColumns[field] ? recivedColumns[field].type : (cur.type || null),
                allowEditColumn = false;
            if (configColumns && configColumns[i]) {
               allowEditColumn = configColumns[i].allowEditAtThePlace || false;
            }
            if (allowEditColumn) {
               if (recivedColumns && recivedColumns[field] && recivedColumns[field].index === pkColumnIndex) {
                 allowEditColumn = false;
               }
            }
            if (allowEditColumn && fieldType in {'Связь': 0, 'Файл': 0, 'Двоичное': 0, 'Символ': 0}) {
               allowEditColumn = false;
            }
            if(!this._allowEditAtThePlace && allowEditColumn){
               this._allowEditAtThePlace = true;
               if (!this._firstEditAtPlaceColumn) {
                  this._firstEditAtPlaceColumn = columns[i].title;
               }
            }
            this._columnMap[i].allowEditAtThePlace = allowEditColumn;
            this._columnMap[i].validators = columns[i].validators ? columns[i].validators : [];
            this._columnMap[i].decimals = columns[i].decimals ? columns[i].decimals : 2;
            this._columnMap[i].inputFilter = columns[i].inputFilter ? columns[i].inputFilter : undefined;
            if (this._allowEditAtThePlace && (fieldType in {'Дата': 0, 'Дата и время': 0, 'Время': 0})) {
               this._columnMap[i].maskField = columns[i].maskField ? columns[i].maskField : null;
            }
            if (this._columnMap[i].allowEditAtThePlace && !this._isComplexRenderStyle && !this.isReadOnly() && this.isEnabled()) {
               this._columnMap[i].className += ' ws-browser-edit-column ws-browser-editable';
            } else if(this._columnMap[i].allowEditAtThePlace){
               this._columnMap[i].className += ' ws-browser-mark-edit-place';
            }
         }
      } else {
         this._allowEditAtThePlace = true;
      }
   },
   /**
    * возвращает содержимое ячейки
    * @param {Object} colDef описание колонки
    * @param {$ws.proto.Record} record запись
    * @param {String} [renderResult] результат рендеринга колонки от класса DataViewAbstract
    */
   _renderTD: function(colDef, record, renderResult){
      if (this._isComplexRenderStyle) {
         var allowEdit = !this.isReadOnly() && this._options.allowEdit;
         if (allowEdit) {
            if(this._disabledEditCells[record.getKey()]) {
               allowEdit = false;
            }
         }
         if (allowEdit && !colDef.render) {
            return '<span class="ws-browser-edit-marker ws-browser-border-edit">' + renderResult + '</span>';
         }
      }
      return renderResult;
   },
   /**
    * Включает редактирование по месту для указанного элемента (ов)
    * @param {jQuery} element Ячейки, для которых нужно включить редактирование по месту
    */
   _enableEditCells: function(element){
      var self = this;
      element.each(function(number, cell){
         $(cell).addClass('ws-browser-edit-column').attr('coldefindex', self._getCellIndex($(cell)));
         $(cell).removeClass('ws-browser-mark-edit-place');
         $(cell).find('.ws-browser-edit-marker').addClass('ws-browser-border-edit');
      });
   },
   /**
    * Выключает редактирование по месту для указанного элемента (ов)
    * @param {jQuery} element Ячейки, для которых нужно выключить редактирование по месту
    */
   _disableEditCells: function(element){
      element.removeClass('ws-browser-edit-column');
      element.addClass('ws-browser-mark-edit-place');
      element.find('.ws-browser-edit-marker').removeClass('ws-browser-border-edit');
   },
   /**
    * Получить количество ошибок редактирования по месту
    * <wiTag page=6>
    * @returns {Number} - Количество ошибок валидации в редактировании по месту
    */
   getValidationErrorsCount: function(){
      return this._editAtPlaceValidationErrors;
   },
   /**
    * Включить/выключить возможность редактирования по месту.
    * <wiTag group="Управление" page=6>
    * @param {String} rowkey Первичный ключ записи.
    * @param {Boolean} enabled Включаем или выключаем.
    * @param {String} [columnName] Имя колонки, в которой меняем возможность редактирования по месту. Если не указано,
    * то влияет на всю строку.
    * @param {jQuery} [tdSet] jQuery объект, у которого ставим enabled; если не передали, то найдет сам.
    * @example
    * <pre>
    *    tableView.setCellsEditEnabled("11", false);
    *    tableView.setCellsEditEnabled("22", false, "Примечание");
    * </pre>
    */
   setCellsEditEnabled: function(rowkey, enabled, columnName, tdSet){
      var object = this._disabledEditCells[rowkey];
      if(this._isComplexRenderStyle){
         this._disabledEditCells[rowkey] = enabled;
         var row = this.findRow(rowkey);
         if(row){
            row.find('.ws-browser-edit-marker').toggleClass('ws-browser-border-edit', enabled);
         }
         return;
      }
      if(columnName !== undefined){
         var td = tdSet ? tdSet : this._findCell(rowkey, columnName);
         if(enabled){
            if(object !== undefined){
               if(Object.isEmpty(object)){
                  for(var i in this._columnMap){
                     if(this._columnMap.hasOwnProperty(i) && this._columnMap[i].title !== columnName){
                        object[this._columnMap[i].title] = true;
                     }
                  }
               }
               else{
                  delete object[columnName];
                  if(Object.isEmpty(object)){
                     delete this._disabledEditCells[rowkey];
                  }
               }
               this._enableEditCells(td);
            }
         }
         else{
            if(object === undefined || !Object.isEmpty(object)){
               if(object === undefined){
                  this._disabledEditCells[rowkey] = object = {};
               }
               object[columnName] = true;
               this._disableEditCells(td);
            }
         }
      }
      else{
         var cells = this.findRow(rowkey).find('td.ws-browser-editable');
         if(enabled){
            delete this._disabledEditCells[rowkey];
            this._enableEditCells(cells);
         }
         else{
            this._disabledEditCells[rowkey] = {};
            this._disableEditCells(cells);
         }
      }
   },
   /**
    * Начать редактирование по месту указанной ячейки.
    * <wiTag group="Управление" page=6>
    * @param {String} rowkey Ключ необходимой записи.
    * @param {String} columnName Название колонки, в которой будет происходить редактирование по месту.
    * @example
    * <pre>
    *    tableView.editCell("22", "Цена");
    * </pre>
    */
   editCell: function(rowkey, columnName) {
      if (this._options.allowEdit && (!this._isComplexRenderStyle || this._disabledEditCells[rowkey] !== false)) {
         //в режиме сложного редактирования по месту мы должны показать шаблон в любом случае, даже если покажем только в режиме только для чтения
         if(this._isComplexRenderStyle || !this.isReadOnly()){
            columnName = this._isComplexRenderStyle ? this._columnMap[0].title : columnName;
            var td = this._findCell(rowkey, columnName);
            if (td.length) {
               if (this._isComplexRenderStyle || td.hasClass('ws-browser-edit-column')) {
                  this._startEditTd(td);
                  this._moveBrowserScrollToTd(td);
               }
            } else {
               $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find cell with rowkey " + rowkey + " and column name " + columnName);
            }
         }
      }
   },
   _getCellIndex: function(td) {
      return td.attr('coldefindex') ? parseInt(td.attr('coldefindex'), 10) : td.length ? td[0].cellIndex : 0;
   },
   _addEditWaitForDialog: function(){
      if (!this._editWaitForDialog) {
         this._editWaitForDialog = new $ws.proto.Deferred();
         var dialog = this.getParentByClass($ws.proto.RecordArea) || this.getTopParent();
         if (dialog instanceof $ws.proto.AreaAbstract) {
            dialog.addPendingOperation(this._editWaitForDialog);
         }
      }
   },
   /**
    * Начинает редактировать ячейку, перед этим необходимо вычитать запись
    * @param {jQuery} td Ячейка, которая будет редактироваться
    * @param {Boolean} [doWait] нужно ли ждать завершения предыдущего редактирования
    */
   _startEditTd: function(td, doWait) {
      var self = this,
         row = td.parent(),
         rowkey = row.attr('rowkey'),
         cellIndex = self._getCellIndex(td),
         edit = function() {
            if(self._disabledEditCells[rowkey] !== false){
               $ws.core.setCursor(false);
               return $ws.helpers.callbackWrapper(function() {
                  if (self._editAtPlaceRecord && self._isIdEqual(rowkey, self._editAtPlaceRecord.getKey())) {
                     return self._editAtPlaceRecord;
                  }
                  var editableRecord = self._notify('onBeforeRead', rowkey, true);
                  if (editableRecord instanceof $ws.proto.Deferred || editableRecord instanceof $ws.proto.Record) {
                     return editableRecord;
                  } else if (rowkey == self._addAtPlaceRecordId && self._addAtPlace) {
                     return self._addAtPlaceRecord;
                  } else {
                     return self._currentRecordSet.readRecord(rowkey);
                  }
               }(), function(record) {
                  var flag = self._notify('onBeforeUpdate', record);
                  $ws.core.setCursor(true);
                  if(flag !== false){
                     if(typeof flag === 'string'){
                        self._tempTemplate = flag;
                     }
                     //в режиме только для чтения нам не надо, чтобы диалог ждал завершения редактирования, так как мы просто его отменим
                     //пользователь в этом режиме не может ничего поменять и ждать нечего,
                     //да и мы не сможем - уход фокуса ловить не откуда, так как все поля только для чтения они фокус не принимают
                     if(!self.isReadOnly()){
                        self._addEditWaitForDialog.apply(self);
                     }
                     if (self._options.display.editAtThePlaceTemplate) {
                        self._startEditAtPlace(record);
                     } else {
                        // если случилось так, что мы потеряли видимый контейнер для редактирования, то поищем его снова
                        if (td.closest('.ws-browser').length === 0) {
                           td = self._body.find('tr[rowkey="' + rowkey + '"] > td[coldefindex="' + cellIndex + '"]');
                        }
                        self._editTdAtPlace(record, td, cellIndex);
                     }
                  }
               });
            } else {
               return new $ws.proto.Deferred().callback();
            }
         };
      //для сложного редактирования по месту проверим возможно ли оно, так как если нет, то и вычитывать запись смысла нет
      //для простого редактирования по месту мы сюда просто в принципе не попадем
      if(this._options.display.editAtThePlaceTemplate && this._disabledEditCells[rowkey] === false) {
         return;
      }
      this._editedColumnIndex = cellIndex;
      this._editedRecordKey = rowkey;

      (function(){
         if(doWait && self._editWaitForDialog){
            return self._editWaitForDialog;
         } else {
            return new $ws.proto.Deferred().callback();
         }
      })().addCallback(function(){
         self._runInBatchUpdate('', function() {
            var result;
            self._toggleFixHover(true);
            if (self._editAtPlaceRecord) {
               this._editTdClearTimer();
               if (!self._isIdEqual(self._editAtPlaceRecord.getKey(), rowkey)) {
                  if (!self._editAtPlaceValidationErrors) {
                     if(self._addAtPlace && !self._addAtPlaceRecord.isChanged()){
                        result = self._editTdCancel();
                     } else {
                        result = self._editTdSaveWithConfirm().addErrback(function() {
                           if (self._editAtPlaceField) {
                              self._editAtPlaceField.setActive(true);
                           } else if ($ws.helpers.instanceOfModule(self._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')) {
                              self._editAtPlaceRecordArea.setActive(true);
                           }
                        });
                     }
                     result.addCallback(edit);
                  }
               } else {
                  self._editTdDestroyFieldWithRefresh();
                  result = edit();
               }
            } else if (!self._editAtPlaceValidationErrors) {
               result = edit();
            }
            return result;
         });
      });
   },
   /**
    * Отдаст конфигурацию колонки, по клику на которую запустилось редактирование по месту
    * или false, если редактирования сейчас нет
    * @return {Object} colDef Описание конфигурации колонки
    */
   getEditedColumnConfig: function(){
      if(this._editedColumnIndex){
         return this._columnMap[this._editedColumnIndex];
      } else {
         return false;
      }
   },
   /**
    * Скрывает данные внутри ячейки, которую собираются редактировать
    * @param {jQuery} cellContainer Контейнер, внутри которого находятся данные
    */
   _editTdHideContents: function(cellContainer) {
      for (var s = 0, nodes = cellContainer[0].childNodes, cnt = nodes.length; s < cnt; s++) {
         if (nodes[s].nodeType == $ws._const.nodeType['TEXT_NODE']) {
            nodes[s].data = "";
         } else {
            var $chNodes = $(nodes[s]);
            if ($chNodes.hasClass('ws-browser-expander-container') || $chNodes.hasClass('ws-browser-text-no-render') ||
               $chNodes.hasClass('ws-browser-text-container')) {
               $chNodes.css({
                  "display": "none"
               });
            } else {
               $chNodes.remove();
               --s;
               --cnt;
            }
         }
      }
   },
   /**
    * @param {Boolean} [editPreviousRow] следует ли редактировать предыдущую строку
    * Обраюатывает нажатие enter'а во время редактирования по месту
    */
   _editTdKeyEnter: function(editPreviousRow) {
      if (this._editTdRecordCanSetData()) {
         var td = this._editAtPlaceCell,
            thisTR = td.closest('tr'),
            nextTR = thisTR,
            cell = undefined,
            colIndex = this._getCellIndex(td);
         while (!cell || !cell.length) {
            nextTR = editPreviousRow === true ? nextTR.prev() : nextTR.next();
            if (!nextTR.length) {
               break;
            }
            cell = nextTR.find('td[coldefindex=' + colIndex + '].ws-browser-edit-column');
         }
         if (!this._editAtPlaceValidationErrors) {
            if (cell && cell.length) {
               this._startEditTd(cell, false);
            } else {
               this.endEditAtThePlace();
            }
         }
      }
   },
   /**
    * Есть ли плагин "лесенки" - тогда нам надо перерисовывать браузер после каждого изменения
    * @returns {Boolean}
    * @private
    */
   _editTdCheckLadder: function() {
      return !!(this._options.display.ladder && this._options.display.ladder.length);
   },
   /**
    * Завершает редактирование по месту.
    * Сохраняет запись и перезагружает/обновляет данные
    * @param {jQuery} [cell] ячейка, которая будет радактироваться после
    */
   endEditAtThePlace: function(cell) {
      var self = this;
      //проверим что у нас сейчас идет вообще редактирование/добавление по месту, иначе нет смысла завершать то, что не начато
      if(this._editAtPlaceRecordArea || this._editAtPlaceField){
         if (this._options.display.editAtThePlaceTemplate) {
            this._editAreaSaveRecord();
         } else if(this._editAtPlaceField) {
            if(this._editAtPlaceField.validate()){
               this._editAtPlaceValidationErrors = 0;
               //поднимем событие об изменении поля до того как забудем все о редактируемой по месту записи
               this._editTdFieldValueChange();
               this._editTdSaveRecord().addBoth(function() {
                  var res = self._editTdDestroyField();
                  if (self._editAtPlaceChanges) {
                     if (self._options.reloadAfterChange) {
                        self.reload();
                     } else if (!cell || (res && self._editTdCheckLadder())) {
                        self.refresh();
                     }
                  }
               });
            } else {
               this._editAtPlaceValidationErrors = 1;
            }
         }
      }
   },
   /**
    * Обрабатывает нажатие клавиши escape во време редактирования по месту
    * @return {Boolean} [noDestroy] Не разрушать область сложного редактирования по шаблону
    * @return {Boolean|Deferred} Нужно ли перезагружать браузер после отмены
    */
   _editTdCancel: function(noDestroy){
      var res = false,
          clear = false,
          self = this;
      if(this._editAtPlaceField && this._editAtPlaceRecord){
         clear = true;
         this._editAtPlaceRecord.rollback();
         var value = this._editAtPlaceRecord.get(this._columnMap[this._getCellIndex(this._editAtPlaceCell)].field);
         this._editAtPlaceField.setValue(value);
         if (this._isIdEqual(this._editAtPlaceRecord && this._editAtPlaceRecord.getKey(), this._addAtPlaceRecordId) && this._addAtPlace) {
            this._addAtPlaceCancel();
         } else {
            this._editTdDestroyField();
            if (this._options.reloadAfterChange && this._editAtPlaceChanges) {
               res = true;
            }
         }
      } else if (this._options.display.editAtThePlaceTemplate && $ws.helpers.instanceOfModule(this._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')) {
         clear = true;
         res = new $ws.proto.Deferred();
         if(this._editAtPlaceRecord) {
            this._editAtPlaceRecord.rollback();
         }
         (function(){
            if (self._isIdEqual(self._editAtPlaceRecord && self._editAtPlaceRecord.getKey(), self._addAtPlaceRecordId) && self._addAtPlace) {
               self._addAtPlace = false;
               return self._addAtPlaceRecord.destroy();
            } else {
               return new $ws.proto.Deferred().callback();
            }
         })().addCallback(function(){
            if (self._editWaitForDialog && !self._editWaitForDialog.isReady()) {
               self._editWaitForDialog.callback();
               self._editWaitForDialog = undefined;
            }
            if(!noDestroy){
               self._complexEditAtPlaceDestroyArea();
            }
         }).addBoth(function(){
            res.callback();
         });
      }
      if(clear){
         this._isUserCancelled = true;
         this._editAtPlaceValidationErrors = 0;
         this._editAtPlaceChanges = false;
      }
      return res;
   },
   /**
    * Функция отмены редактирования по месту, которая дополнительно перезагружает браузер в случае необходимости
    * @protected
    */
   _editTdCancelWithReload: function() {
      var self = this,
          res;
      // При отмене добавления новой записи она удалится, поэтому нужно сказать, что это удаление фэйковое
      self._isFakeDelete = true;
      if (res = this._editTdCancel(true)) {
         //TODO временное решение, в 3.7.0 отрефакторить
         (function(){
            if(res instanceof $ws.proto.Deferred){
               return res;
            } else {
               return new $ws.proto.Deferred().callback();
            }
         })().addCallback(function(){
            self.reload().addCallback(function(result){
               self._isFakeDelete = false;
               return result;
            });
         });
      } else {
         self._isFakeDelete = false;
      }
   },
   /**
    * Обрабатывает нажатие tab'а при редактировании по месту
    * @param {Object} event Объект события
    */
   _editTdKeyTab: function(event) {
      var normalDirection = !event.shiftKey,
         nextTD,
         td = this._editAtPlaceCell;
      nextTD = td;
      var anotherRow = false;
      while (true) {
         if (nextTD.length) {
            nextTD = nextTD[normalDirection ? 'next' : 'prev']('td');
         } else {
            anotherRow = true;
            nextTD = td.closest('tr')[normalDirection ? 'nextAll' : 'prevAll']('.ws-visible:first')
               .find(normalDirection ? 'td:first-child' : 'td:last-child');
            if (!nextTD.length) {
               break;
            }
         }
         if (nextTD.length) {
            td = nextTD;
         }
         if (nextTD.hasClass('ws-browser-edit-column')) {
            break;
         }
      }
      if (this._editTdRecordCanSetData() || !anotherRow) {
         if (nextTD && nextTD.length) {
            this._startEditTd(nextTD, false);
         } else {
            this._editTdSaveWithConfirmAndReload();
         }
      }
      this._moveBrowserScrollToTd(td);
   },
   /**
    * Создаём конфигурацию для поля, используемого в редактировании по месту
    * @param {Object} colDef Опции колонки данного поля
    * @param {Number} width Ширина контейнера
    * @param {Number} height Высота контейнера
    */
   _editTdFieldConfig: function(colDef, width, height) {
      var fieldContext = new $ws.proto.Context().setPrevious(this.getLinkedContext()),
          config = {
         name: colDef.field,
         width: width,
         linkedContext: fieldContext,
         enabled: true,
         allowChangeEnable: false,
         parent: this.getParent(),
         validators: colDef.validators,
         tabindex: -1,
         extendedTooltip: colDef.extendedTooltip
      };
      fieldContext.setContextData(this._editAtPlaceRecord);
      if (colDef.type === "Текст") {
         config["height"] = height;
      } else if (colDef.type === "Число целое" || colDef.type === "Число вещественное" || colDef.type === "Деньги") {
         config["maxLength"] = 255;
         config["delimiters"] = colDef.type === "Деньги";
         if (colDef.type === "Число вещественное")
            config["decimals"] = colDef.decimals || 9;
         else if (colDef.type === "Деньги")
            config["decimals"] = 2;
      } else if (colDef.type === "Дата и время") {
         config["mask"] = colDef.maskField ? colDef.maskField : "DD.MM.YY HH:II";
      } else if (colDef.type === "Дата") {
         config["mask"] = colDef.maskField ? colDef.maskField : "DD.MM.YY";
      } else if (colDef.type === "Время") {
         config["mask"] = colDef.maskField ? colDef.maskField : "HH:II";
      } else if (colDef.type === "Логическое") {
         config["caption"] = "";
      } else if (colDef.type === "Флаги") {
         var flagsList = this.getActiveRecord().get(colDef.field).getColumns(),
            flags = {};
         for (var j = 0, k = flagsList.length; j < k; j++) {
            flags[flagsList[j]] = {
               caption: flagsList[j],
               isThirdPosition: true
            };
         }
         config["elements"] = flags;
      } else {
         config["maxLength"] = 255;
         config["inputFilter"] = colDef.inputFilter;
      }
      return config;
   },
   /**
    * Инициализирует поле редактирования по месту
    * @param {$ws.proto.Control} instance Контрол, который получился
    */
   _editTdInitField: function(instance) {
      var container = instance.getContainer(),
         cell = container.closest('td'),
         parentTR = cell.parent();
      container.height('').addClass('clearfix');
      var h = container.outerHeight();
      cell.find('div.ws-browser-cell-container').height(h);
      parentTR.height(h);
      instance.getContainer().height(h);
      instance.setActive(true);
      var inputElement = instance.getContainer().find('.ws-field :first-child')[0];
      if ($ws._const.browser.isIE && inputElement.createTextRange) { // устанавливаем курсор в IE
         try{
            inputElement.createTextRange().select();
         } catch(e){}
      } else {// и в нормальных браузерах
         if ($.browser.opera) {
            var range = document.createRange();
            range.selectNode(inputElement);
            window.getSelection().addRange(range);
         } else {
            if (typeof(inputElement.select) == 'function') {
               inputElement.select();
            }
         }
      }

      this._editAtPlaceField = instance;
      this._notifyOnSizeChanged(this, this, true);
   },
   /**
    * Включает редактирование ячейки по месту
    * @param {$ws.proto.Record} record Запись
    * @param {jQuery} td Ячейка
    * @param {Number} colIndex Номер столбца
    */
   _editTdAtPlace: function(record, td, colIndex) {
      this._runInBatchUpdate('', function() {
         var self = this,
             editContainer = $("<div class='ws-browser-edit-field' />"),
             colDef = this._columnMap[colIndex],
             fieldContainer = td.find('div.ws-browser-cell-container').removeClass('ws-browser-div-cut').addClass('ws-browser-has-edit-field'),
             parentTR = td.closest('tr'),
             width = fieldContainer.width(),
             height = fieldContainer.height(),
             rowkey = parentTR.attr("rowkey");

         this.setActiveElement(parentTR);
         if (fieldContainer.hasClass('ws-browser-validation-error')) {
            self._editAtPlaceWithValidationError = true;
            fieldContainer.removeClass('ws-browser-validation-error');
         } else {
            self._editAtPlaceWithValidationError = false;
         }

         this._editAtPlaceCellIndex = colIndex;
         this._editAtPlaceRecord = record;
         this._editAtPlaceCell = td;
         this._editAtPlacePreviousValue = record.get(colDef.field);

         parentTR.addClass('ws-browser-editable-row');
         self._toggleFixHover(true);

         editContainer.css({
            width: width,
            height: height,
            position: 'relative'
         });
         this._editTdHideContents(fieldContainer);
         editContainer.data('fieldIndex', colIndex);
         editContainer.data('oldFieldContainerHeight', fieldContainer.height());
         editContainer.data('oldTrHeight', parentTR.height());
         fieldContainer.prepend(editContainer);

         if (!this._editAtPlaceFocusCallback) {
            // в ие и фф в разном порядке срабатывает оповещение о клике и об уходе фокуса с элементов,
            // поэтому получается ситуация, когда значение в поле еще не проставилось, а мы уже обрабатываем уход фокуса
            // для того, чтобы было одинаково во всех браузерах, обработаем уход фокуса с задержкой,
            // чтобы у нас были на этот момент все актуальные изменения
            this._editAtPlaceFocusCallback = function(){
               setTimeout(this._editTdFocusOut.bind(this), 0);
            }.bind(this);
            $('body').bind('click.edit_' + this.getId(), function(e) {
               var $element = $(e.target);
               //если кликнули куда-то по календарю, не важно куда, то все ок.
               if (!($element.closest('.ui-datepicker').length || $element.closest('.ui-datepicker-header').length)) {
                  this._editAtPlaceFocusCallback();
               }
            }.bind(this));
         }

         var fieldConfig = this._editTdFieldConfig(colDef, width, height),
            fieldType = self._fieldTypesForEdit[colDef.type] ? self._fieldTypesForEdit[colDef.type] : self._fieldTypesForEdit['Строка'];
         fieldConfig['element'] = editContainer;
         fieldConfig['handlers'] = {
            onKeyPressed: function(event, e) {
               if (e.which === $ws._const.key.insert && !e.shiftKey && !e.altKey && !e.ctrlKey) {
                  e.stopPropagation();
                  e.preventDefault();
               }
               if (Array.indexOf([$ws._const.key.enter, $ws._const.key.esc, $ws._const.key.tab, $ws._const.key.up, $ws._const.key.down], e.which) !== -1) {
                  e.stopPropagation();
                  e.preventDefault();
                  switch (e.which) {
                     case $ws._const.key.enter:
                     case $ws._const.key.up:
                     case $ws._const.key.down:
                        self._editTdKeyEnter(e.which === $ws._const.key.up || (e.which === $ws._const.key.enter && e.shiftKey));
                        break;
                     case $ws._const.key.esc:
                        self._editTdCancelWithReload();
                        break;
                     case $ws._const.key.tab:
                        self._editTdKeyTab(e);
                        break;
                  }
                  event.setResult(false);
               }
            },
            onFocusOut: this._editAtPlaceFocusCallback,
            onValidate: function(event, res) {
               fieldContainer.toggleClass('ws-browser-validation-error', !res);
               if (!res) {
                  fieldContainer.find('.ws-validation-error').removeClass('ws-validation-error');
               }
            }
         };

         var newField = self._notify('onBeforeEditColumn', record, fieldType, fieldConfig);
         if (newField && newField instanceof Array && newField.length == 2) {
            fieldType = newField[0].toLowerCase().substr(0,3) === 'js!' ? newField[0] : 'Control/' + newField[0];
            fieldConfig = newField[1];
         }

         return $ws.core.attachInstance(fieldType, fieldConfig).addCallback(function(instance) {
            self._editTdInitField(instance);
         });
      });
   },
   /**
    * Передвигает _горизонтальный_ скролл браузера, если он есть, к ячейке при редактировании по месту
    * Правая грацица ячейки совпадёт с правой границей окна
    * @param {jQuery} td
    * @private
    */
   _moveBrowserScrollToTd: function(td) {
      var
         $brCon = this._browserContainer,
         brCon = $brCon.get(0),
         scrollDistance;
      // Если есть скролл и элемент не полностю виден на странице
      if (brCon.clientWidth < brCon.scrollWidth && (td.position().left + td.outerWidth() > brCon.clientWidth) || td.position().left < 0) {
         scrollDistance = td.offset().left - $brCon.offset().left + $brCon.scrollLeft() - $brCon.width() + td.outerWidth();
         if (scrollDistance < 0) {
            scrollDistance = 0;
         }
         $brCon.scrollLeft(scrollDistance);
      }
   },
   /**
    * Обработчик потери фокуса во время редактирования по месту
    */
   _editTdFocusOut: function() {
      if (this._editAtPlaceField) {
         if (!this._editWaitForDialog) {
            this._editWaitForDialog = new $ws.proto.Deferred();
            var dialog = this.getTopParent();
            if (dialog instanceof $ws.proto.AreaAbstract) {
               dialog.addPendingOperation(this._editWaitForDialog);
            }
         }
         this._editTdClearTimer();
         if (this._addAtPlace && !this._addAtPlaceRecord.isChanged()) {
            this._editAtPlaceTimer = setTimeout(this._addAtPlaceCancel.bind(this), $ws._const.Browser.editAtPlaceWait);
         } else {
            this._editAtPlaceTimer = setTimeout(this._editTdSaveWithConfirmAndReload.bind(this), $ws._const.Browser.editAtPlaceWait);
         }
         this._showEmptyDataBlock();
      }
   },
   /**
    * Отменяет таймер ухода фокуса с поля ввода редактирования по месту
    * @private
    */
   _editTdClearTimer: function() {
      if (this._editAtPlaceTimer) {
         clearTimeout(this._editAtPlaceTimer);
         this._editAtPlaceTimer = undefined;
      }
   },
   /**
    * Кидает событие onFieldChange, если нужно
    * @private
    */
   _editTdFieldValueChange: function() {
      if (this._editAtPlaceRecord) {
         var colDef = this._columnMap[this._editAtPlaceCellIndex],
             value = this._editAtPlaceRecord.get(colDef.field),
             isChanged = false;
         if (this._editAtPlacePreviousValue !== value) {
            this._notify('onFieldChange', this._editAtPlaceRecord, colDef.field, colDef.title, value, this._editAtPlacePreviousValue);
            //запомним, что для этого значения мы уже поднимали событие
            this._editAtPlacePreviousValue = value;
            isChanged = true;
         }
         return isChanged;
      }
      return false;
   },
   /**
    * Обновляет данные в записи в редактировании по месту
    * @returns {Boolean} Можно ли установить значение и переходить к следующему полю
    */
   _editTdRecordCanSetData: function() {
      if (!this._editAtPlaceField) {
         return true;
      }
      if (this._editAtPlaceField.validate()) {
         return true;
      } else {
         this._editAtPlaceField.setActive(true);
         return false;
      }
   },
   /**
    * Сохраняет запись, которая редактировалась по месту
    * @returns {$ws.proto.Deferred}
    */
   _editTdSaveRecord: function() {
      var self = this,
          record = this._editAtPlaceRecord,
          saving;
      if (this._editAtPlaceValidationErrors === 0) {
         var flag = this._notify('onBeforeSave', record, true);
         if (record) {
            if (typeof(flag) !== 'boolean') {
               if(flag instanceof $ws.proto.Deferred){
                  saving = flag;
               }
               if (this._addAtPlace && this._isIdEqual(this._addAtPlaceRecordId, record.getKey())) {
                  return this._addAtPlaceOk(saving);
               } else {
                  $ws.core.setCursor(false);
                  this._isUpdatingRecords = true;
                  this._editAtPlaceChanges = true;
                  var res = new $ws.proto.Deferred(),
                     loader = this._container.find('.ws-browser-ajax-loader').removeClass('ws-hidden');
                  $ws.helpers.clearSelection();
                  var dialog = this.getTopParent();
                  if (dialog instanceof $ws.proto.AreaAbstract) {
                     dialog.addPendingOperation(res);
                  }
                  if (this._editWaitForDialog && !this._editWaitForDialog.isReady()) {
                     this._editWaitForDialog.callback();
                  }
                  this._editWaitForDialog = undefined;
                  var process = saving || record.update();
                  process.addCallbacks(function(result){
                     self._editAtPlaceRecord = undefined;
                     self._addAtPlaceRecord = undefined;
                     self._addAtPlace = false;
                     res.callback();
                     return result;
                  }, function(error) {
                     if (error instanceof HTTPError && error.httpError !== 0 && !self.isDestroyed()) {
                        $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self._editAtPlaceRecordArea || self);
                     }
                     //вернем фокус на обалсти редактирования по месту
                     if($ws.helpers.instanceOfModule(self._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')){
                        self._editAtPlaceRecordArea.setActive(true);
                     }
                     res.errback(error);
                  }).addBoth(function(result) {
                     loader.addClass('ws-hidden');
                     self._notify('onAfterRecordsSave', result);
                     $ws.core.setCursor(true);
                     self._isUpdatingRecords = false;
                     return result;
                  });
                  return res;
               }
            } else {
               if (this._editWaitForDialog && !this._editWaitForDialog.isReady()) {
                  this._editWaitForDialog.callback();
                  this._editWaitForDialog = undefined;
               }
            }
         }
         if (flag === true) {
            this._editAtPlaceChanges = true;
            this._addAtPlaceRecordId = undefined;
            return new $ws.proto.Deferred().callback();
         }
      }
      if (flag === true) {
         this._endAddAtPlace();
         return new $ws.proto.Deferred().callback();
      } else {
         return new $ws.proto.Deferred().errback();
      }
   },
   /**
    * Обновляет запись, редактируемую по месту, и обновляет браузер, если нужно
    * @return {$ws.proto.Deferred}
    * @private
    */
   _editTdSaveWithConfirmAndReload: function() {
      var self = this;
      return this._editTdSaveWithConfirm().addCallback(function() {
         var res = this._editTdDestroyField();
         if (self._options.reloadAfterChange && self._editAtPlaceChanges === true && !self._isDestroyed) {
            return self.reload().addCallback(function() {
              if (self._options.display.editAtThePlaceTemplate) {
                self._complexEditAtPlaceDestroyArea();
              }
            });
         } else if (res && self._editTdCheckLadder()) {
            self.refresh();
         }
         return undefined;
      }.bind(this));
   },
   /**
    * Обновляет запись, которая редактируется по месту
    * @returns {$ws.proto.Deferred}
    */
   _editTdSaveWithConfirm: function() {
      if (this._editTdRecordCanSetData()) {
         this._editTdDestroyField();
         if (this._editAtPlaceRecord && (this._addAtPlace || this._editAtPlaceRecord.isChanged())) {
            if(this._options.display.editAtThePlaceTemplate){
               return this._editAreaSaveRecord(false, true);
            } else {
               return this._editTdSaveRecord();
            }
         } else {
            if (this._editWaitForDialog && !this._editWaitForDialog.isReady()) {
               this._editWaitForDialog.callback();
               this._editWaitForDialog = undefined;
            }
            if(this._editTdCancel()){
               this.refresh();
            }
            return new $ws.proto.Deferred().callback();
         }
      }
      return new $ws.proto.Deferred().errback();
   },
   /**
    * Уничтожает поле редактирования по месту
    * @returns {Boolean} Были ли какие-то изменения, из-за чего можно вызвать пересчёт лесенки
    */
   _editTdDestroyField: function() {
      if (!this._editAtPlaceField) {
         return false;
      }
      this._editTdClearTimer();
      var isChanged = this._editTdFieldValueChange();
      this._runInBatchUpdate("", function() {
         var editContainer = this._editAtPlaceField.getContainer(),
            parentTR = editContainer.closest('tr'),
            fieldContainer = editContainer.parent(),
            fieldIndex = parseInt(editContainer.data("fieldIndex"), 10),
            colDef = isNaN(fieldIndex) ? false : this._columnMap[fieldIndex],
            self = this,
            errorMsg;
         // Если colDef === false, то значит мы разрушаем поле при разрушении браузера, делаем только то, что можем
         if(this._editedColumnIndex === fieldIndex && (this._editAtPlaceRecord && this._editAtPlaceRecord.getKey() === this._editedRecordKey)){
            this._editedColumnIndex = undefined;
            this._editedRecordKey = undefined;
         }
         this._toggleFixHover(false);
         parentTR.removeClass('ws-browser-editable-row');
         editContainer.parent().height(editContainer.data("oldFieldContainerHeight"));
         parentTR.height(editContainer.data("oldTrHeight"));
         editContainer.height(editContainer.data("oldFieldContainerHeight"));

         if (!this._options.display.cutLongRows) {
            fieldContainer.removeClass('ws-browser-div-cut');
         }

         var validated = this._editAtPlaceField.validate(),
            wasError = this._editAtPlaceWithValidationError;
         if (!wasError && !validated) {
            if(++this._editAtPlaceValidationErrors === 1 && this._addAtPlaceLinkRow){
               this._addAtPlaceLinkRow.addClass('ws-browser-add-disabled');
            }
            this._editAtPlaceValidationMap[fieldIndex] = true;
         } else if (wasError && validated) {
            if(--this._editAtPlaceValidationErrors === 0 && this._addAtPlaceLinkRow){
               this._addAtPlaceLinkRow.removeClass('ws-browser-add-disabled');
            }
            delete this._editAtPlaceValidationMap[fieldIndex];
         }
         if(this._editAtPlaceValidationMap[fieldIndex]) {
            errorMsg = this._getEditAtPlaceValidationError();
         }

         this._editAtPlaceField.unsubscribe('onFocusOut', this._editAtPlaceFocusCallback);
         this._editAtPlaceField.destroy();
         this._editAtPlaceField = undefined;

         if (this._editAtPlaceRecord) {
            var rowkey = this._editAtPlaceRecord.getKey(),
               listRecord = this._currentRecordSet.contains(rowkey) ? this._currentRecordSet.getRecordByPrimaryKey(rowkey) : null;
            // Проверим, что если запись возвращал рекордсет, то он нам отдал реальную запись
            // Такое может произойти когда запись сохранили, но рекордсет еще не перезагрузили
            if (listRecord instanceof $ws.proto.Record && listRecord.hasColumn(colDef.field) && this._editAtPlaceRecord.hasColumn(colDef.field)) {
               listRecord.set( colDef.field, this._editAtPlaceRecord.get(colDef.field) );
            }
         }
         if (this._editAtPlaceRecord && colDef) {
            //учтем, что при добавлении по месту у нас записи в списке еще нет
            var data = this._renderTD(colDef, listRecord || this._editAtPlaceRecord),
               title = (data instanceof Object && 'jquery' in data) ?
                  data.text() :
                  ((data === null || data === undefined) ? '' : data.toString());
            title = $ws.helpers.escapeTagsFromStr(title, []).replace(/'/g, "&#039;");
            fieldContainer.attr('title', title);
            fieldContainer.removeClass('ws-browser-has-edit-field');
            for (var i = 0, childNodes = fieldContainer.children(), l = childNodes.length; i < l; i++) {
               var child = $(childNodes[i]);
               if (child.hasClass('ws-browser-expander-container') ||
                  child.hasClass('ws-browser-text-no-render') ||
                  child.hasClass('ws-browser-text-container')) {
                  child.css('display', 'block');
               }
            }

            if (this._editAtPlaceValidationMap[fieldIndex]) {
               fieldContainer.addClass('ws-browser-validation-error');
               this._lastMarkedRow = rowkey;
               this._lastMarkedCol = colDef.title;
            }
            if (this.isHierarchyMode() && fieldIndex <= 0) {
               fieldContainer = parentTR.find(".ws-browser-text-container");
            }
            var editModeIsDialog = this._options.editMode == "newDialog" && (this.isHierarchyMode() ? this._options.editBranchMode : true),
               editRecordIsBranch = editModeIsDialog ? false : this.isHierarchyMode() && this._editAtPlaceRecord.get(this._hierColumnIsLeaf) === true;
            this._appendDataToCellContainer(fieldContainer, data, editRecordIsBranch,
                  !!colDef.render, colDef.allowEditAtThePlace, parentTR.attr("rowkey"), parentTR.attr("parentid"));
            if(isChanged){
               this.validate();
            }
            if (this._editAtPlaceValidationMap[fieldIndex]) {
               //покажем на пару секунд пользователю подсказку о том, что у него все плохо
               this._showExtendedTooltip(fieldContainer, errorMsg);
               setTimeout(function(){
                  self._hideExtendedTooltip(fieldContainer);
               }, 2000);
            }
         }
      });
      return true;
   },
   /**
    * Метод, возвращающий ошибку валидации
    * @private
    */
   _getEditAtPlaceValidationError: function() {
      if(this._vResultErrors.length) {
         return this._vResultErrors;
      } else {
         var elem = this._editAtPlaceField;
         return elem._vResultErrors;
      }
   },
   validate: function(firstRun, forceValidateHidden, res) {
      if(res !== true && !Object.isEmpty(this._editAtPlaceValidationMap)) {
         this.clearMark();
         this.markControl(this._vResultErrors, this._lastMarkedRow, this._lastMarkedCol);
      }
      return res;
   },
   /**
    * Удаляет поле для редактирования по месту и перерисовывает браузер если есть лесенка и это нужно сделать
    * @private
    */
   _editTdDestroyFieldWithRefresh: function() {
      if (this._editTdDestroyField() && this._editTdCheckLadder()) {
         this.refresh();
      }
   },
   destroy: function() {
      if (this._editAtPlaceFocusCallback) {
         $('body').unbind('click.edit_' + this.getId(), this._editAtPlaceFocusCallback);
      }
   },
   /**
    * Создаёт запись по месту
    * @param {String} parentId Идентификатор родителя
    * @param {Boolean} [isBranch] Является ли запись папкой
    * @param {Object} [filter] фильтр для инициализации новой записи
    * @private
    */
   _createRowAtThePlace: function(parentId, isBranch, filter){
      if(this._editAtPlaceValidationErrors){
         return;
      }
      var self = this;
      (function(){
         if(self._editWaitForDialog){
            return self._editWaitForDialog;
         } else {
            return new $ws.proto.Deferred().callback();
         }
      })().addCallback(function(){
         if(self._addAtPlaceLinkRow){
            self._addAtPlaceLinkRow.addClass('ws-hidden');
         }      
         $ws.helpers.callbackWrapper(self._beforeCreateRowAtThePlace(parentId), function(){
            var createRecord = function(){
               $ws.core.setCursor(false);
               var prepareRecord = self._readRecord(undefined, filter, parentId, isBranch);
               if (prepareRecord === false) {
                  $ws.core.setCursor(true);
                  if(self._addAtPlaceLinkRow){
                     self._addAtPlaceLinkRow.removeClass('ws-hidden');
                  }
                  return;
               }
               prepareRecord.addCallback(function(record){
                  if(record instanceof $ws.proto.Record){
                     $ws.core.setCursor(true);
                     var flag = self._notify('onBeforeInsert', record);
                     if(flag !== false){
                        if(typeof flag === 'string'){
                           self._tempTemplate = flag;
                        }
                        var parentIdChanged = false;
                        if(self.isHierarchyMode()){
                           var newParentId = record.get(self._hierColumnParentId);
                           if(newParentId != parentId){
                              parentId = newParentId;
                              parentIdChanged = true;
                           }
                        }
                        $ws.helpers.callbackWrapper(parentIdChanged && self.showBranch(parentId), function(){
                           if(flag !== true){
                              self.clearMark();
                              self._addAtPlace = true;
                              self._addAtPlaceRecord = record;
                              self._addAtPlaceRecordId = record.getKey();
                              if(self._addAtPlaceRecordId === null){
                                 self._addAtPlaceRecordId = 'null';
                              }
                              var after,
                                    treelevel = 0;
                              if(self.isTree()){
                                 after = self._body.find('tr[rowkey="' + parentId + '"]:first');
                                 treelevel = after.length ? (parseInt(after.attr($ws._const.Browser.treeLevelAttribute), 10) + 1) : 0;
                              }
                              if(!after || !after.length){
                                 after = self._body.find('.ws-browser-add-at-place-link-row').prev('tr[rowkey]');
                              }
                              var row = $(self._createTrAtPlace(record, treelevel, after));
                              row.addClass('ws-add-at-place');
                              if(isBranch){
                                 row.find('.ws-browser-expander').removeClass('ws-browser-expander minus').addClass('folder');
                              }
                              if(after && after.length){
                                 row.insertAfter(after);
                              }
                              else{
                                 self._body.prepend(row);
                              }
                              self._emptyDataBlock.removeClass('ws-invisible');
                              if(self._count === 0){
                                 // не забываем перерисовать заголовок
                                 self._head.toggleClass("ws-hidden", false);
                                 self._emptyDataBlock.addClass('ws-hidden');
                              }
                              self.zebraBody(self._options.display.hasZebra);
                              self._addAtPlaceRow = row;
                              self.setActiveRow(row);
                              if(self._options.display.editAtThePlaceTemplate){
                                 if(self._currentRecordSet.getRecordCount() || self._isUserCancelled) {
                                    self._addEditWaitForDialog.apply(self);
                                 }
                                 self._startEditAtPlace(self._addAtPlaceRecord, row.find('td:first'));
                              } else {
                                 for(var i in self._columnMap){
                                    if(self._columnMap.hasOwnProperty(i)){
                                       if(self._columnMap[i].allowEditAtThePlace){
                                          var td = row.find('td[coldefindex=' + i + ']');
                                          if(td.length){
                                             self._addEditWaitForDialog.apply(self);
                                             self._editTdAtPlace(record, td, i);
                                             break;
                                          }
                                       }
                                    }
                                 }
                              }
                              self._heightChangedIfVisible();
                           }
                        });
                     }
                  }
               }).addErrback(function(error){
                  return self._recordErrorHandler(error);
               });
            };
            var deferred = (self._editAtPlaceRecord &&
                  self._editTdRecordCanSetData() &&
                  self._editTdSaveWithConfirmAndReload()) || !self._editAtPlaceField;
            if(deferred){
               $ws.helpers.callbackWrapper(deferred, createRecord);
            }
            else if(self._editAtPlaceField){
               self._editAtPlaceField.setActive(true);
            }
         });
      });
   },
   /**
    * Обработчик нажатия на кнопку "сохранить" в добавлении по месту
    * @param {$ws.proto.Deferred} saving процесс сохранения записи
    * @returns {$ws.proto.Deferred} Deferred готовности новой записи
    * @private
    */
   _addAtPlaceOk: function(saving){
      var methodName = this._options.dataSource.readerParams.format !== undefined ?
                  this._options.dataSource.readerParams.format :
                  [this._options.dataSource.readerParams.linkedObject, this._options.dataSource.readerParams.queryName].join('.'),
            newRecord = this._addAtPlaceRecord.cloneRecord(),
            result = saving || this._addAtPlaceRecord.update(),
            self = this,
            dialog = this.getTopParent();
      result.addCallback(function(res){
         self._notify('onAfterInsert', newRecord);
         return res;
      });
      if (dialog instanceof $ws.proto.AreaAbstract) {
         dialog.addPendingOperation(result);
      }
      if(this._editWaitForDialog && !this._editWaitForDialog.isReady()){
         this._editWaitForDialog.dependOn(result);
      }
      this._editWaitForDialog = undefined;
      /**
       * Колбек на обновление записи - при сохранении мы получим её идентификатор в resultId
       */
      this._isUpdatingRecords = true;
      this._editAtPlaceChanges = true;
      result.addCallbacks(function(resultId){
         //Нужно перечитать запись - могли измениться расчётные поля
         if(resultId){
            self._currentRecordSet.readRecord(resultId, methodName).addCallback(function(record){
               self._isUpdatingRecords = false;
               return record;
            }).addErrback(function(error){
               return self._recordErrorHandler(error, resultId);
            });
         }
         self._endAddAtPlace();
         return resultId;
      }, function(error) {
         if (error instanceof HTTPError && error.httpError !== 0 && !self.isDestroyed()) {
            $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
         }
         //если мы еще ждем разрушения, то скажем, что зря
         if (self._waitDestroy && !self._waitDestroy.isReady()) {
            self._waitDestroy.errback();
            self._waitDestroy = undefined;
         }
         //вернем фокус на обалсти редактирования по месту
         if($ws.helpers.instanceOfModule(self._editAtPlaceRecordArea, 'SBIS3.CORE.RecordArea')){
            self._editAtPlaceRecordArea.setActive(true);
         }
         return error;
      });
      return result;
   },
   /**
    * Обработчик нажатия на кнопку "отмена" в добавлении по месту
    * @private
    */
   _addAtPlaceCancel: function(){
      var self = this;
      this._tempTemplate = false;
      this._isFakeDelete = true;
      this._addAtPlaceRecord.destroy().addCallback(function(){
         if(self._options.display.editAtThePlaceTemplate){
            self._complexEditAtPlaceDestroyArea();
         }
         if(self._addAtPlaceRow){
            self._addAtPlaceRow.empty().remove();
         }
         self._endAddAtPlace(true);
         self._isFakeDelete = false;
         if (self._editWaitForDialog && !self._editWaitForDialog.isReady()) {
            self._editWaitForDialog.callback();
            self._editWaitForDialog = undefined;
         }
      });
   },
   /**
    * Заканчивает работу добавления по месту - удаляет кнопки, ставит флаги и т. д.
    * @private
    */
   _endAddAtPlace: function(withoutReload){
      if(withoutReload && this._count === 0 && this._emptyDataText){
         this._emptyDataBlock.removeClass('ws-hidden');
      }
      this._addAtPlace = false;
      this._addAtPlaceRecord = undefined;
      this._addAtPlaceRow = undefined;
      this._editAtPlaceValidationErrors = 0;
      this._editAtPlaceValidationMap = {};
      this._editTdDestroyField();
      if(!this._options.reloadAfterChange && !this._addAtPlaceLinkRow){
         this._createAddAtPlaceLinkRow(this._body);
      } else if(this._addAtPlaceLinkRow){
         this._addAtPlaceLinkRow.removeClass('ws-hidden');
      }
      this._heightChangedIfVisible();
   },
   /**
    * Выполняет действия перед вставкой по месту
    * @param {String} parentId Идентификатор родителя
    * @return {$ws.proto.Deferred|null}
    * @private
    */
   _beforeCreateRowAtThePlace: function(parentId){
      var isRoot = this._isIdEqual(this._rootNode, parentId);
      if(this.isTree() && !this._expanded[parentId]
            && (isRoot && this._options.display.showRoot || !isRoot)){
         return this._processTreeClick(parentId, false);
      }
      return null;
   },
   /**
    * Обработчик клика по строке или ссылке в добавлении по месту
    * @param {jQuery} [event] объект события
    * @param {Boolean} [isFolder] является ли новая запись папкой
    * @private
    */
   _addAtPlaceLinkRowClick: function(event, isFolder){
      if(event){
         this._onClickHandler(event);
         event.stopPropagation();
      }
      var editableRecord = this._addAtPlace ? this._addAtPlaceRecord : this._editAtPlaceRecord;
      // для сложного редактирования по месту обработаем ситуацию ухода фокуса
      if(editableRecord && this._options.display.editAtThePlaceTemplate){
         if(editableRecord.isChanged()){
            this._editAreaSaveRecord.apply(this);
         } else if(this._addAtPlace){
            this._addAtPlaceCancel();
         } else {
            this._editTdCancel();
            this.refresh();
         }
      }
      this._createRowAtThePlace(this._currentRootId, isFolder);
   },
   /**
    * Создаёт строчку с кнопкой добавления записи по месту
    * @param {HTMLElement} tableBody новое body для таблицы
    * @private
    */
   _createAddAtPlaceLinkRow: function(tableBody){
      if(this.isEnabled() && !this.isReadOnly()){
         var td = $('<td class="ws-browser-add-at-place-cell"></td>'),
               self = this,
               folderLink,
               itemLink;
         //перед тем, как создать новую строку добавления, вычистим старую
         if(self._addAtPlaceLinkRow){
            self._addAtPlaceLinkRow.remove();
         }
         this._addAtPlaceLinkRow = $('<tr class="ws-browser-table-row ws-visible ws-browser-add-at-place-link-row"></tr>');
         if(this._options.display.viewMode !== 'foldersTree'){
            itemLink = $('<span class="ws-browser-add-at-place-link ws-browser-add-at-place-link-item asLink ws-hover-target"><div class="ws-browser-add-at-place-item-icon icon-16 icon-NewCategory icon-primary action-hover"/>'+this._options.display.atPlaceLinkText+'</span>');
            itemLink.appendTo(td).click(function(event){
               self._addAtPlaceLinkRowClick(event, false);
            });
         }
         if(this.isHierarchyMode()){
            folderLink = $('<span class="ws-browser-add-at-place-link ws-browser-add-at-place-link-folder asLink ws-hover-target"><div class="ws-browser-add-at-place-item-icon icon-16 icon-CreateFolder icon-primary action-hover"/>'+this._options.display.atPlaceBranchLinkText+'</span>');
            folderLink.appendTo(td).click(function(event){
               self._addAtPlaceLinkRowClick(event, true);
            });
            if(this._options.display.viewMode !== 'foldersTree'){
               folderLink.addClass('ws-browser-add-at-place-link-folder-withItem');
            }
         }
         td.get(0).colSpan = this._getColumnsCount();
         td.appendTo(this._addAtPlaceLinkRow);
         if(this._options.display.hasZebra)
            this._addAtPlaceLinkRow.addClass('rE');
         if(this._options.display.readOnly){
            this._addAtPlaceLinkRow.addClass('ws-hidden');
         }
         this._moveAddAtPlaceLinkRow();
      }
   },
   _moveAddAtPlaceLinkRow: function(){
      if(this._addAtPlaceLinkRow){
         if(this._getVerticalScrollShowed()){
            //добавим строку в футер таблицы только если мы этого еще не делали.
            //из body же строка вычищается сама после каждой перерисовки, поэтому ее каждый раз приходится добавлять
            if(!this._foot.find('.ws-browser-add-at-place-link-row').length){
               this._addAtPlaceLinkRow.prependTo(this._foot.get(0));
            }
         } else {
            this._addAtPlaceLinkRow.appendTo(this._body.get(0));
            //Проверим, что есть записи в браузере
            if(this._body.find('.ws-browser-table-row').length) {
               this._addAtPlaceLinkRow.prev().addClass('ws-browser-row-before-add-at-place');
            }
         }
      }
   },
   _drawBodyCycle: function(){
      if(this._options.display.allowAddAtThePlace){
         this._afterRenderHandler();
         this._moveAddAtPlaceLinkRow();
      }
   },
   /**
    * Создаёт шаблон строки
    * @param {Boolean} isFolder Будет ли строка отображать папку
    * @returns {HTMLTableRowElement} Элемент-строку
    */
   _createRowTemplateAtPlace: function(isFolder){
      var row = document.createElement('tr'),
            exp,
            td,
            flag;
      if (this.isHierarchyMode() && isFolder){
         exp = document.createElement('span');
         exp.className = 'ws-browser-expander-container';
         if(this.isTree() && this._turn === ''){//проставление экспандеров в дереве
            if(this._options.display.hierarchyIcons && this._options.display.hierarchyIcons !== $ws._const.Browser.hierarchyIcons){
               exp.style.backgroundImage = ['url(', $ws._const.wsRoot, this._options.display.hierarchyIcons, ')'].join('');
            }
            exp.className += ' ws-browser-icon ws-browser-expander';
         }
      }
      /**
       * Добавлять чекбоксы в зависимости от selectionType:
       * "leaf" - только у листьев
       * "node" - только у узлов
       */
      if (this._needShowSelectionCheckbox()){
         td = document.createElement('td');
         td.className = 'ws-browser-checkbox-holder';
         if(!this.isHierarchyMode() ||
               (this.isHierarchyMode() &&
                     !(this._options.selectionType === 'leaf' && isFolder) &&
                     !(this._options.selectionType === 'node' && !isFolder)
                     )
               ){
            var container = document.createElement('div'),
                innerDiv = document.createElement('div'),
                checkbox = document.createElement('span');
            container.className = 'ws-browser-cell-paddings';
            innerDiv.className = 'ws-browser-cell-container';
            checkbox.className = 'ws-browser-checkbox';
            innerDiv.appendChild(checkbox);
            container.appendChild(innerDiv);
            td.appendChild(container);
         }
         row.appendChild(td);
      }
      flag = isFolder && ((this.isTree() && this._turn !== '') || this.isHierarchy());
      var num = 0, colDef;
      for (var i = 0, len = this._columnMap.length; i < len; ++i, exp = undefined){
         td = false;
         num = (i === 0 && flag) ? -1 : i;
         colDef = this._columnMap[i];
         if(flag){
            if(num === -1 || colDef.useForFolder){
               td = this._createTdTemplateAtPlace(num, exp);
               td.className += isFolder ? ' ws-browser-bold' : '';
            }
         } else
            td = this._createTdTemplateAtPlace(num, exp);
         if(td)
            row.appendChild(td);
      }
      return row;
   },
   /**
    * Функция для получения ширины таблицы (количество столбцов)
    *
    * @return Number
    */
   _getColumnsCount: function(){
      return this._columnMap.length + (this._needShowSelectionCheckbox() ? 1 : 0);
   },
   /**
    * Формирование  строки таблицы
    *
    * @param {$ws.proto.Record} record Строка RecordSet.
    * @param {Number} level Уровень вложенности строки, используется для просчёта отступов.
    * @return {HTMLTableRowElement} Стандартный html-объект, строку.
    */
   _createTrAtPlace: function(record, level){
      var isFolder = (this.isHierarchyMode() ? record.get(this._hierColumnIsLeaf) : null),
            hasChild = this._options.display.viewMode === 'foldersTree' ? record.get(this._hierColumnHasChild) : null,
            template = isFolder ? 1 : 0,
            key = record.getKey(),
            classes = ['ws-browser-table-row'],
            padding = 0,
            visClass = 'ws-visible',
            isExpanded,
            exp,
            row;
      if(!(this._rowTemplates[template] instanceof Object && 'jquery' in this._rowTemplates[template]))
         this._rowTemplates[template] = this._createRowTemplateAtPlace(isFolder);
      row = this._rowTemplates[template].cloneNode(true);
      exp = $(row).find('.ws-browser-expander-container')[0];
      if(this.isHierarchyMode())
         isExpanded = !!this._expanded[key];
      if(key === null){
         key = 'null';
      }
      row.setAttribute('rowkey', key);
      if(this.isHierarchyMode()){
         row.setAttribute($ws._const.Browser.treeLevelAttribute, level);
      }
      if(this._options.display.hasZebra){
         classes.push('rE');
      }
      if(this._selected[key] !== undefined)
         classes.push('ws-browser-selected');
      if(this._selectedPart && this._selectedPart[key] !== undefined)
         classes.push('ws-browser-selected-part');

      if (this.isHierarchyMode()){
         if(this.isTree() && this._turn === '' && isFolder){//проставление экспандеров в дереве
            if(this._options.display.viewMode !== 'foldersTree' || hasChild === true ){
               $(exp).addClass(isExpanded ? 'minus' : 'plus');
            } else if($ws._const.theme !== 'wi_scheme'){
               var imgPath = $ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/';
               $(exp).css('background', ['url(', $ws._const.wsRoot, imgPath + 'bullet.png', ') no-repeat scroll center center transparent'].join(''));
            }
         }

         var imw = $ws._const.Browser.iconWidth; //проставление отступов узлов в дереве
         padding += imw * level;
         padding += $ws._const.Browser.defaultCellPadding;
         padding += !isFolder && this.isTree() && this._turn !== ''
               ? imw : 0;

         row.setAttribute('parentId', record.get(this._hierColumnParentId));
         if(isFolder && (this._options.display.viewMode !== 'foldersTree' || hasChild))
            classes.push("ws-browser-tree-branch", "ws-browser-folder");

         if(isFolder){
            if(!this.isTree() || !isFolder || this._turn !== '' ||
                  ( this._options.display.viewMode === 'foldersTree' && !hasChild && $ws._const.theme === 'wi_scheme')){
               if(this._options.display.hierarchyIcons && this._options.display.hierarchyIcons !== $ws._const.Browser.hierarchyIcons){
                  exp.style.backgroundImage = ['url(', $ws._const.wsRoot, this._options.display.hierarchyIcons, ')'].join('');
               }
               exp.className += ' ' + (( hasChild || this.isTree() || this._turn !== '') ? ((isExpanded &&
                     this.isTree()) || this._turn !== '' ? 'icon-16 icon-OpenedFolder icon-primary' : 'icon-16 icon-Folder icon-primary') : 'ws-browser-icon item item');
            }
            if(this._options.display.folderIcon){
               $(exp).css('background',['url(', $ws.helpers.processImagePath(this._options.display.folderIcon), ') no-repeat scroll center center transparent'].join(''));
            }
         }
      }
      classes.push(visClass);
      if(classes.length > 0)
         row.className = classes.join(' ');

      if(!this._options.display.editAtThePlaceTemplate){
         var cells = row.childNodes;
         if((this.isHierarchy() || (this.isTree() && this._turn !=='')) && isFolder){
            var flag = false,
                  colspanEnd = 0,
                  k = 1,
                  lastTd,
                  td = this._createTdAtPlace(cells[0], -1, record, padding);
            for(var i = 1, len = this._columnMap.length; i < len; ++i){
               if (this._columnMap[i].useForFolder){
                  lastTd = this._createTdAtPlace(cells[k++],i,record,padding);
                  if (!flag){
                     colspanEnd = i;
                     flag = true;
                  }
               }
            }
            if (flag){
               td.colSpan = colspanEnd;
               lastTd.colSpan = this._getColumnsCount() - colspanEnd;
            } else
               td.colSpan = this._getColumnsCount();
         }
         else{
            var shift = this._needShowSelectionCheckbox() ? 1 : 0;
            for( i = 0, len = this._columnMap.length; i < len; ++i){
               this._createTdAtPlace(cells[i + shift], i, record, padding);//так как теперь первая td - это checkbox
            }
         }
      }
      this._rowsMap[key] = $(row);
      if (typeof(this._options.display.rowRender) == 'function')
         this._options.display.rowRender.apply(this, [record, $(row)]);
      return row;
   },
   _createTdAtPlace: function(td, colIndex, record, padding){
      var colDef = colIndex >= 0 ? this._columnMap[colIndex] : {
               type: 'Строка',
               render: null,
               field: this._options.display.titleColumn,
               title: this._options.display.titleColumn,
               allowEditAtThePlace: this._titleColumnIndex == -1 ? false : this._columnMap[this._titleColumnIndex].allowEditAtThePlace,
               textAlign: 'left',
               fixedSize: false
            },
            data = this._renderTD(colDef, record),
            container = $(td).find(".ws-browser-cell-container")[0],
            isBranch = this.isHierarchyMode() && record.get(this._hierColumnIsLeaf) === true;

      if(colIndex <= 0 && padding > 0){
         container.style.paddingLeft = padding + 'px';
      }

      if(this.isHierarchyMode() && colIndex <= 0){
         container = $(container).children(".ws-browser-text-container")[0];
      }

      data = this._appendDataToCellContainer($(container), data, isBranch, colDef.render, colDef.allowEditAtThePlace,
            record.getKey(), this.isHierarchyMode() ? record.get(this._hierColumnParentId) : undefined);

      if(!colDef.render){
         if(!(data instanceof Object && 'jquery' in data)){
            container.className += ' ws-browser-text-no-render';
         }
      }

      var disabledColumns = this._disabledEditCells[record.getKey()];
      if(disabledColumns !== undefined && (Object.isEmpty(disabledColumns) || disabledColumns[colDef.title] !== undefined)){
         this._disableEditCells($(td));
      }

      return td;
   },
   /**
    * Создаёт ячейку для добавления по месту
    * @param {Number} colIndex Номер колонки
    * @param {Object} [exp] Элемент для раскрытия дерева
    */
   _createTdTemplateAtPlace: function(colIndex, exp){
      var td = document.createElement('td'),
            colDef = colIndex >= 0 ? this._columnMap[colIndex] : {
               type: 'Строка',
               render: null,
               field: this._options.display.titleColumn,
               title: this._options.display.titleColumn,
               className: '',
               allowEditAtThePlace: this._titleColumnIndex == -1 ? false : this._columnMap[this._titleColumnIndex].allowEditAtThePlace,
               textAlign: 'left',
               fixedSize: false
            },
            className = $ws._const.Browser.type2ClassMap[colDef.type] || colDef.type,
            classes = [ 'ws-browser-cell' ];

      if(this._options.display.cutLongRows)
         classes.push('ws-browser-cell-cut');

      if(colDef.textAlign !== 'auto')
         classes.push('ws-browser-' + colDef.textAlign);
      else {
         if(className)
            classes.push('ws-browser-type-' + className);
      }
      if(colDef.className)
         classes.push(colDef.className);
      if(colDef.allowEditAtThePlace && !this.isReadOnly() && this.isEnabled()){
         classes.push('ws-browser-edit-column ws-browser-editable');
      } else {
         classes.push('ws-browser-mark-edit-place');
      }
      if(classes.length > 0)
         td.className = classes.join(' ');

      var element = document.createElement('div');
      element.className = 'ws-browser-cell-paddings';
      var container = document.createElement('div');
      container.className = 'ws-browser-cell-container' + (this._options.display.cutLongRows ? ' ws-browser-div-cut' : '');
      element.appendChild(container);
      if(exp)
         element.appendChild(exp);
      if(this.isHierarchyMode() && colIndex <= 0){
         var elem = document.createElement('div');
         elem.className = "ws-browser-text-container";
         container.appendChild(elem);
      }

      td.appendChild(element);
      if(colDef.allowEditAtThePlace)
         $(td).attr("coldefindex", colIndex < 0 ? this._titleColumnIndex : colIndex );
      return td;
   },
   /**
    * Добавляет в ячейку данные
    * @param {jQuery} cellContainer Контейнер, куда необходимо добавить данные
    * @param {*} data Данные, которые необходимо добавить
    * @param {Boolean} isBranch Добавляем ли мы в папку
    * @param {Boolean} isRender Используем ли мы функцию для отрисовки строки
    * @param allowEditAtThePlace
    * @param recordKey
    * @param parentId
    * @returns {*} Новый вид данных (возможно, их обновили)
    * @private
    */
   _appendDataToCellContainer: function(cellContainer, data, isBranch, isRender, allowEditAtThePlace, recordKey, parentId){
      if(!allowEditAtThePlace && !isRender && (data !== null && data !== undefined)){
         //Правит данные столбца для режима работы в один клик
         if(!this._options.useHoverRowAsActive && this._options.mode == 'oneClickMode'){
            var editMode = isBranch ? this._options.editBranchMode : this._options.editMode,
                  pageURL = (editMode == 'thisWindow') ? this.generateEditPageURL(recordKey, isBranch, parentId) : false,
                  linkContent = (editMode == 'thisWindow') && pageURL !== false ? ' class="ws-browser-link" href="' + pageURL + '"' :
                        'class="ws-browser-' + ( isBranch ? 'folder' : 'edit' ) + '-link" href="javascript:void(0)"';
            if( data instanceof Object && 'jquery' in data ) {
               data = $('<a ' + linkContent + ' />').append(data);
            } else if( data instanceof Array ) {
               data = $('<a ' + linkContent + '>' +
                     '<span class="ws-invisible ws-browser-ladder-element">' + data[0] + ' </span>' + data[1] + '</a>');
            } else {
               data = $('<a ' + linkContent + '>' + data + '</a>');
            }
         }
         else if(this._options.mode !== 'oneClickMode'){
            if(data instanceof Object && 'jquery' in data)
               data = $('<span/>').append(data);
            else
               data = $('<span>' + data + '</span>');
         }
      }
      if( data instanceof Array ) {
         data = $('<span style="visibility:hidden">' + data[0] + '</span><span>' + data[1] + '</span>');
      }
      cellContainer[0].innerHTML = '';
      if(data instanceof Object && "jquery" in data)
         cellContainer.append(data);
      else if(this._highlight)
         cellContainer.html(data);
      else
         cellContainer[0].innerHTML = (data === null || data === undefined) ?  '' : data;

      if(!isRender){
         if(data instanceof Object && 'jquery' in data){
            data.addClass('ws-browser-text-no-render');
         }
      }

      if(this._options.display.cutLongRows){
         var container = cellContainer[0];
         if(!isRender || !(data instanceof Object && 'jquery' in data))
            container.title = (data instanceof Object && 'jquery' in data) ? data.text() :
                  (container.textContent !== undefined ? container.textContent : container.innerText);
         $(container).addClass('ws-browser-div-cut');
      }
      return data;
   },
   _showEmptyDataBlock: function(){
      if(this._options.display.allowAddAtThePlace){
         var wsBrowser = this._container.find('.ws-browser');
         if(wsBrowser.find('tr').size() === 1) {
            if (this._emptyDataText) {
               this._emptyDataBlock.removeClass('ws-hidden');
            }
            this._heightChangedIfVisible();
         }
      }
   },
   _checkAllowEditAtThePlace: function(isBranch, allowEditAtThePlace){
      if (typeof(allowEditAtThePlace) === 'string'){
         return (allowEditAtThePlace === 'BranchesAndLeaves' || (isBranch && allowEditAtThePlace === 'Branches') ) ||
            (!isBranch && allowEditAtThePlace === 'Leaves');
      }
      return allowEditAtThePlace;
   },
   setReadOnly: function(status){
      var readOnly = !!status,
          i, j, l, cnt;
      if(this._addAtPlaceLinkRow !== undefined)
         this._addAtPlaceLinkRow.toggleClass('ws-browser-add-disabled', readOnly);
      if(readOnly){
         var rowCollection = this._body.find('tr[rowkey]'),
             tdCollection = [],
             rowkey = "",
             columnName = "",
             row, cellIndex;
         for(i = 0, l = rowCollection.length; i < l; i++){
            row = rowCollection[i];
            rowkey = row.getAttribute('rowkey');
            if(this._disabledEditCells[rowkey] !== false){
               this._editCellsCollection[rowkey] = [];
               if(!this._isComplexRenderStyle){
                  tdCollection = $(row).find('.ws-browser-edit-column');
                  for(j = 0, cnt = tdCollection.length; j < cnt; j++){
                     cellIndex = parseInt(tdCollection[j].getAttribute('coldefindex'), 10);
                     columnName = this._columnMap[cellIndex].title;
                     this._editCellsCollection[rowkey].push(columnName);
                     this.setCellsEditEnabled(rowkey, false, columnName);
                  }
               }
            }
         }
      } else {
         for(i in this._editCellsCollection){
            if (this._editCellsCollection.hasOwnProperty(i)) {
               if(!this._isComplexRenderStyle){
                  for(j = 0, cnt = this._editCellsCollection[i].length; j < cnt; j++){
                     this.setCellsEditEnabled(i, true, this._editCellsCollection[i][j]);
                  }
               }
            }
         }
         this._editCellsCollection = {};
      }
   },
   _createEditAtPlaceButtons: function(parentContainer){
      var self = this,
          options = [
             ['apply', 'Подтвердить изменения', function(event){
                //при нажатии на кнопку покажем, что идет процесс сохранения, установив в результат deferred сохранения новой записи
                this.setActive(true);
                event.setResult(this._editAreaKeyEnter());
             }],
             ['cancel', 'Отменить', function(event){
                self._editTdCancelWithReload();
                event.stopPropagation();
                event.preventDefault();
             }]
          ];
      var div = $('<div class="ws-browser-edit-buttons-block ws-hidden"></div>'),
          container = $('<div class="ws-browser-edit-buttons-container"></div>').prependTo(div);
      for(var i = 0; i < 2; ++i){
         var callback = options[i][2].bind(this);
         var option = $('<span class="ws-browser-edit-button-element ws-browser-edit-button-' + options[i][0] + '"></span>'),
            button = $('<span class="ws-browser-edit-button" title="' + options[i][1] + '"></span>')
            .appendTo(container)
            .append(option);
         if(!i) {
            if(this.isReadOnly()){
               button.addClass('ws-hidden');
            }
            new Button({
               element: option,
               name: 'apply',
               tooltip: options[i][1],
               image: 'sprite:icon-16 icon-Successful icon-done action-hover',
               handlers: {
                  'onActivated': callback
               }
            });
         } else {
            button.bind('click', callback);
            button.mousedown(function(e){
               e.stopPropagation();
               e.preventDefault();
            });
            button.addClass('ws-browser-cancel-edit');
         }
      }
      this._editAtPlaceButtons = div.appendTo(parentContainer);
   }
});
});