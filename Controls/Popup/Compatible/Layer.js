/**
 * Created by as.krasilnikov on 14.05.2018.
 */
define('Controls/Popup/Compatible/Layer', [
   'Core/Deferred',
   'Core/ParallelDeferred',
   'Core/constants',
   'Core/RightsManager',
   'Core/ExtensionsManager',
   'Core/moduleStubs',
   'View/Runner/requireHelper',
   'Core/IoC',
   'WS.Data/Source/SbisService',
   'WS.Data/Chain'
], function(Deferred, ParallelDeferred, Constants, RightsManager, ExtensionsManager, moduleStubs, requireHelper, IoC, SbisService, Chain) {
   'use strict';

   var loadDeferred;
   var compatibleDeps = [
      'cdn!jquery/3.3.1/jquery-min.js',
      'Core/Control',
      'Lib/Control/Control.compatible',
      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible',
      'Lib/StickyHeader/StickyHeaderMediator/StickyHeaderMediator',
      'View/Runner/Text/markupGeneratorCompatible',
      'Core/nativeExtensions'
   ];
   var defaultLicense = {
      defaultLicense: true
   };

   function isNewEnvironment() {
      return !!document.getElementsByTagName('html')[0].controlNodes;
   }

   function loadDataProviders(parallelDef) {
      parallelDef.push(ExtensionsManager.loadExtensions().addErrback(function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load system extensions', err);
         return err;
      }));

      parallelDef.push(RightsManager.readUserRights().addCallbacks(function(rights) {
         // возможно можно уже удалить, это совместимость со старым форматом прав. на препроцессоре не удалено, решил скопировать и сюда
         if (rights) {
            Object.keys(rights).forEach(function(id) {
               var right = rights[id];
               if (right) {
                  if (typeof right === 'number') {
                     rights[id] = right;
                  } else if (right.flags) {
                     // Копируем, если доступ > 0
                     if (right.restrictions) {
                        // Если новый формат, копируем объект целиком
                        rights[id] = right;
                     } else {
                        // Если старый формат, копируем только число-флаг
                        rights[id] = right.flags;
                     }
                  }
               }
            });
         }
         Constants.rights = true;
         window.rights = rights || {};
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load user rights', err);
      }));

      // parallelDef.push(viewSettingsData().addCallbacks(function(viewSettings) {
      //    window.viewSettings = viewSettings || {};
      // }, function(err) {
      //    IoC.resolve('ILogger').error('Layer', 'Can\'t load view settings', err);
      // }));

      parallelDef.push(userInfo().addCallback(function(userInfo) {
         window && (window.userInfo = userInfo);
      }));

      parallelDef.push(getUserLicense().addCallbacks(function(userLicense) {
         window.userLicense = userLicense || defaultLicense;
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load user license', err);
      }));

      // globalClientConfig
      // параметры пользователськие, клиенстские, глобальные. причем они в session или localStorage могут быть
      // параметры нужно положить в контекст (белый список)
      // parallelDef.push(readGlobalClientConfig().addCallbacks(function(globalClientConfig) {
      //    window.globalClientConfig = globalClientConfig || {};
      // }, function(err) {
      //    IoC.resolve('ILogger').error('Layer', 'Can\'t load global client config', err);
      // }));

      // cachedMethods
      window.cachedMethods = [];

      // product
      window.product = 'продукт никому не нужен?';

      // активность???
   }

   // function viewSettingsData() {
   //    var
   //       dResult = new Deferred(),
   //       viewSettings = {};
   //
   //    moduleStubs.require(['OnlineSbisRu/ViewSettings/Util/ViewSettingsData']).addCallback(function(mods) {
   //       mods[0].getData(null, true).addCallback(function(data) {
   //          viewSettings = data;
   //          dResult.callback(viewSettings);
   //       }).addErrback(function() {
   //          dResult.callback(viewSettings);
   //       });
   //    }).addErrback(function() {
   //       dResult.callback(viewSettings);
   //    });
   //    return dResult;
   // }

   function userInfo() {
      var
         userSource = new SbisService({
            endpoint: 'Пользователь'
         }),
         profileSource = new SbisService({
            endpoint: 'СервисПрофилей'
         }),
         data = {};

      // Получение данных из контекста

      var opt = document.querySelector('html').controlNodes;

      for (var i = 0, len = opt.length; i < len; i++) {
         if (opt[i].control._getChildContext && opt[i].control._getChildContext().userInfoField) {
            data = opt[i].control._getChildContext().userInfoField.userInfo;
            break;
         }
      }

      return expandUserInfo(data);

      function expandUserInfo(data) {
         var deferred;

         data.isDemo = data['ВыводимоеИмя'] === 'Демо-версия';
         data.isPersonalAccount = data['КлассПользователя'] === '__сбис__физики';

         if (data['КлассПользователя'] === '__сбис__физики') {
            deferred = profileSource.call('ЕстьЛиУМеняАккаунтПомимоФизика').addCallback(function(res) {
               data.hasMoreAccounts = res.getScalar();
               return data;
            });
         } else {
            deferred = Deferred.success(data);
         }

         return deferred;
      }
   }

   function getUserLicense() {
      var def = new Deferred();

      new SbisService({ endpoint: 'Биллинг' }).call('ДанныеЛицензии', {}).addCallbacks(function(record) {
         if (record && record.getRow().get('ПараметрыЛицензии')) {
            var data = Chain(record.getRow().get('ПараметрыЛицензии')).toObject();
            def.callback(data);
         } else {
            def.callback(defaultLicense);
         }
      }, function(err) {
         def.errback(err);
      });

      return def;
   }

   // function readGlobalClientConfig() {
   //    var def = new Deferred();
   //
   //    var gcc = {};
   //    new SbisService({endpoint: 'ГлобальныеПараметрыКлиента'}).call('ПолучитьПараметры', {}).addCallbacks(function(rs) {
   //       rs = rs.getAll();
   //       rs.forEach(function(r) {
   //          gcc[r.get('Название')] = r.get('Значение');
   //       });
   //       def.callback(gcc);
   //    }, function(err) {
   //       def.errback(err);
   //    });
   //
   //    return def;
   // }

   function finishLoad(loadDeferred, result) {
      var coreControl = require('Core/Control'),
         controlCompatible = require('Lib/Control/Control.compatible');
      moduleStubs.require(['Core/core-extensions', 'cdn!jquery-cookie/04-04-2014/jquery-cookie-min.js']).addCallbacks(function() {
         // частично поддерживаем старое API. поддержка gedId
         coreControl.prototype._isCorrectContainer = controlCompatible._isCorrectContainer;
         coreControl.prototype.getId = controlCompatible.getId;

         loadDeferred.callback(result);
      }, function(e) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load core extensions', e);

         // частично поддерживаем старое API. поддержка gedId
         coreControl.prototype._isCorrectContainer = controlCompatible._isCorrectContainer;
         coreControl.prototype.getId = controlCompatible.getId;

         loadDeferred.callback(result);
      });
   }

   return {
      load: function(deps, force) {
         if (!isNewEnvironment() && !force) { // Для старого окружения не грузим слои совместимости
            return (new Deferred()).callback();
         }
         if (!loadDeferred) {
            loadDeferred = new Deferred();

            /*Если jQuery есть, то не будем его перебивать. В старом функционале могли подтянуться плагины
            * например, autosize*/
            if (window.jQuery) {
               compatibleDeps.splice(0, 1);
            }

            deps = (deps || []).concat(compatibleDeps);

            var parallelDef = new ParallelDeferred(),
               result;

            var loadDepsDef = moduleStubs.require(deps).addCallback(function(_result) {
               if (window && window.$) {
                  Constants.$win = $(window);
                  Constants.$doc = $(document);
                  Constants.$body = $('body');
               }

               // constants.compat = tempCompatVal; //TODO выпилить
               (function($) {
                  $.fn.wsControl = function() {
                     var control = null,
                        element;
                     try {
                        element = this[0];
                        while (element) {
                           if (element.wsControl) {
                              control = element.wsControl;
                              break;
                           }
                           element = element.parentNode;
                        }
                     } catch (e) {
                     }
                     return control;
                  };
               })(jQuery);

               result = _result;
            }).addErrback(function(e) {
               IoC.resolve('ILogger').error('Layer', 'Can\'t load dependencies', e);
            });
            parallelDef.push(loadDepsDef);
            var parallelDefRes = parallelDef.done().getResult();

            // var tempCompatVal = constants.compat;
            Constants.compat = true;

            if (typeof window !== 'undefined') {
               // для тестов и демок не нужно грузить ни дата провайдеры, ни активность
               if (requireHelper.defined('OnlineSbisRu/VDOM/MainPage/MainPage')) {
                  Constants.systemExtensions = true;
                  Constants.userConfigSupport = true;
                  loadDataProviders(parallelDef);
                  parallelDefRes.addCallbacks(function() {
                     moduleStubs.require(['UserActivity/ActivityMonitor', 'UserActivity/UserStatusInitializer', 'optional!SBIS3.ENGINE/Controls/MiniCard']).addErrback(function(err) {
                        IoC.resolve('ILogger').error('Layer', 'Can\'t load UserActivity', err);
                     });
                  }, function() {
                     moduleStubs.require(['UserActivity/ActivityMonitor', 'UserActivity/UserStatusInitializer', 'optional!SBIS3.ENGINE/Controls/MiniCard']).addErrback(function(err) {
                        IoC.resolve('ILogger').error('Layer', 'Can\'t load UserActivity', err);
                     });
                  });
               }
            }
            parallelDefRes.addCallbacks(function() {
               finishLoad(loadDeferred, result);
            }, function(e) {
               IoC.resolve('ILogger').error('Layer', 'Can\'t load data providers', e);
               loadDepsDef.addCallback(function() {
                  finishLoad(loadDeferred, result);
               });
            });

            return loadDeferred;
         }
         var fakeDeferred = new Deferred();

         //Если из колбэка основного дефереда вернули другой деферед, то после того, как основной деферед получит статус
         //isReady = true, он проигнорирует все колбэки, которые навешены после завершения.
         if (loadDeferred.isReady()) {
            fakeDeferred.callback();
         } else {
            loadDeferred.addCallback(function() {
               fakeDeferred.callback();
            });
         }
         return fakeDeferred;
      }
   };
});
