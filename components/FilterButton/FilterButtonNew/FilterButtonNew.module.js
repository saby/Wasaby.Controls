/**
 * Created by am.gerasimov on 28.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButtonNew', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButtonNew',
   'html!SBIS3.CONTROLS.FilterButtonNew/FilterAreaTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button'
], function(CompoundControl, dotTplFn, dotTplForPicker, PickerMixin, DSMixin) {

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
         //FIXME придрот для демки
         _linkedView: undefined,
         _initialFilter: undefined,
         _initialControlsValues: {},
         _currentControlsValues: {}
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
      resetFilter: function() {
         this._setControlsValues(this._initialControlsValues);
         this._currentControlsValues = $ws.core.clone(this._initialControlsValues);
         this.reload();
         this._linkedView.reload($ws.core.clone(this._initialFilter));
      },
      showPicker: function() {
         this._setControlsValues(this._currentControlsValues);
         FilterButtonNew.superclass.showPicker.apply(this, arguments);
      },
      applyFilter: function() {
         console.log('applyFilter');
         //FIXME придрот для демки
         var controls = this._picker.getChildControls(),
            ctrlName,
            txtValue;
         for (var i = 0, len = controls.length; i < len; i++) {
            ctrlName = controls[i].getName();
            if(ctrlName !== 'applyFilterButton' && ctrlName !== 'clearFilterButton') {
               this._currentControlsValues[ctrlName] = this._getControlValue(controls[i]);
               if(ctrlName === 'NDS_filter') {
                  this._linkedView._filter['withoutNDS'] = controls[i].getText() === 'Без НДС';
               }
               if(ctrlName === 'Using_filter') {
                  txtValue = controls[i].getText();
                  if(txtValue === 'Неиспользуемые') {
                     this._linkedView._filter['showDeleted'] = true;
                     this._linkedView._filter['ShowOnlyDeleted'] = true;
                  }
                  if(txtValue === 'Испльзуемые') {
                     this._linkedView._filter['showDeleted'] = false;
                     this._linkedView._filter['ShowOnlyDeleted'] = false;
                  }
                  if(txtValue === 'Все (используемые и нет)') {
                     this._linkedView._filter['showDeleted'] = true;
                     this._linkedView._filter['ShowOnlyDeleted'] = false;
                  }
               }
               if(ctrlName === 'Selling_filter') {
                  txtValue = controls[i].getText();
                  if(txtValue === 'Все (для продажи и нет)') {
                     this._linkedView._filter['onlySelling'] = false;
                     this._linkedView._filter['onlyNotSelling'] = false;
                  }
                  if(txtValue === 'Для продажи') {
                     this._linkedView._filter['onlySelling'] = true;
                     this._linkedView._filter['onlyNotSelling'] = false;
                  }
                  if(txtValue === 'Не для продажи') {
                     this._linkedView._filter['onlySelling'] = false;
                     this._linkedView._filter['onlyNotSelling'] = true;
                  }
               }
               if(ctrlName === 'ТипНоменклатуры') {
                  txtValue = controls[i].getValue();
                  if(txtValue) {
                     this._linkedView._filter['ТипНоменклатуры'] = txtValue;
                  }
               }
            }
         }
         this.hidePicker();
         this.reload();
         this._linkedView.reload();
      },

      _setPickerContent: function() {
         this._currentControlsValues = this._getControlsValues();
         this._initialControlsValues = $ws.core.clone(this._currentControlsValues);
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', this.resetFilter.bind(this));
         this._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', this.applyFilter.bind(this));
         this._picker.addNodeToHierarchyManager(this._picker.getChildControlByName('ТипНоменклатуры').getSuggest());
      },

      _drawItemsCallback: function() {
         var isFilterLineEmpty = !this._container.find('.controls-ListView__item').length;
         if (isFilterLineEmpty) {
            this._filterLineItemsContainer.text(this._options.linkText)
         }
         this._filterLine.toggleClass('controls__filterButton__filterLine-defaultText', isFilterLineEmpty);
      },

      _getItemTemplate: function(item) {
         var
            filterName = item.get('filter'),
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
         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this,
            horizontalAlign: {
               side: this._options.filterAlign === 'right' ? 'left' : 'right'
            },
            verticalAlign: {
               side: 'top'
            },
            closeButton: true,
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