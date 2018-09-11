define('Controls/List/EditInPlace/EditingRow', [
   'Core/Control',
   'wml!Controls/List/EditInPlace/EditingRow'
], function(Control, template) {
   var EditingRow = Control.extend({
      _template: template,

      _afterMount: function() {
         this.activate();
      },

      _onClickHandler: function(e) {
         /*
         Останавливаем всплытие любых кликов, если строка редактируется. Если клики будут всплывать, то их будет ловить список
         и генерировать событие itemClick, которое не должно стрелять на редактируемой строке.
         Был ещё другой вариант: останавливать клик на поле ввода. Тогда возникают несколько проблем:
         - На каждом компоненте, который будет лежать внутри редактируемой строки, придется останавливать всплытие.
         - Другие компоненты (например, TouchDetector) могут следить за кликами на поле ввода, т.е. безусловный stopPropagation сломал бы ту логику.
         */
         e.stopPropagation();
      }
   });

   return EditingRow;
});
