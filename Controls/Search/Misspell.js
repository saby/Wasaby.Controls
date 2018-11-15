define('Controls/Search/Misspell',
   [
      'Core/Control',
      'wml!Controls/Search/Misspell',
      'css!Controls/Search/Misspell'
   ],
   
   /**
    * Control, that using to show a user the misspelling.
    * @class Controls/Search/Misspell
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    *
    * @css @min-height_MissSpell A min-height of the misspelling control.
    * @css @color_MissSpell_caption A color of the misspelling caption.
    * @css @color_MissSpell_caption-hover A hover color of the misspelling caption.
    */
   
   function(Control, template) {
      
      'use strict';
      
      return Control.extend({
         _template: template
      });
   });
