define('js!SBIS3.Engine.WindowHintManagerPlugin', [
   'js!SBIS3.CORE.Window'
], function(
   Window
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

   $ws.proto.Window.WindowHintManagerPlugin = Window.extendPlugin({
      $protected: {
         _showHint: null,
         _closeHint: null
      },
      $constructor: function () {
         var self = this;
         self._showHint = showHint.bind(self);
         self._closeHint = closeHint.bind(self);
         self._publish('showHint', 'onClose');
         self._eventBusChannel.subscribe('onAfterShow', self._showHint);
      },
      _hideWindow: function () {
         var self = this;
         self._closeHint();
      },
      destroy: function () {
         var self = this;
         self._eventBusChannel.unsubscribe('onAfterShow', self._showHint);
      }
   });
});