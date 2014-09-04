/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('js!SBIS3.CONTROLS.Control', [], function() {

   'use strict';

   /**
    * базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS.Control
    * @extends $ws.core.extend
    */

   var Control = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Control.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Запрещено или нет пользовательское взаимодействие с контролом
             */
            disabled: false,
            /**
             * @cfg {String|jQuery|HTMLElement} Контейнер, в котором создается контрол
             */
            container : null,
            /**
             * @cfg {Object} модель, данные, которые передаются в контрол
             */
            context : null,
            /**
             * @cfg {String} Имя контрола
             */
            name: '',
            /**
             * @cfg {SBIS3.CONTROLS.Control} Логический родитель контрола
             */
            owner: null,
            /**
             * @cfg {SBIS3.CONTROLS.Control} Физический родитель контрола
             */
            parent: null,
            /**
             * @cfg {String} Всплывающая подсказка
             */
            tooltip: '',
            /**
             * @cfg {Boolean} Видимость контрола
             */
            visibility: true
         }
      },

      $constructor: function() {

      },

      /**
       * Разрешить/запретить пользовательское взаимодействие с контролом
       * @param flag
       */
      setDisabled: function(flag){

      },

      /**
       * Узнать запрещено или разрешено пользовательское взаимодействие
       */
      isDisabled: function(){

      },

      /**
       * Получить контейнер контрола
       */
      getContainer: function(){

      },

      /**
       * Получить имя контрола
       */
      getName: function(){

      },

      /**
       * Получить логического родителя контрола
       */
      getOwner: function(){

      },

      /**
       * Получить физического родителя контрола
       */
      getParent: function(){

      },

      /**
       * Запустить валидацию
       */
      validate: function(){

      },

      /**
       * Сменить всплывающую подсказку
       */
      setTooltip: function(){

      },

      /**
       * Показать контрол
       */
      show: function(){

      },

      /**
       * Скрыть контрол
       */
      hide: function(){

      },

      /**
       * Скрыть контрол если он отображается или показать если не отображается
       */
      toggle: function(){

      },

      /**
       * Установить фокус на контрол
       */
      setFocus: function(){

      },

      /**
       * Установить контекст
       * @param context
       */
      setContext: function(context){

      },

      /**
       * Получить контекст
       */
      getContext: function(){

      },

      /**
       * Получить дочерние контролы
       */
      getChildControls: function(){

      },

      /**
       * Получить дочерний контрол по имени
       */
      getChildControlByName: function(){

      },

      /**
       * Перевести фокус на следующий контрол
       */
      moveFocusNext: function(){

      }
   });

   return Control;

});
