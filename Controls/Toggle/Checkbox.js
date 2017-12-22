define('js!Controls/Toggle/Checkbox', [
   'Core/Control',
   'tmpl!Controls/Toggle/Checkbox/Checkbox',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Checkbox/Checkbox'
], function(Control, template, types) {

   /**
    * Контрол, отображающий стандартный флажок
    * @class Controls/Toggle/Checkbox
    * @extends Controls/Control
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/Checkbox#triState
    * @cfg {Boolean} Режим трехпозиционного чекбокса
    */

   /**
    * @name Controls/Toggle/Checkbox#checked
    * @cfg {Boolean|null} Состояние переключателя
    */

   /**
    * @event Controls/Toggle/Checkbox#checkedChanged Происходит при изменении состояния переключателя
    * @param {Boolean|null} value Новое состояние
    */

   var CheckBox = Control.extend({
      _template: template,

      _clickHandler: function (e) {
         if(this._options.checked && this._options.triState){
            this._notify('checkedChanged', null);
         }
         else if (this._options.checked===null){
            this._notify('checkedChanged', false);
         }
         else{
            this._notify('checkedChanged', !this._options.checked);
         }
      }
   });

   CheckBox.getOptionTypes = function getOptionTypes() {
      return {
         triState: types(Boolean),
         caption: types(String),
         tooltip: types(String)
      };
   };

   CheckBox.getDefaultOptions = function getDefaultOptions (){
     return{
        checked:false,
        triState: false
     };
   };

   return CheckBox;
});