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
            pickerClassName: 'controls__filterButton__picker'
         },
         _filterLineButton: undefined

      },

      $constructor: function() {
         var self = this;
         this._container.removeClass('ws-area');
         this._container.find('.controls__filterButton-button').mouseup(function() {
            self.showPicker();
         });
      },

      init: function() {
         FilterButtonNew.superclass.init.apply(this, arguments);
         (this._filterLineButton = this.getChildControlByName('filterLine')).subscribe('onActivated', this.showPicker.bind(this));
      },

      resetFilter: function() {
         console.log('resetFilter');
      },

      applyFilter: function() {
         console.log('applyFilter');
      },

      _redraw: function() {/*Переопределяем, чтобы не было отрисовки*/},

      _setPickerContent: function() {
         var self = this;
         this._picker.getContainer().append(dotTplForPicker.call(this, {template: this._options.template})).addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.reviveComponents().addCallback(function() {
            self._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', self.resetFilter.bind(self));
            self._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', self.applyFilter.bind(self));
         });
      },

      _setPickerConfig: function () {
         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this,
            horizontalAlign: {
               side: this._options.filterAlign
            },
            closeButton: true
         };
      }
   });

   return FilterButtonNew;

});