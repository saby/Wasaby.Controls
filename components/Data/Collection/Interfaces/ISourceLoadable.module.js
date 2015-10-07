/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable', [
], function () {
   'use strict';

   /**
    * Интерфейс коллекции, загружаемой через источник данных
    * @mixin SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @implements SBIS3.CONTROLS.Data.Query.IQueryable
    * @public
    * @author Мальцев Алексей
    */

   var ISourceLoadable = /** @lends SBIS3.CONTROLS.Data.Collection.ISourceLoadable.prototype */{
      /**
       * @event onBeforeCollectionLoad Перед загрузкой коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE Режим загрузки
       * @param {Object} target Объект, в который производится загрузка
       */

      /**
       * @event onAfterCollectionLoad После загрузки коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} [mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE] Режим загрузки
       * @param {SBIS3.CONTROLS.Data.Source.DataSet} [dataSet] Набор данных
       * @param {Object} target Объект, в который производится загрузка
       */

      /**
       * @event onBeforeLoadedApply Перед вставкой загруженных данных в коллекцию
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} [mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE] Режим загрузки
       * @param {*} collection Коллекция, полученная из источника
       * @param {Object} target Объект, в который производится загрузка
       * @example
       * <pre>
       *    grid.subscribe('onBeforeLoadedApply', function(eventObject, mode, collection){
       *       collection.add('My own list item at 1st position', 0);
       *    });
       * </pre>
       */

      /**
       * @event onAfterLoadedApply После вставки загруженных данных в коллекцию
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} [mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE] Режим загрузки
       * @param {*} collection Коллекция, полученная из источника
       * @param {Object} target Объект, в который производится загрузка
       * @example
       * <pre>
       *    grid.subscribe('onAfterLoadedApply', function(eventObject, mode, collection){
       *       collection.add('My own list item at 1st position', 0);
       *    });
       * </pre>
       */

      $protected: {
         _options: {

            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.ISource} Источник данных
             */
            source: undefined
         },

         /**
          * @var {Boolean} Загрузка была произведена
          */
         _loaded: false,

         /**
          * @var {Boolean} С момента последнего вызова load() были внесены изменения в query
          */
         _queryChanged: false
      },

      /**
       * Возвращает источник данных
       * @returns {SBIS3.CONTROLS.Data.Source.Base}
       */
      getSource: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает источник данных
       * @param {SBIS3.CONTROLS.Data.Source.Base} source
       */
      setSource: function (source) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает признак, что коллекция уже была загружена из источника
       * @returns {Boolean}
       */
      isLoaded: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает признак, что запрос на выборку был изменен c момента последнего load()
       * @returns {Boolean}
       */
      isQueryChanged: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Загружает данные из источника в коллекцию
       * @param {String} [mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE] Режим загрузки
       * SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE - заменить
       * SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_APPEND - добавить в конец
       * SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_PREPEND - добавить в начало
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения, первым аргументом придет SBIS3.CONTROLS.Data.Source.DataSet
       */
      load: function (mode) {
         throw new Error('Method must be implemented');
      }
   };

   /**
    * @const {String} Режим загрузки - замена
    */
   ISourceLoadable.MODE_REPLACE = 'r';
   /**
    * @const {String} Режим загрузки - добавление в конец
    */
   ISourceLoadable.MODE_APPEND = 'a';
   /**
    * @const {String} Режим загрузки - добавление в начало
    */
   ISourceLoadable.MODE_PREPEND = 'p';

   return ISourceLoadable;
});
