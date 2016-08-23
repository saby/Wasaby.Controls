/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Row', [
   'js!SBIS3.CONTROLS.DragEntity.Entity',
   'js!WS.Data/Di'
], function (Entity, Di) {
   'use strict';
   /**
    * Объект перемещения списочного контрола
    *
    * @class SBIS3.CONTROLS.DragEntity.Row
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var Row = Entity.extend(/**@lends SBIS3.CONTROLS.DragEntity.Row.prototype*/{
      _moduleName: 'SBIS3.CONTROLS.DragEntity.Row',
      $protected: {
         _options: {
            /**
             * @cfg {WS.Data/Entity/Model} Модель по которой строится строка
             */
            model: undefined,
            /**
             * @cfg {String} Позиция куда добавлять элемент
             * @varian before Выше
             * @varian after Ниже
             * @varian on Внутрь
             */
            position: undefined,
            /**
             * @cfg {JQuery} строка
             */
            domElement: undefined
         }
      },
      /**
       * Возвращает модель строки
       * @returns {WS.Data/Entity/Model}
       */
      getModel: function () {
         return this._options.model;
      },
      /**
       * Устанавливает модель строки
       * @param {WS.Data/Entity/Mode} model
       */
      setModel: function (model) {
         this._options.model = model;
      },
      /**
       * Возвращает позицию элемента
       * @returns {String}
       */
      getPosition: function () {
         return this._options.position;
      },
      /**
       * Устанавливает позицию элемента
       * @param {String} position
       */
      setPosition: function (position) {
         this._options.position = position;
      },
      /**
       * Возвращает JQuery элемент сроки
       * @returns {JQuery}
       */
      getDomElement: function () {
         return this._options.domElement;
      },
      /**
       * Устанавливает JQuery элемент сроки
       * @param {JQuery} element
       */
      setDomElement: function (element) {
         this._options.domElement = element;
      }
   });
   Di.register('dragentity.row', Row);
   return Row;
});