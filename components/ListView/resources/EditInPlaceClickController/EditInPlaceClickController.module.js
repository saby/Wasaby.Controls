/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceClickController',
   [
      'js!SBIS3.CONTROLS.EditInPlaceBaseController'
   ],
   function (EditInPlaceBaseController) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceClickController
       * @extends SBIS3.CONTROLS.EditInPlaceBaseController
       * @author Сухоручкин Андрей Сергеевич
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