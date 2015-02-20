/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 16:47
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.StackPanel", ["js!SBIS3.CORE.GridAbstract"], function( GridAbstract ) {

   "use strict";

   /**
    * @class $ws.proto.StackPanel
    * @extends $ws.proto.GridAbstract
    */
   $ws.proto.StackPanel = GridAbstract.extend({
      $protected: {
         _options: {
            isRelativeTemplate: true
         }
      },

      _onResizeHandler: function (event, initiator){
         if (this._skipOnResizeHandler())
            return;

         if (this !== initiator)
            this._resizeChilds();
      }
   });

   return $ws.proto.StackPanel;

});