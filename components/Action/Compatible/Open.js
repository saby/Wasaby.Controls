/**
 * Created by as.krasilnikov on 19.06.2018.
 */
define('SBIS3.CONTROLS/Action/Compatible/Open', ['Core/Abstract', 'Core/Deferred', 'Controls/Popup/Compatible/Layer'], function(Abstract, Deferred, Layer) {
   'use strict';

   /**
    * @public
    * @author Красильников А.С.
    */
   var CompatibleOpen = Abstract.extend(/** @lends SBIS3.CONTROLS/Action/Compatible/Open.prototype */{
      constructor: function(config) {
         var self = this;
         var actionModule = 'SBIS3.CONTROLS/Action/OpenDialog';

         this._layerDeferred =  new Deferred();
         Layer.load().addCallback(function() {
            requirejs([actionModule], function(OpenDialog) {
               self._action = new OpenDialog(config);
               self._layerDeferred.callback();
            });
         });
      },
      execute: function(meta) {
         this._layerDeferred.addCallback(this._execute.bind(this, meta));
      },
      _execute: function(meta) {
         this._action.execute(meta);
      }
   });
   return CompatibleOpen;
});
