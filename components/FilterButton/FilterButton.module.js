/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'html!SBIS3.CONTROLS.FilterButton/resources/demoFilterButtonTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button'
], function(CompoundControl, dotTplFn, demoTpl, PickerMixin) {

   var FilterButton = CompoundControl.extend([PickerMixin],{
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            linkText: 'Нужно отобрать?',
            filterAlign: 'right',
            template: demoTpl()
         },
         _buttons: undefined

      },
      init: function() {
         FilterButton.superclass.init.apply(this, arguments);
         this._buttons.filterLine = this.getChildControlByName('filterLine');
         this._buttons.clearFilterButton = this.getChildControlByName('clearFilterButton');
         this._buttons.applyFilterButton = this.getChildControlByName('applyFilterButton');
         this._bindButtons();
         this._applyFilter();
      },
      $constructor: function() {
         this._buttons = {
            closedButton: this._container.find('.controls__filter-button__closed'),
            openedButton: this._container.find('.controls__filter-button__opened'),
            clearLineButton: this._container.find('.controls__filter-button__clear')
         };
      },
      _bindButtons: function() {
         var buttons = this._buttons;
         buttons.closedButton.bind('click', this.showPicker.bind(this));
         buttons.openedButton.bind('click', this.hidePicker.bind(this));
         buttons.clearLineButton.bind('click', this.resetFilter.bind(this));
         buttons.applyFilterButton.subscribe('onActivated', this._applyFilter.bind(this));
         buttons.clearFilterButton.subscribe('onActivated', this.resetFilter.bind(this));
         buttons.filterLine.subscribe('onActivated', this.showPicker.bind(this));
      },
      _setPickerContent: function() {
         var wrapper = this._container.find('.controls__filter-button__wrapper');
         this._picker.getContainer().append(wrapper.removeClass('ws-hidden'));
      },
      _setPickerConfig: function () {
         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this,
            horizontalAlign: {
               side: this._options.filterAlign
            }
         };
      },
      _applyFilter: function() {
         var filter = this._pickFilter();
         this.hidePicker();
         this.applyFilter(filter);
      },
      applyFilter: function(filter) {
         console.log(filter);

         this._updateFilterButtonView(filter);
      },
      _pickFilter: function() {
         var filter = { isNotDefault: true };
         return filter;
      },
      resetFilter: function() {
         this.applyFilter({});
      },
      _updateFilterButtonView: function(filter) {
         var isDefault = this._isDefaultFilter(filter);
         this._container.toggleClass('controls__filter-button__default-filter', isDefault);
         this._buttons.clearFilterButton.setEnabled(!isDefault);
         this._updateFilterLine(filter, isDefault);
      },
      _updateFilterLine: function(filter, isDefault) {
         var filterLine = isDefault ? this._options.linkText : this._getFilterLine();
         if (filterLine) {
            this._buttons.filterLine.setCaption(filterLine);
         }
         this._buttons.filterLine.setVisible(!!filterLine);
      },
      _getFilterLine: function() {
         return 'Применён какой-то фильтр';
      },
      _isDefaultFilter: function(filter) {
         return !filter.isNotDefault;
      }
   });

   return FilterButton;

});