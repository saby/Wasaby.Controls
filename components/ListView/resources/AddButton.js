
define('SBIS3.CONTROLS/ListView/resources/AddButton', [
   'js!WSControls/Buttons/Button',
   'css!Controls/List/AddButton/AddButton',
   'css!SBIS3.CONTROLS/ListView/resources/AddButton/AddButton'
], function(WSButton) {

   var AddButton = WSButton.extend([], /** @lends SBIS3.CONTROLS/Button/ToggleButton.prototype */ {
      $protected: {
         _options: {
         }
      },

      _modifyOptions: function(cfg){
         cfg.icon = 'icon-16 icon-Add';
         cfg.className += ' controls-AddButton ' + (cfg.enabled ? 'controls-AddButton__enable' : 'controls-AddButton__disable');
         cfg._textClass += ' controls-AddButtonText';
         return AddButton.superclass._modifyOptions.call(this, cfg);
      }
   });

   return AddButton;

});