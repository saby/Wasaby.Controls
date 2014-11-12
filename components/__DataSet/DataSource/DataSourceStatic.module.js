/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceStatic', ['js!SBIS3.CONTROLS.IDataSource'], function (IDataSource) {
   'use strict';
   return IDataSource.extend({
      $protected: {

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