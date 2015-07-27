/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroup', ['js!SBIS3.CONTROLS.ToolbarBase'], function(ToolbarBase) {

   'use strict';

   /**
    * Контрол, отображающий несколько кнопок рядом.
    * @class SBIS3.CONTROLS.ButtonGroup
    * @extends SBIS3.CONTROLS.ToolbarBase
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroup = ToolbarBase.extend( /** @lends SBIS3.CONTROLS.ButtonGroup.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ButtonGroup;

});
