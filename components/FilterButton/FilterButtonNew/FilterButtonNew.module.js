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
         _filterLineButton: undefined
      },

      $constructor: function() {
         var self = this;
         this._container.removeClass('ws-area');
         this._filterLineButton = this._container.find('.controls__filterButton__filterLine-items');
         this._initEvents();
         this.reload();

      },
      _initEvents: function() {
         var self = this;
         this._container.mouseup(this.showPicker());
         this._container.find('.controls__filterButton__filterLine-cross', function(e) {
            self.setItems([]);
            e.preventDefault();
            e.stopPropagation();
         })
      },

      resetFilter: function() {
         console.log('resetFilter');
      },

      applyFilter: function() {
         console.log('applyFilter');
      },

      _setPickerContent: function() {
         var self = this;
         this._picker.getContainer().append(dotTplForPicker.call(this, {template: this._options.template}));
         this._picker.reviveComponents().addCallback(function() {
            self._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', self.resetFilter.bind(self));
            self._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', self.applyFilter.bind(self));
         });
      },

      _drawItemsCallback: function() {
         var isFilterLineEmpty = Object.isEmpty(this.getItemsInstances());
         if(isFilterLineEmpty) {
            this._filterLineButton.text(this._options.linkText)
         }
         this._filterLineButton.toggleClass('controls__filterButton__filterLine-defaultText', isFilterLineEmpty);
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
         return this._filterLineButton;
      },

      _clearItems: function() {
         FilterButtonNew.superclass._clearItems.apply(this, arguments);
         this._filterLineButton.empty();
      },

      _setPickerConfig: function () {
         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this,
            horizontalAlign: {
               side: this._options.filterAlign
            },
            closeButton: true,
            closeByExternalClick: true,
            //TODO спросить почему не вешается класс
            cssClassName: 'controls__filterButton-' + this._options.filterAlign
         };
      }
   });

   return FilterButtonNew;

});