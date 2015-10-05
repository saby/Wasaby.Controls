/**
 * Created by am.gerasimov on 28.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButtonNew', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButtonNew',
   'html!SBIS3.CONTROLS.FilterButtonNew/FilterAreaTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button'
], function(CompoundControl, dotTplFn, dotTplForPicker, PickerMixin, DSMixin, ControlHierarchyManager) {

   var FilterButtonNew = CompoundControl.extend([PickerMixin, DSMixin],{
      _dotTplFn: dotTplFn,
      _dotTplPicker: dotTplForPicker,
      $protected: {
         _options: {
            linkText: 'Нужно отобрать?',
            filterAlign: 'right',
            pickerClassName: 'controls__filterButton__picker',
            items: [],
            keyField: 'field'
         },
         _filterLineItemsContainer: undefined,
         _filterLine: undefined,
         _clearButton: undefined,
         _applyButton: undefined,
         //FIXME придрот для демки
         _linkedView: undefined,
         _initialFilter: undefined,
         _initialControlsValues: {},
         _currentControlsValues: {},
         _nomFilters: {
            withoutNDS: true,
            ShowDeleted: true,
            ShowOnlyDeleted: true,
            onlySelling: true,
            onlyNotSelling: true,
            ТипНоменклатуры: true
         },
         _controlChangedValues: 0,
         _changedControlsMap: {}
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
         this._filterLineItemsContainer = this._container.find('.controls__filterButton__filterLine-items');
         this._filterLine = this._container.find('.controls__filterButton__filterLine');
         this._initEvents();
         this.reload();

      },
      _initEvents: function() {
         this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button').click(this.showPicker.bind(this));
         this._container.find('.controls__filterButton__filterLine-cross').click(this.resetFilter.bind(this));
      },
      setLinkedView: function(view) {
         this._linkedView = view;
         view.once('onDrawItems', this._setInitialFilter.bind(this));
      },

      //Очистка фильтрации, перерисовка текста у кнопки фильтров
      resetFilter: function() {
         this._setControlsValues(this._initialControlsValues);
         this._currentControlsValues = $ws.core.clone(this._initialControlsValues);
         this.reload();
         for(var i in this._nomFilters) {
            if(this._nomFilters.hasOwnProperty(i) && this._linkedView._filter.hasOwnProperty(i)) {
               delete this._linkedView._filter[i]
            }
         }
         this.toggleClearButton(false);
         this._linkedView.reload($ws.core.merge(this._linkedView._filter, this._initialFilter, {clone: true}));
      },

      showPicker: function() {
         this._setControlsValues(this._currentControlsValues);
         FilterButtonNew.superclass.showPicker.apply(this, arguments);
	      this._picker.getContainer().css('marginLeft', '5px');
      },
      _controlValueChange: function(ctr, event, value) {
         var ctrName = ctr.getName(),
             ctrValue = value === null ? value : value[0];

         if(ctrValue === null || ctr.getDefaultId && ctr.getDefaultId() === ctrValue) {
            if(this._changedControlsMap[ctrName]) {
               this._changedControlsMap[ctrName] = false;
               if (--this._controlChangedValues === 0) {
                  this.toggleClearButton(false);
               }
            }
         } else if (!this._changedControlsMap[ctrName]) {
            this._changedControlsMap[ctrName] = true;
            if(++this._controlChangedValues === 1) {
               this.toggleClearButton(true);
            }
         }
      },
      toggleClearButton: function(enabled) {
         this._clearButton.setEnabled(!!enabled);
      },
      _initControlsEvents: function(controls) {
         for(var i = 0, len = controls.length; i < len; i++) {
            if($ws.helpers.instanceOfModule(controls[i], 'SBIS3.CONTROLS.CustomFilterMenu')) {
               controls[i].subscribe('onSelectedItemsChange', this._controlValueChange.bind(this, controls[i]));
            }
            if($ws.helpers.instanceOfModule(controls[i], 'SBIS3.CORE.FieldLink')) {
               controls[i].subscribe('onValueChange', this._controlValueChange.bind(this, controls[i]));
            }
         }
      },
      //Применение фильтрации, перерисовка текста у кнопки фильтров
      applyFilter: function() {
         console.log('applyFilter');
         //FIXME придрот для демки
         var controls = this._picker.getChildControls(),
             ctrlName,
             txtValue,
             filter = {};
         for (var i = 0, len = controls.length; i < len; i++) {
            ctrlName = controls[i].getName();
            if(ctrlName !== 'applyFilterButton' && ctrlName !== 'clearFilterButton') {
               this._currentControlsValues[ctrlName] = this._getControlValue(controls[i]);
               if(ctrlName === 'NDS_filter') {
                  filter['withoutNDS'] = controls[i].getText() === 'Без НДС';
               }
               if(ctrlName === 'Using_filter') {
                  txtValue = controls[i].getText();
                  if(txtValue === 'Неиспользуемые') {
                     filter['ShowDeleted'] = true;
                     filter['ShowOnlyDeleted'] = true;
                  }
                  if(txtValue === 'Используемые') {
                     filter['ShowDeleted'] = false;
                     filter['ShowOnlyDeleted'] = false;
                  }
                  if(txtValue === 'Все (используемые и нет)') {
                     filter['ShowDeleted'] = true;
                     filter['ShowOnlyDeleted'] = false;
                  }
               }
               if(ctrlName === 'Selling_filter') {
                  txtValue = controls[i].getText();
                  if(txtValue === 'Все (для продажи и нет)') {
                     filter['onlySelling'] = false;
                     filter['onlyNotSelling'] = false;
                  }
                  if(txtValue === 'Для продажи') {
                     filter['onlySelling'] = true;
                     filter['onlyNotSelling'] = false;
                  }
                  if(txtValue === 'Не для продажи') {
                     filter['onlySelling'] = false;
                     filter['onlyNotSelling'] = true;
                  }
               }
               if(ctrlName === 'ТипНоменклатуры') {
                  txtValue = controls[i].getValue();
                  filter['ТипНоменклатуры'] = txtValue ? txtValue : null;
               }
            }
         }
         this.hidePicker();
         this.reload();
         this._linkedView.reload($ws.core.merge(this._linkedView._filter, filter));
      },
      _setPickerContent: function() {
         var fieldLink = this._picker.getChildControlByName('ТипНоменклатуры'),
             suggest = fieldLink.getSuggest();

         fieldLink.subscribe('onBeforeDictionaryOpen', function() {
            setTimeout(function() {
               ControlHierarchyManager.addNode(fieldLink._dictionarySelector);
            }, 0)
         });
         this._currentControlsValues = this._getControlsValues();
         this._initialControlsValues = $ws.core.clone(this._currentControlsValues);
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         (this._clearButton = this._picker.getChildControlByName('clearFilterButton')).subscribe('onActivated', this.resetFilter.bind(this));
         (this._applyButton = this._picker.getChildControlByName('applyFilterButton')).subscribe('onActivated', this.applyFilter.bind(this));
         this._clearButton.setEnabled(false);
         this._initControlsEvents(this._picker.getChildControls());
         ControlHierarchyManager.addNode(suggest);
      },

      _drawItemsCallback: function() {
         var isFilterLineEmpty = !this._container.find('.controls-ListView__item').length;
         if (isFilterLineEmpty) {
            this._filterLineItemsContainer.text(this._options.linkText)
         }
         this._filterLine.toggleClass('controls__filterButton__filterLine-defaultText', isFilterLineEmpty);
      },

      _getItemTemplate: function(item) {
         var filterName = item.get('filter'),
             control = this._picker && this._picker.getChildControlByName(filterName),
             value = control && ((control.getSelectedKeys && control.getSelectedKeys()) || (control.getValue() && control.getValue()));

         if (value && this._initialControlsValues[control.getName()] !== ((value.length && value[0]) || value)) {
            return '<component data-component="SBIS3.CONTROLS.Link">' +
                   '<option name="caption">' + (control.getText ? control.getText() : control.getStringValue()) + '</option>' +
                   '</component>';
         } else {
            return '';
         }
      },

      _getItemsContainer: function() {
         return this._filterLineItemsContainer;
      },

      _clearItems: function() {
         FilterButtonNew.superclass._clearItems.apply(this, arguments);
         this._filterLineItemsContainer.empty();
      },

      _setInitialFilter: function() {
         this._initialFilter = $ws.core.clone(this._linkedView._filter);
      },

      _setPickerConfig: function () {
         var tpl = '';
         for(var i in this._options.items) {
            if(this._options.items.hasOwnProperty(i) && this._options.items[i].editor) {
               tpl += this._options.items[i].editor;
            }
         }

         // FIXME эта кнопка фильтров удалена в 3.7.3, но проблема в popUp миксине с разворотом у края экрана осталась
         return {
	         corner: 'tl',
	         horizontalAlign: {
		         side: 'right',
		         offset: 25
	         },
	         verticalAlign: {
		         side: 'top',
		         offset: -8
	         },
	         closeButton: true,
	         target: this._container.find('.controls__filterButton-button'),
	         closeByExternalClick: true,
	         template: dotTplForPicker.call(this, {template: tpl})
         };
      },
      _setControlValue: function(control, value) {
         if($ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.DropDownList')) {
            control.setSelectedKeys((Array.isArray(value) ? value : [value]) || [0]);
         }
         if($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldLink')) {
            control.setValue(value);
         }
      },
      _getControlValue: function(control) {
         var result;
         if($ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.DropDownList')) {
            result = control.getSelectedKeys();
         }
         if($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldLink')) {
            result = control.getValue();
         }
         return result;
      },
      _setControlsValues: function(values) {
         var self = this,
            control;
         $.each(values, function(name, value) {
            control = self._picker.getChildControlByName(name);
            control && self._setControlValue(control, value);
         });
      },
      _getControlsValues: function() {
         var controls = this._picker.getChildControls(),
             res,
             result = {};
         for (var i = 0, len = controls.length; i < len; i++) {
            res = this._getControlValue(controls[i]);
            result[controls[i].getName()] = Array.isArray(res) ? res[0] : res;
         }
         return result;
      }
   });

   return FilterButtonNew;

});