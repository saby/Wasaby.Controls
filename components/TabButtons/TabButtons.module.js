/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.TabButton', 'css!SBIS3.CONTROLS.TabButtons'], function(RadioGroupBase, TabButton) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    */

   var TabButtons = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {
            type: 'normal',
            hasMarker: true
         }
      },

      $constructor: function() {
         if (!this._options.hasMarker){
            this.getContainer().addClass('controls-TabButton__whithout-marker');
         }
      },

      _getItemTemplate : function() {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
            '<option name="caption" value="{{=it.item.get(\"' + this._options.captionField + '\")}}"></option>'+
            '<option name="additionalText" value="{{=it.item.get(\'additionalText\')}}"></option>'+
            '<option name="align" value="{{=it.item.get(\'align\')}}"></option>'+
            '</component>';
      }
   });

   return TabButtons;

});