define( "js!SBIS3.CRYPTO.PluginOld",
[ "js!SBIS3.CORE.Dialog" ],
function( dialog ){
   
   var cryptoPlugin = (function(){
      var activeXPresent = false;
      try{ ActiveXObject; activeXPresent = true; } catch(e){};
      var
         isPlatformWinx64 = ( navigator.platform === "Win64" ),
         isBrowserMozilla = jQuery.browser.mozilla && !activeXPresent ? true : false,
         currVersion = "1.0.9.2",
         msi = "https://crypto.sbis.ru/CryptoPlugin/SbisCryptoPlugin-setup(" + currVersion + ").msi",
         mimeType = "application/x-sbiscryptoplugin" + ( isPlatformWinx64 ? "-x64" : "" ),
         ActiveXName = "Tensor.SbisCryptoPlugin" + ( isPlatformWinx64 ? "_x64" : "" ),
         NPAPIName = "SbisCryptoPlugin",
         tagId = "sbis-crypto-plugin";
      
      return {
         //Список окон
         windows : {
            WINDOW_INSTALL_CSP : "CryptoPluginInstallCSP",
            WINDOW_BAD_SYSTEM : "CryptoPluginBadSystem",
            _WINDOW_DEFAULT_INSTALL_CSP : "CryptoPluginInstallCSP",
            _WINDOW_UPDATE_PLUGIN : "CryptoPluginUpdatePlugin",
            _WINDOW_INSTALL_PLUGIN : "CryptoPluginInstallPlugin"
         },
         //Возможные ошибки
         errors : {
            ERROR_CSP : "Не установлен криптопровайдер",
            ERROR_BAD_SYSTEM : "Данная система не поддерживается",
            ERROR_USER_CANCELLED : "Действие отменено пользователем",
            ERROR_SILENT_MODE : "Невозможен запуск в 'тихом' режиме",
            ERROR_CRASH : "PLUGIN_CRASHED",
            _ERROR_INSTALL : "Установите плагин криптографии",
            _ERROR_UPDATE : "Обновите плагин криптографии"
         },
         //Минимальная версия плагина, с которой мы можем работать
         currVersion : currVersion,
         //Тэг HTML, который добавляется на страницу
         htmlObject : '<object id="' + tagId + '" type="' + mimeType + '" style="height: 0px; width: 0px;position: absolute;" ><param name="onload" value="pluginLoaded" /></object>',
         msiInstaller : msi,
         useActiveX : activeXPresent,
         _needSpecialSettings : isBrowserMozilla,
         _tagId : tagId,
         _mimeType : mimeType,
         _ActiveXName : ActiveXName,
         _NPAPIName : NPAPIName,
         //Версии системы, с которыми работает плагин
         _supportedOS : ["Win32", "Win64"],
         //Объект плагина
         _plugin : null,

         /**
         ** Инициализация плагина
         ** Если флаг проверки криптопровайдера( checkCSP ) установлен в false, то проверка не проводится.
         ** По-умолчанию проверка будет сделана
         ** Если установлен флаг runOnce, то после первой отмены действия пользователем ему перестанут показываться окна с установкой
         ** silentMode - попытаться запустить плагин без показа окон интерфейса.
         **/
         init : function( params ){
            var def = new $ws.proto.Deferred();
            var self = this;
            //Если не пришло ни одного параметра, то проставим проверку на криптопровайдер по-умолчанию
            if( !params )
               params = { checkCSP : true };
            params.checkCSP = params.checkCSP === false ? false : true;
            
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            //TODO убрать костыль: знаем о каком-то левом окне, которое находится в прикладном коде
            //Это знание позволяет нам скрыть от прикладного кода выбор окна установки СКЗИ
            //Если у нас есть расширенное окно установки СКЗИ, то будем открывать его
            this.setCSPInstallationWindow( "ПоискИУстановкаСКЗИ" );
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            var waitingFunc = function( err_str, plugin ){
               if( params.silentMode ){
                  def.errback( self.errors.ERROR_SILENT_MODE );
                  return;
               }
               if( !params.runOnce || $ws.single.MicroSession.get( self._mimeType ) !== "disabled" ){
                  var err_wind = self._getWindowByError( err_str );
                  if( err_wind ){
                     //Если мы попали в колбэк следующей функции, то пользователь отказался от установки
                     self._openWindowOnError( err_wind ).addCallback( function(){
                        def.errback( self.errors.ERROR_USER_CANCELLED );
                        $ws.single.MicroSession.set( self._mimeType, "disabled" );
                     });
                  }
                  self._waitingForStart( err_str, plugin ).addCallback( function( plugin ){ def.callback( plugin ) } );
               }
               else
                  def.errback( self.errors.ERROR_USER_CANCELLED );
            };
            this._run().addCallback( function( plugin ){
               //Проверим, если нужно, установлен ли криптопровайдер
               if( params.checkCSP && !self._isCSPInstalled( plugin ) ){
                    waitingFunc( self.errors.ERROR_CSP, plugin );
                    return;
               }
               def.callback( plugin );
            }).addErrback( function( err ){
               //Если плагин не умер, то ожидаем его установки
               if( err.message !== self.errors.ERROR_CRASH )
                  waitingFunc( err.message );
               else
                  waitingFunc();
            });
            return def;
         },

         /**
         ** Проверка, может ли плагин запуститься на текущей системе
         **/
         canRunHere : function(){
            return jQuery.inArray( navigator.platform, this._supportedOS ) >= 0 ? true : false;
         },
         
         /**
         ** Функция получения версии плагина.
         ** Если плагин ранее не устанавливался, то вернётся пустая строка
         **/
         getInstalledVersion : function(){
            //Проверим, в каком браузере мы работаем, если работаем в IE, то придеётся работать с ActiveX-оболочкой нашего плагина
            if( !this.useActiveX ){
               //Проверим, утанавливался ли ранее плагин. Для этого сначала обновим массив существующих плагинов
               navigator.plugins.refresh();
               if( navigator.plugins[ this._NPAPIName ] ){
                  var plugin_description = navigator.plugins[ this._NPAPIName ].filename;
                  //Проверим версию. Она хранится в имени файла в скобках
                  return plugin_description.substring( plugin_description.indexOf( "(" ) + 1 , plugin_description.indexOf( ")" ) );
               }
               return "";
            }
            else{
               //Попробуем создать ActiveX-плагин
               var plugin;
               try{
                  plugin = new ActiveXObject( this._ActiveXName );
               }
               catch(e){
                  return "";
               }
               return plugin.Version();
            }
         },
         
         /**
         ** Иногда может потребоваться открывать не стандартное сообщение об отсутствии криптопровайдера, а расширенное.
         ** Эта функция устанавливает название используемого окна.
         **/
         setCSPInstallationWindow : function( windowName ){
            if( $ws._const.xmlContents[windowName] ){
               this.windows.WINDOW_INSTALL_CSP = windowName;
               return true;
            }
            return false;
         },

         //Запуск плагина
         _run : function(){
            var def = new $ws.proto.Deferred();
            //Проверим, не был ли добавлен плагин на страницу ранее.
            if( !this._plugin ){
               //Проверка: можем ли мы вообще запускать плагин на данной системе
               if( !this.canRunHere() )
                  return def.errback( this.errors.ERROR_BAD_SYSTEM );
               //Можем: запустим
               var inst_version = this.getInstalledVersion();
               if( !inst_version )
                  return def.errback( this.errors._ERROR_INSTALL );
               //Если плагин устанавливался, то сравним версии: текущую и установленную
               if( inst_version < this.currVersion )
                  return def.errback( this.errors._ERROR_UPDATE );
               //Если версии совпали, то всё хорошо: добавляем объект плагина
               this._addToWindow();
               //Проверим, а не закрэшился ли плагин при запуске( проверим метод CreateObject )
               if( !( "CreateObject" in this._plugin ) || !this._plugin.CreateObject ){
                  this._plugin = null;
                  return def.errback( this.errors.ERROR_CRASH );
               }
               //Mozilla Firefox требует дополнительной настройки перед запуском плагина
               if( this._needSpecialSettings ){
                  if( jQuery.cookie( this._mimeType + "_need_to_restart_browser" ) === "true" || this._plugin._PrepareSomeBrowsersToWorkWithPlugin() ){
                     $ws.core.alert( "Для корректной работы плагина криптографии просьба закрыть все вкладки и перезапустить браузер." );
                     $.cookie( this._mimeType + "_need_to_restart_browser", "true" );
                     this._plugin = null;
                     return def.errback( this.errors.ERROR_CRASH );
                  }
               }
               var host = window.location.host;
               var prefix = host.substr( 0, host.indexOf( '-' ) ),
                   advancedSignServer = "",
                   devAdvancedSignServer = "https://dev-cvs.tensor.ru/service/sbis-rpc-service300.dll",
                   testAdvancedSignServer = "https://test-cvs.tensor.ru/service/sbis-rpc-service300.dll",
                   fixAdvancedSignServer = "https://fix-cvs.tensor.ru/service/sbis-rpc-service300.dll",
                   workAdvancedSignServer = "http://cvs.sbis.ru/service/sbis-rpc-service300.dll";
               //Разбираем префикс сайта и в зависимости от него устанавливаем адрес OCSP-сервера
               switch( prefix ){
                  case "dev":
                     advancedSignServer = devAdvancedSignServer;
                     break;
                  case "test":
                     advancedSignServer = testAdvancedSignServer;
                     break;
                  case "fix":
                     advancedSignServer = fixAdvancedSignServer;
                     break;
                  default:
                     //Если это локальный стенд
                     if( host.indexOf('.') === -1 )
                        advancedSignServer = devAdvancedSignServer;
                     //Во всех остальных случаях используем рабочий
                     else
                        advancedSignServer = workAdvancedSignServer;
               };
               this._plugin.Configurate( advancedSignServer );
            }
            //Если плагин был добавлен ранее, то просто вернём его
            return def.callback( this._plugin );
         },

         //Добавляет HTML-объект плагина на страницу
         _addToWindow : function(){
            jQuery('body').append( this.htmlObject );
            this._plugin = document.getElementById( this._tagId );
         },

         //Функция проверяет, установлен ли на данный момент ГОСТ-криптопровайдер
         _isCSPInstalled : function( plugin ){
            return plugin.CreateObject( "Provider" ).IsInstalled();
         },

         //Функция вызывается после открытия окна установки/обновления плагина либо установки СКЗИ. 
         //Как только плагин установится, запускаем его и возвращаем в инициирующую функцию
         _waitingForStart : function( error, plugin ){
            var self = this;
            var def = new $ws.proto.Deferred();
            //Очищаем интервал и возвращаем плагин
            var successfullStart = function( plug, interval ){
               clearInterval( interval );
               def.callback( plug );
               if( error ){
                  //Закроем окно установки, если его ещё не закрыли
                  var inst_window = self._getWindowByError( error );
                  if( $ws.single.ControlStorage.containsByName( inst_window ) )
                     $ws.single.ControlStorage.getByName( inst_window ).destroy();
               }
            };
            //Если пришёл плагин, то ожидаем установки СКЗИ
            if( plugin ){
               var interval = setInterval( function(){
                  if( self._isCSPInstalled( plugin ) )
                     successfullStart( plugin, interval );
               }, 1000 );
            }
            else{
               //Каждую секунду пытаемся подцепить плагин
               var interval = setInterval( function(){
                  //Если получилось запустить плагин, то продолжим с того же места, где остановились
                  self._run().addCallback( function( started_plug ){
                     successfullStart( started_plug, interval );
                  }).addErrback( function( err ){
                     //А плагин, даже если умер, то не факт, что он умер.. вероятнее всего, что Chrome спрашивает разрешение на запуск плагина...
                     //Если плагин умер, то больше не пытаемся его запустить
                     //if( err.message === self.errors.ERROR_CRASH )
                     //   clearInterval( interval );
                  });
               }, 1000 );
            }
            return def;
         },

         //Функция открытия окон оповещения в зависимости от ошибки
         _openWindowOnError : function( wind ){
            var window_def = new $ws.proto.Deferred();
            //Открываем окно, соответствующее ошибке
            var context = new $ws.proto.Context();
            context.setValue( "Deferred", window_def );
            $ws.core.attachInstance( 'Control/Area:Dialog', {
               template: wind,
               context: context
            });
            return window_def;
         },

         //Функция получения названия окна по ошибке
         _getWindowByError : function( error ){
            switch( error ){
               case this.errors._ERROR_INSTALL:
                  return this.windows._WINDOW_INSTALL_PLUGIN;
               case this.errors._ERROR_UPDATE:
                  return this.windows._WINDOW_UPDATE_PLUGIN;
               case this.errors.ERROR_CSP:
                  return this.windows.WINDOW_INSTALL_CSP;
               case this.errors.ERROR_BAD_SYSTEM:
                  return this.windows.WINDOW_BAD_SYSTEM;
            }
         }
      }
   })();
   
   return cryptoPlugin;
}); 

