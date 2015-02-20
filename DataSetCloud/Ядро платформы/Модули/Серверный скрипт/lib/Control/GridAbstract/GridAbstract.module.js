/**
 * Модуль "Компонент GridAbstract".
 *
 * @description
 */
define("js!SBIS3.CORE.GridAbstract", ["js!SBIS3.CORE.AreaAbstract", "css!SBIS3.CORE.GridAbstract"], function( AreaAbstract ) {

   "use strict";

   /**
    * @class $ws.proto.GridAbstract
    * @extends $ws.proto.AreaAbstract
    */
   $ws.proto.GridAbstract = AreaAbstract.extend(/** @lends $ws.proto.GridAbstract.prototype */{
      $protected: {
         _options: {
            owner: undefined
         },
         _isReady: false
      },
      $constructor: function() {
         if(this._context && this._craftedContext)
            this._context.destroy();
         this._craftedContext = false;
         this._context = this._context.getPrevious();
      },
      _templateInnerCallback: function() {
         this._isReady = true;
         this._notifyOnSizeChanged(this, this, true);
         this._notify('onReady');
         this._showControls();
      },

      _skipOnResizeHandler: function() {
         return (!this._isReady || (!this._haveStretch() && !this._needForceOnResizeHandler()));
      },

      registerDefaultButton: function(){
         var parent = this.getParent();
         if(parent && parent.registerDefaultButton)
            parent.registerDefaultButton.apply(parent, arguments);
      }
   });

   return $ws.proto.GridAbstract;

});