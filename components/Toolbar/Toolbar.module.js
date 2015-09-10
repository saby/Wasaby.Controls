/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Toolbar', ['js!SBIS3.CONTROLS.ToolbarBase'], function(ToolbarBase) {

   'use strict';

   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS.Toolbar
    * @extends SBIS3.CONTROLS.ToolbarBase
    * @author Крайнов Дмитрий Олегович
    */

   var Toolbar = ToolbarBase.extend( /** @lends SBIS3.CONTROLS.Toolbar.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return Toolbar;

});