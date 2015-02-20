define("js!SBIS3.CORE.TReaderParams", ["js!SBIS3.CORE.CustomType"], function (CustomType) {

   "use strict";

   /**
    * Тип TReaderParams
    * @class TReaderParams
    * @extends CustomType
    * @generateJson
    * @category Выбор
    */
   var TReaderParams = CustomType.extend({
      /**
       * @lends TReaderParams.prototype
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} Тип используемого адаптера
             */
            adapterType: undefined,
            /**
             * @cfg {Object} Параметры адаптера
             */
            adapterParams: {
               /**
                * @cfg {Object} Данные
                */
               data: undefined
            },
            /**
             * @cfg {String} Схема базы данных
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             */
            dbScheme: undefined,
            /**
             * @cfg {String} Связанный объект
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             */
            linkedObject: undefined,
            /**
             * @cfg {String} Имя метода объекта
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Итоговый запрос: linkedObject.queryName
             */
            queryName: undefined,
            /**
             * @cfg {String} Имя метода, определяющего формат записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Возможен выбор декларативного метода, возвращающего набор записей.
             * При указанном методе набор полей, пришедших в прочитанной записи будет идентичным набору полей, возвращаемых указанным методом формата.
             */
            format: undefined,
            /**
             * @cfg {String} Имя метода создания записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Добавить описание
             */
            createMethodName: undefined,
            /**
             * @cfg {String} Имя метода чтения записей
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * При редактировании записи будут прочитаны указанным методом.
             */
            readMethodName: undefined,
            /**
             * @cfg {String} Имя метода изменения записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Добавить описание
             */
            updateMethodName: undefined,
            /**
             * @cfg {String} Имя метода удаления записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Добавить описание
             */
            destroyMethodName: undefined,
            /**
             * @cfg {String} Имя метода копирования записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag class=CustomView group="Данные">
             * Добавить описание
             */
            copyMethodName: undefined
         }
      },
      isConfigured: function () {
         // опция сконфигурирована, если указан объект, либо заполнены статические данные.
         return this._options.linkedObject || this._options.adapterParams.data;
      }
   });
   return TReaderParams;
});