
define('SBIS3.CONTROLS/Button/ListAddButton', [
   'js!WSControls/Buttons/Button',
   'css!SBIS3.CONTROLS/Button/ListAddButton/ListAddButton'
], function(WSButton) {

   var ListAddButton = WSButton.extend([], /** @lends SBIS3.CONTROLS/Button/ToggleButton.prototype */ {
      $protected: {
         _options: {
         }
      },

      _modifyOptions: function(cfg){
         cfg.icon += 'icon-16 icon-Add';
         cfg.className += ' controls-ListAddButton ' + (cfg.enabled ? 'controls-ListAddButton__enable' : 'controls-ListAddButton__disable');
         cfg._textClass += ' controls-ListAddButtonText';
         return ListAddButton.superclass._modifyOptions.call(this, cfg);
      }
   });

   return ListAddButton;

});