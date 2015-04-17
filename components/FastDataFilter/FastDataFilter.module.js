/**
 * Created by am.gerasimov on 15.04.2015.
 */
define('js!SBIS3.CONTROLS.FastDataFilter',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.CollectionMixin',
      'js!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.FastDataFilter'
   ],

   function(CompoundControl, CollectionMixin, CustomFilterMenu, dotTplFn) {


      'use strict';

      var FastDataFilter = CompoundControl.extend([CollectionMixin],{
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               mode: 'hover',
               displayField: ''
            }
         },
         $constructor: function() {
            this._drawItems();
         },
         _getItemTemplate: function() {
            return function (cfg) {
               cfg.options = cfg.options || {};
               cfg.options.items = cfg.values;
               cfg.options.keyField = cfg.keyField;
               cfg.options.mode = this._options.mode;
               cfg.options.displayField = this._options.displayField;
               return {
                  componentType: 'js!SBIS3.CONTROLS.CustomFilterMenu',
                  config: cfg.options
               };
            };
         }
      });
      return FastDataFilter;
   });
