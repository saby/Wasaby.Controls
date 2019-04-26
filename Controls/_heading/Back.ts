import Control = require('Core/Control');
import template = require('wml!Controls/_heading/Back/Back');
import entity = require('Types/entity');
import Env = require('Env/Env');
import 'css!theme?Controls/heading';
   /**
    * Specialized heading to go to the previous level.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/_heading/Back
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/interface/IClick
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/_heading/Back/BackStyles
    * @control
    * @public
    * @author Михайловский Д.С.
    *
    *
    * @demo Controls-demo/Buttons/BackButton/BackButtonDemoPG
    */

   /**
    * @name Controls/_heading/Back#style
    * @cfg {String} Back heading display style.
    * @variant primary
    * @variant secondary
    * @default primary
    * @example
    * Back heading has default style.
    * <pre>
    *    <Controls._heading.Back/>
    * </pre>
    * Back heading has 'secondary' style.
    * <pre>
    *    <Controls._heading.Back style="secondary"/>
    * </pre>
    */

   /**
    * @name Controls/_heading/Back#size
    * @cfg {String} Back heading size.
    * @variant s Small heading size.
    * @variant m Medium heading size.
    * @variant l Large heading size.
    * @default m
    * @example
    * Back heading has default size.
    * <pre>
    *    <Controls._heading.Back/>
    * </pre>
    * Back heading has 'l' size.
    * <pre>
    *    <Controls._heading.Back size="l"/>
    * </pre>
    */

   var _private = {
      convertOldStyleToNew: function(options, self) {
         if (options.style !== self._options.style) {
            if (options.style === 'default') {
               self._style = 'primary';
               Env.IoC.resolve('ILogger').warn('Heading.Back', 'Используются устаревшие стили. Используйте style primary вместо style default');
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

   export = BackButton;

