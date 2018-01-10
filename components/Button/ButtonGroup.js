/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/Button/ButtonGroup', ['SBIS3.CONTROLS/Toolbar/ToolbarBase', 'css!SBIS3.CONTROLS/Button/ButtonGroup/ButtonGroup'], function(ToolbarBase) {

   'use strict';

   /**
    * Контрол, отображающий несколько кнопок рядом.
    * @class SBIS3.CONTROLS/Button/ButtonGroup
    * @extends SBIS3.CONTROLS/Toolbar/ToolbarBase
    * @author Крайнов Д.О.
    */

   var ButtonGroup = ToolbarBase.extend( /** @lends SBIS3.CONTROLS/Button/ButtonGroup.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ButtonGroup;

});
