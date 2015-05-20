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
         _currentFilter: {}
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
         this._filterLineItemsContainer = this._container.find('.controls__filterButton__filterLine-items');
         this._filterLine = this._container.find('.controls__filterButton__filterLine');
         this._initEvents();
         this.reload();

      },
      _initEvents: function() {
         var self = this;
         this._container.mouseup(this.showPicker.bind(this));
         this._container.find('.controls__filterButton__filterLine-cross').mouseup(function(e) {
            self.resetFilter();
            e.preventDefault();
            e.stopPropagation();
         });
      },
      setLinkedView: function(view) {
         this._linkedView = view;
      },
      resetFilter: function() {
         this._linkedView._filter = this._initialFilter;
         this._linkedView.reload();
      },
      showPicker: function() {

         FilterButtonNew.superclass.showPicker.apply(this, argument);
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
            }
         }
         this._currentFilter = this._linkedView._filter;
         this.hidePicker();
         this.reload();
         this._linkedView.reload();
      },

      _setPickerContent: function() {
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', this.resetFilter.bind(this));
         this._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', this.applyFilter.bind(this));
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
            textValue = control && control.getText();
         if (textValue) {
            return '<component data-component="SBIS3.CONTROLS.Link">' +
                     '<option name="caption">' + textValue + '</option>' +
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
         this._initialFilter = this._linkedView._filter;
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
               side: this._options.filterAlign
            },
            verticalAlign: {
               side: 'top'
            },
            closeButton: true,
            closeByExternalClick: true,
            template: dotTplForPicker.call(this, {template: tpl})
         };
      }
   });

   return FilterButtonNew;

});