define('Controls/Search/MissSpell',
   [
      'Core/Control',
      'wml!Controls/Search/MissSpell',
      'css!Controls/Search/MissSpell'
   ],
   
   /**
    * Control, that using to show a user the misspelling.
    * @class Controls/Search/MissSpell
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    *
    * @css @min-height_MissSpell A min-height of the misspelling control.
    * @css @padding_MissSpell .
    * @css @color_MissSpell_caption A color of the misspelling caption.
    * @css @color_MissSpell_caption-hover A hover color of the misspelling caption.
    */
   
   function(Control, template) {
      
      'use strict';
      
      return Control.extend({
         _template: template
      });
   });
