/*global define, require, $ws*/
define('js!SBIS3.CONTROLS.Action.OpenDialog', [
   'js!SBIS3.CONTROLS.Action.Action',
   'js!SBIS3.CONTROLS.Action.DialogMixin',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Utils'
], function(Action, DialogMixin) {
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.Action.OpenDialog
    * @mixes SBIS3.CONTROLS.Action.DialogMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var OpenEditDialog = Action.extend([DialogMixin],/** @lends SBIS3.CONTROLS.Action.OpenDialog.prototype */{

   });
   return OpenEditDialog;
});