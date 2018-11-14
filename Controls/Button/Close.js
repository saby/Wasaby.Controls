define('Controls/Button/Close', [
   'Core/Control',
   'wml!Controls/Button/Close',
   'css!Controls/Button/Close'
], function(Control, template) {

   /**
    * Specialized type of button for closing windows.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    *
    * @class Controls/Button/Close
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @demo Controls-demo/Buttons/Close/CloseDemo
    * @mixes Controls/Button/interface/IClick
    *
    */

   /**
    * @name Controls/Button/Close#viewMode
    * @cfg {String} Close button display view mode.
    * @variant default Default display style.
    * @variant light Light display style.
    * @default default
    * @example
    * Close button display as light.
    * <pre>
    *    <Controls.Button.Close viewMode="link" size="l"/>
    * </pre>
    * Close button display as default.
    * <pre>
    *    <Controls.Button.Close viewMode="toolButton" size="l"/>
    * </pre>
    */

   /**
    * @name Controls/Button/Close#transparent
    * @cfg {String} Determines whether close button background color.
    * @variant true Close button has transparent background.
    * @variant false Close button has their viewmode's background.
    * @default true
    * @example
    * Close button has transparent background.
    * <pre>
    *    <Controls.Button.Close viewMode="toolButton" transparent="{{true}}" size="l"/>
    * </pre>
    * Close button has toolButton's background.
    * <pre>
    *    <Controls.Button.Close viewMode="toolButton" transparent="{{false}}" size="l"/>
    * </pre>
    */

   /**
    * @name Controls/Button/Close#size
    * @cfg {String} Close button size. The value is given by common size notations.
    * @variant l Medium button size.
    * @variant m Large button size.
    * @default m
    * @remark
    * Close button has this size only in default view mode.
    * @example
    * Close button has l size.
    * <pre>
    *    <Controls.Button.Close viewMode="toolButton" transparent="{{true}}" size="l"/>
    * </pre>
    * Close button has m size.
    * <pre>
    *    <Controls.Button.Close viewMode="toolButton" transparent="{{false}}" size="m"/>
    * </pre>
    */

   var CloseButton = Control.extend({
      _template: template
   });

   CloseButton.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'l',
         transparent: true
      };
   };

   return CloseButton;
});
