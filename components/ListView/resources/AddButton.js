
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
         cfg.className += 'controls-AddButton-wrapper controls-AddButton ' + (cfg.enabled ? 'controls-AddButton_state-enable' : 'controls-AddButton_state-disable');
         cfg._textClass += ' controls-AddButtonText';
         return AddButton.superclass._modifyOptions.call(this, cfg);
      },

      _toggleState: function() {
         var  container = this._container;
         container[0].className = container[0].className.replace(/(^|\s)controls-AddButton_state-\S+/g, '');

         container.addClass('controls-AddButton_state-' + (this._options.enabled ? 'enable' : 'disable'));
         AddButton.superclass._toggleState.apply(this, arguments);
      }
   });

   return AddButton;

});