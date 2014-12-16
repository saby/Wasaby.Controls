define( "js!SBIS3.CRYPTO.Plugin",
[ "js!SBIS3.CORE.PluginManager", "js!SBIS3.CORE.Dialog", "js!SBIS3.CORE.LoadingIndicator" ],
function( pluginManager, dialog, loadingIndicator ){
   
   var cryptoPlugin = (function(){
      var newError = function( type, message ){
         var err = new Error();
         err.type = type;
         err.message = message;
         return err;
      };
      return {
         name: "SbisCryptoPlugin",   //Имя плагина
         version : "3.6.3.6",        //Текущая версия плагина
         _plugin : null,             //Объект плагина
         //Список окон
         windows : {
            WINDOW_INSTALL_CSP : "CryptoPluginInstallCSP",
            _WINDOW_DEFAULT_INSTALL_CSP : "CryptoPluginInstallCSP"
         },
         //Возможные ошибки
         errorType : {
            USER_CANCELLED : "USER_CANCELLED",
            SILENT_MODE : "SILENT_MODE",
            INTERNAL : "INTERNAL_ERROR",
            CONNECTION : "CONNECTION_ERROR",
            UNKNOWN : "UNKNOWN"
         },
         //Сервера получения штампа времени для улучшенной подписи
         advancedSignServer : {
            dev  : "https://dev-cvs.tensor.ru/service/sbis-rpc-service300.dll",
            test : "https://test-cvs.tensor.ru/service/sbis-rpc-service300.dll",
            fix  : "https://fix-cvs.tensor.ru/service/sbis-rpc-service300.dll",
            work : "http://cvs.sbis.ru/service/sbis-rpc-service300.dll"
         },
         //Иногда возникают ситуации, когда происходит параллельный запуск ещё не инициализированного плагина.
         //Эта переменная контроллирует, чтобы запуск плагина был 1 раз
         mInit : false,

         /**
         * Инициализация плагина
         * @param {Params} params - Параметры:
         *    checkCSP - Флаг проверки криптопровайдера. Если явно установлен в false, то проверка не проводится( по-умолчанию проверка будет сделана );
         *    runOnce - Если поднят данный флаг, то после первой отмены действия пользователем ему перестанут показываться окна с установкой;
         *    silentMode - попытаться запустить плагин без показа окон интерфейса;
         *    opener - опенер для открываемых окон плагина.
         * @returns {$ws.proto.Deferred}
         */
         init : function( params ){
            var init_def = new $ws.proto.Deferred();
            var self = this;
            
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            //TODO убрать костыль: знаем о каком-то левом окне, которое находится в прикладном коде
            //Это знание позволяет нам скрыть от прикладного кода выбор окна установки СКЗИ
            //Если у нас есть расширенное окно установки СКЗИ, то будем открывать его
            this.setCSPInstallationWindow( "ПоискИУстановкаСКЗИ" );
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            //Если не пришло ни одного параметра, то проставим параметры по-умолчанию
            if( !params )
               params = {};
            params.checkCSP = params.checkCSP === false ? false : true;
            
            this._initPlugin( params ).addCallbacks( function( plugin ){
               //Проверим наличие криптопровайдера
               self._checkCSP( self._plugin, params ).addCallbacks( function(){
                  init_def.callback( self._plugin );
               }, function( err ){
                  init_def.errback( err );
               });
            }, function( err ){
               init_def.errback( err );
            });
            
            return init_def;
         },
         
         _initPlugin : function( params, restart_new_version ){
            var _init_def = new $ws.proto.Deferred(),
                self = this;
            //Если плагин уже запускался, то вернём его
            if( this._plugin )
               return _init_def.callback( this._plugin );
            
            //Если инициализация уже проходила, а плагин ещё не инициализирован, то просто дождёмся его
            if( this.mInit && !this._plugin && !restart_new_version ){
               var waitForInitInterval = setInterval( function(){
                  if( self._plugin ){
                     _init_def.callback( self._plugin );
                     clearInterval( waitForInitInterval );
                  }
               }, 100 );
               return _init_def;
            }
            this.mInit = true;
            
            var init_params = {};
            //Название флага тихого режима отличается от используемого данным модулем
            init_params.silent = params.silentMode;
            init_params.runOnce = params.runOnce;
            init_params.opener = params.opener;
            //Эти строки будут показываться в окне установки плагина
            init_params.dialogOptions = {
               caption: 'Установите плагин криптографии',
               description: 'Для работы с электронной подписью на носителе необходимо установить плагин криптографии',
               help: 'http://help.sbis.ru/about_edo/teh_terms/cryptoplugin_why/install'
            };
            //Адрес сервиса улучшенной подписи
            init_params.advSignServ = this._getAdvancedSignServerAdress();
            //Запустим плагин
            pluginManager.getPlugin( self.name, self.version, init_params ).addCallbacks( function( plugin ){
               //Сохраняем запущенный на странице плагин
               self._plugin = plugin;
               //Установим ему таймаут ответа в 5 минут( 300000 миллисекунд )
               pluginManager.setQueryTimeout( 300000, self._plugin )
               //Добавляем дополнительные функции
               self._addFunctions();
               //Тут нам, возможно, надо докачать некоторые библиотеки для плгина..
               self._plugin._GetAdditionalLibraries().addCallbacks( function( res ){
                  if( res )
                     _init_def.callback( self._plugin );
                  else
                     _init_def.errback( newError( self.errorType.INTERNAL, "Не удалось скачать дополнительные библиотеки криптографии. Обратитесь в службу методической поддержки" ) );
               }, function( err ){
                  _init_def.errback( err );
               });
            }, function( err ){
               //Временное решение: перезапуск лаунчера после обновления плагина криптографии( не выгружаются unmanaged библиотеки )
               if( err.description === "CRYPTO_PLUGIN_DOWNLOAD" ){
                  setTimeout( function(){
                     self._initPlugin( params, true ).addCallbacks( function( res ){
                        _init_def.callback( res );
                     }, function( err ){
                        _init_def.errback( err );
                     });
                  }, 2000 );
                  return;
               }
               //Обработка ошибок .getPlugin()
               var ret_error;
               switch( err.type ){
                  case pluginManager.errorsType.USER_CANCELLED:
                     ret_error = newError( self.errorType.USER_CANCELLED, err.message );
                     break;
                  case pluginManager.errorsType.SILENT_MODE:
                     ret_error = newError( self.errorType.SILENT_MODE, err.message );
                     break;
                  case pluginManager.errorsType.INTERNAL_SERVER_ERROR:
                  case pluginManager.errorsType.INTERNAL_CLIENT_ERROR:
                     ret_error = newError( self.errorType.INTERNAL, err.message );
                     break;
                  default:
                     ret_error = newError( self.errorType.UNKNOWN, "Неизвестная ошибка при запуске плагина: " + err.message );
               }
               self.mInit = false;
               _init_def.errback( ret_error );
            });
            
            return _init_def;
         },
         
         //Функция определяет адрес OCSP-сервера улучшенной подписи
         _getAdvancedSignServerAdress : function(){
            var host = window.location.host;
            var prefix = host.substr( 0, host.indexOf( '-' ) );
            //Разбираем префикс сайта и в зависимости от него выбираем адрес OCSP-сервера
            switch( prefix ){
               case "dev":
                  return this.advancedSignServer.dev;
               case "test":
                  return this.advancedSignServer.test;
               case "fix":
                  return this.advancedSignServer.fix;
               default:
                  //Если это локальный стенд
                  if( host.indexOf('.') === -1 )
                     return this.advancedSignServer.dev;
                  //Во всех остальных случаях используем рабочий
                  return this.advancedSignServer.work;
            };
         },

         /**
         * Иногда может потребоваться открывать не стандартное сообщение об отсутствии криптопровайдера, а расширенное.
         * Эта функция устанавливает название используемого окна.
         * @param {String} windowName - Название окна
         * @returns {bool} - Удалось ли установить новое название окна
         */
         setCSPInstallationWindow : function( windowName ){
            if( $ws._const.xmlContents[windowName] ){
               this.windows.WINDOW_INSTALL_CSP = windowName;
               return true;
            }
            return false;
         },

         //Функция вызывается после открытия окна установки/обновления плагина либо установки СКЗИ. 
         //Как только плагин установится, запускаем его и возвращаем в инициирующую функцию
         _checkCSP : function( plugin, params ){
            var self = this;
            var check_def = new $ws.proto.Deferred();
            
            //Если не надо проверять наличие криптопровайдера
            if( !params.checkCSP )
               return check_def.callback();
            
            //Проверяем наличие установленного криптопровайдера
            plugin.GetProviderNames().addCallback( function( prov_names ){
               //при это если устновлен только Рутокен ЭЦП и у нас кастомное окно, то не сразу возвращаем callback
               if( prov_names && prov_names.length !== 0 && !( prov_names.length === 1 && jQuery.inArray( 'Рутокен ЭЦП', prov_names ) !== -1 && self.windows.WINDOW_INSTALL_CSP !== self.windows._WINDOW_DEFAULT_INSTALL_CSP ) )
                  return check_def.callback();
               //Провайдер не установлен
               //Придётся открывать окно установки, проверим, можем ли мы это сделать
               if( params.silentMode ){
                  if( prov_names.length === 0 )
                     return check_def.errback( newError( self.errorType.SILENT_MODE, "Не установлен криптопровайдер" ) );
                  else
                     return check_def.callback();
               }
               //Открываем окно
               var interval;
               //Если попадём в callback этого deferred'а, и резульат не true, то пользователь отказался от установки
               var window_def = new $ws.proto.Deferred();
               window_def.addCallback( function( res ){
                  if( res === true )
                     check_def.callback();
                  else
                     check_def.errback( newError( self.errorType.USER_CANCELLED, "Не установлен криптопровайдер" ) );
               });
               var inst_window = self.windows.WINDOW_INSTALL_CSP;
               var context = new $ws.proto.Context();
               context.setValue( "Deferred", window_def );
               context.setValue( "RTExists", jQuery.inArray( 'Рутокен ЭЦП', prov_names ) !== -1 );
               $ws.core.attachInstance( 'Control/Area:Dialog', { template: inst_window, context: context, opener: params.opener } );
               //Функция вызовется при успешной установке СКЗИ
               var successfullInstall = function( interval ){
                  clearInterval( interval );
                  if( !check_def.isReady() )
                     check_def.callback();
                  //Закроем окно установки, если его ещё не закрыли и если это окно по-умолчанию
                  if( $ws.single.ControlStorage.containsByName( inst_window ) && inst_window === self.windows._WINDOW_DEFAULT_INSTALL_CSP )
                     $ws.single.ControlStorage.getByName( inst_window ).destroy();
               };
               //Постоянно проверяем, не установился ли криптопровайдер
               interval = setInterval( function(){
                  plugin.GetProviderNames().addCallback( function( new_prov_names ){
                     if( new_prov_names.length !== 0 && !( new_prov_names.length === prov_names.length && new_prov_names.every( function(v,i){ return v === prov_names[i] } ) ) )
                        successfullInstall( interval );
                  });
               }, 1000 );
            }).addErrback( function( err ){
               check_def.errback( err );
            });
            return check_def;
         },
         
         _addFunctions : function(){
            if( this._plugin ){
               
               /**
               * Получить объект сертификата из двоичных данных
               * @param {String} data - Данные сертификата в base64
               * @returns {crypto::Certificate} - объект сертификата
               */
               this._plugin.GetCertificateFromData = function( data ){
                  return this.NewCertificate().addCallback( function( cert ){
                     return cert.Load( data ).addCallback( function( res ){
                        if( res )
                           return cert;
                        return new Error( "Не удалось загрузить сертификат из двоичных данных." );
                     }).addErrback( function( err ){
                        return err;
                     });
                  });
               };
               
               /**
               * Получить разобранный объект сертификата из двоичных данных
               * Метод сделан для удобной работы с реквизитами сертификата, т.к. все методы получения реквизитов сертификата из объекта - асинхронные.
               * @param {String} data - Данные сертификата в base64
               * @returns {Object} - Json-объект с полями-реквизитами сертификата
               */
               this._plugin.GetParsedCertificateFromData = function( data ){
                  return this.GetCertificateFromData( data ).addCallback( function( cert ){
                     return cert.Parse().addCallback( function( parsed_cert ){
                        parsed_cert.object = cert;
                        return parsed_cert;
                     });
                  }).addErrback( function( err ){
                     return err;
                  });
               };
               
               /**
               * Получить объект сертификата из контейнера
               * @param {String} cont_name - Имя контейнера их которого хочется загрузить сертификат
               * @returns {crypto::Certificate} - объект сертификата
               */
               this._plugin.GetCertificateFromContainer = function( cont_name ){
                  var self = this;
                  return this.NewCertificate().addCallback( function( cert ){
                     return self.LoadCertificateFromContainer( cont_name, cert ).addCallback( function(){
                           return cert;
                        return new Error( "Не удалось загрузить сертификат из контейнера." );
                     }).addErrback( function( err ){
                        return err;
                     });
                  });
               };
               
               /**
               * Получить разобранный объект сертификата из контейнера
               * Метод сделан для удобной работы с реквизитами сертификата, т.к. все методы получения реквизитов сертификата из объекта - асинхронные.
               * @param {String} cont_name - Имя контейнера их которого хочется загрузить сертификат
               * @returns {Object} - Json-объект с полями-реквизитами сертификата
               */
               this._plugin.GetParsedCertificateFromContainer = function( cont_name ){
                  var self = this;
                  return this.GetCertificateFromContainer( cont_name ).addCallback( function( cert ){
                     return cert.Parse().addCallback( function( parsed_cert ){
                        parsed_cert.object = cert;
                        parsed_cert.container_name = cont_name;
                        return parsed_cert;
                     });
                  }).addErrback( function( err ){
                     return err;
                  });
               };
               
               /**
               * Получить массив сертификатов клиента.
               * @param {bool} silent_mode - Показывать ли индикатор загрузки при вызове метода
               * @returns {Array} - Массив разобранных сертификатов клиента
               */
               this._plugin.GetCertificates = function( silent_mode ){
                  var def = new $ws.proto.Deferred(),
                      //Добавляем timestamp для индикатора загрузки( защита от вызова функции несколько раз параллельно )
                      ind_id = 'get_certificates_indic_' + ( +new Date() ),
                      loading_ind = null;
                   if( !silent_mode )
                      loading_ind = new loadingIndicator( { showInWindow : true, name: ind_id, message: "Поиск ключей электронной подписи..." } );
                  
                  this._GetCertificates().addCallback( function( certs_array ){
                     if( loading_ind ) loading_ind.close();
                     def.callback( certs_array );
                  }).addErrback( function( err ){
                     if( loading_ind ) loading_ind.close();
                     def.errback( err );
                  });
                  return def;
               };
               
               /**
               * Получить массив сертификатов клиента.
               * @param {bool} silent_mode - Показывать ли индикатор загрузки при вызове метода
               * @returns {Array} - Массив разобранных сертификатов клиента
               */
               this._plugin.GetCertificates_ = function( silent_mode ){
                  var def = new $ws.proto.Deferred(),
                      self = this,
                      //Добавляем timestamp для индикатора загрузки( защита от вызова функции несколько раз параллельно )
                      ind_id = 'get_certificates_indic_' + ( +new Date() ),
                      loading_ind = null;
                  
                  var showLoadingInd = function( message ){
                     if( !loading_ind )
                        loading_ind = new loadingIndicator( { showInWindow : true, name: ind_id } );
                     loading_ind.setMessage( message );
                  };
                  
                  var hideLoadingInd = function( message ){
                     if( loading_ind )
                        loading_ind.close();
                  };
                  
                  this.GetContainerNames().addCallback( function( cont_names ){
                     var pd = new $ws.proto.ParallelDeferred(),
                         parsed_certs_arr = [],
                         iterator = { quantity : cont_names.length, it : 0 };
                     var IncIndicator = function(){
                        iterator.it++;
                        if( !silent_mode )
                           showLoadingInd( "Поиск ключей электронной подписи: " + ( ( iterator.it/iterator.quantity * 100 ) ).toFixed() + "% завершено" );
                     };
                     for( var i = 0; i < cont_names.length; i++ ){
                        pd.push(
                           self.GetParsedCertificateFromContainer( cont_names[i] ).addCallback( function( curr_cert ){
                              parsed_certs_arr.push( curr_cert );
                              IncIndicator();
                           }).addErrback( function( err ){
                              //Не удалось загрузить сертификат из контейнера, ну ок.. счётчик контейнеров всё равно прибавим
                              IncIndicator();
                           })
                        );
                     }
                     pd.done().getResult().addCallback( function(){
                        hideLoadingInd();
                        def.callback( parsed_certs_arr );
                     }).addErrback( function( err ){
                        hideLoadingInd();
                        def.errback( err );
                     });
                  }).addErrback( function( err ){
                     def.errback( err );
                  });
                  return def;
               };
            }
         }
      }
   })();
   
   return cryptoPlugin;
}); 

