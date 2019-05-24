import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/CloseButton/CloseButton');
import Env = require('Env/Env');
import 'css!theme?Controls/popupTemplate';
   /**
    * Specialized type of button for closing windows.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    *
    * @class Controls/_popupTemplate/CloseButton
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @demo Controls-demo/Buttons/Close/CloseDemo
    * @mixes Controls/interface/IClick
    *
    */

   /**
    * @name Controls/_popupTemplate/CloseButton#viewMode
    * @cfg {String} Close button display view mode.
    * @variant toolButton  Close display style as button toolButton.
    * @variant link Close display style as button link.
    * @default toolButton
    * @example
    * Close button display as link.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="link" size="l"/>
    * </pre>
    * Close button display as toolButton.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="toolButton" size="l"/>
    * </pre>
    */

   /**
    * @name Controls/_popupTemplate/CloseButton#transparent
    * @cfg {String} Determines whether close button background color.
    * @variant true Close button has transparent background.
    * @variant false Close button has their viewmode's background.
    * @default true
    * @example
    * Close button has transparent background.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="toolButton" transparent="{{true}}" size="l"/>
    * </pre>
    * Close button has toolButton's background.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="toolButton" transparent="{{false}}" size="l"/>
    * </pre>
    */

   /**
    * @name Controls/_popupTemplate/CloseButton#size
    * @cfg {String} Close button size. The value is given by common size notations.
    * @variant l Medium button size.
    * @variant m Large button size.
    * @default m
    * @remark
    * Close button has this size only in toolButton view mode.
    * @example
    * Close button has l size.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="toolButton" transparent="{{true}}" size="l"/>
    * </pre>
    * Close button has m size.
    * <pre>
    *    <Controls.buttons:Button.Close viewMode="toolButton" transparent="{{false}}" size="m"/>
    * </pre>
    */

   var _private = {

      // TODO: удалить по подзадаче, когда уберем поддержку старых опций https://online.sbis.ru/opendoc.html?guid=375f4d56-c47c-4ee2-abbc-e38a45fd474a
      compatibleViewMode: function(options, self) {
         if (options.transparent !== undefined) {
            self._transparent = options.transparent;
         }
         if (options.viewMode !== undefined) {
            self._viewMode = options.viewMode;
         } else {
            //TODO: https://online.sbis.ru/opendoc.html?guid=1f771374-0295-4add-bbd4-12d478d14163
            if(options.style==='popup') {
               self._viewMode = options.style;
            } else {
               self._viewMode = (options.style === 'light' ? 'link' : 'toolButton');
            }
            if (options.style !== undefined) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Option "style" is deprecated and removed in 19.200. Use option "viewMode".');
               if (options.style === 'primary') {
                  Env.IoC.resolve('ILogger').warn(this._moduleName, 'Option "style" is deprecated and not regulated transparency. Use option "transparent".');
                  self._transparent = false;
               }
            }
         }
      }
   };

   var CloseButton = Control.extend({
      _template: template,
      _viewMode: null,
      _transparent: true,

      _beforeMount: function(options) {
         _private.compatibleViewMode(options, this);
      },
      _beforeUpdate: function(newOptions) {
         _private.compatibleViewMode(newOptions, this);
      }
   });

   CloseButton._theme = ['Controls/popupTemplate'];

   CloseButton.getDefaultOptions = function() {
      return {
         size: 'l'
      };
   };

   export = CloseButton;

