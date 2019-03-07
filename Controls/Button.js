define('Controls/Button', [
   'Controls/buttons',
   'Env/Env'
], function(buttonsLib, Env) {
   'use strict';

   /**
    * Graphical control element that provides the user a simple way to trigger an event.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/buttons:Button
    * @extends Core/Control
    * @mixes Controls/Button/interface/IHref
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @mixes Controls/Button/interface/IIcon
    * @mixes Controls/Button/interface/IIconStyle
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/IButton
    * @mixes Controls/Button/ButtonStyles
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Button
    * @demo Controls-demo/Buttons/ButtonDemoPG
    */

   Env.IoC.resolve('ILogger').error(
      'Controls/Button',
      'This control is deprecated. Use \'Controls/buttons:Button\' instead'
   );

   return buttonsLib.Button;
});
