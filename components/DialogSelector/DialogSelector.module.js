/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.DialogSelector',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.SelectorMixin',
      'js!SBIS3.CORE.Dialog'
   ], function(cExtend, selectorMixin, Dialog ) {

      'use strict';

      return cExtend.mixin(Dialog, selectorMixin);

   });
