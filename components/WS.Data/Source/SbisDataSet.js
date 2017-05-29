/* global define */
define('js!WS.Data/Source/SbisDataSet', [
   'js!WS.Data/Source/DataSet',
   'js!WS.Data/Di',
   'js!WS.Data/Adapter/Sbis',
   'Core/core-instance'
], function (
   DataSet,
   Di,
   AdapterSbis,
   CoreInstance
) {
   'use strict';

   /**
    * Набор данных, полученный из БЛ СБИС.
    * Подключает встроенные типы БЛ в порождаемые объекты.
    * @class WS.Data/Source/SbisDataSet
    * @extends WS.Data/Source/DataSet
    * @author Мальцев Алексей
    */

   var SbisDataSet = DataSet.extend(/** @lends WS.Data/Source/SbisDataSet.prototype */{
      _moduleName: 'WS.Data/Source/SbisDataSet',

      _$adapter: 'adapter.sbis',
      _$totalProperty: 'n',

      /**
       * @member {String} Свойство, в котором лежат мета-данные
       */
      _metaProperty: 'm',

      /**
       * @member {String} Свойство, в котором лежат хлебные крошки
       */
      _pathProperty: 'p',

      /**
       * @member {String} Свойство, в котором лежит строка итогов
       */
      _resultsProperty: 'r',

      //region WS.Data/Source/DataSet

      getAll: function(property) {
         var items = SbisDataSet.superclass.getAll.call(this, property);

         if (CoreInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet')) {
            var meta = items.getMetaData(),
               buildRecord = (function(data, idProperty) {
                  return Di.create('entity.model', {
                     rawData: data,
                     adapter: this._$adapter,
                     idProperty: idProperty || ''
                  });
               }).bind(this),
               buildRs = (function(data, idProperty) {
                  return Di.create('collection.recordset', {
                     rawData: data,
                     adapter: this._$adapter,
                     idProperty: idProperty || ''
                  });
               }).bind(this);

            if (this.hasProperty(this._metaProperty)) {
               buildRecord(
                  this.getProperty(this._metaProperty)
               ).each(function(name, value) {
                  meta[name] = value;
               });
            }

            if (this.hasProperty(this._resultsProperty)) {
               meta.results = buildRecord(
                  this.getProperty(this._resultsProperty),
                  this.getIdProperty()
               );
            }

            if (this.hasProperty(this._pathProperty)) {
               meta.path = buildRs(
                  this.getProperty(this._pathProperty),
                  this.getIdProperty()
               );
            }

            items.setMetaData(meta);
         }

         return items;
      }

      //endregion WS.Data/Source/DataSet
   });

   Di.register('source.sbis-dataset', SbisDataSet);

   return SbisDataSet;
});
