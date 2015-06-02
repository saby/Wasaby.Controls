/**
 * Created by am.gerasimov on 02.06.2015.
 */
define('js!SBIS3.CONTROLS.DropDownList',
   [
      'js!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.DropDownList'
   ],

   function(CustomFilterMenu, dotTplFn) {


      'use strict';

      var DropDownList = CustomFilterMenu.extend({
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               pickerClassName: 'controls-CustomFilterMenu__picker controls-DropDownList__picker',
               allowEmptySelection: false,
               targetPart: false,
               className: 'controls-dropDownList'
            }
         },
         _setPickerConfig: function () {
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top',
                  offset: -1
               },
               horizontalAlign: {
                  side: 'left',
                  offset: -1
               },
               closeByExternalClick: true,
               targetPart: true
            };
         }
      });
      return DropDownList;
   });

