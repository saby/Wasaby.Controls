define('Controls-demo/CompatibleDemo/WasabyEnv/WS3/WS3WithHandlers',
   [
      'Core/Control',
      'wml!Controls-demo/CompatibleDemo/WasabyEnv/WS3/WS3WithHandlers',
      'Lib/Control/LayerCompatible/LayerCompatible',
      'css!Controls-demo/CompatibleDemo/CompatibleDemo'
   ],
   function(Control, template, CompatibleLayer) {
      'use strict';

      var WS3WithHandlers = Control.extend({
         _template: template,
         _compatibleReady: false,
         _text: null,
         _textNew: null,

         _beforeMount: function() {
            this._text = 'Wait...';
            this._textNew = this._text;
         },

         _afterMount: function() {
            var self = this;
            CompatibleLayer.load()
               .addCallback(function() {
                  self._compatibleReady = true;
                  self._text = 'Init success!';
                  self._setText(null, self._text);
                  self._forceUpdate();
               });
         },
         _setTextNew: function(e, value) {
            this._text = value;
         },
         _setText: function(e, value) {
            this._textNew = value;
         },

         _setTextOld: function(e, value) {
            this.getTopParent()._logicParent._setText(e, value);
         },
      });
      return WS3WithHandlers;
   }
);
