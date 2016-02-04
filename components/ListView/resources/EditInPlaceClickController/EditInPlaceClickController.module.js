/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceClickController',
   [
      'js!SBIS3.CONTROLS.EditInPlaceBaseController',
      'js!SBIS3.CONTROLS.EditInPlace'
   ],
   function (EditInPlaceBaseController, EditInPlace) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceClickController
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         EditInPlaceClickController = EditInPlaceBaseController.extend(/** @lends SBIS3.CONTROLS.EditInPlaceClickController.prototype */ {
            $protected: {
               _options: {
               }
            },
            $constructor: function() {
            }
         });

      return EditInPlaceClickController;
   });