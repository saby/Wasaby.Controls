/**
 * Created by as.krasilnikov on 29.10.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper',
   [
      'Core/Control',
      'wml!Controls/Popup/Compatible/ManagerWrapper/ManagerWrapper',
   ],
   function(Control, template) {
      'use strict';

      var ManagerWrapper = Control.extend({
         _template: template,

      });

      return ManagerWrapper;
   });
