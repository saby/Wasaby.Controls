/**
 * Created by ad.chistyakova on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.MassAmountSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.MassAmountSelector',
   'js!SBIS3.CONTROLS.RadioGroup',
   'js!SBIS3.CONTROLS.NumberTextBox',
   'js!SBIS3.CONTROLS.Button'
], function(Control, dotTplFn) {

   var MassAmountSelector = Control.extend({

      $protected: {
         _options: {
            name: 'controls-MassAmountSelector',
            verticalAlignment: 'Top',
            width: '350px',
            height: 'auto',
            resizable: false
         },
         _radioButtons : undefined,
         _numberTextBox: undefined,
         _numberTextBoxValue: undefined
      },
      _dotTplFn: dotTplFn,

      $constructor: function() {
      },
      init: function(){
         var self = this;
         MassAmountSelector.superclass.init.call(this);
         //Так как забиндились на контекст в него нужно положить правильное первоначальное значение.
         this.getContext().setValue('controls-RadioButtons', 'current');
         //TODO нужно запомнить и отписываться на destroy или сам догадается?
         this._radioButtons = this.getChildControlByName('controls-RadioButtons').subscribe('onSelectedItemChange', this.onChangeRadioButton.bind(this));
         this._numberTextBox = this.getChildControlByName('controls-numberTextBox');
         this.getChildControlByName('controls-buttonPrint').subscribe('onActivated', function(){
            var parent = this.getTopParent();
            if (parent.validate()){
               parent.setResult(self._numberTextBox.getNumericValue());
               parent.ok();
            }
         });
      },
      onChangeRadioButton: function(event, item){
         //TODO hotfix значения в контекст перестало проставляться, убрать когда биндинг начнёт нормально работать
         this.getContext().setValue('controls-RadioButtons', item);
         this._numberTextBoxValue = this._numberTextBoxValue || this._numberTextBox.getNumericValue();
         this._numberTextBox.setText(item === 'all' ? 2000 : this._numberTextBoxValue);
         //TODO может стоит заменить на onFieldChange у контекста? Ибо радио-кнопки теперь с data-bind'ом
         this._container.find('> .controls-MassAmountSelector__numberTextBox').toggleClass('ws-hidden', item !== 'pickNum');
      }
   });

   return MassAmountSelector;

});
