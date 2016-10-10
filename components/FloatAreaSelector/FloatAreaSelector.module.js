/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.FloatAreaSelector',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.SelectorMixin',
      'js!SBIS3.CORE.FloatArea'
   ], function(cExtend, selectorMixin, FloatArea ) {

      'use strict';

      return cExtend.mixin(FloatArea, selectorMixin);

   });
