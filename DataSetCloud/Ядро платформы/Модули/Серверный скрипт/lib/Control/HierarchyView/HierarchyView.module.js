/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 0:43
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.HierarchyView", ["js!SBIS3.CORE.HierarchyViewAbstract"], function( HierarchyViewAbstract ) {

   "use strict";

   $ws.single.DependencyResolver.register('SBIS3.CORE.HierarchyView', [], "SBIS3.CORE.DataViewAbstract/SBIS3.CORE.TableView/SBIS3.CORE.HierarchyViewAbstract");
   /**
    * Иерахическое представление
    * <wiTag page=3>
    * @class $ws.proto.HierarchyView
    * @extends $ws.proto.HierarchyViewAbstract
    * @control
    * @category Table
    */
   $ws.proto.HierarchyView = HierarchyViewAbstract.extend(/** @lends $ws.proto.HierarchyView.prototype */{
      /**
       * @event onConvert При переключении режима иерархия/дерево
       * Событие, происходящее при переключении из иерархии в дерево и обратно
       * Обработка результата:
       *    Не обрабатывается
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @example
       * <pre>
       *    dataView.subscribe('onConvert', function(event){
       *       this.reload();
       *    });
       * </pre>
       */
      /**
       * @event onFolderEnter При открытии папки.
       * Событие, происходящее при открытии папки.
       * Обработка результата:
       *    Если вернуть объект, то будет считаться, что это новый фильтр,
       *    Если вернуть false, то перехода в папку не произойдет. Текущий раздел не изменится. Как будто в папку вообще не кликали
       *    Если вернуть true, то перехода в папку не произойдет, но можно будет вызывать свою
       *    загрузку в этом разделе (в который перешли). Т.е. изменится текущий раздел на тот, в который кликнули
       * @param {String} rowkey Первичный ключ открываемой папки
       * @example
       * <pre>
       *    dataView.subscribe('onFolderEnter', function(event, rowkey){
       *       event.setResult($ws.core.merge( this.getQuery(), {
       *          "Сотрудник": $ws.single.GlobalContext.getValue('currentUserId')
       *       }));
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            display: {
               ///Это никак не Display дальше
               /**
                * @cfg {String} hierarchyIcons
                * <wiTag noShow>
                */
               hierarchyIcons: $ws._const.Browser.hierarchyIcons, //Иконки с плюсами, минусами, папками, и т д
               /**
                * @cfg {String} folderIcon
                * <wiTag noShow>
                */
               folderIcon: $ws._const.Browser.folderIcon,
               /**
                * @cfg {String} itemIcon
                * <wiTag noShow>
                */
               itemIcon: $ws._const.Browser.itemIcon,
               /**
                * @cfg {Number} Номер колонки, у которой делаем отсупы
                * <wiTag group="Отображение">
                *    У какой колонки ставим отсуп при открытии папки
                */
               columnPaddingIndex: undefined
            },
            /**
             * @cfg {Boolean} Разрешить навигацию с разворотом у иерархии
             * !ИСПОЛЬЗОВАТЬ С ОСТОРОЖНОСТЬЮ!
             * <wiTag noShow>
             */
            alwaysAllowNavigation: false
         },
         _blockOpenDir: false,                  //Для блокирования обработки повторного клика по папке до тех пор, пока не обработано предыдущее событие, вызванное кликом
         _turn : '',                            //тип разворота
         _rowTemplates: [undefined, undefined], //Шаблоны для создания строк, нулевой - для листа, первый - для папки
         _selectAfterPathLoad: true,             //Выделять ли запись после загрузки пути в дереве
         _showSelectionRootId: null
      },
      $constructor: function(){
         this._registerShortcut($ws._const.key.backspace, $ws._const.modifiers.nothing, this._selectParentFolder);
         this._registerShortcut($ws._const.key.esc, $ws._const.modifiers.nothing, this._selectParentFolder);
         this._registerShortcut($ws._const.key.v, $ws._const.modifiers.control, this._toggleViewKey);
         this._publish('onFolderEnter', 'onConvert');
      },
      /**
      * Обработчик создания записи
      * @command newItem
      */
      _insertRecordItem: function(filter){
         //в случае разворота создаем запись как дочернюю к текущей активной, если это папка, или дочернюю к ее родительской, если это лист
         if(this._turn){
            var activeRecord = this.getActiveRecord(),
                newRecordFolder = this._currentRootId;
            if(activeRecord instanceof $ws.proto.Record){
               newRecordFolder = activeRecord.isBranch() ? activeRecord.getKey() : activeRecord.getParentKey();
            }
            this._showRecordDialog({parentId: newRecordFolder, isBranch: false}, filter);
         } else {
            $ws.proto.HierarchyView.superclass._insertRecordItem.apply(this, arguments);
         }
      },
      /**
       * В режиме одиночного клика при наведении на папку делаем её оранжевой, в режиме двойного - при клике по папке заходим в неё
       * @private
       */
      _initEvents: function() {
         var element;
         $ws.proto.HierarchyView.superclass._initEvents.apply(this, arguments);
         element = this._body.parent().get(0);
         if (this._options.mode === 'oneClickMode') {
            $('.ws-browser-table-row', element).live('mouseenter mouseleave', function(event) {
               var folderIcon = $(event.target).closest('.ws-browser-table-row').find('.ws-browser-hierarchy-expander'),
                  toggle = (event.type === 'mouseenter');
               folderIcon.toggleClass('icon-disabled', !toggle).toggleClass('icon-hover', toggle);
            });
         } else {
            $('.ws-browser-hierarchy-expander', element).live('click', function(event) {
               var row = $(event.target).closest('.ws-browser-table-row'),
                  key = row.attr('rowkey'),
                  record;
               if (this._currentRecordSet.contains(key)) {
                  record = this._currentRecordSet.getRecordByPrimaryKey(key);
                  this._clickOnFolder(key, record);
               }
            }.bind(this));
         }
      },
      /**
       * Рисует тело таблицы и заполняет его данными
       */
      _drawBody: function(){
         var columns = this._currentRecordSet.getColumns();
         if(!Object.isEmpty(columns) && !(this._options.display.titleColumn in columns)) {
               throw new Error("Trying to render hierarchy with unexistent titleColumn");
         }
         $ws.proto.HierarchyView.superclass._drawBody.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Перезагружает данные в соответствии с новыми параметрами фильтрации (filter) и обновляет отображение табличного браузера.
       * При этом может очистить текущий набор данных (doClear).
       * Так же можно перейти на первую или нужную страницу, либо остаться на текущей, в случае использования постраничной навигации (keepPage).
       * @param {Object} filter Параметры фильтрации
       * @param {Boolean} [doClear=false] очищать текущие данные перед загрузкой?
       * @param {Boolean|Number} [keepPage=false] Оставлять ли страницу
       * @param {Array} [sorting] Массив, где каждый элемент имеет вид: {field: '...', order: 'asc' / 'desc'}.
       * @param {Boolean} [noLoad=false] Не перезагружать данные.
       * Чем раньше встретится элемент с полем field, тем важнее field будет для сортировки.
       * @example
       * <pre>
       *    dataView.setQuery({
       *       "Сотрудник" : "11",
       *       "Дата": function(){
       *          return new Date();
       *       },
       *       "Подразделение": {
       *          fieldName: "ДокументНашаОрганизация"
       *       }
       *    }, true, true);
       * </pre>
       */
      setQuery : function(filter, doClear, keepPage, sorting, noLoad){
         var wait = new $ws.proto.ParallelDeferred(),
             self = this;
         wait.push($ws.proto.HierarchyView.superclass.setQuery.apply(this, arguments));
         if (typeof self._pathSelector !== 'undefined') {
            wait.push(self._pathSelector.setQuery(filter));
         }
         wait.done();
         return wait.getResult();
      },
      /**
       * Нужно ли показывать указанную запись
       * @param {$ws.proto.Record} record Запись
       * @returns {Boolean}
       * @protected
       */
      _drawRecordCondition: function(record) {
         if (this._turn) {
            return true;
         }
         if (this._isShowSelection || (this._showAllRoots && this._isIdEqual(this._currentRootId, this._rootNode))) {
            return !this._currentRecordSet.contains(record.get(this._hierColumnParentId));
         }
         return record.get(this._hierColumnParentId) == this._currentRootId;
      },
      _getBodyContainer: function(){
         return $('<tbody/>');
      },
      _drawBodyCycle: function(){
         var oldBody = this._body,
            tableBody = this._getBodyContainer(); //Новое tbody для таблицы

         this._body = tableBody;
         this._body.html(this._createRecordsTemplate(this._currentRecordSet.getRecords()));
         //$ws._const.browser.isIE = undefined
         var rows = $ws._const.browser.isIE ?  this._body.find('[rowkey]') : this._body.children();
         for(var i = 0, len = rows.length; i < len; ++i){
            var key = rows.eq(i).attr('rowkey');
            this._rowsMap[key] = rows.eq(i);
            if(this._options.display.rowRender){
               this._options.display.rowRender.apply(this, [this._currentRecordSet.getRecordByPrimaryKey(key), rows.eq(i)]);
            }
         }
         // Если в результате отрисовки изменилось кол-во строк
         var nowCount = this._body.children().size(),
             newCount = tableBody.children().size();
         // update: newCount > 0, clear: newCount = 0, nowCount != 0
         if(newCount > 0 || (newCount === 0 && nowCount !== 0)) {
            this._body.remove();
            this._body = tableBody;
            this._data.append(this._body);
         }
         oldBody.remove();
         this._data.append(this._body);
      },
      _createRecordsTemplate: function(records) {
         var id = 0,
            visibleId = 0,                               //Идентификатор видимых строк, чётные - красим
            html ='',
            hasLeaf = !$ws._const.browser.isIE,
            self = this;

         var rowHtml = function(record) {
            if (self._options.selectionType !== 'node' || (self._options.selectionType === 'node' && self._testSelectedRecord(record))) {
               if(self._drawRecordCondition(record)){
                  //В случае ctrl+b || ctrl+v уровень элементов у всех одинаковый (отличаются только флагом папки/не папки
                  var level = ((self._turn === '') ? 0 : self._currentRecordSet.getRecordLevel(record.getKey())),
                     odd = self._options.display.hasZebra ? (visibleId % 2) : this;
                  if(!hasLeaf && record.get(self._hierColumnIsLeaf) !== true) {
                     hasLeaf = true;
                  }
                  html += self._createTRsHtml(record, level, odd, false);
                  ++visibleId;
                  ++id;
               }
            }
         };
         this._rowsMap = {}; //Забываем ссылки на старые строки

         this._currentRecordSet.rewind();
         if(records && records.length) {
            for(var i = 0, len = records.length; i < len; i++) {
               rowHtml(records[i]);
            }
         }

         //супер-фикс для ие, для случая, когда если у всех строк одинаково есть колспан,
         // в этом случае ие рисует левый отступ, о котором его не просили
         if(!hasLeaf){
            var temp = [];
            temp.push('<tr>');

            if (this._needShowSelectionCheckbox()) {
               temp.push('<td></td>');
            }

            $ws.helpers.forEach(this._columnMap, function() {
               temp.push('<td></td>');
            });
            temp.push('</tr>');
            html = temp.join('') + html;
         }

         if(this._options.display.allowHorizontalScroll) {
            this._emptyDataScroller[visibleId ? 'hide' : 'show']();
         }
         this._count = id;
         return html;
      },
      _rowHTMLTemplate: function(options){
         var template = doT.template(
               '<tr class="{{=it.className}}" rowkey="{{=it.rowkey}}" treelevel="{{=it.level}}" parentId="{{=it.parentId}}">' +
                     '{{? it.useCheckbox}}' +
                        '<td class="ws-browser-cell {{? it.checkbox}}ws-browser-checkbox-holder{{?}}">' +
                           '{{? it.checkbox }}<span class="ws-browser-checkbox"/>{{?}}' +
                        '</td>' +
                     '{{?}}' +
                     '{{~it.cells :cell:index }}' +
                     '{{ if(it.columnPaddingIndex === index || (!it.columnPaddingIndex && index === 0)){ ' +
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
       * Шаблон первой ячейки в строке
       * @param {Object} options Параметры ячейки
       * @return {String}
       * @private
       */
      _cellFirstTemplate: function(options){
         var template = doT.template(
               '<td class="{{=it.cellClassName}}{{? it.isFolder}} ws-browser-folder-column{{?}}"' +
                     '{{? it.isFolder}}' +
                        'colspan="{{=it.colspan}}"' +
                     '{{?}}'+
                     '{{? it.colDefIndex || "0"}}' +
                        ' coldefindex="{{=it.colDefIndex}}"'+
                     '{{?}}' +
                     '>' +
                     '<div class="{{=it.containerClassName}}" style="padding-left: {{=it.padding}}px;">' +
                     '{{? it.isHierColumn}}' +
                        '{{? it.folderIconSpan}}' +
                        '<span class="{{=it.folderIconSpan}} {{=it.expanded}}"></span>' +
                        '{{?}}' +
                     '{{?}}' +
                     '<div class="ws-browser-text-container">{{=it.data}}</div>' +
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
               '<td class="{{=it.cellClassName}}"' +
                  '{{? it.isFolder}}' +
                     ' colspan="{{=it.colspan}}"' +
                  '{{?}}'+
                  '{{? it.colDefIndex || "0"}}' +
                     ' coldefindex="{{=it.colDefIndex}}"'+
                  '{{?}}' +
                  '>' +
                     '<div class="{{=it.containerClassName}}">' +
                        '{{? it.isHierColumn}}' +
                           '{{? it.folderIconSpan}}' +
                           '<span class="{{=it.folderIconSpan}} {{=it.expanded}}"></span>' +
                           '{{?}}' +
                        '{{?}}' +
                     '<div class="ws-browser-text-container">{{=it.data}}</div>' +
                     '</div>' +
                     '</div>' +
                     '</td>');
         this._cellGeneralTemplate = template;
         return template(options);
      },
      /**
       * Формирование  строки таблицы
       *
       * @param   {$ws.proto.Record}   record   строка RecordSet
       * @param   {Number}             level    уровень вложенности строки, используется для просчёта отступов
       * @param   {Boolean}            odd      нечётная ли строка, нечётные красим. В случае hasZebra == false сюда всегда будет передан false
       * @return  {String}             стандартный html-строку
       */
      _createTRsHtml: function(record, level, odd){
         var isFolder = record.get(this._hierColumnIsLeaf),
             key = record.getKey(),
             classes = ['ws-browser-table-row'],
             visClass = 'ws-visible',
             parentId = record.get(this._hierColumnParentId),
             selectionType = this._options.selectionType,
             rowConfig = {
                  cells: []
             },
             colspan = {},
             columnIndex,
             isHierColumn;
         if (typeof key == 'string') {
            key = key.replace(/'/g, '&#039;');
         } else if(key === null) {
            key = 'null';
         }
         if (!odd) {
            classes.push('rE');
         }
         if(this._selected[key] !== undefined){
            classes.push('ws-browser-selected');
         }

         if(isFolder){
            classes.push('ws-browser-tree-branch', 'ws-browser-folder');
            colspan = this._countColspanForFolder();
         }

         classes.push(visClass);

         rowConfig.className = classes.join(' ');
         rowConfig.columnPaddingIndex = this._options.display.columnPaddingIndex;
         rowConfig.rowkey = key;
         rowConfig.level = level;
         rowConfig.parentId = parentId === null ? '' : parentId;
         rowConfig.useCheckbox = this._needShowSelectionCheckbox();
         rowConfig.checkbox = selectionType === 'all' ||
            selectionType === 'node' && isFolder ||
            selectionType === 'leaf' && !isFolder;

         for (var i = 0, len = this._columnMap.length; i < len; ++i) {
            columnIndex = undefined;
            if ((this._titleColumnIndex === -1 && i===0 && isFolder) || i === this._titleColumnIndex) {
               columnIndex = this._titleColumnIndex;
               isHierColumn = true;
            } else if (this._columnMap[i].useForFolder || !isFolder) {
               columnIndex = i;
               isHierColumn = false;
            }
            if (columnIndex !== undefined) {
               rowConfig.cells.push( this._cellTemplateOptions(record, level, this._options.editMode, columnIndex, isFolder, colspan[i], isHierColumn));
            }
         }

         return this._rowHTMLTemplate.call(this, rowConfig);
      },
      /**
       * Выглядит как жесть, но на самом деле неплохо считает колспаны для папок.
       * (а все изза несчастного useForFolder)
       * @returns {Object} набор колспанов для колонок с useForFolder или titleColumnIndex
       * @private
       */
      _countColspanForFolder: function(){
         var colspan = {},
            flag = false,
            sumColSpan = 0,
            titleColumnIndex,
            summator = 1;
         for (var i = this._columnMap.length - 1; i >= 0; i-- ){
            if (this._columnMap[i].useForFolder/* && i > this._titleColumnIndex*/){
               if (titleColumnIndex){
                  colspan[titleColumnIndex]--;
                  colspan[i] = summator;
               }
               if (!flag){
                  flag = true;
                  colspan[i] = summator;
                  sumColSpan += summator;
               }
               else{
                  colspan[i] = titleColumnIndex === undefined ? summator : 1;
                  sumColSpan += summator;
               }
               summator = 1;
            }
            else {
               if (i === this._titleColumnIndex || (i===0 && this._titleColumnIndex === -1)){
                  colspan[i] =   this._columnMap.length - sumColSpan;
                  summator = 1;
                  titleColumnIndex = (this._titleColumnIndex !== -1) ? i : undefined;
               }
               else {
                  summator++;
               }
            }
         }
         return colspan;
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
            if(this.isHierarchyMode()){
               this.resetFilter(true);
               if(this._pathSelector && this._pathSelector instanceof $ws.proto.PathSelector) {
                  this._pathSelector.setPath([]);
               }
               if(this._turn){
                  this._clearExpandAll(true); //независимо от сброса фильтра нужно сбрасывать разворот...
               }
               if(this._expanded){
                  for(var key in this._expanded){
                     if(this._expanded.hasOwnProperty(key)){
                        delete this._expanded[key];
                     }
                  }
               }
               if(this._rootNode) {
                  this._currentRootId = this._rootNode;
               }
            }
         }
         $ws.proto.HierarchyView.superclass.clear.apply(this, arguments);
      },
      /**
       * Возвращает признак иерархическое представление или нет
       * <wiTag group="Управление">
       * @returns {boolean} иерархическое представление
       * @example
       * <pre>
       *    if(dataView.isHierarchy())
       *       dataView.showBranch(key);
       *    else
       *       dataView.reload();
       * </pre>
       */
      isHierarchy: function(){
         return true;
      },
      /**
       * Дописывает в фильтр системные параметры
       * @param {Object} filter Фильтр
       * @return {Object}
       * @protected
       */
      _prepareSystemParams: function(filter){
         if( filter[this._hierColumnParentId] === undefined ){
            filter[this._hierColumnParentId] = this._options.display.partiallyLoad ? this._currentRootId : this._rootNode;
         }
         return $ws.proto.HierarchyView.superclass._prepareSystemParams.apply(this, arguments);
      },
      /**
       * Обновляет видимость футера. Если есть какой-то дополнительный режим, его не должно быть видно
       * @private
       */
      _updateFooterVisibility: function(){
         if(this._foot){
            this._foot.toggleClass('ws-hidden', this._turn !== '');
         }
      },
      /**
       * Устанавливает "смешанный" режим
       * @param {Boolean} [noLoad] Без загрузки
       * @private
       */
      _setMixedMode: function(noLoad){
         this._turn = 'Mixed';
         this._updateFooterVisibility();
         this._currentFilter['Разворот'] = 'С разворотом';
         if( !noLoad ){
            this.reload();
         }
      },
      /**
       * <wiTag group="Управление" >
       * Разворачивает текущую папку с узлами и листьями если передали true (isWithFolders) или в режиме "только листья"
       * Повторный вызов с тем же параметром отменит разворот (отменит предыдущий вызов функци)
       * @param {Boolean|String} mode true - разворачивать с папками, false - без папок
       * @param {Boolean} [noLoad] Если передать true, то не будет загружать данные
       * @example
       * <pre>
       *    dataView.applyTurn(true);
       * </pre>
       */
      applyTurn: function(mode, noLoad){
         return this._runInBatchUpdate('HierarchyView.applyTurn', function() {
            if(this._options.display.fixedExpand) {
               return;
            }
            if (this._foot){
               this._foot.toggleClass('ws-hidden', this._turn === '');
            }
            if( mode === 'mixed' ){
               this._turn = 'Mixed';
               this._currentFilter['Разворот'] = 'С разворотом';
               if( !noLoad ){
                  this.reload();
               }
            }
            else{
               $ws.proto.HierarchyView.superclass.applyTurn.call(this, mode, noLoad);
            }
         });
      },
      /**
       * Метод построения разворота
       * @param {Boolean} withFolders с папками или без
       * @param {Boolean} [noLoad] не загружать после установки параметров
       */
      _expandAll: function(withFolders, noLoad){
         var filter = this.getQuery();
         this._expanded[this._currentRootId] = 2;
         filter[this._hierColumnParentId] = this._currentRootId;
         this._systemParams[this._hierColumnParentId] = this._currentRootId;
         filter['Разворот'] = 'С разворотом';
         filter.usePages = '';
         this._systemParams['Разворот'] = 'С разворотом';
         this._currentFilter['Разворот'] = 'С разворотом';
         this._options.dataSource.filterParams['Разворот'] = 'С разворотом';
         if(withFolders){
            this._turn = 'BranchesAndLeaves';
            filter['ВидДерева'] = 'С узлами и листьями';
            this._systemParams['ВидДерева'] = 'С узлами и листьями';
         } else if(this._options.display.expand === 'onlyFolders'){
            this._turn = 'OnlyFolders';
            filter['ВидДерева'] = 'Только узлы';
            this._options.dataSource.filterParams['ВидДерева'] = 'Только узлы';
            this._systemParams['ВидДерева'] = 'Только узлы';
         } else{
            this._turn = 'OnlyLeaves';
            filter['ВидДерева'] = 'Только листья';
            this._options.dataSource.filterParams['ВидДерева'] =  'Только листья';
            this._systemParams['ВидДерева'] = 'Только листья';
         }
         if(this._currentRecordSet && !this._options.alwaysAllowNavigation){
            this._currentRecordSet.setUsePages('');
         }
         if(this._paging){
            this._paging.hide();
         }
         if(!noLoad){
            this._runQuery(filter, true);
         }
      },
      /**
       * Возвращает нормальное отображение браузера, без режима ctrl+b / ctrl+v
       * @param {Boolean} [noLoad] не загружать после установки параметров
       */
      _clearExpandAll: function(noLoad){
         if (this._turn) {
            $ws.proto.HierarchyView.superclass._clearExpandAll.apply(this, arguments);
            this._turn = '';
         }
      },
      /**
       * <wiTag group="Отображение">
       * Открыть папку с указанным ключом (rowkey).
       * Если передали ключ листа, то откроет папку, в которой находится эта запись и установит на нее курсор по
       * необходимости (noSelection).
       * @param {Number} rowkey Идентификатор парента.
       * @param {Boolean} [noSelection] Флаг того, что указанную запись не нужно выделять.
       * @param {Boolean} [byLoaded] необходимо ли отрисоваться по уже загруженным данным, исключительно для иерархии
       * @returns {$ws.proto.Deferred|undefined}
       * @example
       * <pre>
       *    dataView.showBranch("123");
       * </pre>
       */
      showBranch: function(rowkey, noSelection, byLoaded){
         if(this._turn !== ''){
            this._clearExpandAll(true);
         }
         $ws.proto.HierarchyView.superclass[byLoaded ? "_showBranchHierarchy" : "showBranch"].apply(this, arguments);
      },
      /**
       * Обработчик на добавление записи в рекордсете
       * @param {Boolean} full перезагружать ли всё дерево
       * @param {Array} parents узел, начиная с которого необходимо перезагрузить дерево
       */
      _onRecordUpdated: function(full, parents){
         if(this._turn !== '' && !this._options.display.fixedExpand){
            if(parents instanceof $ws.proto.Record && !this._currentRecordSet.contains(parents.getKey())){
               //выйдем из разворота без перезагрузки
               this._clearExpandAll(false);
               //и обновим раздел, в котором новая запись
               this._currentRootId = parents.getParentKey();
               $ws.proto.HierarchyView.superclass._onRecordUpdated.apply(this, arguments);
            } else if(this._onRecordUpdatedBegin()){
               this._clearExpandAll();
            }
         }
         else{
            $ws.proto.HierarchyView.superclass._onRecordUpdated.apply(this, arguments);
         }
      },
      /**
       * Разворачивает браузер при смене фильтра через метод
       * @param {Object} filter Новый фильтр
       * @param {String} fieldValue Значение разворота
       * @protected
       */
      _expandFromFilter: function(filter, fieldValue){
         if(fieldValue == 'С разворотом' && this._turn === ''){
            this._expandAll(filter['ВидДерева'] == 'С узлами и листьями', true);
         }
         else if(fieldValue == 'Без разворота'){
            this._clearExpandAll(true);
         }
      },
      _checkPager: function(recordsCount, hasNextPage){
         return this._turn === '' && this._options.display.usePaging && recordsCount !== hasNextPage;
      },
      _updatePager: function(){
         $ws.proto.HierarchyView.superclass._updatePager.apply(this, arguments);
         if (this._currentRecordSet && this._options.display.showRecordsCount && this._count === 0){
            this._rootElement.find('.ws-browser-pager-text').text('Всего : 0');
         }
         this._blockOpenDir = false;
         this._foot.find('.ws-browser-dropdown-container').toggleClass('ws-hidden', !!this._turn);
         if (this._paging) {
            this._paging.toggle(this._turn === '');
         }
      },
      /**
       * Выполняет действия, необходимые для сохранения открытых элементов отрисовки
       */
      _reloadBody: function(){
         if(this._turn === '' && this._pathSelector){
            this._pathSelector.setPath([]);
         }
         $ws.proto.HierarchyView.superclass._reloadBody.apply(this, arguments);
      },
      /**
       * При очистке нужно очистить выбор пути, разворот и открытые папки
       * @protected
       */
      _clearAdditionalStates: function(){
         if(this._pathSelector && this._pathSelector instanceof $ws.proto.PathSelector){
            this._pathSelector.setPath([]);
         }
         if(this._turn){
            this._clearExpandAll(true); //независимо от сброса фильтра нужно сбрасывать разворот...
         }
         if(this._rootNode) {
            this._currentRootId = this._rootNode;
         }
      },
      /**
       * Открывает нужную папку, сигналит событие и обрабатывает его
       * @param {Number|String} id Идентификатор папки
       * @private
       */
      _folderEnter: function(id) {
         var page = this._pageSaver[id],
            tmpId = this._currentRootId,
            objHierField = {},
            res;
         this._currentRootId = id;
         res = this._notify('onFolderEnter', id);
         if (typeof res !== 'boolean') {
            if (this._options.display.scrollPaging) {
               //Определена в scrollPaging
               this._folderEnterScroll(id, res);
               if (!(res instanceof Object)) {
                  objHierField[ this._options.dataSource.hierarchyField ] = id;
                  res = $ws.core.merge( this._currentRecordSet.getQuery(), objHierField);
               }
            }
            if (res instanceof Object) {
               this.setQuery(res);
            } else if (this._options.display.partiallyLoad) {
               this._systemParams[this._hierColumnParentId] = id;
               this._currentRecordSet.loadNode(this._currentRootId, false, page ? page : 0, false);
            } else {
               this._drawBody();
               this._updatePager();
            }
         } else {
            this._currentRootId = res ? this._currentRootId : tmpId ;
         }
      },
      _prepareHierarchyRollUp: function(rollUp){
         if (rollUp) {
            this._showSelectionRootId = this._currentRootId;
         } else {
            this._currentRootId = this._showSelectionRootId;
         }
      },
      /**
       * Происходит при обновлении пути в PathSelector'е
       * @param {$ws.proto.EventObject} event Объект события
       * @param {Number|String} id Идентификатор узла, который был открыт
       * @param {Number|String} prevId Идентификатор предыдущего открытого узла
       */
      _onPathSelectorChange: function(event, id, prevId) {
         //Попросили при переходе в корень в хлебнывх крошках сбрасывать сохранение страниц
         if (id == this.getRootNode()) {
            this._dropPageSave();
         }
         this._folderEnter(id);
         this.setActive(true);
         if (prevId !== undefined) {
            this._hovered = prevId;
            this._loadedForPathSelector = true;
         }
      },
      /**
       * Обрабатывает открытие папки по клику (двойному клику, в зависимости от режима)
       * @param {String} rowkey Ключ записи
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _clickOnFolder: function(rowkey, record) {
         if (!this._blockOpenDir) {
            this._blockOpenDir = true;
            if(this._hasRowOptions){
               //аккуратно скроем опции записи и больше ничего не будем трогать
               this._hideRowOptions();
            }
            return this._runInBatchUpdate('HierarchyView._clickOnFolder', function() {
               if (this._turn !== '') {
                  this.clearTurn(true);
               }
               if (this._pathSelector && record) {
                  this._pathSelector.append({
                     id: rowkey,
                     title: record.get(this._options.display.titleColumn)
                  });
               }
               this._folderEnter(rowkey);
            });
         }
      },
      /**
       * Переходит на уровень выше
       * @returns {Boolean}
       * @private
       */
      _selectParentFolder: function(){
         if(this.isEnabled()){
            var activeRow = this.getActiveElement(),
               idprColumn = this._hierColumnParentId;
            if(this._turn !== '' || this._currentRootId === this._rootNode) {
               return false;
            }
            if(activeRow &&(activeRow.attr('rowkey') === 'null' || !activeRow.attr('rowkey'))){
               return false;
            }
            var tempId = this._currentRootId,
               way = this._currentRecordSet.getWay();
            if(this._currentRecordSet.contains(tempId)) {
               tempId = this._currentRecordSet.getRecordByPrimaryKey(tempId).get(idprColumn);
            } else if(way && way.contains(tempId)) {
               tempId = way.getRecordByPrimaryKey(tempId).get(idprColumn);
            } else {
               throw new Error('HierarchyViewAbstract:_keyboardHover backspace error');
            }

            if(this._pathSelector && !this._pathSelector.isEmpty()){
               this._pathSelector.pop();
            }
            this._hovered = this._currentRootId;
            this.showBranch(tempId);
            this._updatePager();
            return false;
         }
      },
      /**
       * Выбирает выбранную папку или начинает её редактирование
       * @return {Boolean}
       * @private
       */
      _enterKey: function(){
         var activeRow = this.getActiveElement();
         if(!activeRow){
            return false;
         }
         if(activeRow.hasClass('ws-browser-folder') && !(this._options.display.fixedExpand && this._turn !== '')){
            var record = this.getActiveRecord();
            this._clickOnFolder(record.getKey(), record);
         }
         else if(!this._selectMode){
            this._elementActivated(activeRow);
         }
         return true;
      },
      /**
       * Возвращает опции, необходимые шаблону
       * @param {$ws.proto.Record} record Запись
       * @param {Number} level Уровень вложенности
       * @param {String} editMode Режим редактирования
       * @param {Number} colDefIdx Номер колонки
       * @param {Boolean} isBranch Является ли папкой
       * @param {Number} colspan Количество колонок, которое занимает ячейка
       * @returns {Object}
       * @protected
       */
      _cellTemplateOptions: function(record, level, editMode, colDefIdx, isBranch, colspan, isHierColumn){
         if(isHierColumn && this._titleColumnIndex == -1) {
            arguments[3] = -1;
         }
         var res = $ws.proto.HierarchyView.superclass._cellTemplateOptions.apply(this, arguments);
         res.expanded = (isBranch ? (this._turn !== '' ? 'icon-24 icon-OpenedFolder icon-disabled' : 'icon-24 icon-Folder icon-disabled action-hover') : ' ws-browser-icon item');
         res.isFolder = isBranch;
         res.isHierColumn = isHierColumn;
         res.colspan = colspan;
         res.colDefIndex = colDefIdx;
         res.folderIconSpan = isBranch ? 'ws-browser-expander-container ws-browser-hierarchy-expander' : '';
         // Для колонки, если она отображает папки, и при этом не папка, то добавляем отступ - чтобы текст в папках и не папках был выровнен
         if(!isBranch && colDefIdx  <= 0) {
            res.containerClassName += ' ws-browser-hierarchy-padding';
         }
         return res;
      },
      _getColumnConfigByIndex: function(idx){
         if(idx == -1)
            return {
               title: this._options.display.titleColumn,
               field: this._options.display.titleColumn,
               render: null
            };
         else
            return $ws.proto.HierarchyView.superclass._getColumnConfigByIndex.apply(this, arguments);
      },
      /**
       * Возвращает false, если нужно другое отображение в футере
       * @returns {Boolean}
       * @protected
       */
      _isDefaultPagingText: function(){
         return this._options.display.usePaging && this._turn === '';
      },
      /**
       * Применяет/отменяет разворот
       * @param {Boolean|String} mode Режим отображения
       * @param {Boolean} noLoad Если указать true, то загрузки не будет
       * @protected
       */
      _toggleTurn: function(mode, noLoad){
         if(this._turn){
            this._clearExpandAll(noLoad);
         }
         else{
            this._expandAll(mode, noLoad);
         }
      },
      /**
       * Устанавливает текущей страницу с указанным номером (pageNumber) и при необходимости загружает её.
       * @param {Number}   pageNumber  Номер страницы
       * @param {Boolean}  load        Загружать или нет страницу
       * @wiType 1
       */
      setPage: function(pageNumber, load){
         if(!this._isDestroyed){
            if(this._options.display.usePaging){
               this._pageSaver[this.getCurrentRootNode()] = pageNumber;
            }
            $ws.proto.HierarchyView.superclass.setPage.apply(this, arguments);
         }
      },
      /**
       * Устанавливает флаг, что разрешать навигацию всегда
       * !Использовать с осторожностю!
       * @param {Boolean} enable
       */
      setAlwaysAllowNavigation: function(enable) {
         this._options.alwaysAllowNavigation = !!enable;
      },
      getAlwaysAllowNavigation: function() {
         return this._options.alwaysAllowNavigation;
      },
      /**
       * <wiTag group="Отображение">
       * Ставит номер колонки, у которой делать отступ
       * @param {Number} index
       */
      setColumnPaddingIndex: function(index) {
         if(typeof(index) == 'number') {
            this._options.display.columnPaddingIndex = index;
         }
      },
      /**
       * Возвращает номер колонки, у которой делается отсуп
       * @returns {Number}
       */
      getColumnPaddingIndex: function() {
         return this._options.display.columnPaddingIndex;
      },
      _setPageSave: function(pageNum){
         this._pageSaver[this.getCurrentRootNode()] = pageNum - 1;
      },
      _dropPageSave: function(){
         this._pageSaver = {
            'null' : 0
         };
      },
      /**
       * <wiTag group="Управление" >
       * Отменяет применение разворота
       * @param {Boolean} noLoad не загружать данные
       * @example
       * <pre>
       *    dataView.clearTurn();
       * </pre>
       */
      clearTurn: function(noLoad){
         this._clearExpandAll(noLoad);
      },
      _hasNearestRow: function ( ) {
         return $ws.proto.HierarchyView.superclass._hasNearestRow.apply(this, arguments) && !this._currentRootId;
      },
      _selectRecords: function(tbody, records){
         var data = records;
         if (this._turn === '') {
            //тут мы проверяем на то, что предложенные записи лежат в текущем разделе, чтобы отметить только их, делаем только когда нет разворота
            var recordsInCurrentBranch = [],
                  record;
            for(var i = 0, l = records.length; i < l; i++){
               record = records[i];
               if (this._isIdEqual(record.getParentKey(), this._currentRootId)) {
                  recordsInCurrentBranch.push(record);
               }
            }
            data = recordsInCurrentBranch;
         }
         $ws.proto.HierarchyView.superclass._selectRecords.apply(this, [tbody, data]);
      },
      /**
       * Возвращает элемент управления хлебными крошками
       *
       * @returns {$ws.proto.PathSelector|undefined}
       */
      getPathSelector : function() {
         return this._pathSelector;
      }
   });

   return $ws.proto.HierarchyView;

});
