/**
 * Created by as.krasilnikov on 14.05.2018.
 */
define('Controls/Popup/Compatible/Layer', [
   'Core/Deferred',
   'Core/ParallelDeferred',
   'Core/constants',
   'Core/RightsManager',
   'Core/ExtensionsManager',
   'WS.Data/Chain',
   'Core/moduleStubs',
   'Core/IoC',
   'WS.Data/Source/SbisService',
   'cdn!jquery/3.3.1/jquery-min.js'
], function(Deferred, ParallelDeferred, Constants, RightsManager, ExtensionsManager, Chain, moduleStubs, IoC, SbisService) {
   'use strict';

   var loadDeferred;
   var compatibleDeps = [
      'Lib/Control/Control.compatible',
      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible',
      'View/Runner/Text/markupGeneratorCompatible',
      'cdn!jquery-cookie/04-04-2014/jquery-cookie-min.js',
      'Core/nativeExtensions'
   ];
   var defaultLicense = {
      defaultLicense: true
   };

   function isNewEnvironment() {
      return !!document.getElementsByTagName('html')[0].controlNodes;
   }

   function loadDataProviders() {
      var def = new Deferred();

      var parallelDef = new ParallelDeferred();

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

      parallelDef.push(viewSettingsData().addCallbacks(function(viewSettings) {
         window.viewSettings = viewSettings || {};
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load view settings', err);
      }));

      parallelDef.push(new SbisService({
         endpoint: 'Пользователь'}).call('GetCurrentUserInfo', {}).addCallbacks(function(userInfo) {
         window.userInfo = Chain(userInfo.getRow()).toObject() || {};
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load user info', err);
      }));

      parallelDef.push(getUserLicense().addCallbacks(function(userLicense) {
         window.userLicense = userLicense || defaultLicense;
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load user license', err);
      }));

      //globalClientConfig
      // параметры пользователськие, клиенстские, глобальные. причем они в session или localStorage могут быть
      // параметры нужно положить в контекст (белый список)
      parallelDef.push(readGlobalClientConfig().addCallbacks(function(globalClientConfig) {
         window.globalClientConfig = globalClientConfig || {};
      }, function(err) {
         IoC.resolve('ILogger').error('Layer', 'Can\'t load global client config', err);
      }));

      //cachedMethods
      window.cachedMethods = [];

      //product
      window.product = 'продукт никому не нужен?';

      //активность???

      def.dependOn(parallelDef.done().getResult());

      return def;
   }

   function viewSettingsData() {
      var
         dResult = new Deferred(),
         viewSettings = {};

      moduleStubs.require(['OnlineSbisRu/ViewSettings/Util/ViewSettingsData']).addCallback(function(mods) {
         mods[0].getData(null, true).addCallback(function(data) {
            viewSettings = data;
            moduleStubs.require(['Core/core-extensions']).addCallback(function() {
               dResult.callback(viewSettings);
            });
         }).addErrback(function() {
            moduleStubs.require(['Core/core-extensions']).addCallback(function() {
               dResult.callback(viewSettings);
            });
         });
      }).addErrback(function() {
         dResult.callback(viewSettings);
      });
      return dResult;
   }

   function getUserLicense() {
      var def = new Deferred();

      new SbisService({endpoint: 'Биллинг'}).call('ДанныеЛицензии', {}).addCallbacks(function(record) {
         if (record && record.getRow().get('ПараметрыЛицензии')) {
            var data = record.getRow().get('ПараметрыЛицензии').toObject();
            def.callback(data);
         } else {
            def.callback(defaultLicense);
         }
      }, function(err) {
         def.errback(err);
      });

      return def;
   }

   function readGlobalClientConfig() {
      var def = new Deferred();

      var gcc = {};
      new SbisService({endpoint: 'ГлобальныеПараметрыКлиента'}).call('ПолучитьПараметры', {}).addCallbacks(function(rs) {
         rs = rs.getAll();
         rs.forEach(function(r) {
            gcc[r.get('Название')] = r.get('Значение');
         });
         def.callback(gcc);
      }, function(err) {
         def.errback(err);
      });

      return def;
   }

   return {
      load: function(deps) {
         if (!isNewEnvironment()) { //Для старого окружения не грузим слои совместимости
            return (new Deferred()).callback();
         }
         if (!loadDeferred) {
            loadDeferred = new Deferred();

            if (window && window.$) {
               Constants.$win = $(window);
               Constants.$doc = $(document);
               Constants.$body = $('body');
            }

            deps = (deps || []).concat(compatibleDeps);

            moduleStubs.require(deps).addCallback(function(result) {
               // var tempCompatVal = constants.compat;
               Constants.compat = true;
               Constants.systemExtensions = true;
               Constants.userConfigSupport = true;

               if (typeof window !== 'undefined') {
                  loadDataProviders().addCallbacks(function() {
                     loadDeferred.callback(result);
                  }, function(e) {
                     IoC.resolve('ILogger').error('Layer', 'Can\'t load data providers', e);
                     loadDeferred.callback(result);
                  });
               } else {
                  loadDeferred.callback(result);
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
            });
         }
         return loadDeferred;
      }
   };
});
