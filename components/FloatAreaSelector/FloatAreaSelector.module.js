/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.FloatAreaSelector',
   [
      'js!SBIS3.CONTROLS.SelectorMixin',
      'js!SBIS3.CORE.FloatArea'
   ], function( selectorMixin, FloatArea ) {

      'use strict';

      return $ws.core.mixin(FloatArea, selectorMixin);

   });
