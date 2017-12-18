/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('SBIS3.CONTROLS/FloatArea/FloatAreaSelector',
   [
      'Core/core-extend',
      'SBIS3.CONTROLS/Mixins/SelectorMixin',
      'Lib/Control/FloatArea/FloatArea'
   ], function(cExtend, selectorMixin, FloatArea ) {

      'use strict';

      return cExtend.mixin(FloatArea, selectorMixin);

   });
