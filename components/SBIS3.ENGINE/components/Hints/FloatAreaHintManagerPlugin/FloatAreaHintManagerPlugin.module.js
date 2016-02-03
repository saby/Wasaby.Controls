define('js!SBIS3.Engine.FloatAreaHintManagerPlugin', [
   'js!SBIS3.CORE.FloatArea'
], function(
   FloatArea
) {
   'use strict';

   var showHint = function () {
      if (this._options.template !== undefined && this._options.template !== '') {
         $ws.single.EventBus.channel('HintManagerChannel').notify('showHint', this._options.template);
      }
   };

   var closeHint = function () {
      if (this._options.template !== undefined && this._options.template !== '') {
         $ws.single.EventBus.channel('HintManagerChannel').notify('onClose', this._options.template);
      }
   };

   var hideOverlay = function () {
      if ($ws.single.HintManager) {
         $ws.single.HintManager.animateToggle(true);
      }
   };

   $ws.proto.FloatArea.FloatAreaHintManagerPlugin = FloatArea.extendPlugin({
      $protected: {
         _showHint: null,
         _hideOverlay: null,
         _closeHint: null
      },
      $constructor: function () {
         var self = this;
         self._showHint = showHint.bind(self);
         self._closeHint = closeHint.bind(self);
         self._hideOverlay = hideOverlay.bind(self);
         self._publish('showHint', 'onClose');
         self._eventBusChannel.subscribe('onBeforeShow', self._hideOverlay);
         self._eventBusChannel.subscribe('onAfterShow', self._showHint);
         self._eventBusChannel.subscribe('onAfterClose', self._closeHint);
      },
      destroy: function () {
         var self = this;
         self._eventBusChannel.unsubscribe('onBeforeShow', self._hideOverlay);
         self._eventBusChannel.unsubscribe('onAfterShow', self._showHint);
         self._eventBusChannel.unsubscribe('onAfterClose', self._closeHint);
      }
   });
});