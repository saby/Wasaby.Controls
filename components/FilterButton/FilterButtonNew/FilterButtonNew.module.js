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
            template: '',
            pickerClassName: 'controls__filterButton__picker',
            items: [
               {field: 'field1', textValue: 'filter1'},
               {field: 'field2', textValue: 'filter2'},
               {field: 'field3', textValue: 'filter3'},
               {field: 'field4', textValue: 'filter4'}
            ],
            keyField: 'field'
         },
         _filterLineItemsContainer: undefined,
         _filterLine: undefined
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
            self.setItems([]);
            e.preventDefault();
            e.stopPropagation();
         });
      },

      resetFilter: function() {
         console.log('resetFilter');
      },

      applyFilter: function() {
         console.log('applyFilter');
      },

      _setPickerContent: function() {
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', this.resetFilter.bind(this));
         this._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', this.applyFilter.bind(this));
      },

      _drawItemsCallback: function() {
         var isFilterLineEmpty = !this._container.find('.controls-ListView__item').length;
         if(isFilterLineEmpty) {
            this._filterLineItemsContainer.text(this._options.linkText)
         }
         this._filterLine.toggleClass('controls__filterButton__filterLine-defaultText', isFilterLineEmpty);
      },

      _getItemTemplate: function(item) {
         var textValue = item.get('textValue');
         if (textValue) {
            return '<component data-component="SBIS3.CONTROLS.Link">' +
                     '<option name="caption">' + textValue + '</option>' +
                   '</component>';
         }
      },

      _getItemsContainer: function() {
         return this._filterLineItemsContainer;
      },

      _clearItems: function() {
         FilterButtonNew.superclass._clearItems.apply(this, arguments);
         this._filterLineItemsContainer.empty();
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
            closeButton: true,
            closeByExternalClick: true,
            template: dotTplForPicker.call(this, {template: tpl})
         };
      }
   });

   return FilterButtonNew;

});