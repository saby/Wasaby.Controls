/**
 * Created by am.gerasimov on 15.02.2017.
 */
/**
 * Created by am.gerasimov on 15.02.2017.
 */
define('SBIS3.CONTROLS/Action/Utils/OpenDialogUtil', ['Core/core-merge'], function (cMerge) {
   'use strict';

   var OpenDialogUtil = {
      getOptionsFromProto: function(mod, opts) {
         var prototypeProtectedData = {},
            options;

         (mod.prototype || mod)._initializer.call(prototypeProtectedData); //На прототипе опции не доступны, получаем их через initializer
         options = prototypeProtectedData._options;
         cMerge(options, opts || {});

         return options;
      },

      errorProcess: function(err) {
         err.processed = true;
         require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager){
            InformationPopupManager.showMessageDialog({
               message: err.message,
               status: 'error'
            });
         });
      }
   };

   return OpenDialogUtil;
});