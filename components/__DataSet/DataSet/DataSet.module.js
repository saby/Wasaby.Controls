/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [], function () {
   'use strict';
   return $ws.proto.Abstract.extend({
      $protected: {
         _data: []
      },
      $constructor: function () {

      },
      addRecord:function(record){
         this._data.push(record);
      }
   });
});