/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.CustomFilterMenu',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CONTROLS.DropdownListMixin',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CORE.MarkupTransformer',
      'html!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.CustomFilterMenu/CustomFilterMenuItem',
      'html!SBIS3.CONTROLS.CustomFilterMenu/CustomFilterMenuFooter'
   ],

   function(Control, PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin, Button, Link, MarkupTransformer, dotTplFn, dotTplFnForItem, dotTplFnFooter) {

      'use strict';

      var CustomFilterMenu = Control.extend([PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin], {
         $protected: {
            _options: {
               itemTemplate: dotTplFnForItem,
               mode: 'hover',
               defaultValue : 0,
               defaultText : '',
               caption : ''
            },
            _dotTplFn: dotTplFn,
            _caption: null,
            _pickerCaption: null,
            _pickerListContainer: null,
            _pickerHeadContainer: null,
            _pickerFooterContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _defaultId: null,
            _buttonChoose : null,
            _buttonHasMore: null,
            _currentSelection: {},
            _hideAllowed : true
         },
         $constructor: function() {
            this._container.bind(this._options.mode === 'hover' ? 'mouseenter' : 'mousedown', this.showPicker.bind(this));
            this._publish('onClickMore');
         },
         init : function () {
            CustomFilterMenu.superclass.init.apply(this, arguments);
            this._initializePicker();
         },
         _setPickerContent : function () {
            var self = this,
                header = $('<div class="controls-CustomFilterMenu__header"/>'),
                list = $('<div class="controls-CustomFilterMenu__list"/>'),
                footer,
                pickerContainer = this._getPickerContainer();

            header.append(this._container.clone().removeAttr('style'));
            pickerContainer.append(header, list);

            this._setVariables();
            this.reload();
            this._bindItemSelect();
            this._pickerResetButton.click(function() {
               self.removeItemsSelectionAll();
               self.hidePicker();
            });
            if(this._options.mode === 'hover') {
               header.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, true));
               list.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, false));
            }
            if (this._options.multiselect) {
               footer = $('<div class="controls-CustomFilterMenu__footer"/>');
               footer.append($(MarkupTransformer(dotTplFnFooter)({})));
               this._buttonChoose = new Button({
                  caption: 'Отобрать',
                  primary: true,
                  element: footer.find('#CustomFilter_buttonChoose'),
                  className: 'ws-invisible',
                  handlers: {
                     onActivated : function(){
                        var currSelection = self._getCurrentSelection();
                        self._hideAllowed = true;
                        if (!self._isSimilarArrays(self.getSelectedKeys(), currSelection)) {
                           self.setSelectedKeys(currSelection);
                        }
                        self.hidePicker();
                     }
                  }

               });
               this._buttonHasMore = new Link({
                  caption: 'Еще...',
                  element: footer.find('#CustomFilter_buttonHasMore'),
                  handlers: {
                     onActivated : function(){
                        self._notify('onClickMore');
                        self.hidePicker();
                     }
                  }

               });
               //footer пришлось положить внутрь list, потому что иначе усложняются css правила на случаи multiselect : false
               list.append(footer);
            }
         },
         _buildTplArgs: function(item) {
            return {
               item: item,
               displayField: this._options.displayField,
               multiselect: this._options.multiselect
            };
         },
         setSelectedKeys : function(idArray){
            //Если у нас есть выбранные элементы, нцжно убрать DefaultId из набора
            //Т.к. ключи могут отличаться по типу (0 !== '0'), то придется перебирать массив самостоятельно.
            if (idArray.length > 1) {
               for (var i = 0; i < idArray.length; i++) {
                  if (idArray[i] == this._defaultId){
                     idArray = idArray.splice(i, 1);
                     break;
                  }
               }

            }
            CustomFilterMenu.superclass.setSelectedKeys.apply(this, arguments);
            this._updateCurrentSelection();

         },
         _updateCurrentSelection: function(){
            var keys;
            this._currentSelection = {};
            keys = this.getSelectedKeys();
            for (var i = 0, len = keys.length; i < len; i++ ) {
               this._currentSelection[keys[i]] = true;
            }
         },
         _getCurrentSelection: function(){
            var keys = [];
            for (var i in this._currentSelection) {
               if (this._currentSelection.hasOwnProperty(i) && this._currentSelection[i]) {
                  //Если ключи были number, они станут здесь строкой
                  keys.push(i);
               }
            }
            return keys;
         },
         //Проверка на нестрогое равенство массивов
         _isSimilarArrays : function(arr1, arr2){
            if (arr1.length === arr2.length) {
               for (var i = 0; i < arr1.length; i ++) {
                  if (arr1[i] != arr2[i]) {
                     return false;
                  }
               }
               return true;
            }
            return false;
         },
         _clickItemHandler : function (e) {
            var  self = this,
                row = $(e.target).closest('.' + self._getItemClass()),
                  selected;
            if (row.length && (e.button === ($ws._const.browser.isIE8 ? 1 : 0))) {

               //Если множественный выбор, то после клика скрыть менюшку можно только по кнопке отобрать
               this._hideAllowed = !this._options.multiselect;
               if (this._options.multiselect && !$(e.target).hasClass('controls-ListView__defaultItem') /* && $(e.target).hasClass('js-controls-CustomFilterMenu__itemCheckBox')*/) {
                  this._buttonChoose.getContainer().removeClass('ws-invisible');
                  selected =  !row.hasClass('controls-CustomFilterMenu__item__selected');
                  row.toggleClass('controls-CustomFilterMenu__item__selected', selected);
                  this._currentSelection[row.data('id')] = selected;
               } else {
                  self.setSelectedKeys([row.data('id')]);
                  self.hidePicker();
               }
            }
         },
         _dblClickItemHandler : function(e){
            e.stopImmediatePropagation();
            var  row = $(e.target).closest('.' + this._getItemClass());
            if (row.length && (e.button === ($ws._const.browser.isIE8 ? 1 : 0))) {
               if (this._options.multiselect) {
                  this._hideAllowed = true;
                  this.setSelectedKeys([row.data('id')]);
                  this.hidePicker();
               }
            }

         },
         showPicker: function() {
            var items = this._getPickerContainer().find('.controls-CustomFilterMenu__item');
            this._updateCurrentSelection();
            this._hideAllowed = true;
            //Восстановим выделение по элементам
            for (var i = 0 ; i < items.length; i++) {
               $(items[i]).toggleClass('controls-CustomFilterMenu__item__selected', !!this._currentSelection[$(items[i]).data('id')])
            }
            CustomFilterMenu.superclass.showPicker.apply(this, arguments);
            this._getPickerContainer().toggleClass('controls-CustomFilterMenu__equalsWidth', this._pickerListContainer[0].offsetWidth === this._pickerHeadContainer[0].offsetWidth);
            if (this._buttonChoose) {
               this._buttonChoose.getContainer().addClass('ws-invisible');
            }
         },
         hide: function(){
            if (this._hideAllowed) {
               CustomFilterMenu.superclass.hide.apply(this, arguments);
            }
         },
         _getItemClass: function(){
            return 'controls-CustomFilterMenu__item';
         },
         _getPickerContainer: function() {
            return this._picker.getContainer();
         },
         _pickerMouseLeaveHandler: function(fromHeader, e) {
            if(this._hideAllowed && !$(e.toElement).closest('.controls-CustomFilterMenu__' + (fromHeader ? 'list' : 'header')).length) {
               this.hidePicker();
            }
         },
         _drawItemsCallback: function() {
            //Надо вызвать просто для того, чтобы отрисовалось выбранное значение/значения
            this.setSelectedKeys(this._options.selectedKeys);
         },
         _dataLoadedCallback: function() {
            this._defaultId = this._dataSet.at(0).getKey();
         },
         _setVariables: function() {
            var pickerContainer = this._getPickerContainer();

            this._caption = this._container.find('.controls-CustomFilterMenu__caption');
            this._resetButton = this._container.find('.controls-CustomFilterMenu__crossIcon');
            this._pickerCaption  = pickerContainer.find('.controls-CustomFilterMenu__caption');
            this._pickerResetButton = pickerContainer.find('.controls-CustomFilterMenu__crossIcon');
            this._pickerListContainer = pickerContainer.find('.controls-CustomFilterMenu__list');
            this._pickerHeadContainer = pickerContainer.find('.controls-CustomFilterMenu__header');
            this._pickerFooterContainer = pickerContainer.find('.controls-CustomFilterMenu__footer');
         },
         _addItemAttributes: function (container, item) {
            /*implemented from DSMixin*/
            CustomFilterMenu.superclass._addItemAttributes.apply(this, arguments);
            if (item.getKey() == this.getDefaultId()) {
               container.addClass('controls-ListView__defaultItem');
            }
         },

         _drawSelectedItems : function(id) {
            var textValues = [],
                len = id.length,
                self = this,
                pickerContainer,
                def;

            if(len) {
               def = new $ws.proto.Deferred();

               if(this._dataSet) {
                  for(var i = 0; i < len; i++) {
                     textValues.push(this._dataSet.getRecordByKey(id[i]).get(this._options.displayField));
                  }
                  def.callback(textValues);
               } else {
                  //TODO переделать, когда БЛ научится отдавать несколько записей при чтении
                  this._dataSource.read(id[0]).addCallback(function(record) {
                     def.callback([record.get(self._options.displayField)]);
                  })
               }

               def.addCallback(function(textValue) {
                  pickerContainer = self._getPickerContainer();
                  if (!self._options.multiselect) {
                     pickerContainer.find('.controls-CustomFilterMenu__item__selected').removeClass('controls-CustomFilterMenu__item__selected');
                     pickerContainer.find('[data-id="' + id[0] + '"]').addClass('controls-CustomFilterMenu__item__selected');
                  }
                  self.setCaption(textValue.join(', '));
               });
               self._setResetButtonVisibility(id[0] === this._defaultId);
            }
         },
         getDefaultId: function() {
            return this._defaultId;
         },
         setCaption: function(text) {
            if(typeof text === 'string') {
               this._options.caption = text;
               this._caption.text(text);
               this._pickerCaption.text(text);
            }
         },
         getCaption: function() {
            return this._options.caption;
         },
         getText: function() {
            return this._caption.text();
         },
         _setResetButtonVisibility: function(show) {
            this._resetButton.toggleClass('ws-hidden', show);
            this._pickerResetButton.toggleClass('ws-hidden', show);
         },
         _getItemsContainer : function () {
            return this._pickerListContainer;
         },
         _setPickerConfig: function () {
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top',
                  offset: -2
               },
               horizontalAlign: {
                  side: 'left',
                  offset: -2
               },
               closeByExternalOver: !this._options.multiselect,
               closeByExternalClick : true,
               targetPart: true
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               CustomFilterMenu.superclass._clearItems.call(this, this._pickerListContainer);
            }
         },
         destroy : function(){
            if (this._buttonChoose) {
               this._buttonChoose.destroy();
            }
            if (this._buttonHasMore) {
               this._buttonHasMore.destroy();
            }
            CustomFilterMenu.superclass.destroy.apply(this, arguments);
         }
      });

      return CustomFilterMenu;
   });
