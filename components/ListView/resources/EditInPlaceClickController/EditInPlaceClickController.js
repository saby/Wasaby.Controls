/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('SBIS3.CONTROLS/ListView/resources/EditInPlaceClickController/EditInPlaceClickController',
   [
      'SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController'
   ],
   function (EditInPlaceBaseController) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS/ListView/resources/EditInPlaceClickController/EditInPlaceClickController
       * @extends SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController
       * @author Сухоручкин А.С.
       * @control
       * @public
       */

      var
         EditInPlaceClickController = EditInPlaceBaseController.extend(/** @lends SBIS3.CONTROLS/ListView/resources/EditInPlaceClickController/EditInPlaceClickController.prototype */ {
            $protected: {
               _options: {
               }
            },
            $constructor: function() {
            }
         });

      return EditInPlaceClickController;
   });