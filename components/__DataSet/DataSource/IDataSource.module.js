/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _adapter: ''// имя класса адаптера
      },
      $constructor: function () {
      },
      read: function () {
         /*Method must be implemented*/
      },
      query: function () {
         /*Method must be implemented*/
      },
      create: function () {
         /*Method must be implemented*/
      },
      destroy: function () {
         /*Method must be implemented*/
      },
      update: function () {
         /*Method must be implemented*/
      }
   });
});