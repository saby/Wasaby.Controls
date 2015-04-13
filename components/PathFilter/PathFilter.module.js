/**
 * Created by am.gerasimov on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.PathFilter',
   [
      'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
      'js!SBIS3.CONTROLS.PathFilterComboBox',
      'html!SBIS3.CONTROLS.PathFilter'
   ],

   function(ButtonGroupBaseDS, PathFilterComboBox, dotTplFn) {


      'use strict';

      var PathFilter = ButtonGroupBaseDS.extend({
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               mode: 'hover'
            }
         },
         _getItemTemplate: function(item) {
            var cfg = {
               editable: false,
               items: item.get('values'),
               keyField: item.get('keyField'),
               className: 'controls-PathFilter__pathFilterComboBox'
            };
            return '<component data-component="SBIS3.CONTROLS.PathFilterComboBox" config="' + $ws.helpers.encodeCfgAttr(cfg) + '"></component>';
         }
      });

      return PathFilter;


   });
