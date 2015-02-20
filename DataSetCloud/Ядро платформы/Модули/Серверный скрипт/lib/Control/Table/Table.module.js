/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 16:49
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.Table", ["js!SBIS3.CORE.GridAbstract"], function( GridAbstract ) {

   "use strict";

   /**
    * @class $ws.proto.Table
    * @extends $ws.proto.GridAbstract
    */
   $ws.proto.Table = GridAbstract.extend({
      _updateResizer: function() {},
      _onResizeHandler: function (event, initiator){
         if (this._skipOnResizeHandler())
            return;

         if (this !== initiator)
            this._resizeChilds();
      }
   });

   return $ws.proto.Table;

});