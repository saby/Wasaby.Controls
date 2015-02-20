/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 0:48
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.TreeView', ['js!SBIS3.CORE.HierarchyViewAbstract'], function( HierarchyViewAbstract ) {

   'use strict';

   $ws._const.Browser = $ws._const.Browser || {};
   $ws._const.TreeView = {
      recordsMoveOffset: {'top': 5, 'left': 5},
      treeLevelAttribute: 'treelevel',
      hierarchyIcons: 'img/browser/tree_icons.gif',
      iconWidth: 32,
      accordion: {
         padding: 16,
         levelIndent: 16
      }
   };

   $ws.single.DependencyResolver.register('SBIS3.CORE.TreeView', [], "SBIS3.CORE.DataViewAbstract/SBIS3.CORE.TableView/SBIS3.CORE.HierarchyViewAbstract");

   /**
    * @class $ws.proto.TreeView
    * <wiTag page=2>
    * @extends $ws.proto.HierarchyViewAbstract
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.TreeView'>
    * <options name='display'>
    * <options name='columns' type='array'>
    * <options>
    *    <option name='title' value='поле1'></option>
    *    <option name='field' value='поле1'></option>
    *    <option name='width' value='114'></option>
    * </options>
    * <options>
    *    <option name='title' value='поле2'></option>
    *    <option name='field' value='поле2'></option>
    *    <option name='width' value='114'></option>
    * </options>
    * </options>
    * </options>
    * </component>
    * @category Table
    * @designTime plugin /design/designPlugin
    */
   $ws.proto.TreeView = HierarchyViewAbstract.extend(/** @lends $ws.proto.TreeView.prototype */{
      /**
       * @event onFolderOpen При открытии папки.
       * Событие, происходящее при открытии папки.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} rowkey Первичный ключ открываемой папки.
       * @param {Array} keys Ключи записей открываемой папки.
       * @param {Array} rows Строки, которые будут отображены.
       * @example
       * <pre>
       *    dataView.subscribe('onFolderOpen', function(event, rowkey, keys, rows){
       *       rows.addClass('new-row');
       *    });
       * </pre>
       */
      /**
       * @event onFolderClose При закрытии папки.
       * Событие, происходящее при закрытии папки.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} rowkey Первичный ключ закрываемой папки.
       * @example
       * <pre>
       *    dataView.subscribe('onFolderClose', function(event, rowkey){
       *       this.setSelection(rowkey);
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} Выделять с учетом вложенности
             * <wiTag group="Управление" >
             * При установке этой опции будут выделяться дочерние элементы в дереве
             */
            selectChilds: '',
            display: {
               /**
                * @cfg {String} Иконка для открытого узла
                * <wiTag group="Отображение">
                */
               folderIconOpen: undefined,
               /**
                * @cfg {String} Иконка для закрытого узла
                * <wiTag group="Отображение">
                */
               folderIconClose: undefined,
               /**
                * @cfg {String} Иконка для отображения листов
                * <wiTag group="Отображение">
                */
               itemIcon: undefined,
               /**
                * @cfg {String} Разворот
                * <wiTag group="Управление">
                * Дерево будет распахнуто полностью.
                * @example
                * <pre>
                *    dataView.applyTurn(true);
                * </pre>
                * <pre>
                *    dataView.clearTurn();
                * </pre>
                * @see applyTurn
                * @see clearTurn
                * @variant folders только папки
                * @variant items листья и папки
                */
               expand:'',
               /**
                * @cfg {Boolean} Отображать корень
                * <wiTag group="Отображение">
                * Будет ли отображена папка, обозначающая корень дерева.
                */
               showRoot: false,
               /**
                * @cfg {String} Иконки с плюсами, минусами, папками, и т д
                * <wiTag noShow>
                */
               hierarchyIcons: $ws._const.TreeView.hierarchyIcons,
               /**
                * @cfg {Number} Значение отступа для уровня иерархии в px
                * <wiTag group="Отображение">
                * Каждый узел в представлении имеет отступ слева относительно родительского узла на указанное значение в px.
                * Если значение не указано, то по умолчанию отступ зависит от константы $ws._const.TreeView.iconWidth
                * @see setLevelPadding
                * @see getLevelPadding
                */
               levelPadding: $ws._const.TreeView.iconWidth
            },
            cssClassName: 'ws-treeview'
         },
         _selectAfterPathLoad: true,            //Выделять ли запись после загрузки пути в дереве
         _fullTreeExpand: false,                //Флаг того, что дерево полностью развернуто
         _expanded: {},                         //Флаги с открытыми ветками дерева
         _loaded: {},                           //Флаги загруженности веток дерева
         _rootNode: null,                       //Текущий корневой узел
         _currentRootId: null,                  //Текущий отображаемый узел
         _turn: "",                             //тип разворота
         _rowTemplate: undefined,               //Шаблон строки. Именно она будет копироваться
         _rowOptionsDefault: [],                //Опции, которые будут созданы при первом наведении мыши
         _selectedPart: {},                     //Частично выбранные папки (часть дочерних элементов выбрана, часть - нет)
         _disabledEditCells: {},                //Ключи записей, у которых выключено редактирование по месту. Если внутри есть объект, то там будуту названия колонок, для которых выключено редактирование по месту
         _hierColumnParentId: 'Раздел',         //Поле записи с "отцом" записи
         _hierColumnIsLeaf: 'Раздел@',          //Поле записи, является ли запись папкой
         _hierColumnHasChild: 'Раздел$',        //Поле записи, есть ли дочерние записи
         _useLoadChildsFlag: false,             //Используется ли флаг загрузки доступности детей
         _hasFirstRequest: false,               //Имеется ли первая загрузка данных
         _employeePadding: 0,                   //Дополнительный отступ для реестра с иконками 32 пикселя
         _additionalPadding: 3,                 //Дополнительный отступ дерева
         _insideOfAccordion: false,             //находится ли дерево внутри аккордеона
         _systemParams: {
            "ВидДерева": "",
            "HierarchyField": "",
            "Разворот": "",
            "ЗаголовокИерархии": "",
            "_ЕстьДочерние": false
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
            $ws._const.key.left,
            $ws._const.key.right,
            $ws._const.key.b,
            $ws._const.key.v
         ]
      },

      $constructor: function(){
         this._options.display.folderIconOpen = this.extractIconName(this._options.display.folderIconOpen);
         this._options.display.folderIconClose = this.extractIconName(this._options.display.folderIconClose);
         this._options.display.itemIcon = this.extractIconName(this._options.display.itemIcon);
         this._publishTreeEvents();
         this._createRowTemplate();
         this._initLoading();
         this._insideOfAccordion = this._container.parents().hasClass('ws-accordion');
      },

      extractIconName: function(iconName){
         var result = iconName && iconName.length ?
            (iconName.indexOf('sprite:') !== -1 ? iconName.slice(iconName.indexOf('sprite:') + 7) : iconName.slice()) : undefined;
         return result;
      },

      /**
       * Фильтрует то, что должно попасть в состояние
       * @param {Object} filter Фильтр браузера
       * @protected
       */
      _filterState: function(filter){
         $ws.proto.TreeView.superclass._filterState.apply(this, arguments);
         if( filter[this._hierColumnParentId] !== undefined ){
            delete filter[this._hierColumnParentId];
         }
      },
      /**
       * Инициализирует команды и события
       * @private
       */
      _publishTreeEvents: function(){
         this._publish('onFolderOpen', 'onFolderClose');
      },
      /**
       * Подписывается на готовность рекордсета, чтобы начать загрузку
       * @private
       */
      _initLoading: function(){
         var self = this;
         this._dReady.addCallback(function(){
            var filter = self._currentFilter,
               expand = self._options.display.expand,
               map = {
                  'onlyFolders': 'Только узлы',
                  'items': 'Только листья'
               };
            if(expand){
               filter['Разворот'] = 'С разворотом';
               filter['ВидДерева'] = expand in map ? map[expand] : 'С узлами и листьями';
            }
            if(self._hasFirstRequest){
               self.setQuery(filter);
            }
         });
      },
      setQuery : function(filter, doClear, keepPage, sorting, noLoad){
         //перед тем как установим фильтр в дерево забудем, что какие-то ветки были открыты
         if(!this._options.display.fixedExpand && !this._turn) {
            this._closeAll(!noLoad);
         }
         return $ws.proto.TreeView.superclass.setQuery.apply(this, arguments);
      },
      /**
       * Проверка записи - для модуля TreeViewAbstract (обработка клика по корневой записи)
       */
      checkRecord: function(record, row, event){
         if ($(event.target).hasClass('ws-browser-expander-container')) {
            return false;
         }
         if (this._isIdEqual(this._rootNode && row.attr('rowkey')) && record === undefined) {
            this._notify('onRowActivated', row);
            return false;
         }
         return true;
      },
      /**
       * Инициализирует горячие клавиши
       * @private
       */
      _initKeys: function(){
         $ws.proto.TreeView.superclass._initKeys.apply(this, arguments);
         this._registerShortcut($ws._const.key.left, $ws._const.modifiers.nothing, this._keyLeft);
         this._registerShortcut($ws._const.key.right, $ws._const.modifiers.nothing, this._keyRight);
      },
      /**
       * Проверяет текущую (выбранную) запись. Если она есть, то выполняет callback с аргументами: activeRecord и key.
       * Преемущественно создана для уменьшения дублирования кода.
       * @param {Function} callback Обработчик
       * @private
       */
      _checkActiveRecord: function(callback){
         var activeRecord = this.getActiveRecord();
         if(activeRecord){
            var key = activeRecord.getKey();
            callback.call(this, activeRecord, key);
         }
      },
      /**
       * Закрывает текщуую ветку дереве. Или переходит к родителю
       * @private
       */
      _keyLeft: function(){
         if(this.isEnabled()){
            var self = this;
            this._checkActiveRecord(function(activeRecord, key){
               if(self._expanded[key]){
                  self._processTreeClick(key, true);
               }
               else{
                  var parent = activeRecord.get(self._hierColumnParentId);
                  if(self.haveRow(parent)){
                     self.setActiveRow(self.findRow(parent));
                  }
               }
            });
         }
      },
      /**
       * Открывает текущую ветку в дереве. Или переходит к первой дочерней строчке
       * @private
       */
      _keyRight: function(){
         if(this.isEnabled()){
            var self = this;
            this._checkActiveRecord(function(activeRecord, key){
               if(self._expanded[key]){
                  var children = self._currentRecordSet.recordChilds(key);
                  if(children.length && self.haveRow(children[0])){
                     self.setActiveRow(self.findRow(children[0]));
                  }
               }
               else{
                  self._processTreeClick(key, false);
               }
            });
         }
      },
      /**
       * Обрабатывает открытие папки по клику (двойному клику, в зависимости от режима)
       * @param {String} rowkey Ключ записи
       * @param {$ws.proto.Record} record Запись
       * @private
       */
      _clickOnFolder: function(rowkey, record){
         this._processElementClick(rowkey, record);
      },
      _elementActivated: function(activeRow, ignoreSelection) {
         var currentRecord = this.getActiveRecord(activeRow),
             isBranch = currentRecord.hasColumn(this._hierColumnIsLeaf) ? currentRecord.get(this._hierColumnIsLeaf) : false;

         if(this._selectMode && isBranch && this._options.folderLinkAction == 'activate'){
            this.confirmSelection([currentRecord]);
            return;
         }

         $ws.proto.TreeView.superclass._elementActivated.apply(this, arguments);
      },
      /**
       * <wiTag group="Отображение" >
       * Открыть или закрыть ветку(видимую) дерева.
       * @param rowkey Ключ записи.
       * @example
       * <pre>
       *    dataView.toggleBranch("123");
       * </pre>
       */
      toggleBranch: function(rowkey){
         this._processTreeClick(rowkey, !!this._expanded[rowkey]);
      },
      /**
       * Обработка клика на элементе
       * @param {String} rowkey Идентификатор записи
       * @param {$ws.proto.Record} record Запись
       * @param {Boolean} [clickToExpanderIcon] Произошел ли клик по иконке скрытия/раскрытия узла
       * @returns {$ws.proto.Deferred|null}
       */
      _processElementClick: function(rowkey, record, clickToExpanderIcon){
         var result = this._processTreeClick(rowkey, !!this._expanded[rowkey], clickToExpanderIcon, record);
         if(!result){
            this._notifySetCursor(record);
         }
         return result;
      },
      /**
       * Добавляет событие движения мыши для отрисовки опций строки
       */
      _initEvents: function(){
         $ws.proto.TreeView.superclass._initEvents.apply(this, arguments);
         var self = this,
            rowkey,
            parent = this._body.parent()[0];
         var expandTree = function(event){
            event.stopPropagation();
            var row = $(this).parents('tr'),
               rowkey = row.attr('rowkey');
               rowkey = rowkey === "null" ? null : rowkey;
            var record = self._currentRecordSet.contains(rowkey) ?
                  self._currentRecordSet.getRecordByPrimaryKey(rowkey) :
                  undefined;
            if(self.isEnabled() && !$(event.target).hasClass('ws-browser-expander-container')){
               var flag = self._notify('onRowClick', row, record, self._columnMap[0].title, self._columnMap[0].field);
               if(flag !== false){
                  self._processElementClick(rowkey, record);
               }
               else{
                  self._notifySetCursor(record);
               }
            } else {
               self.setActiveElement(row, false, true, true);
               self._processElementClick(rowkey, record, true);
            }
         };
         $('.ws-browser-expander', parent).live('click', expandTree);
      },
      /**
       * Создаёт шаблоны строк для создания из них всех остальных строк
       */
      _createRowTemplate: function(){
         this._rowTemplate = document.createElement('tr');
      },
      /**
       * Задает маппинг колонок браузера, сливая в один массив все реально отображаемые колонки, с полным набором их параметров.
       */
      _mapColumns: function(){
         var configColumns = this._options.display.columns,
            recivedColumns = this._currentRecordSet && this._currentRecordSet.getColumns(),
            columns = configColumns ? configColumns : recivedColumns;
         if(columns){
            $ws.proto.TreeView.superclass._mapColumns.apply(this, arguments);
         }
      },
      /**
       * Шаблон первой ячейки в строке
       * @param {Object} options Параметры ячейки
       * @return {String}
       * @private
       */
      _cellFirstTemplate: function(options){
         var template = doT.template(
            '<td class="{{=it.cellClassName}}{{? it.expanderClassName }} ws-browser-folder-column{{?}}" coldefindex={{=it.coldefindex}}{{? it.colspan }} colspan="{{= it.colspan }}"{{?}}>' +
               '<div class="{{=it.containerClassName}}" style="padding-left: {{=it.padding}}px;">' +
                  '{{? it.expanderClassName }}' +
                     '<span class="{{=it.expanderClassName}}"></span>' +
                  '{{?}}' +
               '<div class="ws-browser-tree-text-container ws-browser-text-container">{{=it.data}}</div>' +
               '</div>' +
            '</td>');
         this._cellFirstTemplate = template;
         return template(options);
      },
      /**
       * Шаблон остальных ячеек
       * @param {Object} options Параметры ячейки
       * @return {String}
       * @private
       */
      _cellGeneralTemplate: function(options){
         var template = doT.template(
            '<td class="{{=it.cellClassName}}" coldefindex={{=it.coldefindex}}>' +
               '<div class="{{=it.containerClassName}}">{{=it.data}}</div>' +
            '</td>');
         this._cellGeneralTemplate = template;
         return template(options);
      },
      /**
       * Возвращает html-текст нужной строки
       * @param {Object} options Параметры строки и её содержимого
       * @return {String}
       * @private
       */
      _rowHTMLTemplate: function(options){
         var template = doT.template(
            '<tr class="{{=it.className}}" rowkey="{{=it.rowkey}}" treelevel="{{=it.level}}"{{? it.parentId !== undefined }} parentId="{{=it.parentId}}"{{?}}>' +
                  '{{? it.useCheckbox}}' +
                     '<td class="ws-browser-cell {{? it.checkbox}}ws-browser-checkbox-holder{{?}}">' +
                        '{{? it.checkbox }}<span class="ws-browser-checkbox"/>{{?}}' +
                     '</td>' +
                  '{{?}}' +
               '{{~it.cells :cell:index }}' +
                  '{{ if(index === 0){ ' +
                     'out += this._cellFirstTemplate(cell);' +
                  '}' +
                  'else{' +
                     'out += this._cellGeneralTemplate(cell);' +
                  '} }}' +
               '{{~}}' +
            '</tr>'
         );
         this._rowHTMLTemplate = template;
         return template.call(this, options);
      },
      /**
       * Возвращает html-код строки с параметрами
       * @param {String|null} key Первичный ключ записи
       * @param {Number} level Уровень вложенности строки. Чем больше уровень, тем больше отступ слева
       * @param {Boolean} isBranch Создаём ли мы строку для папки или нет
       * @param {Array} cells Массив с информацией о ячейках
       * @param {String|null} [parentId] Идентификатор родительской записи
       * @returns {String}
       * @private
       */
      _rowHTML: function(key, level, isBranch, cells, parentId) {
         var classes = ['ws-browser-table-row ws-visible'],
            rowConfig = {};
         if (typeof key == 'string') {
            key = key.replace(/'/g, "&#039;");
         }

         this._addClasses(classes, key, isBranch);
         rowConfig.className = classes.join(' ');
         rowConfig.rowkey = key;
         rowConfig.level = level;
         rowConfig.parentId = parentId;
         rowConfig.useCheckbox = this._needShowSelectionCheckbox();
         rowConfig.checkbox = this._options.selectionType === 'all' || this._options.selectionType === 'node' && isBranch ||
            this._options.selectionType === 'leaf' && !isBranch;

         rowConfig.cells = cells;
         return this._rowHTMLTemplate.call(this, rowConfig);
      },
      _addClasses: function(classes, key, isBranch){
         if(isBranch) {
            classes.push('ws-browser-folder');
            if (this.isFoldersTree()) {
               classes.push('ws-browser-foldersTree');
            }
         }
         if (this._options.display.hasZebra) {
            classes.push('rE');
         }
         if (this._selected[key] !== undefined) {
            classes.push('ws-browser-selected');
         }
         if (this._selectedPart[key] !== undefined) {
            classes.push('ws-browser-selected-part');
         }
      },
      /**
       * Возвращает html-текст строки
       * @param {$ws.proto.Record} record Запись
       * @param {Number} level Уровень вложенности в дереве
       * @return {String}
       * @private
       */
      _rowHTMLString: function(record, level, firstDraw){
         var key = record.getKey(),
            isBranch = record.get(this._hierColumnIsLeaf),
            editMode = this._options.editMode,
            parentId = record.get(this._hierColumnParentId),
            cells = [];

         if(this._selected[key] !== undefined && firstDraw && Array.indexOf(this._selectedRecords, record) == -1){
            this._selectedRecords.push(record);
         }

         for(var i = 0, len = this._columnMap.length; i < len; ++i){
            cells.push(this._cellTemplateOptions(record, level, editMode, i, isBranch, i, false));
         }
         return this._rowHTML(key, level, isBranch, cells, parentId);
      },
      /**
       * Формирование  строки таблицы
       *
       * @param   {$ws.proto.Record}   record   строка RecordSet
       * @param   {Number}             level    уровень вложенности строки, используется для просчёта отступов
       * @return  {HTMLTableRowElement}         стандартный html-объект, строку
       */
      _createTR: function(record, level){
         var row = this._rowTemplate.cloneNode(false),
            key = record.getKey(),
            classes = ['ws-browser-table-row ws-visible'],
            isBranch = record.get(this._hierColumnIsLeaf),
            contents = [],
            editMode = this._options.editMode;

         this._addClasses(classes, key, isBranch);
         row.className = classes.join(' ');

         row.setAttribute('rowkey', key);
         row.setAttribute('treelevel', level);
         row.setAttribute('parentId', record.get(this._hierColumnParentId));

         if(this._needShowSelectionCheckbox()){
            var hasCheckbox = this._options.selectionType === 'all' || this._options.selectionType === 'node' && isBranch ||
                                                      this._options.selectionType === 'leaf' && !isBranch;
            contents.push(['<td class="ws-browser-cell ', (hasCheckbox ? 'ws-browser-checkbox-holder' : ''), '">',
                              (hasCheckbox ? '<span class="ws-browser-checkbox"/>' : ''),
                           '</td>'].join('')
            );
         }

         for(var i = 0, len = this._columnMap.length; i < len; ++i){
            var options = this._cellTemplateOptions(record, level, editMode, i, isBranch);
            if(i === 0){
               contents.push(this._cellFirstTemplate(options));
            }
            else{
               contents.push(this._cellGeneralTemplate(options));
            }
         }
         if($ws._const.browser.isIE && (!$ws._const.browser.isModernIE || $ws._const.browser.isIE9)){
            $(row).html(contents.join(''));  //IE8- не умеет в данном случае корректно создавать ячейки таблицы, требуется jQuery
         }
         else{
            row.innerHTML = contents.join('');  //Этот способ предпочтительнее - он не медленнее, а иногда быстрее предыдущего на треть
         }
         this._rowsMap[key] = $(row);
         if(this._options.display.rowRender){
            this._options.display.rowRender.apply(this, [record, $(row)]);
         }
         //inspection: Node !== HTMLTableRowElement
         //noinspection JSValidateTypes
         return row;
      },
      /**
       * Выполняет указанную функцию для всех отображаемых корней дерева
       * @param {Function} func Функция, которая будет выполнена. Будет запущена от контекста дерева с аргументом-идентификатором корня
       * @private
       */
      _executeFuncForRoots: function(func) {
         var roots;
         if (this._showAllRoots) {
            roots = this._currentRecordSet.getLoadedRoots();
         } else {
            roots = [this._rootNode];
         }
         $ws.helpers.forEach(roots, func, this);
      },
      /**
       * Проходит по строкам рекордсета, рисует нужные
       */
      _drawBodyCycle: function(){
         var tableBody = $('<tbody/>'); //Новое tbody для таблицы
         this._rowsMap = {}; //Забываем ссылки на старые строки
         if(this._options.display.expand){
            this._expanded[this._rootNode] = 2;
         }
         if (this._options.display.showRoot) {
            this._createRoot(tableBody);
         }
         var oldBody = this._body;
         this._body = tableBody;
         if (!this._options.display.showRoot || this._expanded[this._rootNode]) {
            if(this._options.display.expand === 'items'){
               this._drawList();
            }
            else{
               this._firstDraw = oldBody.hasClass('ws-browser-body'); //Проверка, первый раз рендерим или нет. Нужна для правильного формирования массива с записями
               this._executeFuncForRoots(this._drawBranch);
            }
         } else {
            this._updateAfterDraw();
         }
         if(this._options.display.allowHorizontalScroll){
            this._emptyDataScroller.toggleClass('ws-hidden', this._count);
         }
         oldBody.remove();
         this._data.append(this._body);
      },
      /**
       * Создаёт строку "Корень"
       * @param {jQuery} tableBody Элемент, в который нужно добавлять строчки
       * @private
       */
      _createRoot: function(tableBody) {
         var key = this._rootNode,
            userExpanded = 'ws-browser-expander-container ws-browser-icon-user ws-browser-expander ',
            defExpanded = 'ws-browser-expander-container ws-browser-icon ws-browser-expander',
            cell = {
               cellClassName: 'ws-browser-cell',
               containerClassName: 'ws-browser-cell-container  ws-browser-div-cut',
               coldefindex: 0,
               colspan: this.getColumns().length,
               padding: $ws._const.Browser.defaultCellPadding,
               expanderClassName: (this._options.display.folderIconClose !== undefined && this._options.display.folderIconOpen !== undefined) ?
                                  userExpanded + (this._expanded[key] ? this._options.display.folderIconOpen + ' minus' : this._options.display.folderIconClose + ' plus') :
                                  defExpanded + (this._expanded[key] ? ' minus' : ' plus'),
               checkbox: ((this._needShowSelectionCheckbox() && this._options.selectionType !== 'leaf') ? 'ws-browser-checkbox' : 'ws-browser-checkbox-holder'),
               data: this._options.display.rootName
            },
            html = this._rowHTML(key, 0, true, [cell]);
         tableBody.append(this._rowsMap[key] = $(html));
      },
      /**
       * <wiTag group="Управление" >
       * Раскрыть/закрыть всё дерево, а не только текущую ветку.
       * @param {Boolean} expand Раскрывать ли.
       * @param {Boolean} [noLoad] Загружать ли.
       * @example
       * <pre>
       *    dataView.applyTurnTree(true);
       * </pre>
       */
      applyTurnTree: function(expand, noLoad){
         if(this._options.display.fixedExpand){
            return;
         }
         if(expand){
            this._fullTreeExpand = true;
            this._expandTreeAll(noLoad, this._rootNode);
         }
         else{
            this._fullTreeExpand = false;
            //closeAll не вызывет перезагрузку вообще никогда, тогда как в loaded из-за фильтров может стоять
            // загруженный раздел, тогда как на деле его надо перезагрузить
            if (!noLoad) {
               this._loaded = {};
            }
            this._closeAll(noLoad);
         }
      },
      /**_expandAll вызывют только из Иерархии, поэтому здесь только переопределяем и ничего не делаем
       Убрать нельзя, ибо вызываем еще и из _prepareDataSource*/
      _expandAll: function(withFolders, noLoad){
      },
      /**
       * Полностью разворачивает указанную ветку дерева
       * @param {Boolean} noLoad Если указано, то изменения не отобразятся внешне и загрузки не произойдёт
       * @param {String} rowkey Идентификатор папки, которую нужно развернуть
       */
      _expandTreeAll: function(noLoad, rowkey){
         this._expanded[rowkey] = 2;
         this._currentFilter['Разворот'] = 'С разворотом';
         if(!noLoad){
            if(this._options.display.partiallyLoad){
               var self = this;
               this._clearBranch(rowkey); //Очищаем текущие строчки
               this._updateActiveRow();
               this._toggleExpander(rowkey, true);
               this._loaded[rowkey] = true;
               this._currentRecordSet.loadNode(rowkey, false, 0, true, undefined, {browserFolder: true}).addCallback(function(){
                  //Могут раскрыть дерево, когда не было ни одной загруженной записи.
                  if(self._currentRecordSet.getRecordCount()){
                     if (self._emptyDataText) {
                        self._emptyDataBlock.addClass('ws-hidden');
                     }
                  }
                  self._hideLoadingIndicator();
                  self._clearBranch(rowkey); //Очищаем текущие строчки, за время загрузки мы могли успеть загрузить папку без вложенных папок и показать её, тем самым строчки будут двоиться
                  var drawResult = self._drawBranch(rowkey);
                  self._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
                  self._heightChangedIfVisible();
               });
            }
            else{
               this._clearBranch(rowkey);
               this._openBranch(rowkey);
               this._heightChangedIfVisible();
            }
         }
      },
      /**
       * <wiTag noShow>
       * Раскрывает все загруженные ветки дерева при отображении браузера в режиме дерева.
       */
      openAll: function(){
         var self = this;
         $(this._body).find('tr.ws-browser-folder').each(function(){
            var rowkey = $(this).attr('rowkey');
            rowkey = rowkey === "null" ? null : rowkey;
            self._expanded[rowkey] = 1;
         });
         this._reloadBody();
      },
      /**
       * <wiTag group="Управление" >
       * Закрыть ветку дерева с указанным идентификатором.
       * @param {String} rowkey Идентификатор строки.
       * @example
       * <pre>
       *    dataView.hideBranch("123");
       * </pre>
       */
      hideBranch: function(rowkey){
         if(this._turn === ''){
            this._processTreeClick(rowkey, true);
         }
      },
      /**
       * <wiTag group="Управление" >
       * Получить признак, открыта или закрыта ветка с указанным идентификатором.
       * @param {String} rowkey Идентификатор записи.
       * @returns {Boolean} Признак открыта ли ветка.
       * @example
       * <pre>
       *    if(dataView.isTreeFolderExpanded("123"))
       *       dataView.hideBranch("123");
       * </pre>
       */
      isTreeFolderExpanded: function(rowkey){
         return !!this._expanded[rowkey];
      },
      /**
       * Действия, которые нужно сделать при загрузке пути
       * @param {String} rowkey Ключ записи
       * @param {Boolean} noSelection Флаг того, что запись не нужно выделять
       */
      _showBranchAfterPathLoad: function(rowkey, noSelection){
         if(noSelection){
            this._selectAfterPathLoad = rowkey;
         }
      },
      /**
       * Разворачивает указанную ветку дерева по id парента
       * @param {String} rowkey идентификатор парента
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showActiveFolderOrElement: function(rowkey, noSelection){
         if(this._isIdEqual(rowkey, this._rootNode)){
            if(!this._expanded[this._rootNode]){
               if(this.haveRow(rowkey)){
                  this._processTreeClick(rowkey, false);
               }
               if(!noSelection){
                  this.setActiveElement(this._body.find('tr[rowkey="' + rowkey + '"]'));
               }
            }
            return undefined;
         }
         var way = [],
            idpr = rowkey,
            record,
            fldBranchName = this._hierColumnIsLeaf,
            fldParentIdname = this._hierColumnParentId;
         if(idpr && idpr != this._rootNode && !this._currentRecordSet.contains(idpr)){//Запись не содержится в рекордсете - выходим
            return undefined;
         }
         record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
         if(!record.get(fldBranchName))//Если это не папка, то возвращаемся на уровень вверх
            idpr = record.get(fldParentIdname) || null;
         //Теперь идём вверх до конца, запоминаем путь
         while(idpr && idpr != this._rootNode){
            way.push(idpr);
            if(this._currentRecordSet.contains(idpr))
               record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
            else
               throw new Error('Something wrong with the showBranch!');

            idpr = record.get(fldParentIdname) || null;
         }
         if(this._options.mode === 'navigationMode'){
            this._closeOtherBranches(rowkey);
         }
         //Идём в обратном порядке, чтобы раскрывать ветки правильно
         for(var i = way.length - 1; i >= 0; --i){
            record = this._currentRecordSet.getRecordByPrimaryKey(way[i]);
            if(record.get(this._hierColumnIsLeaf) === false){
               rowkey = way[i];
               break;
            }
            if(!this._expanded[way[i]]){
               this._expanded[way[i]] = 1;
            }
         }
         if(this._options.display.partiallyLoad && this._currentRecordSet.getRecordByPrimaryKey(rowkey).get(fldBranchName) && !this._loaded[rowkey]){
            var result = this._currentRecordSet.loadNode(rowkey, false),
               self = this;
            if(!noSelection){
               result.addCallback(function(){
                  self.setActiveElement(self._body.find('tr[rowkey="' + rowkey + '"]'));
               });
            }
            return result;
         }
         else{
            this._drawBody();
            this._updatePager();
         }
         if(!noSelection){
            this.setActiveElement(this._body.find('tr[rowkey="' + rowkey + '"]'));
         }
         return undefined;
      },
      /**
       * Обрабатывает загрузку рекордсета, в который пришёл путь до папки в showBranch
       * @param {Event}                eventState  Состояние события
       * @param {$ws.proto.RecordSet}  recordSet   Рекордсет, который был загружен
       * @param {Boolean}              isSuccess   Успешность запроса
       */
      _pathRecordSetLoaded: function(eventState, recordSet, isSuccess){
         this._wayRS = recordSet;
         if(isSuccess){
            //Мы загрузили путь до узла
            var path = this._wayRS.getWay(),
               record,                                            //Текущая запись из рекордсета
               way = [];                                          //Массив с путём до нужной записи
            if(this._rootNode && path !== null && !path.contains(this._rootNode))
               return;

            if (!path) {
               $ws.single.ioc.resolve('ILogger').error('TreeView', 'Requires way ("p") in request result');
               return;
            }

            path.rewind();
            while((record = path.next()) !== false){//В дереве делаем массив ключей, которые нужно будет подгрузить
               if(record.get(this._hierColumnIsLeaf) === false){
                  break;
               }
               var key = record.getKey();

               way.push(key);
               this._expanded[key] = 1;
               this._loaded[key] = true;
            }
            if(way.length){
               var loading = this._wayRS.getLoadingId();
               if(loading instanceof Array){
                  loading = loading[0];
               }
               if(this._selectAfterPathLoad === true){
                  this._hovered = loading;
                  this._activeElement = undefined;
               }
               else{
                  this._selectAfterPathLoad = true;
               }
               this._systemParams[this._hierColumnParentId] = way;
               var deferred = this._currentRecordSet.loadNode(way, false);
               if(!this._wayRSDeferred.isReady()){
                  this._wayRSDeferred.dependOn(deferred);
               }
               if(this._options.mode === 'navigationMode'){
                  var self = this;
                  deferred.addCallback(function(){
                     self._closeOtherBranches(way[way.length - 1]);
                     self.refresh();
                  });
               }
            }
            else
               this._wayRSDeferred.callback();
         }
      },
      /**
       * Обновляет текущую строчку после перерисовки
       * @private
       */
      _updateActiveRow: function(){
         if(this._activeElement && this._activeElement.closest('html').size() === 0 || !this._activeElement && this._hovered){
            var newRow = (this._hovered && this.haveRow(this._hovered)) ? this.findRow(this._hovered) : undefined;
            this.setActiveElement(newRow, false, true);
         }
      },
      /**
       * Очищает дочерние строчки у указанной записи
       * @param {String} rowkey Идентификатор записи
       * @private
       */
      _clearBranch: function(rowkey){
         var row,
            prevRow,
            treeLevel,
            rowLevel;
         if(this.haveRow(rowkey)){
            row = this.findRow(rowkey);
            treeLevel = parseInt(row.attr($ws._const.TreeView.treeLevelAttribute), 10) || 0;
            row = row.next();
         }
         else if(this._isIdEqual(rowkey, this._rootNode)){
            treeLevel = -1;
            row = this._body.find('tr').eq(0);
         }
         else{
            return;
         }
         while(row.length){
            rowLevel = parseInt(row.attr($ws._const.TreeView.treeLevelAttribute), 10) || 0;
            if(rowLevel <= treeLevel){
               break;
            }
            this._rowsMap[row.attr('rowkey')] = undefined; //Чистим ссылку
            prevRow = row;
            row = row.next();
            prevRow.remove();
         }
      },
      /**
       * Закрывает ветку дерева (удаляет строчки) и меняет плюсы-минусы
       * @param {String} rowkey Первичный ключ записи, ветку которой необходимо закрыть
       * @private
       */
      _closeBranch: function(rowkey){
         this._toggleExpander(rowkey, false);
         this._clearBranch(rowkey);
         this._updateClassesLastRow();
         this._notify('onFolderClose', rowkey);
      },
      _updateClassesLastRow: function() {
         this._body.find('.ws-browser-table-row-last').removeClass('ws-browser-table-row-last');
         this._body.find('tr:last').addClass('ws-browser-table-row-last');
      },
      /**
       * Выполняет для каждой видимой записи внутри папки указанную функцию
       * @param {String|null} rowkey Идентификатор записи
       * @param {Number} treeLevel Уровень вложенности в дереве
       * @param {Boolean} expanded Открыта ли эта папка полностью (ctrl+b)
       * @param {Function} callback Функция, которую нужно вызвать для указанной строки
       * @private
       */
      _drawFolder: function(rowkey, treeLevel, expanded, callback){
         var childs = this._currentRecordSet.recordChilds(rowkey);
         for(var i = 0, len = childs.length; i < len; ++i){
            var record = this._currentRecordSet.getRecordByPrimaryKey(childs[i]),
               key = record.getKey();
            if(record.get(this._hierColumnIsLeaf) &&
               this._expanded[key] === undefined &&
               (this._expanded[rowkey] === 2 || expanded) &&
               (!this._useLoadChildsFlag ||
                  this._currentRecordSet.recordChilds(key).length > 0 ||
                  !record.get(this._hierColumnHasChild))){
               this._expanded[key] = 1;
            }
            callback(record, treeLevel);
            if(record.get(this._hierColumnIsLeaf) === true && this._expanded[key]){
               this._drawFolder(key, treeLevel + 1, this._expanded[rowkey] === 2 || expanded, callback);
            }
         }
         if(this._expanded[rowkey] === 2){
            this._expanded[rowkey] = 1;
         }
         this._loaded[rowkey] = true;
      },
      /**
       * Рекурсивно создаёт строчки дерева
       * @param {String|null} rowkey Идентификатор записи
       * @returns {Object} Возвращает объект с ключами keys и rows, к примеру: {keys: [1, 2, 3], rows: [&lt;tr&gt;, &lt;tr&gt;, &lt;tr&gt;]}
       * @private
       */
      _drawBranch: function(rowkey){
         var parentRow = this.haveRow(rowkey) && this.findRow(rowkey),
            parentTreeLevel = parentRow && parseInt(parentRow.attr($ws._const.TreeView.treeLevelAttribute), 10) + 1 || 0,
            fragment = document.createDocumentFragment(),
            result = {keys: [], rows: $()},
            self = this;
         if(this._body[0].childNodes.length){
            this._drawFolder(rowkey, parentTreeLevel, false, function(record, treeLevel){
               var row = self._createTR(record, treeLevel);
               result.keys.push(record.getKey());
               result.rows.push(row);
               fragment.appendChild(row);
            });
         }
         else{
            var html = '';
            //TODO сделать что-то с  _fullTreeExpand
            this._drawFolder(rowkey, parentTreeLevel, this._fullTreeExpand, function(record, treeLevel){
               html += self._rowHTMLString(record, treeLevel, self._firstDraw);
            });
            this._body.html(html);
            var rows = this._body.children();
            for(var i = 0, len = rows.length; i < len; ++i){
               var key = rows.eq(i).attr('rowkey');
               result.keys.push(key);
               result.rows.push(rows.get(i));
               this._rowsMap[key] = rows.eq(i);
               if(this._options.display.rowRender){
                  this._options.display.rowRender.apply(this, [this._currentRecordSet.getRecordByPrimaryKey(key), rows.eq(i)]);
               }
            }
         }
         if(parentRow && parentRow.length){
            this._body[0].insertBefore(fragment, parentRow[0].nextSibling);
         }
         else{
            this._body.append(fragment);
         }
         this._updateAfterDraw();
         return result;
      },
      /**
       * Обновляет количество записей, текст в футере, и т..д
       * @private
       */
      _updateAfterDraw: function(){
         //hasNextPage может вернуть true и в количество записей запишется это самое true!
         this._count = typeof(this._currentRecordSet.hasNextPage()) !== 'number' ? this._currentRecordSet.getRecordCount() : this._currentRecordSet.hasNextPage();
         this._updatePager();
         this._updateActiveRow();
         this._updateClassesLastRow();
      },
      /**
       * Создаёт строки простым списком (для display.expand === 'items')
       * @private
       */
      _drawList: function(){
         var html = '',
            self = this;
         this._currentRecordSet.each(function(record){
            html += self._rowHTMLString(record, 0);
         });
         this._body.html(html);
         this._updateAfterDraw();
      },
      /**
       * Меняет плюс-минус у указанной строки
       * @param {String} rowkey Идентификатор строки
       * @param {Boolean} open Открывать ли
       * @private
       */
      _toggleExpander: function(rowkey, open){
         var
               row = this.haveRow(rowkey) && this.findRow(rowkey),
               changeIcon = function (oldClass, newClass) {
                     row.find('.ws-browser-expander')
                           .removeClass(this._options.display[oldClass])
                           .addClass(this._options.display[newClass]);
               };

         if(row){
            if (this._options.display.folderIconOpen !== undefined && this._options.display.folderIconClose !== undefined) {
               var iconClasses = ['folderIconClose', 'folderIconOpen'];
               changeIcon.apply(this, open ? iconClasses : iconClasses.reverse());

            } else {
               row.find('.ws-browser-expander').toggleClass('minus', open).toggleClass('plus', !open);
            }
         }
      },
      /**
       * Открывает ветку дерева, создаёт известные записи
       * @param {String} rowkey Идентификатор записи
       * @private
       */
      _openBranch: function(rowkey){
         if(this.haveRow(rowkey)){
            this._toggleExpander(rowkey, true);
         }
         var drawResult = this._drawBranch(rowkey);
         this._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
      },
      /**
       * Обработка клика в дереве
       * @param {String}  rowkey    Идентификатор строки, по которой кликнули
       * @param {Boolean} doClose   Закрывается ли ветка
       * @param {Boolean} [clickToExpanderIcon] Произошел ли клик по иконке скрытия/раскрытия узла
       * @param {Boolean} [record] запись для проверки есть ли у записи дети
       * @returns {$ws.proto.Deferred|null|Boolean}
       */
      _processTreeClick: function(rowkey, doClose, clickToExpanderIcon, record){
         if(this._options.display.fixedExpand === true && this._options.mode !== 'navigationMode') {
            return null;
         }
         var result,
            closed = false,
            contains = this._currentRecordSet.contains(rowkey),
            isBranch = contains && this._currentRecordSet.getRecordByPrimaryKey(rowkey).get(this._hierColumnIsLeaf) || !contains;
         if(this._options.mode === 'navigationMode' && !!this._expanded[rowkey] && !(this._options.display.isRightAccordion && clickToExpanderIcon)){ //В режиме навигации не закрываем папки
            return null;
         }
         if(doClose){
            this._expanded[rowkey] = 0;
         }
         else{
            if(isBranch){
               this._expanded[rowkey] = 1;
            }
         }
         if(this._options.mode === 'navigationMode'){
            closed = this._closeOtherBranches(rowkey);
            if(closed){
               for(var i in this._expanded){
                  if(this._expanded.hasOwnProperty(i) && this._expanded[i] === 0){
                     this._closeBranch(i);
                  }
               }
            }
         }
         if(contains && !isBranch){
            this._heightChangedIfVisible(true);
            return null;
         }

         if(doClose){
            this._closeBranch(rowkey);
            this._heightChangedIfVisible(true);
            result = null;
         }
         else{
            //Не будем грузить и открывать папку в дереве папок, у которой нет деток.
            if (this.isFoldersTree() && record instanceof $ws.proto.Record && !this._hasRecordChildren(record)) {
               return null;
            }
            if(this._options.display.partiallyLoad && !this._loaded[rowkey]){
               this._loaded[rowkey] = true;
               this._toggleExpander(rowkey, true);
               var self = this;
               result = this._currentRecordSet.loadNode(rowkey, false, undefined, undefined, undefined, {browserFolder: true}, undefined, true).addCallback(function(size){
                     self._hideLoadingIndicator();
                     if(self._expanded[rowkey] && size){
                        var drawResult = self._drawBranch(rowkey);
                        self._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
                        self._heightChangedIfVisible(true);
                     }
                  });
            }
            else{
               this._openBranch(rowkey);
               this._heightChangedIfVisible(true);

               result = null;
            }
         }
         this._updatePager();
         return result ? result : null;
      },
      /**
       * Закрывает другие ветки дерева, кроме указанной
       * @param {String} rowkey Ключ ветки, которую оставить открытой
       * @returns {Boolean}
       * @private
       */
      _closeOtherBranches: function(rowkey){
         var opened = this._getItemParents(rowkey),
            opening = {},
            changes = false;
         for(var i = 0; i < opened.length; ++i){
            opening[opened[i]] = true;
         }
         for(i in this._expanded){
            if(this._expanded.hasOwnProperty(i)){
               if(this._expanded[i] && !opening[i]){
                  this._expanded[i] = 0;
                  changes = true;
               }
            }
         }
         for(i = 1; i < opened.length; ++i){
            if(opened.hasOwnProperty(i)){
               if(!this._expanded[opened[i]]){
                  var contains = this._currentRecordSet.contains(opened[i]);
                  if(contains && this._currentRecordSet.getRecordByPrimaryKey(opened[i]).get(this._hierColumnIsLeaf) || !contains){
                     this._expanded[opened[i]] = 1;
                     changes = true;
                  }
               }
            }
         }
         return changes;
      },
      /**
       * Закрывает всё в дереве
       * @param {Boolean} [noDraw] Если указано, то изменения не отобразятся
       */
      _closeAll: function(noDraw){
         this._expanded = {};
         if(this._options.display.partiallyLoad){
            this._systemParams['Разворот'] = 'Без разворота';
            this._currentFilter['Разворот'] = 'Без разворота';
         }
         if(!noDraw){
            this._drawBody();
         }
      },
      /**
       * Закрыть все открытые папки в дереве.
       * <wiTag group="Управление">
       */
      closeAll: function(){
         for(var key in this._expanded){
            if(this._expanded.hasOwnProperty(key)){
               if(!this._isIdEqual(key, this._rootNode)){
                  this._clearBranch(key);
               }
            }
         }
         this._expanded = {};
         this._heightChangedIfVisible();
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
       * Производит обработку параметров
       * @private
       */
      _configChecking: function(){
         this._options.display.usePaging = '';
         $ws.proto.TreeView.superclass._configChecking.apply(this, arguments);
         this._options.display.showPathSelector = false;
         this._rootNode = this._getDefaultRootNode();
         if(this.isFoldersTree()){//наличие дочерних элементов запрашиваем только для дерева папок
            this.setLoadChildFlag(true);
         }
         if(this._options.display.partiallyLoad){
            this._options.selectChilds = '';
         }
         if (this._options.display.showRoot) {
            this._expanded[this._rootNode] = 1;
         }
         if(this._options.display.levelPadding !== $ws._const.TreeView.iconWidth){
            this._additionalPadding = 0;
         } else if (this._container.hasClass('ws-treeview-employees') ) {
            this._employeePadding = 4;
         }
      },
      /**
       * Возвращает дефолтный корень дерева
       * @return {String|null}
       * @private
       */
      _getDefaultRootNode: function(){
         if(this._options.display.rootNode !== null && typeof(this._options.display.rootNode) === 'object'){
            var context = this.getLinkedContext(),
               rootNodeField = this._options.display.rootNode.fieldName,
               root;
            if((root = context.getValue(rootNodeField)) !== undefined){
               return root;
            }
         }
         return this._options.display.rootNode;
      },
      /**
       * Подготавливает источник данных
       * @private
       */
      _prepareDataSource: function(){
         $ws.proto.TreeView.superclass._prepareDataSource.apply(this, arguments);
         this._options.dataSource.hierarchyField = this._options.display.hierColumn;
         this._hasFirstRequest = (this._options.dataSource.firstRequest || this._options.dataSource.firstRequest === undefined);
         //Если мы строим дерево из кнопки 'convert' в тулбаре, разрешаем отображать не больше 1000 записей
         if (this._options.optionsSaver.display){
            this._options.dataSource.usePages = 'parts';
            this._options.dataSource.rowsPerPage = 1000;
         }
         this._options.dataSource.firstRequest = false;
         if(this._options.dataSource.filterParams[this._hierColumnParentId] === ""){ // запрашиваемый узел всегда должен уйти правильно
            this._options.dataSource.filterParams[this._hierColumnParentId] = this._rootNode;
         }
      },
      /**
       * Дописывает в фильтр системные параметры
       * @param {Object} filter Фильтр
       * @return {Object}
       * @protected
       */
      _prepareSystemParams: function(filter){
         if( filter[this._hierColumnParentId] === undefined ){
            filter[this._hierColumnParentId] = this._rootNode;
         }
         return $ws.proto.TreeView.superclass._prepareSystemParams.apply(this, arguments);
      },
      /**
       * Событие, поджигаемое при загрзузке данных.
       * @param {Event} eventState
       * @param {$ws.proto.RecordSet} recordSet
       * @param {Boolean} isSuccess Успешность запроса. Если не успешен - значит произошел Abort Ajax запроса
       * @param {Error} [error] Ошибка в случае неуспешного запроса
       * @param {Object} [options] Опции запроса
       */
      _onDataLoaded: function(eventState, recordSet, isSuccess, error, options){
         if (this._options.selectChilds) {
            this._rebuildPartialSelection(true);
         }
         if(!options || !options.browserFolder){
            $ws.proto.TreeView.superclass._onDataLoaded.apply(this, arguments);
         }
         else{
            this._resetSelectedRecords();
            this._notifyBatchDelayed('onAfterLoad');
         }
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает новое значение идентификатора корня для браузера.
       * @param {Number|String} node Идентификатор узла
       * @param {Boolean} [noLoad] Если указать как true, то загрузки данных не будет
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
            self._currentRecordSet.updateInitialParameter(self._hierColumnParentId, node + '');
            if( noLoad ){
               result.callback();
            }
            else{
               result.dependOn(self.reload());
            }
         });
         return result;
      },
      /**
       * <wiTag group="Управление">
       * Перезагрузить данные в дереве.
       * При этом сохранятся открытые/закрытые папки.
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *    dataView.reload();
       * </pre>
       */
      reload: function(){
         if (this.isDestroyed()) {
            return;
         }
         var filter = this.getQuery(true),
            expand = !this._options.display.partiallyLoad || this._options.display.expand || this._fullTreeExpand;
         filter['Разворот'] = expand ? 'С разворотом' : 'Без разворота';
         if(expand){
            filter[this._hierColumnParentId] = this._rootNode;
         }
         else{
            filter[this._hierColumnParentId] = [];
            this._loaded = {};
            for(var i in this._expanded){
               if(this._expanded.hasOwnProperty(i)){
                  var isVisible = this._expanded[i] ? 1 : 2,
                     rowkey = i,
                     record;
                  while(!this._isIdEqual(rowkey, this._rootNode)){
                     if(!this._currentRecordSet.contains(rowkey)){
                        isVisible = 0;
                        break;
                     }
                     record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
                     rowkey = record.get(this._hierColumnParentId);
                     if(rowkey != this._rootNode && !this._expanded[rowkey]){
                        isVisible = 0;
                        break;
                     }
                  }
                  if(isVisible === 1){
                     filter[this._hierColumnParentId].push(i);
                     this._loaded[i] = true;
                  }
                  else if(isVisible === 0){
                     delete this._expanded[i];
                  }
               }
            }
            if(!this._options.display.showRoot && !this._loaded[this._rootNode]){
               this._loaded[this._rootNode] = true;
               if(filter[this._hierColumnParentId].length === 0)
                  filter[this._hierColumnParentId] = this._rootNode;
               else
                  filter[this._hierColumnParentId].push(this._rootNode);
            }
            else if(filter[this._hierColumnParentId].constructor === Array && filter[this._hierColumnParentId].length === 0){
               this._expanded[this._rootNode] = true;
               filter[this._hierColumnParentId] = this._rootNode;
            }
         }
         return this._runQuery(filter, true);
      },
      /**
       * <wiTag noShow>
       * Нужно ли загружать информацию о том, есть ли у папки дочерние записи
       * @param {Boolean} load true - загружаем
       */
      setLoadChildFlag: function(load){
         this._useLoadChildsFlag = load;
         this._systemParams["_ЕстьДочерние"] = load;
      },
      /**
       * Возвращает узел, который нужно загрузить после редактирования записи
       * @param {$ws.proto.Record} record Записи
       * @return {String|null}
       * @protected
       */
      _getNodeForRecordUpdate: function(record){
         if(!this._options.display.partiallyLoad){
            return this._rootNode;
         }
         return record.get(this._hierColumnParentId);
      },
      /**
       * Возвращает признак отображения древовидной структуры.
       * <wiTag group="Управление">
       * @returns {boolean} Дерево или нет.
       * @example
       * <pre>
       *    if(dataView.isTree())
       *       dataView.applyTurnTree(true);
       *    else
       *       dataView.reload();
       * </pre>
       */
      isTree: function(){
         return true;
      },
      /**
       * Обработчик, который определяет, куда вставлять запись
       * @param {jQuery} row Строчка, по которой произошёл клик
       * @param {Event} [event] Событие
       * @return {String|null|Boolean}
       * @protected
       */
      _insertRowPosition: function(row, event){
         var parentId;
         if( row instanceof Object && 'jquery' in row ){
            var key = row.attr('rowkey');
            if( this._currentRecordSet.contains(key) ){
               var record = this._currentRecordSet.getRecordByPrimaryKey(key);
               if( event && event.altKey ){
                  if( record.get(this._hierColumnIsLeaf) ){
                     parentId = key;
                  }
                  else{
                     return false;
                  }
               }
               else{
                  parentId = record.get(this._hierColumnParentId);
               }
            }
         }
         if( parentId === undefined ){
            parentId = this._rootNode;
         }
         return parentId;
      },
      /**
       * Обработчик перед сохранением записи. Нужно для дерева - в нём мы раскрываем папку, в которую сохранили запись
       * @param {Object} event Событие
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _onBeforeSaveRecordDialog: function(event, record){
         // пытаемся открыть папку, в которую сохранили запись. Сделано так для выборок, в которых записи и папки из разных таблиц
         if(record.hasColumn(this._hierColumnParentId)){
            var parent = record.get(this._hierColumnParentId);
            if( this.haveRow(parent) ){
               var deferred = new $ws.proto.Deferred();
               $ws.helpers.callbackWrapper(this.showBranch(parent), function(){
                  deferred.callback();
               });
               event.setResult(deferred);
            }
         }
         $ws.proto.TreeView.superclass._onBeforeSaveRecordDialog.apply(this, arguments);
      },
      /**
       * Думает, что нужно перезагрузить после изменения записей
       * @param {Array} records Удалённые записи
       * @protected
       */
      _reloadAfterRecordsChange: function(records){
         var nodes;
         if( this._options.display.partiallyLoad ){
            if(records.length){
               if( records.length > 1 ){
                  var map = {};
                  for(var i = 0; i < records.length; ++i){
                     var record = records[i];
                     map[record.get(this._hierColumnParentId)] = true;
                  }
                  nodes = Object.keys(map);
               }
               else{
                  nodes = records[0].get(this._hierColumnParentId);
               }
            }
         }
         else{
            nodes = this._rootNode;
         }
         this._currentRecordSet.loadNode(nodes, undefined, this._currentRecordSet.getPageNumber(), !this._options.display.partiallyLoad);
      },
      /**
       * Возвращает список опций строки
       * @returns {Array}
       * @protected
       */
      _getRowOptions: function(){
         var actions = $ws.proto.TreeView.superclass._getRowOptions.apply(this, arguments),
            self = this;
         if(this._options.editDialogTemplate){
            actions.unshift(['Добавить лист (Insert)', 'sprite:icon-16 icon-Add icon-primary', function(){
               self._insertChildRecordItem();
            }, 'addItem']);
         }
         if(this._options.editBranchDialogTemplate){
            actions.unshift(['Добавить папку (Ctrl + Insert)', 'sprite:icon-16 icon-CreateFolder icon-primary', function(){
               self._insertChildRecordFolder();
            }, 'addFolder']);
         }
         return actions;
      },
      _hasRecordChildren: function(record){
         return (record.hasColumn(this._hierColumnHasChild)? record.get(this._hierColumnHasChild) : null) ||
            this.getRecordSet().recordChilds(record.getKey()).length;
      },
      /**
       * Является ли деревом папок
       * @returns {boolean}
       */
      isFoldersTree: function(){
         return this._options.display.viewMode === 'foldersTree';
      },
      /**
       * Возвращает опции, необходимые шаблону
       * @param {$ws.proto.Record} record Запись
       * @param {Number} level Уровень вложенности
       * @param {String} editMode Режим редактирования
       * @param {Number} colDefIdx Номер колонки
       * @param {Boolean} isBranch Является ли папкой
       * @returns {Object}
       * @protected
       */
      _cellTemplateOptions: function(record, level, editMode, colDefIdx, isBranch){
         var res = $ws.proto.TreeView.superclass._cellTemplateOptions.apply(this, arguments),
            hasChildren = this.isFoldersTree() ? this._hasRecordChildren(record) : true;
         if( hasChildren ){
            if (isBranch) {
               var userExpanded = 'ws-browser-expander-container ws-browser-icon-user ws-browser-expander ',
                   defExpanded = 'ws-browser-expander-container ws-browser-icon ws-browser-expander ';
               res.expanderClassName = (this._options.display.folderIconOpen !== undefined && this._options.display.folderIconClose !== undefined) ?
                                       userExpanded + (this._expanded[record.getKey()] ? this._options.display.folderIconOpen + ' minus' : this._options.display.folderIconClose + ' plus') :
                                       defExpanded + (this._expanded[record.getKey()] ? 'minus' : 'plus');
            } else {
               res.expanderClassName = (this._options.display.itemIcon !== undefined ? 'ws-browser-icon-user ' + this._options.display.itemIcon : '');
            }
         }
         res.checkbox = res.checkbox ? 'ws-browser-checkbox' : (this._needShowSelectionCheckbox() && 'ws-browser-checkbox-holder');
         res.padding = this._insideOfAccordion ?
                       $ws._const.TreeView.accordion.padding + level * $ws._const.TreeView.accordion.levelIndent :
                       (level * $ws._const.TreeView.iconWidth  + (this._container.hasClass('ws-treeview-employees') && level > 1 ? (level - 1) * 4 : 0));
         return res;
      },
      /**
       * Применяет/отменяет разворот
       * @param {Boolean|String} mode Режим отображения
       * @param {Boolean} noLoad Если указать true, то загрузки не будет
       * @protected
       */
      _toggleTurn: function(mode, noLoad){
         var activeRecord = this.getActiveRecord(),
            key = (activeRecord && activeRecord.getKey()) || this._rootNode;
         if( this._expanded[key] ){
            this._processTreeClick(key, true);
         }
         else if(activeRecord && activeRecord.get(this._hierColumnIsLeaf)){
            this._expandTreeAll(noLoad, key);
         }
      },
      /**
       * Дополнительная фильтрация опций строки для отнаследованных классов
       * @param {Array} filter Названия опций, которые не нужно отображать
       * @param {$ws.proto.Record} record Текущая запись
       * @protected
       */
      _additionalFilterRowOptions: function(filter, record){
         $ws.proto.TreeView.superclass._additionalFilterRowOptions.apply(this, arguments);
         if( !record || !record.get(this._hierColumnIsLeaf) || this._options.display.readOnly || !this._options.allowAdd ){
            filter.push('addItem', 'addFolder');
         }
      },
      /**
       * Убирает выделение со строки
       * @param {String} key Ключ записи
       * @param {Boolean} [notNotify] Не поднимать событий
       */
      _unselectRow: function(key, notNotify){
         $ws.proto.TreeView.superclass._unselectRow.apply(this, arguments);
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').removeClass('ws-browser-selected-part');
         }
         else{
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.removeClass('ws-browser-selected-part');
            delete this._selectedPart[key];
         }
      },
      /**
       * Выбирает строку
       * @param {String} key Ключ записи
       * @param {Boolean} [notNotify] Не поднимать событий
       */
      _selectRow: function(key, notNotify){
         var row;
         $ws.proto.TreeView.superclass._selectRow.apply(this, arguments);
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            row = this._head.find('.ws-browser-checkbox').closest('tr');
            row.addClass('ws-browser-selected');
            row.removeClass('ws-browser-selected-part');
         }
         else{
            row = this._body.find('tr[rowkey="' + key + '"]');
            row.removeClass('ws-browser-selected-part');
            delete this._selectedPart[key];
         }
      },
      /**
       * Обозначает, что строка выделена частично
       * @param {String} key Ключ записи
       * @param {Boolean} [notNotify] Не поднимать событий
       */
      _selectPartRow: function(key, notNotify){
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').addClass('ws-browser-selected-part').removeClass('ws-browser-selected');
         }
         else{
            this._unselectRow(key, notNotify);
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.addClass('ws-browser-selected-part');
            this._selectedPart[key] = true;
         }
      },
      /**
       * Пересчитывает выделение папок, поднимаясь "вверх" по ним
       * @param {String} key Ключ папки
       * @param {Boolean} [notNotify] не поднимать событие, используется для служебной очистки выделения
       * @private
       */
      _rebuildBranchSelectionToUp: function(key, notNotify) {
         var children = this._currentRecordSet.recordChilds(key),
            selectedCount = 0,
            hasPartial = false,
            allSelected;
         for (var i = 0; i < children.length; ++i) {
            if (this._selected[children[i]] !== undefined) {
               ++selectedCount;
            } else if (this._selectedPart[children[i]] !== undefined) {
               hasPartial = true;
            }
         }
         allSelected = (selectedCount === children.length && (this._isIdEqual(key, this._rootNode) || this._options.selectChilds === 'full'));
         if (selectedCount === 0 && !hasPartial) {
            this._unselectRow(key, notNotify);
         } else if (allSelected) {
            this._selectRow(key, notNotify);
         } else {
            this._selectPartRow(key, notNotify);
         }
         if (!this._isIdEqual(this._rootNode, key) && this._currentRecordSet.contains(key)) {
            this._rebuildBranchSelectionToUp(this._currentRecordSet.getRecordByPrimaryKey(key).get(this._hierColumnParentId), notNotify);
         }
      },
      /**
       * Меняет выделение на строке. Если было - убирает, если не было - добавляет
       * @param {String} key Ключ записи
       */
      _toggleRowSelection: function(key) {
         if (this._options.selectChilds) {
            var isSelect = this._selected[key] === undefined,
               self = this,
               toggleChildren = function (key) {
                  if (isSelect) {
                     self._selectRow(key);
                  } else {
                     self._unselectRow(key);
                  }

                  var children = self._currentRecordSet.recordChilds(key);
                  for (var i = 0; i < children.length; ++i) {
                     toggleChildren(children[i]);
                  }
               };
            toggleChildren(key);
            if (key) {
               if (self._currentRecordSet.contains(key)) {
                  this._rebuildBranchSelectionToUp(self._currentRecordSet.getRecordByPrimaryKey(key).get(self._hierColumnParentId));
               }
            }
         } else {
            $ws.proto.TreeView.superclass._toggleRowSelection.apply(this, arguments);
         }
      },
      /**
       * Выделяет папку и все её дочерние записи
       * @param {String} key Первичный ключ записи, которую нужно выбрать
       * @param {Boolean} notNotify Нужно ли извещать об изменениях
       * @private
       */
      _selectBranch: function(key, notNotify) {
         var children = this._currentRecordSet.recordChilds(key);
         this._selectRow(key, notNotify);
         for (var i = 0; i < children.length; ++i) {
            this._selectBranch(children[i], notNotify);
         }
      },
      /**
       * Пересчитывает выделение в указанной папке, спускаясь "вниз"
       * @param {String|null} key Идентификатор папки
       * @param {Boolean} notNotify Нужно ли сигналить о смене выделения
       * @returns {Number} Результат обновления: 0 - ничего не выбрано в данной папке, 1 - что-то выбрано, 2 - выбрано всё
       * @protected
       */
      _rebuildBranchSelection: function(key, notNotify) {
         var children = this._currentRecordSet.recordChilds(key),
            allSelected = true,
            hasSelected = false,
            selectCurrent;
         if (this._selected[key] !== undefined) {
            this._selectBranch(key, notNotify);
            return 2;
         }
         for (var i = 0; i < children.length; ++i) {
            var res = this._rebuildBranchSelection(children[i], notNotify);
            if (res !== 2) { //Не все выбраны
               allSelected = false;
            }
            if (res > 0) {
               hasSelected = true;
            }
         }
         selectCurrent = (hasSelected && allSelected && this._options.selectChilds === 'full') ||
            this._selected[key] !== undefined;
         if (selectCurrent) {
            this._selectRow(key, notNotify);
            return 2;
         } else if (hasSelected) {
            this._selectPartRow(key, notNotify);
            return 1;
         }
         this._unselectRow(key, notNotify);
         return 0;
      },
      /**
       * Пересчитывает выделение на всех записях, меняет чекбоксы на строках
       * @param {Boolean} [notNotify] Не поднимать событий
       */
      _rebuildPartialSelection: function(notNotify) {
         if (!this._currentRecordSet) {
            return;
         }
         if (this._options.selectChilds) {
            this._selectedPart = {};
            this._executeFuncForRoots(function(item) {
               this._rebuildBranchSelection(item, notNotify);
            });
         }
      },
      /**
       * <wiTag group="Управление">
       * Отметить записи с указанными ключами (keys).
       * Если передали только один ключ, то строка с этим ключом станет активной.
       * Если записей много, то они помечаются, а курсор ставится на первую.
       * @param {Array} args Массив ключей записей которые необходимо пометить.
       * @example
       * <pre>
       *    dataView.setSelection(["21", "22", "23" ]);
       * </pre>
       */
      setSelection : function(args){
         $ws.proto.TreeView.superclass.setSelection.apply(this, arguments);
         this._rebuildPartialSelection();
      },
      /**
       * <wiTag group="Управление" >
       * Снимает выделение с записей с указанными ключами
       * @param {Array} args Массив ключей записей с которых необходимо снять выделение
       * @param {Boolean} [notNotify] не поднимать событие, используется для служебной очистки выделения
       * @example
       * <pre>
       *    dataView.clearSelection([ "11", "12", "22"]);
       * </pre>
       */
      clearSelection : function(args, notNotify){
         $ws.proto.TreeView.superclass.clearSelection.apply(this, arguments);
         args = this._normalizeArgs(args);
         if (this._options.selectChilds) {
            $ws.helpers.forEach(args, function(key) {
               var record,
                  parentKey;
               if (this._currentRecordSet.contains(key)) {
                  record = this._currentRecordSet.getRecordByPrimaryKey(key);
                  parentKey = record.get(this._hierColumnParentId);
                  if (this._currentRecordSet.contains(parentKey)) {
                     this._rebuildBranchSelectionToUp(parentKey, notNotify);
                  }
               }
            }, this);
         }
      },
      /**
       * <wiTag group="Управление">
       * Снимает отметки со всех записей. Не убирает синию полоску с текущей записи.
       * <pre>
       *    dataView.removeSelection();
       * </pre>
       * @command
       */
      removeSelection : function(){
         $ws.proto.TreeView.superclass.removeSelection.apply(this, arguments);
         this._rebuildPartialSelection();
      },
      /**
       * <wiTag group="Управление">
       * Отмечает все записи как выбранные, независимо от постраничной навигации.
       * Если страниц несколько, то получит все данные без учета страниц.
       * Возвращает асинхронное событие завершения процесса отметки
       * @returns {$ws.proto.Deferred} окончание отметки
       * @example
       * <pre>
       *    dataView.selectAll().addCallback(function(){
       *       dataView.sendCommand('confirmSelection');
       *    });
       * </pre>
       * @command
       */
      selectAll: function(){
         if(this._options.selectChilds){
            this._selected = [];
            this._selectedRecords = [];
            var self = this,
               selectRecord = function(key){
                  self._selectRow(key, true);
                  var childs = self._currentRecordSet.recordChilds(key);
                  for(var i = 0; i < childs.length; ++i){
                     selectRecord(childs[i]);
                  }
               };
            selectRecord(this._rootNode);
            this._notifyBatchDelayed('onChangeSelection', this._selectedRecords, true);
            this._updatePager();
         }
         else{
            $ws.proto.TreeView.superclass.selectAll.apply(this, arguments);
         }
      },
      /**
       * Если текущий режим - "дерево папок", то при вставке папок нужно помечать, что родительская папка имеет дочерние элементы
       * @param {$ws.proto.EventObject} event Событие
       * @param {$ws.proto.Record} record Запись
       * @private
       */
      _onRecordUpdated: function(event, record){
         var parent,
            parentId;
         if(record instanceof $ws.proto.Record){
            parentId = record.get(this._hierColumnParentId);
            if(this.isFoldersTree() && this._currentRecordSet.contains(parentId)){
               parent = this._currentRecordSet.getRecordByPrimaryKey(parentId);
               if(parent.get(this._hierColumnIsLeaf) === true){
                  parent.set(this._hierColumnHasChild, true);
                  parent.commit();
               }
            }
         }
         $ws.proto.TreeView.superclass._onRecordUpdated.apply(this, arguments);
      },
      /**
       * <wiTag group="Отображение" >
       * Установить значение отступа для уровня иерархии в px. Подробнее {@link display.levelPadding}
       * Если установить null-значение, то отступ будет рассчитан автоматически
       * @param {Number|null} levelPadding Событие
       */
      setLevelPadding: function(levelPadding){
         if(typeof (levelPadding) === 'number'){
            this._options.display.levelPadding = levelPadding;
            this._employeePadding = 0;
            this._additionalPadding = 0;
         } else {
            throw new Error('Parameter for setLevelPadding must be a number!');
         }
      },
      /**
       * <wiTag group="Отображение" >
       * Получить значение отступа для уровня иерархии в px. Подробнее {@link display.levelPadding}
       * @return {Number|null}
       */
      getLevelPadding: function(){
         return this._options.display.levelPadding;
      },
      /**
       * Возвращает признак развернута ли папка по ее ключу
       * @param {Number} rowkey идентификатор узла
       * @returns {Boolean} Развернут узел или нет
       * @example
       * <pre>
       *    if(!treeView.isShow("123"))
       *       treeView.showBranch("123");
       * </pre>
       */
      isShow: function(rowkey){
         if(rowkey === this._rootNode) {
            return true;
         } else {
            return this._turn === '' ? this._expanded[rowkey] !== undefined : this._body.find('tr[rowkey="' + rowkey + '"]').length !== 0;
         }
      },
      getOpenFolders: function ( ) {
         var openFolders = [this._rootNode];
         for (var i in this._expanded) {
            if (this._expanded.hasOwnProperty(i)) {
               openFolders.push(i);
            }
         }
         return openFolders;
      }
   });

   return $ws.proto.TreeView;

});
