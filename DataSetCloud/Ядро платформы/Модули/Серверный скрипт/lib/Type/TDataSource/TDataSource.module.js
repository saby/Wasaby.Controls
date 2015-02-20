define("js!SBIS3.CORE.TDataSource", ["js!SBIS3.CORE.CustomType", "js!SBIS3.CORE.TReaderParams"], function (CustomType, TReaderParams) {

   "use strict";

   /**
    * Тип TDataSource
    * @class TDataSource
    * @extends CustomType
    * @generateJson
    * @category Выбор
    */
   var TDataSource = CustomType.extend({
      /**
       * @lends TDataSource.prototype
       */
      $protected: {
         _options: {
            /**
             * @cfg {Object} Контекст
             * @noShow
             */
            context: '',
            /**
             * @typedef {Object} FilterParam
             * @property {string} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             * @property {boolean} [saveToState=false] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<string, string|function|FilterParam>} Параметры фильтрации
             * @editor FilterParamsEditor
             * @example
             * <pre>
             *    filterParams: {
             *       'param' : 'val1',
             *       'param2' : 'val2'
             *    }
             * </pre>
             */
            filterParams: {},
            /**
             * @cfg {Object} Массив обязательных параметров
             */
            requiredParams: [],
            /**
             * @cfg {String} Тип ридера данных
             *
             * Возможные значения:
             * <ol>
             *    <li>ReaderUnifiedSBIS</li>
             *    <li>ReaderSBIS</li>
             *    <li>ReaderSBISSpecial</li>
             *    <li>mockReader</li>
             *    <li>StraightArgsReader</li>
             * </ol>
             */
            readerType: 'ReaderUnifiedSBIS',
            /**
             * @cfg {Object} Параметры ридера
             * @editor TReaderParamsEditor
             * @example
             * <pre>
             *    readerParams: {
             *       dbScheme: '',
             *       linkedObject: 'Календарь',
             *       queryName: 'Список',
             *       format: 'test1Method',
             *       createMethodName: 'Список',
             *       readMethodName: 'Список',
             *       updateMethodName: 'Список',
             *       destroyMethodName: 'Список'
             *    }
             * </pre>
             */
            readerParams: TReaderParams,
            /**
             * @cfg {Boolean} Разрешить первичный запрос данных
             */
            firstRequest: true,
            /**
             * @cfg {Boolean} Настройка режима постраничной навигации
             * @variant full полная загрузка
             * @variant parts постраничная загрузка
             * @variant '' нет постраничного вывода
             */
            usePages: '',
            /**
             * @cfg {Number} Текущая показанная страница
             */
            pageNum: 0,
            /**
             * @cfg {Number} Число записей на странице
             */
            rowsPerPage: 2,
            /**
             * @cfg {Object} Настройки сортировки
             */
            sorting: null,
            /**
             * @cfg {Boolean} Ждать предыдущего запроса
             */
            waitForPrevQuery: false,
            /**
             * @cfg {String} Поле иерархии
             * Это имя поля источника данных, по значению которого устанавливается иерархическая связь между записями.
             */
            hierarchyField: ''
         }
      },
      isConfigured: function () {
         return this._options.readerParams.isConfigured();
      },
      /**
       * @returns {object} объект TDataSource без лишних полей
       */
      getRaw: function () {
         var object = {};
         $ws.helpers.forEach(this, function (value, opt) {
            var type = $ws.helpers.type(value);
            if (!/^_/.test(opt) && type !== 'function') {
               if (type === 'object') {
                  object[opt] = TDataSource.prototype.getRaw.apply(value);
               } else {
                  object[opt] = value;
               }
            }
         });
         return object;
      }
   });
   return TDataSource;
});