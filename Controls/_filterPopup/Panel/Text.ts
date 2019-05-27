import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Text/Text');
import 'css!theme?Controls/filterPopup';

   /**
    * Контрол, отображающий текст с кнопкой сброса в виде крестика.
    * Используется для демонстрации пользователю выбранного фильтра, клик по крестику сбрасывает фильтр.
    * @class Controls/_filterPopup/Panel/Text
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Text#caption
    * @cfg {String} Caption Control caption text.
    * @example
    * <pre>
    *    <Controls.filterPopup:Text>
    *        <ws:caption>По удалённым</ws:caption>
    *    </Controls.filterPopup:Text>
    * </pre>
    */


   /* KONGO!
      Контрол, отображающий текст с кнопкой сброса в виде крестика. - Control with caption and reset button.
      Используется для демонстрации пользователю выбранного фильтра, клик по крестику сбрасывает фильтр. Control is used for display selected filter. Click on reset button will reset filter.
    */



   var Text = Control.extend({
      _template: template,

      _afterMount: function() {
         this._notify('valueChanged', [true]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   Text.getDefaultOptions = function() {
      return {
         value: true
      };
   };

   export = Text;


