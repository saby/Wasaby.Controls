/**
 * Вспомогательный класс для выполнения завершающего действия настройщика экспорта
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Executor
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Executor',
   [
      'Core/Deferred',
      'SBIS3.CONTROLS/ExportCustomizer/Utils/CollectionSelectByIds',
      'SBIS3.CONTROLS/Utils/ImportExport/RemoteCall',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',

      'i18n!SBIS3.CONTROLS/ExportCustomizer/_Executor'
   ],

   function (Deferred, collectionSelectByIds, RemoteCall, InformationPopupManager) {
      'use strict';

      /**
       * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
       * @property {Array<string>} fieldIds Список полей для колонок в экспортируемом файле
       * @property {Array<string>} columnTitles Список отображаемых названий колонок в экспортируемом файле
       * @property {string} fileUuid Uuid стилевого эксель-файла
       * @property {ExportServiceParams} serviceParams Прочие параметры, необходимых для работы БЛ
       */

      var Executor = /**@lends SBIS3.CONTROLS/ExportCustomizer/_Executor.prototype*/ {
         /**
          * Выполнить завершающее действие настройщика экспорта
          *
          * @public
          * @param {object} options Опции компонента
          * @return {Core/Deferred<ExportResults>}
          */
         execute: function (options) {
            if (!options || typeof options !== 'object') {
               throw new Error('Options must be an object');
            }
            var promise = new Deferred();
            // Сформировать результирующие данные из всего имеющегося
            // И сразу прроверить их
            this.gatherValues(options, true).addCallback(function (data) {
               // И если всё нормально - завершить диалог
               if (data) {
                  var outputCall = options.outputCall;
                  if (outputCall) {
                     (new RemoteCall(outputCall)).call(data).addCallbacks(
                        function (result) {
                           data.result = result;
                           promise.callback(data);
                        },
                        function (err) {
                           promise.errback(/*err*/rk('При отправке данных поизошла ошибка', 'НастройщикЭкспорта'));
                        }
                     );
                  }
                  else {
                     promise.callback(data);
                  }
               }
               else {
                  promise.callback(null);
               }
            });
            return promise;
         },

         /*
          * Собрать из опций все результирующие данные и, если указано, проверить их
          *
          * @private
          * @param {object} options Опции компонента
          * #param {boolean} withValidation Провести проверку данных перез возвратом
          * @return {Core/Deferred<ExportResults>}
          */
         gatherValues: function (options, withValidation) {
            var data = {
               serviceParams: options.serviceParams,
               fieldIds: options.fieldIds,
               columnTitles: collectionSelectByIds(options.allFields, options.fieldIds, function (v) { return v.title; }) || [],
               fileUuid: options.fileUuid || null,//Если значначение пусто, значит стилевого эксель-файла нет. БЛ в таком случае безальтернативно требует значения null
               canDeleteFile: options.isTemporaryFile || null
            };
            return withValidation
               ?
               // Прроверить собранные данные
               _checkResults(data, options).addCallback(function (isSuccess) {
                  return isSuccess ? data : null;
               })
               :
               // Вернуть сразу
               Deferred.success(data);
         }
      };

      // Private methods:

      /*
       * Проверить результаты
       *
       * @private
       * @param {object} data Результирующие данные
       * @param {object} options Опции компонента
       * @return {Core/Deferred}
       */
      var _checkResults = function (data, options) {
         var validators = options.validators;
         var promise;
         if (validators && validators.length) {
            var errors = [];
            var warnings = [];
            var optionGetter = function (name) { return this[name]; }.bind(options);
            for (var i = 0; i < validators.length; i++) {
               var check = validators[i];
               var args = check.params;
               args = args && args.length ? args.slice() : [];
               args.unshift(data, optionGetter);
               var result = check.validator.apply(null, args);
               if (result !== true) {
                  (check.noFailOnError ? warnings : errors).push(
                     result || check.errorMessage || rk('Неизвестная ошибка', 'НастройщикЭкспорта')
                  );
               }
            }
            if (errors.length) {
               promise = _showMessage('error', rk('Исправьте пожалуйста', 'НастройщикЭкспорта'), errors.join('\n'));
            }
            else
            if (warnings.length) {
               promise = _showMessage('confirm', rk('Проверьте пожалуйста', 'НастройщикЭкспорта'), warnings.join('\n') + '\n\n' + rk('Действительно экспортировать так?', 'НастройщикЭкспорта'));
            }
         }
         return promise || Deferred.success(true);
      };

      /**
       * Показать сообщение пользователю
       *
       * @private
       * @param {SBIS3.CONTROLS/SubmitPopup#SubmitPopupStatus} type Тип диалога (confirm, default, success, error)
       * @param {string} title Заголовок сообщения
       * @param {string} text Текст сообщения
       * @return {Core/Deferred}
       */
      var _showMessage = function (type, title, text) {
         var isConfirm = type === 'confirm';
         var promise = new Deferred();
         var args = [{
            status: type,
            message: title,
            details: text
         }];
         if (isConfirm) {
            args.push(promise.callback.bind(promise, true), promise.callback.bind(promise, false));
         }
         else {
            args.push(promise.callback.bind(promise, null));
         }
         InformationPopupManager[isConfirm ? 'showConfirmDialog' : 'showMessageDialog'].apply(InformationPopupManager, args);
         return promise;
      };

      return Executor;
   }
);
