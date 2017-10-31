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
    * @name Controls/Button/interface/ITriCheckable#triState
    * @cfg {Boolean} Режим трехпозиционного чекбокса
    */

   /**
    * @name Controls/Button/interface/ITriCheckable#checked
    * @cfg {Boolean|null} Состояние переключателя
    */

   /**
    * @event Controls/Button/interface/ITriCheckable#checkedChanged Происходит при изменении состояния переключателя
    * @param {Boolean|null} value Новое состояние
    */

});