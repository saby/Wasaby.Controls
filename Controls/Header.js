define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, IoC, template, types) {
   'use strict';

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
            var currentIconClass = classesOfIcon[options.iconStyle];
         }else {
            IoC.resolve('ILogger').error("Header-Separator", "Для иконки задан несуществующий стиль");
            currentIconClass = classesOfIcon.ExpandLight;
         }
         self._icon = currentIconClass[options.iconValue]+ ' ' + currentIconClass.size;
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
            'h6',
            'h7'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'default',
            's'
         ])
      }
   };

   return Header;
});
