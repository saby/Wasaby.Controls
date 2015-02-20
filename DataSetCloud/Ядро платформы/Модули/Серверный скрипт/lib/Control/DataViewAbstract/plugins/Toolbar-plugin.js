/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.10.12
 * Time: 15:34
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.ToolbarPlugin',
      [ 'js!SBIS3.CORE.DataViewAbstract', 'js!SBIS3.CORE.Infobox', 'js!SBIS3.CORE.ToolBar',
         'js!SBIS3.CORE.HierarchyView', 'js!SBIS3.CORE.TreeView'
      ],
      function(DataViewAbstract, Infobox, ToolBar) {

   'use strict';
   var MAX_TREE_ROWS_PER_PAGE = 1000;
/**
 * @class   $ws.proto.DataViewAbstract.ToolbarPlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.ToolbarPlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.ToolbarPlugin.prototype */{
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {Boolean} Отображать панель инструментов
             * <wiTag group="Управление" >
             * Задает необходимость отображения панели управления записями таблицы.
             * Панель управления располагается над таблицей и содержит кнопки, для всех возможных вариантов взаимодействия с отображенными в табличном браузере данными.
             * @example
             * <pre>
             *     //задаём использование панели инструментов
             *     <option name="showToolbar">true</option>
             *     <options name="toolbarButtons">
             *        <option name="refresh">true</option>
             *        <option name="move">true</option>
             *        <option name="convert">true</option>
             *     </options>
             * </pre>
             * @see toolbarButtons
             */
            showToolbar: false,
             /**
              * @typedef {Object} ToolbarButtons
              * @property {Boolean} addItem добавить запись
              * @property {Boolean} addFolder добавить папку
              * @property {Boolean} edit редактировать
              * @property {Boolean} delete удалить
              * @property {Boolean} refresh перечитать данные
              * @property {Boolean} expandSet кнопка меню разворота
              * @property {Boolean} move переместить
              * @property {Boolean} copy копировать
              * @property {Boolean} print печать
              * @property {Boolean} printRecord печать записи
              * @property {Boolean} convert конвертировать в дерево/иерархию
              * @property {Boolean} clearFilter очистить фильтрацию
              * @property {Boolean} clearExpand отменить разворот
              * @property {Boolean} clearSorting очистить сортировку
              */
             /**
              * @cfg {ToolbarButtons} Кнопки панели инструментов
              * <wiTag group="Управление">
              * Настройки кнопок.
              * Необходимо понимать, что появятся в панели инструментов только те кнопки, действия которых разрешены.
              * @example
              * <pre>
              *     <option name="showToolbar">true</option>
              *     //задаём кнопки панели инструментов
              *     <options name="toolbarButtons">
              *        <option name="refresh">true</option>
              *        //для появления данной кнопки необходимо разрешить перемещение записей в опции allowMove
              *        <option name="move">true</option>
              *        <option name="convert">true</option>
              *     </options>
              * </pre>
              * @see showToolbar
              */
            toolbarButtons: {}
         }
      },
      _menuButtons : {
         'addItem' : ['Добавить запись (Insert)', 'sprite:icon-16 icon-Add icon-primary', 'addItem'],
         'delete' : ['Удалить (Delete)', 'sprite:icon-16 icon-Erase icon-error', 'delete'],
         'refresh': ['Перечитать данные (Ctrl+N)', 'sprite:icon-16 icon-Refresh icon-primary', 'refresh'],
         'filterParams' : ['Параметры фильтрации (Ctrl+Q)', 'sprite:icon-16 icon-Document icon-primary', 'filterParams'],
         'clearFilter' : ['Очистить фильтрацию', 'sprite:icon-16 icon-Close icon-primary', 'clearFilter'],
         'clearSorting' : ['Очистить сортировку', 'sprite:icon-16 icon-Close icon-primary', 'clearSorting'],
         'clearExpand' :['Обычный', 'sprite:icon-16 icon-HierarchyView icon-primary', 'clearExpand'],
         'expandSet' :['Вид списка', '', 'expandSet']
      },
      _expandMenu : undefined,
      _expandRows : [],
      _toolbar : undefined,     //Контрол тулбара
      _toolbarReady:undefined   //Деферред готовности тулбара
   },
   $condition: function(){
      return this._options.display.showToolbar === true;
   },
   $constructor: function(){
      if(this._options.display.showToolbar === true){
         this._toolbarReady = new $ws.proto.Deferred();
         if (this.isHierarchyMode()){
            this._menuButtons['addFolder'] = ['Добавить папку (Ctrl+Insert)', 'sprite:icon-16 icon-CreateFolder icon-primary', 'addFolder'];
            this._menuButtons['convert'] = this.isHierarchy() ? ['Переключить в дерево', 'sprite:icon-16 icon-HierarchyView icon-primary', 'convert'] :
                  ['Переключить в иерархию', 'sprite:icon-16 icon-TreeView icon-primary', 'convert'];
            this._menuButtons['expandWithFolders'] = ['Развернуто с папками (Ctrl+B)', 'sprite:icon-16 icon-TreeView icon-primary', 'expandWithFolders'];
            if (this._options.display.viewMode !== 'foldersTree') //у дерева
               this._menuButtons['expand'] = ['Развернуто без папок (Ctrl+V)', 'sprite:icon-16 icon-ListView icon-primary', 'expand'];
         }
         this._drawToolBar();
         //нужно после построенного тулбара
         if (this.isHierarchyMode() && this._options.display.toolbarButtons.expandSet !== undefined && !this._options.display.fixedExpand)
            this._buildExpandMenu();
      }
   },
   /**
    * Обрабатывает нажатия клавиш
    * @param {Object} e переданное событие
    * @return {Boolean}
    */
   _keyboardHover: function(e, controlResult){
      if(this.isActive()){
         var buttonId = '';
         //меняем иконки разворота
         if (this._options.display.toolbarButtons.expandSet !== true)
            return controlResult;
         if((this._isCtrl(e) && (e.which === $ws._const.key.b || e.which === $ws._const.key.v))){
            buttonId = this._turn !== "" ? (e.which === $ws._const.key.b ? 'expandWithFolders' : 'expand') : 'clearExpand';
            this._setToolBarButtonImage('expandSet', this._expandRows[this._findExpandRowIdByButtonId(buttonId)].imgSrc);
         }
      }
      return controlResult;
   },
   _buildExpandMenu: function(){
      var   self = this,
            objectExpand = {
               'clearExpand': self._menuButtons['clearExpand'],
               'expandWithFolders': self._menuButtons['expandWithFolders'],
               'expand': self._menuButtons['expand']
                };
      for(var i in objectExpand){
         if (!objectExpand.hasOwnProperty(i) || objectExpand[i] === undefined)
            continue;
         var buttonConfig = self._prepareButtonsList([objectExpand[i]])[0],
               rowConfig = {
                  caption: buttonConfig.caption ? buttonConfig.caption : buttonConfig.tooltip,
                  imgSrc: buttonConfig.img,
                  id: buttonConfig.id ? buttonConfig.id : buttonConfig.name ? buttonConfig.name : i ,
                  renderStyle : buttonConfig.renderStyle,
                  name: i
               };
         if(buttonConfig.handlers && buttonConfig.handlers.onActivated){
            rowConfig.handlers = {
               'onActivated': buttonConfig.handlers.onActivated
            };
         }
         this._expandRows.push(rowConfig);
      }
      if (this._options.display.toolbarButtons.expandSet === false){
         this._toolbarReady.addCallback(function(toolbar){
            self._toolbar.getMenu().addSubMenu('expandSet', self._expandRows);
            return toolbar;
         });
      }
      else if(this._options.display.toolbarButtons.expandSet === true){
         if (this._options.display.showPathSelector){
            self._pathSelector.subscribe('onPathChange', function(){
               self._setToolBarButtonImage('expandSet', self._expandRows[self._findExpandRowIdByButtonId('clearExpand')].imgSrc);
            });
         }
         $ws.core.attachInstance('Control/Menu', {
            id: this.getId() + '-menuExpandControl',
            data: self._expandRows,
            handlers: {
               onActivated: function(e, id){
                  self._setToolBarButtonImage('expandSet', self._expandRows[self._findExpandRowIdByButtonId(id)].imgSrc);
               }
            }
         }).addCallback(function(menu){ self._expandMenu = menu});
      }
   },
   _setToolBarButtonImage: function(buttonName, img){
      var button;
      if (this._toolbar){
         button = this._toolbar.getButtonByName(buttonName);
         button.getContainer().find('.ws-button-image').removeClass()
               .addClass("ws-button-image");
         button.setImage(img);
      }
      //Проверку на toolbarReady убрали. По идее тулбар в этом месте должен быть всегда
   },
   _findExpandRowIdByButtonId : function(id){
      var idInRow;
      for (var i = 0, len = this._expandRows.length; i < len; i++){
         var index = id.indexOf(this._expandRows[i].name);
         if ( index >= 0 && (id.length - index === this._expandRows[i].name.length)) {
            idInRow = i;
            break;
         }
      }
      return idInRow;
   },
   /**
    * Создает основную структуру html браузера
    */
   _createContainer:function(){
      if(this._options.display.showToolbar && !this._headContainer.length){
         var borderClass = this._options.display.useDrawingLines ? ' ws-browser-border' : '';
         if(!this._options.display.showHead)
            borderClass += ' ws-browser-border-top';
         this._rootElement.find('div:first').prepend(
               [
                  '<div class="ws-browser-head-container"><div class="ws-browser-head-scroller"><table cellspacing="0" class="ws-table-fixed ws-browser-head ',
                  borderClass,
                  '\"><colgroup></colgroup><thead></thead></table></div></div>'
               ].join('')
         );
         this._head = this._rootElement.find('thead');
         this._headContainer = this._rootElement.find('.ws-browser-head-container');
      }
   },
   /**
    * Метод получения списка кнопок для тулбара
    * @returns {Array} - Массив кнопочек. [Тултип, иконка, условие показа, обработчик на нажатие]
    */
   _getToolbarButtons: function(){
      var buttons = this._options.display.toolbarButtons || [],
            result = [];
      for (var i in buttons){
         if (buttons.hasOwnProperty(i)){
            if (buttons[i] === true && this._menuButtons.hasOwnProperty(i))
               result.push(this._menuButtons[i]);
         }
      }
      return result;
   },
   /**
    * Метод получения списка иконок, валидных на данный момент
    * @return {Array} Массив кнопок с опциями.
    * Структура задана жестко. [Тултип, иконка, условие показа, обработчик на нажатие(функция)]
    */
   _getMenuButtons: function(){
/*
      if(this._turn !== '')
         buttons.push(
            ['Развернуть без папок (Ctrl+V)', 'sprite:icon-16 icon-ListView icon-primary', 'expand']
         );*/
      var buttons = this._options.display.toolbarButtons || [],
            result = [];
      for (var i in buttons){
         if (buttons.hasOwnProperty(i)){
            if (buttons[i] === false && this._menuButtons.hasOwnProperty(i))
               result.push(this._menuButtons[i]);
         }
      }
      return result;
   },
   /**
    * Метод прорисовки встроенного тулбара
    */
   _drawToolBar: function() {
      //Нужно обновить стили, относящиеся к содержимому блока заголовка (включить полосочку, если в заголовке что-то есть)
      this._headerContentFlags['toolbar-plugin'] = true;
      this._updateHeaderContentStyles();

      var toolbarContainer = $('<div class="ws-browser-toolbar"><div class="ws-toolbar" id="' + this.getId() + '-toolbar"></div></div>');
      this._headContainer.prepend(toolbarContainer);
      var buttons = this._getToolbarButtons(),
          subButtons = this._getMenuButtons(),
          self = this;
      if (this.isHierarchy() && this._options.display.showPathSelector){
         this._headContainer.find('.ws-browser-toolbar').addClass('ws-toolbar-path-selector');
      }
      new ToolBar({
         name: 'ws-toolbar-' + this.getId(),
         element: toolbarContainer.find('.ws-toolbar'),
         buttons: this._prepareButtonsList(buttons),
         subBtnCfg: this._prepareButtonsList(subButtons),
         buttonsSide: 'right',
         parent : this.getParent(),
         handlers: {
            'onReady': function(){
               self._toolbar = this;
               this.setEnabled(self.isEnabled());
               self._toolbarReady.callback(this);
            }
         }
      });
   },
   /**
    * Создаёт объект конфигурации кнопки тулбара
    * @param {Object} button Параметры кнопки
    * @returns {Object}
    */
   _prepareButton: function(button){
      return {
         tooltip: button[0],
         img: button[1] ? (button[1].search('sprite:') !== -1 ? button[1] : $ws._const.wsRoot + button[1]) : '',
         name: button[2],
         handlers: {
            'onActivated': this._actions[button[2]]
         }
      };
   },
   /**
    * Подготовливает список кнопок
    * @param {Array} buttons Массив с конфигурацией кнопок
    */
   _prepareButtonsList: function(buttons){
      var list = [],
         prevSeparator = true,
         insertSeparator = function() {
            if(!Object.isEmpty(list[list.length - 1]))
               list.push({});
         };
      for(var i = 0, l = buttons.length; i < l; i++ ){//Разбор массива готовых кнопок, с задефайненой структурой
         if(this._actions[buttons[i][2]]){//Проверка поля условия проходит - значит можно рисовать
            if(buttons[i][0] === ''){//Сепаратор с пустым тултипом
               if(!prevSeparator){
                  insertSeparator();
                  prevSeparator = true;
               }
            }
            else{ //добавляем кнопку в отрисовку
               list.push(this._prepareButton(buttons[i]));
               prevSeparator = false;
            }
         }
      }
      return list;
   },
   /**
    * <wiTag group="Управление" >
    * Метод добавления дополнительной кнопки в тулбар.
    * Добавляет кнопку в панель управления таблицей с заданными именем (name), картинкой (img), всплывающей подсказкой(tooltip) и обработкой нажатия на кнопку (handlers).
    * @param {Object} config Объект конфигурации кнопки).
    * @param {String} config.name Имя кнопки
    * @param {String} [config.tooltip] Подпись при наведении на кнопку
    * @param {String} [config.img] Путь к картинке (указывается относительно ресурсов)
    * @param {Object} [config.handlers] Стандартный объект с описанием обработчиков (см. {@link $ws.proto.Abstract#handlers})
    * @param {String} [config.wsClassName] Имя создаваемого класса
    * @example
    * <pre>
    *    dataView.addToolbarButton({
    *       name: 'Кнопка',
    *       tooltip: 'Моя кнопка',
    *       img: 'sprite:icon-16 icon-Edit icon-primary',
    *       handlers: function(){
    *          this.sendCommand('edit');
    *       }
    *    });
    * </pre>
    * @see toolbarButtons
    * @see getToolbar
    */
   addToolbarButton : function(config, image, handlers, name, wsClassName){
      //TODO в версии 3.7. (?) убить лишние параметры и оставить только Object + tooltip заменить на config
      var self = this,
         options = (typeof config == 'object') ? config : {
            tooltip: config || '',
            img: image,
            handlers: handlers || {},
            name: name,
            wsClassName: wsClassName
         };
      if (options.img && (options.img.indexOf($ws._const.resourceRoot) < 0 && options.img.indexOf($ws._const.wsRoot) < 0))
         options.img = $ws._const.resourceRoot + options.img;
      self._toolbarReady.addCallback(function(toolbar){
         toolbar = self._toolbar !== undefined ? self._toolbar : toolbar;
         toolbar.addButton(options);
         return toolbar;
      });
   },
   /**
    * Создаёт/удаляет ненужные кнопки с тулбара и меню, пересчитывает возможные действия для пользователя
    */
   _rebuildActions: function(){
      this._initActionsFlags();
      var self = this;
      this._toolbarReady.addCallback(function(toolbar){
         toolbar.getMenuReady().addCallback(function(menu){
            if(!self._actions['addItem']){
               toolbar.deleteButton('addItem');
            }
            if(!self._actions['addFolder']){
               toolbar.deleteButton('addFolder');
            }
            var buttons = self._prepareButtonsList(self._getToolbarButtons());
            for(var i = 0, len = buttons.length; i < len; ++i){
               if(!toolbar.hasButton(buttons[i].name)){
                  toolbar.insertButton(buttons[i], 'menu');
               }
            }
            var menuActions = self._getMenuButtons();
            for(i = 0, len = menuActions.length; i < len; ++i){
               menuAction = menuActions[i];
               if(!self._actions[menuAction[2]] && menu.hasItem(menuAction[2])){
                  menu.removeItem(menuAction[2]);
               }
            }
            var prevButton = 'menu';
            for(i = menuActions.length - 1; i >= 0; --i){
               var menuAction = menuActions[i];
               if(menu.hasItem(menuAction[2])){
                  prevButton = menuAction[2];
               }
               else if(self._actions[menuAction[2]] && !menu.hasItem(menuActions[2])){
                  menu.insertItem(self._prepareMenuItem(menuAction), prevButton);
               }
            }
            return menu;
         });
         return toolbar;
      });
   },
   /**
    * Устанавливает возможность добавления записей
    * @param {Boolean} allow Можно или нельзя
    */
   setAllowAdd: function(allow){
      if(this._options.allowAdd != allow)
         this._rebuildActions();
   },
   /**
    * Устанавливает возможность редактирования записей
    * @param {Boolean} allow Можно или нельзя
    */
   setAllowEdit: function(allow){
      if(this._options.allowEdit != allow)
         this._rebuildActions();
   },
   /**
    * Устанавливает возможность удаления записей
    * @param {Boolean} allow Можно или нельзя
    */
   setAllowDelete: function(allow){
      if(this._options.allowDelete != allow)
         this._rebuildActions();
   },
   /**
    * <wiTag group="Управление" >
    * Возвращает асинхронное событие, в коллбэк которого приходит элемент управления "панель управления" ($ws.proto.Toolbar).
    * Список имён стандартных кнопок панели управления представления данных:
    * <ul>
    *    <li>addItem - добавить запись;</li>
    *    <li>addFolder - добавить папку;</li>
    *    <li>edit - редактировать запись;</li>
    *    <li>copy - копировать записи;</li>
    *    <li>delete - удалить запись;</li>
    *    <li>refresh - перезагрузить данные;</li>
    *    <li>expand - развернуть без папок;</li>
    *    <li>expandWithFolders - развернуть с папками;</li>
    *    <li>filterParams - параметры фильтрации;</li>
    *    <li>clearFilter - очистка фильтрации;</li>
    *    <li>history - история записи;</li>
    *    <li>clearSorting - очистка сортировки;</li>
    *    <li>print - печать реестра;</li>
    *    <li>printRecord - печать записи;</li>
    *    <li>addItem - добавить запись.</li>
    * </ul>
    * @returns {$ws.proto.Deferred}
    * @example
    * <pre>
    *    dataView.getToolbar().addCallback(function(toolbar){
    *       dataView.addToolbarButton({
    *          name: 'Кнопка',
    *          tooltip: 'Моя кнопка',
    *          img: 'sprite:icon-16 icon-Edit icon-primary',
    *          handlers: function(){
    *             this.sendCommand('edit');
    *          }
    *       });
    *       return toolbar;
    *    });
    * </pre>
    * @see toolbarButtons
    * @see addToolbarButton
    */
   getToolbar: function(){
      return this._toolbarReady;
   },
   setEnabled: function(enable){
      enable = !!enable;
      if( (this._options.allowChangeEnable || enable === this._options.enabled) && this._toolbar )
         this._toolbar.setEnabled(enable);
   },
   _initActionsFlags: function(){
      var vtHier = this.isHierarchyMode() || this._turn !== '',
         isEditBranch = this._options.editBranchDialogTemplate,
         isEdit = this._options.editDialogTemplate,
         self = this,
         getParentForRow = function(row){
             var parentId;
             if(row instanceof Object && 'jquery' in row){
                if(self.isHierarchyMode())
                  parentId = row.attr('parentid');
             }
             if(!parentId){
                parentId = self._currentRootId;
             }
             return parentId;
         };
      this._actions['addItem'] = this._options.allowAdd !== false && !this._options.display.readOnly && isEdit && function(row, addChild) {
                               var newRecordParent = addChild === true && row && row.hasClass("ws-browser-folder") ? row.attr("rowkey") : getParentForRow(row);
                               self._showRecordDialog({isBranch: false, parentId: newRecordParent});
                            };
      this._actions['addFolder'] = this._options.allowAdd !== false && !this._options.display.readOnly && vtHier && isEditBranch && function(row, addChild) {
                               var newRecordParent = addChild === true && row && row.hasClass("ws-browser-folder") ? row.attr("rowkey") : getParentForRow(row);
                               self._showRecordDialog({isBranch: true, parentId: newRecordParent});
                            };
      this._actions['expand'] = this.isHierarchyMode() && !this._options.display.fixedExpand &&
                                  this._options.selectionType !== "node" && function(){
                               if (self._turn !== 'OnlyLeaves'){
                                  self._turn = '';
                                  self.applyTurn(false);
                               }
                            };
      this._actions['expandWithFolders'] = this.isHierarchyMode() && !this._options.display.fixedExpand &&
                                  this._options.selectionType !== "node" && function(){
                               if (self._turn !== 'BranchesAndLeaves'){
                                  self._turn = '';
                                  self.applyTurn(true);
                               }
                            };
      this._actions['clearExpand'] = this.isHierarchyMode() && !this._options.display.fixedExpand &&
            this._options.selectionType !== "node" && function(){
         self._clearExpandAll();
      };
      this._actions['expandSet'] = this.isHierarchy() && !this._options.display.fixedExpand &&
            this._options.selectionType !== "node" && function(className){
            if (self._options.display.toolbarButtons.expandSet === false){
               return true;
            }
            var event;
            if(document.createEvent){
               event = document.createEvent("HTMLEvents");
            }
            else if(document.createEventObject){
               event = document.createEventObject();
            }
            var buttonContainer = self._options.display.toolbarButtons.expandSet ? this.getContainer() : $('#' + self._id + '-' + className), //если выбор из подменю, то ищем по всему документу
                     offset = buttonContainer.offset();
            event.clientX = offset.left + $ws._const.Toolbar.menuOffsetDefault.left;
            event.clientY = offset.top + $ws._const.Toolbar.menuOffsetDefault.top + buttonContainer.height();
            self._expandMenu.show(event);
      };
      this._actions['filterParams'] = this._options.filterDialogTemplate && function(){
                               self.createFiltersDialog.apply(self, []);
                            };
      this._actions['clearFilter'] = this._options.filterDialogTemplate && function(){
                               self.resetFilter();
                            };
      this._actions['refresh'] = $.proxy(self.reload, self);
      this._actions['convert'] = this.isHierarchyMode() && function(){
         self.convert();
      };
   },
   /**
    * Переключить из иерархии в дерево. Актуально только для режима isHierarchyMode = true, т.е. при работе с иерархическими данными.
    */
   convert: function(){
      var self = this,
         options = self._options,
         parent = self.getParent(),
         topParent = self.getTopParent(),
         rootNode =  self.getRootNode(),
         setBrowserBool = !!($ws.helpers.instanceOfMixin(topParent, 'SBIS3.CORE.Selector') && self === topParent.getBrowser());//нужно обновить браузер у selector, если это его окно
      // TODO это неправильно
      Infobox.hide(0);
      if (options.optionsSaver.display !== undefined)
         options.display = options.optionsSaver.display;
      else{
         options.optionsSaver.display = options.display;
      }
      options.display.showPathSelector = true;
      options.type = self.isTree() ? 'Control/DataViewAbstract/TableView/HierarchyViewAbstract/HierarchyView' : 'Control/DataViewAbstract/TableView/TreeView' ;
      options.handlers = self._saveHandlersToConvert();
      options.element = $('<div id="'+self.getId()+'" class="ws-convert-container" type="' + options.type + '"></div>');
      options.element.attr({
         'alignmargin' : self.getContainer().attr('alignmargin'),
         'autoheight' : self.getContainer().attr('autoheight'),
         'sbisname' : self.getContainer().attr('sbisname'),
         'tabindex' : self.getContainer().attr('tabindex')
      });
      options.dataSource.firstRequest = false;
      // если pathSelector подменил фильтр ставим старый
      options.optionsSaver.filterForSet = options.optionsSaver.filter ? options.optionsSaver.filterForSet : self.getQuery();
      options.optionsSaver.isConverted = true;
      options.display.rootNode = (rootNode instanceof Array) ? rootNode.toString() : rootNode;// в setRootNode некоторые личности ставят массив. Делаем строку
      if (self.isHierarchy()){
         if (self._turn === '') {
            options.optionsSaver.rootNode = self.getCurrentRootNode();
         }
      }
      else if (self.getQuery()['Разворот'] !== 'С разворотом'){ //Дерево _turn не ставит
         var activeRec =  self.getActiveRecord();
         options.optionsSaver.rootNode = activeRec ? (self.isTreeFolderExpanded(activeRec.getKey()) ?  activeRec.getKey() : self.getFolderKeyForActiveRecord())
               : self.getFolderKeyForActiveRecord();
      }
      options.optionsSaver.activeRecord = self.getActiveRecord();
      options.verticalAlignment = self._verticalAlignment;
      options.horizontalAlignment = self._horizontalAlignment;
      options.parent = parent;
      options.linkedContext = self.getLinkedContext();
      options.setNewDataSourceWithParent = true; //Создание нового рекордсета для нового браузера
      delete options.cssClassName; //Иначе дерево не проставит свой класс
      self.getContainer().parent().append(options.element);
      options.handlers.onReady = options.handlers.onReady || [];
      options.handlers.onReady.push(self._onReady);
      self.destroy();
      //мы сделаем new, так как require.js в случае циклической зависимости отдаст нам null
      var view = self.isTree() ? new $ws.proto.HierarchyView(options) : new $ws.proto.TreeView(options);
      if (view.isTree()){
         view.subscribe('onFolderOpen', self._onTreeShowInfoBox);
      }
      view._notify('onConvert', view);
      //Меняем брауезер у DialogSelector
      if (setBrowserBool) {
         topParent.setBrowser(view);
      }
   },
   _resetChildrenOwners: function() {
      var children = this.getTopParent().getChildControls(),
          viewId = this.getId();
      for (var i = 0, len = children.length; i < len; i++) {
         if (children[i].getOwnerId() ===  viewId) {
            children[i].setOwner(this);
         }
      }
   },
   _onReady: function(){
      this.unsubscribe('onReady', this._onReady);
      var filter = $ws.core.merge(this.getQuery(), this._options.optionsSaver.filterForSet);
      filter[this._options.display.hierColumn] = this.isHierarchy() ? this._options.optionsSaver.rootNode : this.getRootNode();
      this.setQuery(filter);
      this._resetChildrenOwners();
      this.once('onAfterLoad', this._onAfterLoadShowBranch);
   },
   _onAfterLoadShowBranch : function (){
      if (this.isTree())
         this._onTreeShowInfoBox();
      //TODO В 3.5.2 попробовать обойтись без showBranch (прописать раздел в setQuery для дерева)
      if (this._options.optionsSaver.rootNode !== this.getCurrentRootNode() && this.isTree()) {
         if (this._systemParams['Разворот'] !== 'С разворотом'){
            this.once('onAfterLoad', this._onAfterLoadSetActiveRow);
            this.showBranch(this._options.optionsSaver.rootNode);
            return;
         }
      }
      this._onAfterLoadSetActiveRow();
   },
   _onAfterLoadSetActiveRow: function(){
      //если была запись в корне - поставим курсор на нее
      if (this._options.optionsSaver.activeRecord) {
         var key = this._options.optionsSaver.activeRecord.getKey(),
               trs = this.getContainer().find('tr:.ws-browser-table-row');
         for (var i = 0, len = trs.length; i < len; i++) {
            if (trs[i].getAttribute('rowkey') == key) {
               this.setActiveRow($(trs[i]));
               break;
            }
         }
      }
      this.setActive(true);
   },
   _onTreeShowInfoBox: function(){
      var self = this,
         nextPage = this.getRecordSet().hasNextPage(),
         rowsPerPage = this._options.display.partiallyLoad ? nextPage : this.getDataSource().rowsPerPage;
      if ((typeof (nextPage) === "boolean" && nextPage ) || (nextPage > rowsPerPage) || (nextPage && rowsPerPage >= MAX_TREE_ROWS_PER_PAGE)){
         // TODO а почему-бы здесь не показывать у какого-то фиксированного элемента?
         $ws.single.Infobox.show(self.getActiveElement(),
            'Внимание! Показаны не все записи, так как это привело бы к длительному ожиданию.<br> ' +
            'Чтобы посмотреть полный список - переключитесь в режим иерархии.', undefined, 100, 5000);
      }
   },
   /**
    * Сохраняем пользовательские обработчики, чтобы отправить в новое представление (кнопка переключения)
    * @returns {Object} Объект с массивом обработчиков
    * @private
    */
   _saveHandlersToConvert: function(){
      var
         result = {},
         events = this.getEvents();

      for (var i = 0, l = events.length; i < l; i++){
         var eventName = events[i],
             handlers = this.getEventHandlers(eventName);
         if (eventName==='onFolderEnter')
            continue;
         for (var j = 0 , len = handlers.length; j < len ; j++){
            if(handlers[j].wsHandlerPath || eventName === 'onConvert'){
               if (result[eventName]=== undefined)
                  result[eventName]= [];
               result[eventName].push(handlers[j]);
            }
         }
      }
      return result;
   },
   destroy: function() {
      if(this._toolbar)
         this._toolbar.destroy();
   }
});

});