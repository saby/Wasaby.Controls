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
    * @css @line-height_MissSpell A line-height of the misspelling caption.
    * @css @color_MissSpell_caption A color of the misspelling caption.
    * @css @color_MissSpell_caption-hover A hover color of the misspelling caption.
    * @css @spacing_MissSpell_horizontal A horizontal spacing (padding) on the left and right sides.
    */
   
   function(Control, template) {
      
      'use strict';
      
      var MissSpell = Control.extend({
         _template: template
      });
      
      return MissSpell;
   });
