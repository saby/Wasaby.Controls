/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ToolbarBase', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Класс обеспечивает поведение тулбара.
    * Тулбар представляет из себя набор кнопок, объединенных в группу по наличию схожего поведения.
    * Например, несколько кнопок, управляющих одним реестром.
    * @class SBIS3.CONTROLS.ToolbarBase
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @extends $ws.proto.Control
    * @author Крайнов Дмитрий Олегович
    */

   var ToolbarBase = Control.Control.extend( /** @lends SBIS3.CONTROLS.ToolbarBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ToolbarBase;

});