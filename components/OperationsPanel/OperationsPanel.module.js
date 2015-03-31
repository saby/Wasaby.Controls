/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanel', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsPanel',
   'css!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.CheckBox',
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.CollectionMixin',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function(Control, dotTplFn, OPStyles, CheckBox, MenuLink, PickerMixin, TreeMixin, CollectionMixin, StaticSource, ArrayStrategy) {
   var defaultItems = [
      { name: 'print', caption: 'Распечатать', icon: 'sprite:icon-24 icon-Print icon-primary action-hover', type: { mass: true, selection: true} },
      { name: 'save', caption: 'Выгрузить', icon: 'sprite:icon-24 icon-Save icon-primary action-hover', type: { mass: true, selection: true } },
      { name: 'remove', caption: 'Удалить', icon: 'sprite:icon-24 action-hover icon-Erase icon-error', type: { mass: true, selection: true } },
      { name: 'allRecords', caption: 'Документы', mainAction: 'print', icon: '', type: { mass: true, selection: true } },
      { name: 'list', caption: 'Список', mainAction: 'print', icon: '', type: { mass: true, selection: true }},
      { name: 'sum', icon: 'sprite:icon-24 icon-Sum icon-primary action-hover', type: { mass: true, selection: true } },
      { name: 'merge', caption: 'Объединить', icon: '', type: { selection: true } },
      { name: 'move', caption: 'Перенести', icon: 'sprite:icon-24 icon-Move icon-primary action-hover', type: { selection: true } },
      { name: 'saveToPDF', caption: 'В PDF',  mainAction: 'save', icon: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover', type: { mass: true, selection: true } },
      { name: 'saveToExcel', caption: 'В Excel',  mainAction: 'save', icon: 'sprite:icon-24 icon-Excel icon-multicolor action-hover', type: { mass: true, selection: true } },
      { name: 'selectCurrentPage', caption: 'Всю страницу', icon: '', type: { mark: true } },
      { name: 'removeSelection', caption: 'Снять', icon: '', type: { mark: true } },
      { name: 'invertSelection', caption: 'Инвертировать', icon: '', type: { mark: true } },
      { name: 'showSelection', caption: 'Выбрать отмеченные', icon: '', type: { mark: true } }
   ];
   /**
    * SBIS3.CONTROLS.OperationsPanel
    * @class SBIS3.CONTROLS.OperationsPanel
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var OperationsPanel = Control.extend([CollectionMixin, PickerMixin, TreeMixin],/** @lends SBIS3.CONTROLS.OperationsPanel.prototype */{
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            linkedView: undefined,
            items: defaultItems
         },
         _linkedView: undefined,
         _blocks: undefined,
         _markCheckBox: undefined,
         _markButton: undefined,
         _selectedCount: undefined,
         /*TODO подумать как без него*/
         _defaultItems: undefined,
         _currentMode: undefined,
         _panelInitialized: undefined
      },

      $constructor: function() {
         this._blocks = {
            wrapper: this._container.find('.controls__operations-panel__wrapper'),
            markOperations: this._container.find('.controls__operations-panel__actions-mark'),
            allOperations: this._container.find('.controls__operations-panel__actions'),
            closedButton: this._container.find('.controls__operations-panel__closed'),
            openedButton: this._container.find('.controls__operations-panel__opened')
         };

         this._defaultItems = new StaticSource({data: defaultItems, keyField: 'name', strategy: new ArrayStrategy()});
         this._addMarkOperation();
         this._initHandlers();
         this._initOperations();
         this._bindPanelEvents();
         this.setLinkedView(this._options.linkedView);
      },
      _drawItemsCallback: function() {
         this._markButton =  this.getItemInstance('markOperations');
         this._markCheckBox = this.getChildControlByName('markCheckBox');
         if (!this._panelInitialized) {
            this._panelInitialized = true;
            this._bindMarkCheckBox();
         }
      },
      setLinkedView: function(linkedView) {
         var name;
         if (linkedView) {
            if ($ws.helpers.instanceOfModule(linkedView, 'SBIS3.CONTROLS.DataGrid')) {
               this._setLinkedView(linkedView);
            } else if (typeof linkedView === 'string') {
               name = linkedView.indexOf('/') !== -1 ? linkedView.split('/')[1] : linkedView;
               this.getTopParent().waitChildControlByName(name).addCallback(function(instanse) {
                  this._setLinkedView(instanse);
               }.bind(this));
            }
         }
      },
      _setLinkedView: function(linkedView) {
         this._toggleView(linkedView);
         this._toggleMarkBlock();
         this._togglePanel();
         this._toggleMode();
         this._notify('onAfterLoad');
      },
      getLinkedView: function() {
         return this._linkedView;
      },
      _toggleView: function(linkedView) {
         if (this._linkedView) {
            this._linkedView.unsubscribe('onSelectedItemsChange', this._handlers.onChangeSelection);
         }
         this._linkedView = linkedView;
         this._selectedCount = this._linkedView.getSelectedItems().length;
         if (this._linkedView) {
            this._linkedView.subscribe('onSelectedItemsChange', this._handlers.onChangeSelection);
         }
      },
      _initHandlers: function() {
         this._handlers = {
            onChangeSelection: this._onChangeSelection.bind(this),
            onCheckBoxClick: this._onCheckBoxClick.bind(this),
            onButtonClick: this._onButtonClick,
            /*mark*/
            selectCurrentPage: this._selectCurrentPage.bind(this),
            removeSelection: this._removeSelection.bind(this),
            invertSelection: this._invertSelection.bind(this),
            showSelection: this._showSelection.bind(this),
            /*all*/
            remove: this._removeRecords.bind(this)
         };
      },
      /*TODO подумать как без такого обхода*/
      _initOperations: function() {
         var items = this.getItems(),
            self = this;
         $.each(items._data, function (key, item) {
            self._parseOperation(item);
         });
      },
      _parseOperation: function(cfg) {
         var defaultCfg = this._defaultItems.read(cfg.name).getResult();
         $.each(['caption', 'icon', 'type'], function(key, param){
            if (!cfg[param] && cfg[param] !== '') {
               cfg[param] = defaultCfg ? defaultCfg.get(param) : '';
            }
         });
         if (cfg.type.mark && cfg.name !== 'markOperations') {
            cfg.mainAction = cfg.mainAction || 'markOperations';
         }
         if (this.getItems().getParent(cfg)) {
            cfg.title = cfg.caption;
            delete cfg.caption;
         }
         if (cfg.action) {
            this._handlers[cfg.name] = cfg.action;
         }
         cfg.visible = cfg.visible !== false;
         cfg.enabled = cfg.enabled !== false;
      },
      _onChangeSelection: function() {
         this._selectedCount = this._linkedView.getSelectedItems().length;
         this._toggleMode();
         this._togglePanel();
      },
      _onCheckBoxClick: function() {
         this._markCheckBox.getValue() === true ? this._selectCurrentPage() : this._removeSelection();
      },
      _onButtonClick: function(e, id) {
         var parent = this.getParent();
         id = id ? id : this.getName();
         if (parent._handlers[id]) {
            parent._handlers[id].apply(parent, [parent._currentMode]);
         }
      },
      _selectCurrentPage: function() {
         this._linkedView.setSelectedItemsAll()
      },
      _removeSelection: function() {
         this._linkedView.setSelectedItems([]);
      },
      _invertSelection: function() {
         this._linkedView.toggleItemsSelectionAll();
      },
      _showSelection: function() {
         console.log('_showSelection');
      },
      _removeRecords: function(type) {
         var view = this.getLinkedView(),
            records = type ? view.getSelectedItems() : view._dataSet._indexId;
         view._dataSet.removeRecord(records);
         /*TODO это точно ли я должен делать?*/
         view._dataSource.sync(view._dataSet);
      },
      _bindPanelEvents: function() {
         this._blocks.closedButton.bind('click', this.open.bind(this));
         this._blocks.openedButton.bind('click', this.close.bind(this));
      },
      _bindMarkCheckBox: function() {
         this._markCheckBox._container.bind('click', this._handlers.onCheckBoxClick);
      },
      open: function() {
         if (this.isEnabled()) {
            this._drawButtons();
            this._updateMarkBlock();
            this.showPicker();
         }
      },
      close: function() {
         this.hidePicker();
      },
      hide: function() {
         this.close();
         $ws.proto.OperationsPanel.superclass.hide.apply(this, arguments);
      },
      isOpen: function() {
         return this._picker && this._picker.isVisible();
      },
      _drawButtons: function() {
         if (!this._panelInitialized) {
            this._drawItems();
         }
      },
      _togglePanel: function() {
         this[this._selectedCount ? 'open' : 'close']();
      },
      _updateMarkBlock: function() {
         this._updateMarkCheckBox();
         this._updateMarkButton();
      },
      _toggleMode: function() {
         this._currentMode = !!this._selectedCount;
         this._blocks.wrapper.toggleClass('controls__operations-panel__mass-mode',  !this._currentMode).toggleClass('controls__operations-panel__selection-mode',  this._currentMode);
      },
      _toggleMarkBlock: function() {
         this._blocks.markOperations.toggleClass('ws-hidden', !this._linkedView._options.multiselect);
      },
      _updateMarkCheckBox: function() {
         /*TODO убрать не нужные проверки когда этот метод будет запускаться по деферреду загрузки датасоурса*/
         var recordsCount = this._linkedView && this._linkedView._dataSet && this._linkedView._dataSet.getCount();
         this._markCheckBox.setChecked(this._selectedCount === recordsCount && recordsCount ? true : this._selectedCount ? null : false)
      },
      _updateMarkButton: function() {
         var hasMarkOptions = !!this._markButton.getItems()._data.length,
            caption;
         if (hasMarkOptions) {
            this.getItems().getItem('markOperations').caption = caption = this._selectedCount ? 'Отмечено(' + this._selectedCount + ')' : 'Отметить';
            this._markButton.setCaption(caption);
         }
         this._markButton.setVisible(hasMarkOptions)
      },
      _setPickerContent: function() {
         this._picker.getContainer().append(this._blocks.wrapper);
         this._blocks.wrapper.removeClass('ws-hidden');
      },
      _setPickerConfig: function () {
         return {
            corner: 'tl',
            target: this
         };
      },
      _getTargetContainer: function(item) {
         var type = item.type.mark ? 'mark' : 'all';
         return this.getItems().getParent(item) ? null : this._blocks[type + 'Operations'];
      },
      _getItemTemplate: function() {
         return function (cfg) {
            var items = this.getItems().getChildItems(cfg.name, true),
               type = this._getButtonType(cfg.type),
               elementClass = 'controls__operations-panel__action-type-' + type,
               menu = [];
            //TODO В будущем меню само должно уметь строить себя если нулевой уровень имеет hierField
            $.each(items, function (key, value) {
               value = $ws.core.clone(value);
               if (value.mainAction === cfg.name)  {
                  value.mainAction = null;
               }
               menu.push(value);
            });
            return {
               componentType: 'js!SBIS3.CONTROLS.MenuLink',
               config: {
                  name: cfg.name,
                  caption: cfg.caption,
                  items: menu,
                  parent: this,
                  icon: cfg.icon,
                  visible: cfg.visible !== false,
                  enabled: cfg.enabled !== false,
                  hierField: this._options.hierField,
                  className: elementClass + ' controls-MenuLink__32px',
                  pickerClassName: elementClass,
                  handlers: {
                     onActivated: this._handlers.onButtonClick,
                     onMenuItemActivate: this._handlers.onButtonClick
                  }
               }
            };
         }
      },
      _addMarkOperation: function() {
         this._items.addItem({
            name: 'markOperations',
            type: {'mark': true},
            caption: 'Отметить'
         });
      },
      _getButtonType: function (type) {
         return type.mark ? 'mark' : type.mass && type.selection ? 'all' : type.mass ? 'mass' : 'selection';
      },
      setEnabled: function(enabled) {
         if (!enabled) {
            this.close();
         }
         OperationsPanel.superclass.setEnabled.apply(this, arguments);
      },
      addButtons: function(buttons) {
         this._toggleButtons(buttons, false);
      },
      removeButtons: function(buttons) {
         this._toggleButtons(buttons, true);
      },
      _toggleButtons: function(buttons, flag) {
         var self = this;
         buttons = buttons instanceof Array ? buttons : [buttons];
         $.each(buttons, function(key, value) {
            if (flag) {
               self.getItems().destroyItem(value);
               self._drawItems();
            } else {
               self._parseOperation(value);
               self.addItem(value);
            }
         });
      },
      hideButtons: function(names) {
         this._toggleButtonsVisible(names, false);
      },
      showButtons: function(names) {
         this._toggleButtonsVisible(names, true);
      },
      _toggleButtonsVisible: function(names, state) {
         var self = this;
         names = names instanceof Array ? names : [names];
         $.each(names, function(key, value) {
            self.getItems().getItem(value).visible = state;
         });
         this._drawItems();
      },
      getButton: function(name) {
         this._drawButtons();
         return this.getItemInstance(name);
      },
      getPanelState: function() {
         return this._currentMode;
      },
      destroy: function() {
         /*TODO написать в конце, чтобы ни чего не забыть разрушить*/
         OperationsPanel.superclass.destroy.apply(this);
      }
   });
   return OperationsPanel;
});

/*TODO переименовать некоторые функции с toggle*/


