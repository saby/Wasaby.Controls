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
    * @name Controls/Toggle/Checkbox#value
    * @cfg {Boolean|null} Состояние переключателя
    */

   /**
    * @event Controls/Toggle/Checkbox#checkedChanged Происходит при изменении состояния переключателя
    * @param {Boolean|null} value Новое состояние
    */

   var _private ={
      notifyChangeValue: function (self, value) {
         self._notify('changeValue', value);
      }
   };

   var Checkbox = Control.extend({
      _template: template,

      _clickHandler: function () {
         if (!this._options.triState){
            _private.notifyChangeValue(this, !this._options.value);
         }
         else{
            if (this._options.value === false){
               _private.notifyChangeValue(this, true);
            }
            else{
               if(this._options.value === true){
                  _private.notifyChangeValue(this, null);
               }
               else{
                  _private.notifyChangeValue(this, false);
               }
            }
         }
      }
   });

   Checkbox.getOptionTypes = function getOptionTypes() {
      return {
         triState: types(Boolean),
         caption: types(String),
         tooltip: types(String)
      };
   };

   Checkbox.getDefaultOptions = function getDefaultOptions (){
     return{
        value:false,
        triState: false
     };
   };

   Checkbox._ptivate = _private;

   return Checkbox;
});