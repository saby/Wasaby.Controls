/* global define */
define('js!WS.Data/Adapter/RecordSetTable', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/ITable',
   'js!WS.Data/Adapter/GenericFormatMixin',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   Abstract,
   ITable,
   GenericFormatMixin,
   RecordSet,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате рекордсета.
    * Работает с данными, представленными в виде экземлпяра {@link WS.Data/Collection/RecordSet}.
    *
    * Создадим адаптер для таблицы:
    * <pre>
    *    var rs = new RecordSet({
    *          rawData: [
    *             {id: 1, title: 'Test 1'},
    *             {id: 2, title: 'Test 2'},
    *          ]
    *       }),
    *       adapter = new RecordSetTable();
    *    adapter.at(0).get('title');//'Test 1'
    * </pre>
    * @class WS.Data/Adapter/RecordSetTable
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/ITable
    * @mixes WS.Data/Adapter/GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetTable = Abstract.extend([ITable, GenericFormatMixin], /** @lends WS.Data/Adapter/RecordSetTable.prototype */{
      _moduleName: 'WS.Data/Adapter/RecordSetTable',

      /**
       * @member {WS.Data/Collection/RecordSet} Список
       */
      _data: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         if (data && !CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
            throw new TypeError('Argument data should be an instance of WS.Data/Collection/RecordSet');
         }
         RecordSetTable.superclass.constructor.call(this, data);
         GenericFormatMixin.constructor.call(this, data);
      },

      //region WS.Data/Adapter/ITable

      getFields: function () {
         var fields = [];
         if (this._isValidData() && this._data.getCount() > 0) {
            this._data.at(0).each(function(name) {
               fields.push(name);
            });
         }
         return fields;
      },

      getCount: function () {
         return this._isValidData() ? this._data.getCount() : 0;
      },

      add: function (record, at) {
         this._buildData(record);
         this._data.add(record, at);
      },

      at: function (index) {
         return this._isValidData() ? this._data.at(index) : undefined;
      },

      remove: function (at) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         return this._data.removeAt(at);
      },

      replace: function (record, at) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         return this._data.replace(record, at);
      },

      move: function(source, target) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         var rec = this._data.at(source);
         this._data.removeAt(source);
         this._data.add(rec, target);
      },

      merge: function(acceptor, donor, idProperty) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         acceptor = this._data.at(acceptor);
         this._data.at(donor).each(function(name, value) {
            if (name !== idProperty) {
               acceptor.set(name, value);
            }
         }, this);
         this._data.removeAt(donor);
      },

      copy: function(index) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         var clone = this._data.at(index).clone();
         this.add(clone, 1 + index);
         return clone;
      },

      clear: function () {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         var count = this._data.getCount();
         for (var i = count - 1; i >= 0; i--) {
            this._data.removeAt(i);
         }
      },

      addField: function(format, at) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.addField(format, at);
      },

      removeField: function(name) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.removeField(name);
      },

      removeFieldAt: function(index) {
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.removeFieldAt(index);
      },

      //endregion WS.Data/Adapter/ITable

      //region Public methods

      //endregion Public methods

      //region Protected methods

      _buildData: function (sample) {
         if (!this._data) {
            var config = {};
            if (sample) {
               if (sample.getAdapter) {
                  config.adapter = sample.getAdapter();
               }
               if (sample.getIdProperty) {
                  config.idProperty = sample.getIdProperty();
               }
            }
            this._data = new RecordSet(config);
         }
      },

      _isValidData: function () {
         return this._data instanceof RecordSet;
      },

      _getFieldsFormat: function() {
         return this._data.getFormat();
      }

      //endregion Protected methods
   });

   return RecordSetTable;
});
