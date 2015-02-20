/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:12
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FiltersDialog", ["js!SBIS3.CORE.Dialog"], function( Dialog ) {

   "use strict";

   /**
    * @class $ws.proto.FiltersDialog
    * @extends $ws.proto.Dialog
    * @control
    */
   $ws.proto.FiltersDialog = Dialog.extend(/** @lends $ws.proto.FiltersDialog.prototype */{
      $constructor : function() {
         var self = this;
         this._publish('onBeforeApplyFilter');

         this.getOpener().subscribe('onBeforeApplyFilter', function(event, filter){
            var newFilter = $ws.core.merge(filter || {}, event.getResult() || {});
            event.setResult(self._notify("onBeforeApplyFilter", newFilter));
         });
      }
   });

   return $ws.proto.FiltersDialog;

});