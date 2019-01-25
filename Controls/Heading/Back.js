define('Controls/Heading/Back', [
   'Core/Control',
   'wml!Controls/Heading/Back/Back',
   'Types/entity',
   'Core/IoC',
   'css!theme?Controls/Heading/Back/Back'
], function(Control, template, entity, IoC) {
   /**
    * Specialized heading to go to the previous level.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/Heading/Back
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/Heading/Back/BackStyles
    * @control
    * @public
    * @author Михайловский Д.С.
    *
    *
    * @demo Controls-demo/Buttons/BackButton/BackButtonDemoPG
    */

   /**
    * @name Controls/Heading/Back#style
    * @cfg {String} Back heading display style.
    * @variant primary
    * @variant secondary
    * @default primary
    * @example
    * Back heading has default style.
    * <pre>
    *    <Controls.Heading.Back/>
    * </pre>
    * Back heading has 'secondary' style.
    * <pre>
    *    <Controls.Heading.Back style="secondary"/>
    * </pre>
    */

   /**
    * @name Controls/Heading/Back#size
    * @cfg {String} Back heading size.
    * @variant s Small heading size.
    * @variant m Medium heading size.
    * @variant l Large heading size.
    * @default m
    * @example
    * Back heading has default size.
    * <pre>
    *    <Controls.Heading.Back/>
    * </pre>
    * Back heading has 'l' size.
    * <pre>
    *    <Controls.Heading.Back size="l"/>
    * </pre>
    */

   var _private = {
      convertOldStyleToNew: function(options, self) {
         if (options.style !== self._options.style) {
            if (options.style === 'default') {
               self._style = 'primary';
               IoC.resolve('ILogger').warn('Heading.Back', 'Используются устаревшие стили. Используйте style primary вместо style default');
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

   BackButton.getOptionTypes = function getOptionTypes() {
      return {
         caption: entity.descriptor(String).required(),
         style: entity.descriptor(String).oneOf([
            'primary',
            'secondary',
            'default'
         ]),
         size: entity.descriptor(String).oneOf([
            's',
            'm',
            'l'
         ])
      };
   };

   BackButton.getDefaultOptions = function() {
      return {
         style: 'primary',
         size: 'm'
      };
   };

   return BackButton;
});
