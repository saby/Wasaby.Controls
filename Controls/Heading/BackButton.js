define('Controls/Heading/BackButton', [
   'Core/Control',
   'wml!Controls/Heading/BackButton/Back',
   'WS.Data/Type/descriptor',
   'Core/IoC',
   'css!Controls/Heading/BackButton/Back'
], function(Control, template, types, IoC) {

   /**
    * Specialized heading to go to the previous level. Support different display styles and sizes.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/Heading/BackButton
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Button
    *
    *
    * @demo Controls-demo/Buttons/BackButton/BackButtonDemoPG
    */

   /**
    * @name Controls/Heading/Back#style
    * @cfg {String} Back button display style.
    * @variant primaryN Primary display style.
    * @variant secondary Secondary display style.
    * @default primaryN
    * @example
    * Back button has default style.
    * <pre>
    *    <Controls.Heading.BackButton/>
    * </pre>
    * Back button has 'secondary' style.
    * <pre>
    *    <Controls.Heading.BackButton style="secondary"/>
    * </pre>
    */

   /**
    * @name Controls/Heading/Back#size
    * @cfg {String} Back button size.
    * @variant s Small button size.
    * @variant m Medium button size. It is the default value.
    * @variant l Large button size.
    * @default m
    * @example
    * Medium back button size.
    * <pre>
    *    <Controls.Header.BackButton/>
    * </pre>
    * Large back button size.
    * <pre>
    *    <Controls.Header.BackButton size="l"/>
    * </pre>
    */

   var _private = {
      convertOldStyleToNew: function(options, self) {
         if (options.style !== self._options.style) {
            if (options.style === 'default') {
               self._style = 'primaryN';
               IoC.resolve('ILogger').error('Heading.BackButton', 'Используются устаревшие стили. Используйте style primary вместо style default');
            } else if (options.style === 'primary') {
               self._style = 'secondary';
               IoC.resolve('ILogger').error('Heading.BackButton', 'Используются устаревшие стили. Используйте style secondary вместо style primary');
            } else {
               self._style = options.style;
            }
         }
      }
   };

   var BackButton = Control.extend({
      _template: template,
      _beforeMount: function(options) {
         _private.convertOldStyleToNew(options, this);
      },
      _beforeUpdate: function(newOptions) {
         _private.convertOldStyleToNew(newOptions, this);
      }
   });

   BackButton.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String).required(),
         style: types(String).oneOf([
            'primary',
            'primaryN',
            'secondary',
            'default'
         ]),
         size: types(String).oneOf([
            's',
            'm',
            'l'
         ])
      };
   };

   BackButton.getDefaultOptions = function() {
      return {
         style: 'primaryN',
         size: 'm'
      };
   };

   return BackButton;

});
