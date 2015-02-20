define('js!SBIS3.CORE.Switcher/design/DesignPlugin',
   [
      "js!SBIS3.CORE.Switcher"
   ],
   function(Switcher){
      $ws.proto.Switcher.DesignPlugin = Switcher.extendPlugin({
         setColorStyle: function(colorStyle) {
            this._options.colorStyle = colorStyle;
            var isGray = colorStyle === 'gray';
            this._textOffContainer.toggleClass('ws-switcher-text-gray', isGray);
         }
      });
   });