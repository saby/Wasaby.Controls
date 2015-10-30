/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.DialogSelector',
   [
      'js!SBIS3.CONTROLS.SelectorMixin',
      'js!SBIS3.CORE.Dialog'
   ], function( selectorMixin, Dialog ) {

      'use strict';

      return $ws.core.mixin(Dialog, selectorMixin);

   });
