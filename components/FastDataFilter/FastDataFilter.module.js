/**
 * Created by am.gerasimov on 15.04.2015.
 */
define('js!SBIS3.CONTROLS.FastDataFilter',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.FastDataFilter'
   ],

   function(CompoundControl, DSMixin, CustomFilterMenu, dotTplFn) {


      'use strict';

      var FastDataFilter = CompoundControl.extend([DSMixin],{
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               mode: 'hover',
               displayField: ''
            }
         },
         $constructor: function() {
            this.reload();
         },
         _getItemTemplate: function(item) {
            var cfg = {
               items: item.get('values'),
               keyField: item.get('keyField'),
               mode: this._options.mode,
               displayField: this._options.displayField
            };
            return '<component data-component="SBIS3.CONTROLS.CustomFilterMenu" config="' + $ws.helpers.encodeCfgAttr(cfg) + '"></component>';
         }
      });
      return FastDataFilter;
   });
