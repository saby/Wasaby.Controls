define('Controls/Search/Misspell',
   [
      'Core/Control',
      'wml!Controls/Search/Misspell',
      'css!theme?Controls/Search/Misspell'
   ],
   
   /**
    * Control, that using to show a user the misspelling.
    * @class Controls/Search/Misspell
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    *
    * @css @line-height_Misspell A line-height of the misspelling control.
    *
    * @css @color_Misspell-caption A color of the misspelling caption.
    *
    * @css @color_Misspell-caption_hover A hover color of the misspelling caption.
    * @css @text-decoration_Misspell-caption_hover text-decoration of caption at hover.
    *
    * @css @color_Misspell-caption_active A active color of the misspelling caption.
    * @css @text-decoration_Misspell-caption_active text-decoration of caption at active.
    *
    * @css @font-weight_Misspell-text A font-weight of
    * @css @font-weight_Misspell-caption
    */
   
   function(Control, template) {
      
      'use strict';
      
      return Control.extend({
         _template: template
      });
   });
