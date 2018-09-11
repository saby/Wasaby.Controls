/**
 * Created by as.krasilnikov on 19.06.2018.
 */
define('SBIS3.CONTROLS/Action/Compatible/Open', ['Core/Abstract', 'Core/Deferred'], function(Abstract, Deferred) {
   'use strict';

   /**
    * @public
    * @author Красильников А.С.
    */
   var CompatibleOpen = Abstract.extend(/** @lends SBIS3.CONTROLS/Action/Compatible/Open.prototype */{
      constructor: function(config) {
         CompatibleOpen.superclass.constructor.apply(this, arguments);
         this._config = config;
      },
      execute: function(meta) {
         if (!this._layerDeferred) {
            var self = this;
            var actionModule = 'SBIS3.CONTROLS/Action/OpenDialog';

            this._layerDeferred =  new Deferred();
            requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
               Layer.load().addCallback(function() {
                  requirejs([actionModule], function(OpenDialog) {
                     self._action = new OpenDialog(self._config);
                     self._layerDeferred.callback();
                  });
               });
            });
         }
         this._layerDeferred.addCallback(this._execute.bind(this, meta));
      },
      _execute: function(meta) {
         this._action.execute(meta);
      }
   });
   return CompatibleOpen;
});
