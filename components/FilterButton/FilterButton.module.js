/**
 * Created by am.gerasimov on 28.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton',
   [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'html!SBIS3.CONTROLS.FilterButton/FilterAreaTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button'
   ],
   function(CompoundControl, dotTplFn, dotTplForPicker, PickerMixin, DSMixin) {

   var FilterButtonNew = CompoundControl.extend([PickerMixin, DSMixin],{
      _dotTplFn: dotTplFn,
      _dotTplPicker: dotTplForPicker,
      $protected: {
         _options: {
            linkText: 'Нужно отобрать?',
            filterAlign: 'right',
            template: '',
            pickerClassName: 'controls__filterButton__picker'
         }
         },

      $constructor: function() {
         this._container.removeClass('ws-area');
         this._initEvents();

      },
      _initEvents: function() {
         this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button').click(this.showPicker.bind(this));
         this._container.find('.controls__filterButton__filterLine-cross').click(this.resetFilter.bind(this));
      },
      resetFilter: function() {
         console.log('resetFilter');
      },

      applyFilter: function() {
         console.log('applyFilter');
         this.hidePicker();
      },

      _setPickerContent: function() {
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', this.resetFilter.bind(this));
         this._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', this.applyFilter.bind(this));
      },

      _setPickerConfig: function () {
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
            context: new $ws.proto.Context({restriction: 'set'}),
            template: dotTplForPicker.call(this, {template: this._options.template})
         };
      }
   });

   return FilterButtonNew;

});