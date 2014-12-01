/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceXHR', ['js!SBIS3.CONTROLS.IDataSource'], function (IDataSource) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _options: {
            /**
             * @cfg {String} Метод запроса. POST или GET. По умолчанию = Get.
             */
            method: 'GET',
            /**
             * @cfg {String} Тип данных, который Вы ожидаете от сервера. По умолчанию text.
             */
            dataType: 'text',
            /**
             * @cfg {String} contentType Тип данных при отсылке данных на сервер. По умолчанию application/x-www-form-urlencoded.
             */
            contentType: 'application/x-www-form-urlencoded',
            /**
             * @cfg {String} url URL, по которому отправляется запрос.
             */
            url: ''
         },
         _xhr: undefined      //Последний запрос
      },
      $constructor: function () {
         if (this._options.url === '') {
            throw new Error('Request with no URL is ambiguous');
         }
      },
      /**
       * @param {String} data Данные для отправки
       * @param {Object} [headers] Заголовки
       * @return {$ws.proto.Deferred}
       */
      execute: function (data, headers) {
         var
            dResult = new $ws.proto.Deferred(),
            self = this;

         try {
            this._xhr = $.ajax({
               type: this._options.method,
               dataType: this._options.dataType,
               contentType: this._options.contentType,
               url: this._options.url,
               headers: headers || {},
               data: data,
               success: function (result) {
                  self._validateCookies();
                  dResult.callback(result);
                  return result;
               },
               // null
               // 'timeout'
               // 'error'
               // 'notmodified'
               // 'parsererror'
               error: function (xhr, textStatus) {
                  self._validateCookies();
                  var
                     humanReadableErrors = {
                        timeout: 'Таймаут запроса',
                        error: 'Неизвестная ошибка',
                        parsererror: 'Ошибка разбора документа',
                        abort: 'Запрос был прерван',
                        403: 'У вас недостаточно прав для выполнения данного действия.',
                        404: 'Документ не найден',
                        423: 'Действие заблокировано лицензией',
                        500: 'Внутренняя ошибка сервера',
                        502: 'Сервис недоступен. Повторите попытку позже.',
                        503: 'Сервис недоступен. Повторите попытку позже.',
                        504: 'Сервис недоступен. Повторите попытку позже.'
                     },
                     textError = ((xhr.status in humanReadableErrors) ? humanReadableErrors[xhr.status]
                        : ((textStatus in humanReadableErrors) ? humanReadableErrors[textStatus]
                        : humanReadableErrors['error'])),
                     error;

                  // Запрос был отменен пользователем по esc
                  if (xhr.status === 0 && xhr.getAllResponseHeaders() === '') {
                     textError = 'Запрос был прерван пользователем';
                  }

                  error = new HTTPError(textError, xhr.status, self._options.url, xhr.responseText);

                  // Извещаем о HTTP-ошибке
                  $ws.single.EventBus.channel('errors').notify('onHTTPError', error);

                  //обрабатываем ситуацию истекшей сессии
                  if (xhr.status == '401') {

                     // Новый вариант рассылки ошибки о проблеме аутентификации
                     if ($ws.single.EventBus.channel('errors').notify('onAuthError') === true) {
                        return;
                     }

                     // Старый способ. Надо выпилить в 3.8
                     if (typeof $ws.core._authError == 'function') {
                        $ws.core._authError();
                        return;
                     }
                  }

                  if (xhr.status == '403' || xhr.status == '423') {
                     dResult.errback(error);
                     if (!error.processed) {
                        $ws.core.alert(textError, 'error');
                     }
                  }
                  else {
                     dResult.errback(error);
                  }
               }
            });
         } catch (e) {
            dResult.errback('JavaScript exception while trying to execute request: ' + e.message);
         }

         return dResult;
      },
      /**
       * Прерывает загрузку
       */
      abort: function () {
         if (this._xhr) {
            this._xhr.abort();
         }
      },
      /**
       * Проверка куки, если изменилась - кидаем ошибку авторизации
       */
      _validateCookies: function () {
         var storedSID = $ws.single.GlobalContext.getValue('sid'), cookieSID;
         if ('jQuery' in window && 'cookie' in window.jQuery) {
            cookieSID = $.cookie('sid');
            // Если у нас сохранен ранее SID и если в куке тоже есть SID
            if (storedSID && cookieSID) {
               var
                  w = storedSID.split('-'),
                  n = cookieSID.split('-');

               //если изменились пользователи или клиент, то покажем ошибку авторизации
               if (w[0] !== n[0] || w[1] !== n[1]) {
                  // Новый способ извещения об ошибке аутентицикации
                  $ws.single.EventBus.channel('errors').notify('onAuthError');

                  // Старый способ. Удалить с 3.8
                  if (typeof $ws.core._authError == 'function') {
                     $ws.core._authError();
                  }
               }
            }
            else {
               // ... если SID ранее не сохранен - сохраним
               $ws.single.GlobalContext.setValue('sid', cookieSID);
            }
         }
      }
   });
});