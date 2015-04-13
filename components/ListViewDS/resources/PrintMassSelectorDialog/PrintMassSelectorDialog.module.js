/**
 * Created by ad.chistyakova on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.PrintMassSelectorDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.PrintMassSelectorDialog',
   'js!SBIS3.CONTROLS.RadioGroup',
   'js!SBIS3.CONTROLS.NumberTextBox',
   'js!SBIS3.CONTROLS.Button',
   'css!SBIS3.CONTROLS.PrintMassSelectorDialog'
], function(Control, dotTplFn) {

   var PrintMassSelector = Control.extend({

      $protected: {
         _options: {
            items: [{
               id : 'current',
               title : 'Текущую страницу'
            },
            {
               id : 'all',
               title : 'Все записи'
            },
            {
               id : 'pickNum',
               title : 'Количество записей'
            }],
            verticalAlignment: 'Top',
            height: 'auto'
         },
         _radioButtons : undefined,
         _numberTextBox: undefined
      },
      _dotTplFn: dotTplFn,

      $constructor: function() {
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
      },
      init: function(){
         PrintMassSelector.superclass.init.call(this);
         //TODO нужно запомнить и отписываться на destroy или сам догадается?
         this._radioButtons = this.getChildControlByName('controls-RadioButtons').subscribe('onActivate', this.onChangeRadioButton.bind(this));
         this._numberTextBox = this.getChildControlByName('controls-numberTextBox');
      },
      onChangeRadioButton: function(){
         this._container.find('> .controls-PrintMassSelector__numberTextBox').toggleClass('ws-hidden', this._radioButtons.getSelectedItem() !== 'pickNum');
      }
   });

   return PrintMassSelector;

});
