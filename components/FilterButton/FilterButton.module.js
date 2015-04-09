/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'js!SBIS3.CONTROLS.PickerMixin'
], function(CompoundControl, dotTplFn, PickerMixin) {

   var FilterButton = CompoundControl.extend([PickerMixin],{
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
         },
         _blocks: undefined

      },

      $constructor: function() {
         this._blocks = {
            closedButton: this._container.find('.controls__filter-button__closed'),
            openedButton: this._container.find('.controls__filter-button__opened'),
            wrapper: this._container.find('.controls__filter-button__wrapper')
         };
         this._blocks.closedButton.bind('click', this.showPicker.bind(this));
         this._blocks.openedButton.bind('click', this.hidePicker.bind(this));
      },
      _setPickerContent: function() {
         this._picker.getContainer().append(this._blocks.wrapper);
         this._blocks.wrapper.removeClass('ws-hidden');
      },
      _setPickerConfig: function () {
         return {
            corner: 'tr',
            target: this,
            horizontalAlign: {
               side: 'right'
            }
         };
      }
   });

   return FilterButton;

});