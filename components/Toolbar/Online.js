/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/Toolbar/Online', ['SBIS3.CONTROLS/Toolbar/ToolbarBase'], function(ToolbarBase) {

   'use strict';

   /**
    * Контрол, отображающий тулбар для макетов online.sbis.ru.
    * Например, некоторые кнопки могут дублироваться в выпадающем списке.
    * @class SBIS3.CONTROLS/Toolbar/Online
    * @extends SBIS3.CONTROLS/Toolbar/ToolbarBase
    * @author Крайнов Д.О.
    * @public
    */

   var ToolbarOnline = ToolbarBase.extend( /** @lends SBIS3.CONTROLS/Toolbar/Online.prototype */ {
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