define('js!Controls/Toggle/Checkbox', [
], function() {

   /**
    * Контрол, отображающий стандартный флажок
    * @class Controls/Toggle/Checkbox
    * @extends Controls/Control
    * @mixes Controls/Button/interface/ICaption
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

});