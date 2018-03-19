define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, IoC, template, types) {
   'use strict';

   var classesOfIcons = {
      ExpandLightAccent: {
         size: 16,
         icon: 'ExpandLight',
         style: 'Accent'
      },

      ExpandLightAdditional: {
         size: 16,
         icon: 'ExpandLight',
         style: 'Additional'
      },

      ExpandLightMain: {
         size: 16,
         icon: 'ExpandLight',
         style: 'Main'
      },

      CollapseLightAccent: {
         size: 16,
         icon: 'CollapseLight',
         style: 'Accent'
      },

      CollapseLightMain: {
         size: 16,
         icon: 'CollapseLight',
         style: 'Main'
      },

      CollapseLightAdditional: {
         size: 16,
         icon: 'CollapseLight',
         style: 'Additional'
      },

      MarkExpandBoldAccent: {
         size: 16,
         icon: 'MarkExpandBold',
         style: 'Accent'
      },

      MarkExpandBoldAdditional: {
         size: 16,
         icon: 'MarkExpandBold',
         style: 'Additional'
      },

      MarkExpandBoldtMain: {
         size: 16,
         icon: 'MarkExpandBold',
         style: 'Main'
      },

      MarkCollapseBoldAccent: {
         size: 16,
         icon: 'MarkCollapseBold',
         style: 'Accent'
      },

      MarkCollapseBoldMain: {
         size: 16,
         icon: 'MarkCollapseBold',
         style: 'Main'
      },

      MarkCollapseBoldAdditional: {
         size: 16,
         icon: 'MarkCollapseBold',
         style: 'Additional'
      },

      AccordionArrowDown: {
         size: 24,
         icon: 'AccordionArrowDown',
         style: 'Additional'
      },

      AccordionArrowUp : {
         size: 24,
         icon: 'AccordionArrowUp',
         style: 'Additional'
      }
   };

   var _private = {
      cssStyleGeneration: function (self, options) {
         if (classesOfIcons.hasOwnProperty(options.iconStyle)) {
            var currentIconClass = classesOfIcons[options.iconStyle];
         }else {
            IoC.resolve('ILogger').error("SeparatorIcon", "У кнопки-разделителя задан некорректный стиль иконки");
            currentIconClass = classesOfIcons.AccordionArrowUp;
         }
         self._style = currentIconClass.style;
         self._size = currentIconClass.size;
         self._icon = currentIconClass.icon;
      }
   };

   var Header = Control.extend({
      _template: template,

      countClickHandler: function (e) {
         if(this._options.countClickable){
            e.stopPropagation();
            this._notify('countClick');
         }
      },
      constructor: function (options) {
         Header.superclass.constructor.apply(this, arguments);
         _private.cssStyleGeneration(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.cssStyleGeneration(this, newOptions);
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
