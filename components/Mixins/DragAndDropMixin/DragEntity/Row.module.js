/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Row', [
   'js!SBIS3.CONTROLS.DragEntity.Entity',
   'js!WS.Data/Di'
], function (Entity, Di) {
   'use strict';
   /**
    * Drag'n'drop объект списочного контрола. Объекты этого класса (либо его наследники) создаются ListView, когда пользователь начинает перемещать элемент.
    *
    * @class SBIS3.CONTROLS.DragEntity.Row
    * @public
    * @author Крайнов Дмитрий Олегович
    * @example
    * Рассмотрим пример, как создать свою Drag'n'drop-сущность:
    * <pre>
    *    defined('js!SBIS3.Demo.DragEntity.Task', ['js!SBIS3.CONTROLS.DragEntity.Row', 'js!WS.Data/Di'], function (Row, Di) {
    *       var Task = Row.extend({
    *          $protected: {
    *             _options: {
    *                user: undefined
    *             }
    *          },
    *          getUser: function(){
    *             return this._options.user
    *          }
    *       });
    *       //Если не нужно прокидывать долнительные опции, то регистрируем вот так
    *       Di.register('demo.task', Task);
    *    })
    *
    *    //Где-то в другом модуле регистрируем фабрику.
    *    ...
    *    var context = this.getLinkedContext();
    *    Di.register('demo.taskfactory', function(options){
    *        options.user = context.getValue('user');
    *        return new Task(options);
    *    });
    *    ...
    * </pre>
    * Внедряем фабрику в ListView через xhtml:
    * <pre>
    *    ...
    *    <component data-component="SBIS3.CONTROLS.ListView" name="listView">
    *       ...
    *       <option name="dragEntity">demo.taskfactory</option>
    *       ...
    *    </component>
    *    ...
    * </pre>
    * @see SBIS3.CONTROLS.ListView#dragEntity
    * @see SBIS3.CONTROLS.ListView#DragEntityOptions
    * @see SBIS3.CONTROLS.DragObject
    */
   var Row = Entity.extend(/**@lends SBIS3.CONTROLS.DragEntity.Row.prototype*/{
      _moduleName: 'SBIS3.CONTROLS.DragEntity.Row',
      /**
       * @typedef {String} DragPosition
       * @variant on Вставить перемещаемые элементы внутрь текущей записи.
       * @variant after Вставить перемещаемые элементы после текущей записи.
       * @variant before Вставить перемещаемые элементы перед текущей записью.
       */
      $protected: {
         _options: {
            /**
             * @cfg {WS.Data/Entity/Model} Модель по которой строится строка.
             */
            model: undefined,
            /**
             * @cfg {DragPosition} Позиция элемента после перемещения.
             */
            position: undefined,
            /**
             * @cfg {JQuery} DOM элемент, отображающий запись.
             */
            domElement: undefined
         }
      },
      /**
       * Возвращает модель строки.
       * @returns {WS.Data/Entity/Model}
       */
      getModel: function () {
         return this._options.model;
      },
      /**
       * Устанавливает модель строки.
       * @param {WS.Data/Entity/Mode} model
       */
      setModel: function (model) {
         this._options.model = model;
      },
      /**
       * Возвращает позицию элемента.
       * @returns {DragPosition}
       * @see position
       */
      getPosition: function () {
         return this._options.position;
      },
      /**
       * Устанавливает позицию элемента.
       * @param {DragPosition} position
       * @see position
       */
      setPosition: function (position) {
         this._options.position = position;
      },
      /**
       * Возвращает JQuery элемент сроки.
       * @returns {JQuery}
       */
      getDomElement: function () {
         return this._options.domElement;
      },
      /**
       * Устанавливает JQuery элемент сроки.
       * @param {JQuery} element
       */
      setDomElement: function (element) {
         this._options.domElement = element;
      }
   });
   Di.register('dragentity.row', Row);
   return Row;
});