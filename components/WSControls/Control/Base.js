/**
 * Created by dv.zuev on 02.06.2017.
 */

define('js!WSControls/Control/Base',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!WS.Data/Entity/InstantiableMixin'
   ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             ButtonCompatible,
             InstantiableMixin) {

      'use strict';

      var Base = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin],
         {
            _controlName: 'WSControls/Control/Base',
            iWantVDOM: false,

            constructor: function (cfg) {
               this.deprecatedContr(cfg);
            }


         });

      return Base;

   });