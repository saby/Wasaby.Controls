define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Control showing the headers
    * @class Controls/Header
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} caption size
    * @variant caption has small size
    * @variant caption has middle size
    * @variant caption has large size
    */

   /**
    * @name Controls/Header#caption
    * @cfg {String} caption text
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} caption display style
    * @variant default caption will be default
    * @variant primary caption will be accented
    */

   /**
    * @name Controls/Header#clickable
    * @cfg {Boolean} caption can be clicked
    */

   /**
    * @name Controls/Header#counterValue
    * @cfg {Number} value of counter. If this option is specified, the title will be displayed
    */

   /**
    * @name Controls/Header#counterLocation
    * @cfg {String} counter location relative to header
    * @variant after counter will be displayed after the caption
    * @variant before counter will be displayed before the caption
    */

   /**
    * @name Controls/Header#counterStyle
    * @cfg {String} counter display style
    * @variant primary counter will be accented
    * @variant default counter will be default
    * @variant disabled counter will be non accented
    */

   /**
    * @name Controls/Header#counterSize
    * @cfg {String} size of counter
    * @variant small counter has small size
    * @variant default counter has middle size
    */

   /**
    * @name Controls/Header#countClickable
    * @cfg {Boolean} the ability to send a single event when counter was clicked. Event name is countClick
    */

   /**
    * @name Controls/Header#iconClickable
    * @cfg {Boolean} the ability to send a single event when icon was clicked. Event name is iconClick
    */

   /**
    * @name Controls/Header#iconLocation
    * @cfg {String} icon location relative to header
    * @variant after icon will be displayed after the caption
    * @variant before icon will be displayed before the caption
    */

   /**
    * @name Controls/Header#iconStyle
    * @cfg {String} icon display style
    * @variant Accent icon will be default
    * @variant Additional icon will be non accented
    * @variant Main icon will be accented
    */

   /**
    * @name Controls/Header#iconType
    * @cfg {String} icon type
    * @variant MarkExpandBold down arrow with double width
    * @variant ExpandLight default dawn arrow
    * @variant AccordionArrowDown double down arrow
    */

   /**
    * @name Controls/Header#iconValue
    * @cfg {Boolean} icon value. if iconValue == true, that icon will be displaying, else icon will not be displaying
    */

   /**
    * @name Controls/Header#separatorIcon
    * @cfg {Boolean} icon separator will be displayed or not
    */

   /**
    * @name Controls/Header#separatorIconStyle
    * @cfg {String} icon display style. In the online theme has only one display style
    * @variant primary icon-separator will be accented
    * @variant default icon-separator will be default
    */

   /**
    * @name Controls/Header#commonClick
    * @cfg {Boolean} a common hover for all header elements
    */


   var classesOfIcon = {
      MarkExpandBold: {
         true: "icon-MarkExpandBold",
         false: "icon-MarkCollapseBold",
         size: "icon-16"
      },

      ExpandLight: {
         true: "icon-ExpandLight",
         false: "icon-CollapseLight",
         size: "icon-16"
      },

      AccordionArrowDown: {
         true: "icon-AccordionArrowDown",
         false: "icon-AccordionArrowUp ",
         size: "icon-24"
      }
   };

   var _private = {
      cssStyleGeneration: function (self, options) {
         if (classesOfIcon.hasOwnProperty(options.iconType)) {
            var currentIconClass = classesOfIcon[options.iconType];
            self._icon = currentIconClass[options.iconValue]+ ' ' + currentIconClass.size;
         }
      }
   };

   var Header = Control.extend({
      _template: template,

      constructor: function (options) {
         Header.superclass.constructor.apply(this, arguments);
         _private.cssStyleGeneration(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.cssStyleGeneration(this, newOptions);
      },

      countClickHandler: function (e) {
         if(this._options.countClickable){
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
         style: types(String).oneOf([
            'default_big',
            'primary_big',
            'default',
            'primary'
         ]),
         clickable: types(Boolean),
         counterValue: types(Number),
         counterLocation: types(String).oneOf([
            'after',
            'before'
         ]),
         counterStyle: types(String).oneOf([
            'primary',
            'default',
            'disabled'
         ]),
         counterSize: types(String).oneOf([
            'default',
            'small'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'm',
            's'
         ]),
         iconClickable: types(Boolean),
         iconLocation: types(String).oneOf([
            'after',
            'before'
         ]),
         iconStyle: types(String).oneOf([
            'Accent',
            'Additional',
            'Main'
         ]),
         iconType: types(String).oneOf([
            'MarkExpandBold',
            'ExpandLight',
            'AccordionArrowDown'
         ]),
         iconValue: types(Boolean),
         separatorIcon: types(Boolean),
         separatorIconStyle: types(String).oneOf([
            'primary',
            'default'
         ]),
         commonClick: types(Boolean)
      }
   };

   return Header;
});
