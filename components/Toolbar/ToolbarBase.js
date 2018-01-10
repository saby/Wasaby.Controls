/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/Toolbar/ToolbarBase', ['Lib/Control/Control'], function(Control) {

   'use strict';

   /**
    * Класс обеспечивает поведение тулбара.
    * Тулбар представляет из себя набор кнопок, объединенных в группу по наличию схожего поведения.
    * Например, несколько кнопок, управляющих одним реестром.
    * @class SBIS3.CONTROLS/Toolbar/ToolbarBase
    * @extends Lib/Control/Control
    * @author Крайнов Д.О.
    * @public
    */

   var ToolbarBase = Control.Control.extend( /** @lends SBIS3.CONTROLS/Toolbar/ToolbarBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ToolbarBase;

});