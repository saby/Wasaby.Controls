/**
 * Created by ad.chistyakova on 10.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Print/MassAmountSelector', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/OperationsPanel/Print/MassAmountSelector',
   'SBIS3.CONTROLS/Radio/Group',
   'SBIS3.CONTROLS/NumberTextBox',
   'SBIS3.CONTROLS/Button',
   'i18n!SBIS3.CONTROLS/OperationsPanel/Print/MassAmountSelector',
   'css!SBIS3.CONTROLS/OperationsPanel/Print/MassAmountSelector'
], function(Control, dotTplFn) {

   var MassAmountSelector = Control.extend({

      $protected: {
         _options: {
            name: 'controls-MassAmountSelector',
            verticalAlignment: 'Top',
            width: '350px',
            height: 'auto',
            resizable: false,
            itemsRadioGroup: [
               {
                  id: 'current',
                  title: rk('Текущую страницу')
               },
               {
                  id: 'all',
                  title: rk('Все записи')
               },
               {
                  id: 'pickNum',
                  title: rk('Количество записей')
               }
            ]
         },
         _radioButtons : undefined,
         _numberTextBox: undefined,
         _numberTextBoxValue: undefined
      },
      _dotTplFn: dotTplFn,

      $constructor: function() {
          this._publish('onApply');
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
            var
               numericValue = self._numberTextBox.getNumericValue();
            if (numericValue || self._radioButtons.getSelectedKey() === 'all') {
               self._notify('onApply', numericValue);
               this.sendCommand('close', numericValue);
            } else {
               require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                  InformationPopupManager.showMessageDialog({
                     message: rk('Для завершения обработки команды вам необходимо указать количество записей'),
                     status: 'error'
                  });
               });

            }
         });
      },
      onChangeRadioButton: function(event, item){
         //TODO hotfix значения в контекст перестало проставляться, убрать когда биндинг начнёт нормально работать
         this.getContext().setValue('controls-RadioButtons', item);
         this._numberTextBoxValue = this._numberTextBoxValue || this._numberTextBox.getNumericValue();
         this._numberTextBox.setText(item === 'all' ? 0 : this._numberTextBoxValue);
         //TODO может стоит заменить на onFieldChange у контекста? Ибо радио-кнопки теперь с data-bind'ом
         this._container.find('> .controls-MassAmountSelector__numberTextBox').toggleClass('ws-hidden', item !== 'pickNum');
      }
   });

   return MassAmountSelector;

});
