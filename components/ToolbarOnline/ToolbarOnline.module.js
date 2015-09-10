/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ToolbarOnline', ['js!SBIS3.CONTROLS.ToolbarBase'], function(ToolbarBase) {

   'use strict';

   /**
    * Контрол, отображающий тулбар для макетов online.sbis.ru.
    * Например, некоторые кнопки могут дублироваться в выпадающем списке.
    * @class SBIS3.Engine.ToolbarOnline
    * @extends SBIS3.CONTROLS.ToolbarBase
    * @author Крайнов Дмитрий Олегович
    */

   var ToolbarOnline = ToolbarBase.extend( /** @lends SBIS3.Engine.ToolbarOnline.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {Array} набор кнопок, которые дублируются в выпадающем списке
             */
            dropDownButtons: null
         }
      },

      $constructor: function() {

      }

   });

   return ToolbarOnline;

});