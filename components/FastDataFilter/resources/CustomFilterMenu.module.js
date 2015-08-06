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
      'html!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.CustomFilterMenu/CustomFilterMenuItem'

   ],

   function(Control, PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin, dotTplFn, dotTplFnForItem) {

      'use strict';

      var CustomFilterMenu = Control.extend([PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin], {
         $protected: {
            _options: {
               itemTemplate: dotTplFnForItem,
               mode: 'hover'
            },
            _dotTplFn: dotTplFn,
            _caption: null,
            _pickerCaption: null,
            _pickerListContainer: null,
            _pickerHeadContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _defaultId: null
         },
         $constructor: function() {
            this._container.bind(this._options.mode === 'hover' ? 'mouseenter' : 'mousedown', this.showPicker.bind(this));
         },
         init : function () {
            CustomFilterMenu.superclass.init.apply(this, arguments);
            this._initializePicker();
         },
         _setPickerContent : function () {
            var self = this,
                header = $('<div class="controls-CustomFilterMenu__header"/>'),
                list = $('<div class="controls-CustomFilterMenu__list"/>'),
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
         },
         showPicker: function() {
            CustomFilterMenu.superclass.showPicker.apply(this, arguments);
            this._getPickerContainer().toggleClass('controls-CustomFilterMenu__equalsWidth', this._pickerListContainer[0].offsetWidth === this._pickerHeadContainer[0].offsetWidth);
         },
         _getItemClass: function(){
            return 'controls-CustomFilterMenu__item';
         },
         _getPickerContainer: function() {
            return this._picker.getContainer();
         },
         _pickerMouseLeaveHandler: function(fromHeader, e) {
            if(!$(e.toElement).closest('.controls-CustomFilterMenu__' + (fromHeader ? 'list' : 'header')).length) {
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

                  pickerContainer.find('.controls-CustomFilterMenu__item__selected').removeClass('controls-CustomFilterMenu__item__selected');
                  pickerContainer.find('[data-id="' + id[0] + '"]').addClass('controls-CustomFilterMenu__item__selected');
                  self._setCaptionText(textValue.join(', '));
               });
               self._setResetButtonVisibility(id[0] === this._defaultId);
            }
         },
         getDefaultId: function() {
            return this._defaultId;
         },
         _setCaptionText: function(text) {
            if(typeof text === 'string') {
               this._caption.text(text);
               this._pickerCaption.text(text);
            }
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
               closeByExternalOver: true,
               targetPart: true
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               CustomFilterMenu.superclass._clearItems.call(this, this._pickerListContainer);
            }
         }
      });

      return CustomFilterMenu;
   });
