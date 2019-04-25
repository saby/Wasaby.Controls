import Control = require('Core/Control');
import Classes = require('Controls/_toggle/Button/Classes');
import template = require('wml!Controls/Button/Button');
import buttons = require('Controls/buttons');
   /**
    * Button that switches between two states: on-state and off-state.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/_toggle/Button
    * @mixes Controls/_toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/IButton
    * @mixes Controls/Button/interface/IIconStyle
    * @mixes Controls/_toggle/Button/Styles
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    *
    * @demo Controls-demo/Buttons/Toggle/ToggleButtonPG
    */

   /**
    * @name Controls/_toggle/Button#icons
    * @cfg {Array} Pair of icons.
    * First icon displayed when toggle switch is off.
    * Second icon displayed when toggle switch is on.
    * @example
    * Toggle button with one icon.
    * <pre>
    *    <Controls.Toggle.Button icons="{{['icon-small icon-ArrangeList03']}}" viewMode="link"/>
    * </pre>
    * Toggle button with two icons.
    * <pre>
    *    <Controls.Toggle.Button icons="{{['icon-small icon-ArrangeList03', 'icon-small icon-ArrangeList04']}}" iconStyle="success" style="primary" viewMode="link"/>
    * </pre>
    */

   /**
    * @name Controls/_toggle/Button#captions
    * @cfg {Array} Pair of captions.
    * First caption displayed when toggle switch is off.
    * Second caption displayed when toggle switch is on.
    * @example
    * Toggle button with two captions.
    * <pre>
    *    <Controls.Toggle.Button readOnly="{{false}}" size="m" captions="{{['Change', 'Save']}}" style="info" viewMode="link"/>
    * </pre>
    * Toggle button with one caption.
    * <pre>
    *    <Controls.Toggle.Button readOnly="{{false}}" size="m" captions="{{['Save']}}" style="info" viewMode="link"/>
    * </pre>
    */

   /**
    * @name Controls/_toggle/Button#viewMode
    * @cfg {Enum} Toggle button view mode.
    * @variant link Decorated hyperlink.
    * @variant pushButton Decorated hyperlink transform to toolbar button.
    * @variant toolButton Toolbar button.
    * @default link
    * @example
    * Toggle button with 'link' viewMode.
    * <pre>
    *    <Controls.Toggle.Button captions="{{['Send document']}}" style="primary" viewMode="link" size="xl"/>
    * </pre>
    * Toggle button with 'toolButton' viewMode.
    * <pre>
    *    <Controls.Toggle.Button captions="{{['Send document']}}" style="danger" viewMode="toolButton"/>
    * </pre>
    * Toggle button with 'pushButton' viewMode.
    * <pre>
    *    <Controls.Toggle.Button captions="{{['Send document']}}" style="primary" viewMode="pushButton"/>
    * </pre>
    */
   var stickyButton = [
      'pushButton',
      'toolButton'
   ];

   var _private = {
      optionsGeneration: function(self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         // Называть _style нельзя, так как это состояние используется для темизации
         self._buttonStyle = currentButtonClass.style ? currentButtonClass.style : options.style;
         self._transparent = options.transparent;
         self._viewMode = currentButtonClass.style ? currentButtonClass.viewMode : options.viewMode;
         self._state = (stickyButton.indexOf(self._viewMode) !== -1 && options.value ? '_toggle_on' : '') + (options.readOnly ? '_readOnly' : '');
         self._caption = (options.captions ? (!options.value && options.captions[1] ? options.captions[1] : options.captions[0]) : '');
         self._icon = (options.icons ? (!options.value && options.icons[1] ? options.icons[1] : options.icons[0]) : '');
         self._iconStyle = buttons.iconsUtil.iconStyleTransformation(options.iconStyle);
      }
   };
   var ToggleButton = Control.extend({
      _template: template,
      _beforeMount: function(options) {
         _private.optionsGeneration(this, options);
      },
      _clickHandler: function() {
         if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
         }
      },
      _beforeUpdate: function(newOptions) {
         _private.optionsGeneration(this, newOptions);
      }
   });

   ToggleButton._theme = ['Controls/buttons', 'Controls/toggle'];

   ToggleButton.getDefaultOptions = function() {
      return {
         viewMode: 'link',
         style: 'secondary',
         size: 'l',
         iconStyle: 'secondary'
      };
   };

   ToggleButton._private = _private;
   export = ToggleButton;

