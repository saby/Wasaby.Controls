/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('SBIS3.CONTROLS/Dialog/DialogSelector',
   [
      'Core/core-extend',
      'SBIS3.CONTROLS/Mixins/SelectorMixin',
      'Lib/Control/Dialog/Dialog'
   ], function(cExtend, selectorMixin, Dialog ) {

      'use strict';

      return cExtend.mixin(Dialog, selectorMixin);

   });
