define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Control showing the headers.
    * @class Controls/Header
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} caption size
    * @variant s Caption has small size.
    * @variant m Caption has middle size.
    * @variant l Caption has large size.
    */

   /**
    * @name Controls/Header#caption
    * @cfg {String} caption Caption text.
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} Caption display style.
    * @variant default Caption will be default.
    * @variant primary Caption will be accented.
    */

   /**
    * @name Controls/Header#type
    * @cfg {String} Caption display style.
    * @variant simpleHeader Caption isn't clickable and has only one size.
    * @variant commonHeader Caption is clickable and has three size.
    */

   /**
    * @name Controls/Header#clickable
    * @cfg {Boolean} Whether caption and counter can be clicked.
    */

   /**
    * @name Controls/Header#counterValue
    * @cfg {Number} Value of counter. If this option is specified, the title will be displayed.
    */

   /**
    * @name Controls/Header#counterLocation
    * @cfg {String} Counter location relative to header.
    * @variant right Counter will be displayed after the caption.
    * @variant left Counter will be displayed before the caption.
    */

   /**
    * @name Controls/Header#counterStyle
    * @cfg {String} Counter display style.
    * @variant primary Counter will be accented.
    * @variant default Counter will be default.
    * @variant disabled Counter will be non accented.
    */

   /**
    * @name Controls/Header#counterSize
    * @cfg {String} Size of counter.
    * @variant s Counter has small size.
    * @variant m Counter has middle size.
    * @variant l Counter has large size.
    */

   /**
    * @name Controls/Header#countClickable
    * @cfg {Boolean} The ability to send a single event when counter was clicked. Event name is countClick.
    */

   /**
    * @name Controls/Header#iconClickable
    * @cfg {Boolean} The ability to send a single event when icon was clicked. Event name is iconClick.
    */

   /**
    * @name Controls/Header#iconLocation
    * @cfg {String} Icon location relative to header.
    * @variant right Icon will be displayed after the caption.
    * @variant left Icon will be displayed before the caption.
    */

   /**
    * @name Controls/Header#iconSize
    * @cfg {String} Icon location relative to header.
    * @variant m Icon has middle size.
    * @variant l Icon has large size.
    */

   /**
    * @name Controls/Header#iconStyle
    * @cfg {String} Icon display style.
    * @variant Accent Icon will be default.
    * @variant Additional Icon will be non accented.
    * @variant Main Icon will be accented.
    */

   /**
    * @name Controls/Header#openIcon
    * @cfg {String} This icon display when isIconOpen is true.
    */

   /**
    * @name Controls/Header#closeIcon
    * @cfg {String} This icon display when isIconOpen is false. This is the default value.
    */

   /**
    * @name Controls/Header#isIconOpen
    * @cfg {Boolean} If isIconOpen is true, that opening icon will be displaying, else closing icon will be displaying.
    */

   /**
    * @name Controls/Header#separatorIcon
    * @cfg {Boolean} Icon separator will be displayed or not.
    */

   /**
    * @name Controls/Header#separatorIconStyle
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Icon-separator will be accented.
    * @variant default Icon-separator will be default.
    */

   /**
    * @name Controls/Header#commonClick
    * @cfg {Boolean} A common hover for all header elements.
    */

   var _private = {
      updateHeaderStyle: function (self, options) {
         this.captionStyleGeneration(self, options);
         this.iconStyleGeneration(self, options);
      },

      captionStyleGeneration: function (self, options) {
         self._style = 'controls-Header__caption_type-' + options.type + '_style-' + options.style;
         self._size = 'controls-Header__caption_type-' + options.type + '_size-' + options.size;
         if(options.type === 'commonHeader') {
            self._style += (options.clickable ? '_hovered' : '');
         }
      },
      iconStyleGeneration: function (self, options) {
         if (options.isIconOpen) {
            self._icon = options.openIcon;
         }else {
            self._icon = options.closeIcon;
         }
      }
   };

   var Header = Control.extend({
      _template: template,

      constructor: function (options) {
         Header.superclass.constructor.apply(this, arguments);
         _private.updateHeaderStyle(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.updateHeaderStyle(this, newOptions);
      },

      countClickHandler: function (e) {
         if(this._options.countClickable && this._options.clickable){
            e.stopPropagation();
            this._notify('countClick');
         }
      },

      iconClickHandler: function (e) {
         if(this._options.iconClickable){
            e.stopPropagation();
            this._notify('iconClick');
         }
      }
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String),
         openIcon: types(String),
         closeIcon: types(String),
         style: types(String).oneOf([
            'default',
            'primary'
         ]),
         type: types(String).oneOf([
            'commonHeader',
            'simpleHeader'
         ]),
         clickable: types(Boolean),
         counterValue: types(Number),
         counterLocation: types(String).oneOf([
            'right',
            'left'
         ]),
         counterStyle: types(String).oneOf([
            'primary',
            'default',
            'disabled'
         ]),
         counterSize: types(String).oneOf([
            'm',
            's',
            'l'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'm',
            's'
         ]),
         iconClickable: types(Boolean),
         iconLocation: types(String).oneOf([
            'right',
            'left'
         ]),
         iconStyle: types(String).oneOf([
            'Accent',
            'Additional',
            'Main'
         ]),
         iconSize: types(String).oneOf([
            'm',
            'l'
         ]),
         isIconOpen: types(Boolean),
         separatorIcon: types(Boolean),
         separatorIconStyle: types(String).oneOf([
            'primary',
            'default'
         ]),
         commonClick: types(Boolean)
      }
   };

   Header.getDefaultOptions = function() {
      return {
         style: 'default',
         type: 'simpleHeader',
         isIconOpen: false
      };
   };

   Header._private = _private;

   return Header;
});
