define('js!SBIS3.Engine.FieldLink', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Поле связи. Можно выбирать значение из списка, можно из автодополнения
    * @class SBIS3.Engine.FieldLink
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var FieldLink = Control.Control.extend(/** @lends SBIS3.Engine.FieldLink.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Выбирается одно или несколько значений
             */
            multiSelect: false
         }
      },

      $constructor: function() {

      }
   });

   return FieldLink;

});