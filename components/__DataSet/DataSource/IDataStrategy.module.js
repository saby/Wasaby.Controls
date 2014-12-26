/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataStrategy', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
      },
      $constructor: function () {
      },
      /**
       * Приводит данные к единому формату, для заполнения датасета
       * @param data - данные
       * @param columns - описание полей
       */
      prepareData: function (data, columns) {
         /*Method must be implemented*/
      }

   });
});