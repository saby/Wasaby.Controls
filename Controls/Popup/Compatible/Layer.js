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
   'Core/IoC',
   'WS.Data/Source/SbisService',
   'WS.Data/Chain'
], function(Deferred, ParallelDeferred, Constants, RightsManager, ExtensionsManager, moduleStubs, IoC, SbisService, Chain) {
   'use strict';

   var loadDeferred;
   var jQueryModuleName = 'is!browser?jquery';
   var compatibleDeps = [
      'Core/Control',
      'Lib/Control/Control.compatible',
      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible',
      'Lib/StickyHeader/StickyHeaderMediator/StickyHeaderMediator',
      'View/Executor/GeneratorCompatible',
      'Core/nativeExtensions',

      //так как для VDOM страниц была отделена минимизированная тема онлайна, то необходимо подгружать полную тему
      //для того чтобы корректно работали стили, которые используют прикладные программисты в старых окнах
      'css!SBIS3.CONTROLS/themes/online/online'
   ];
   var defaultLicense = {
      defaultLicense: true
   };

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
      if (!opt) {
         if (window.userInfo) {
            data = window.userInfo;
         }
      } else {
         moduleStubs.require(['EngineUser/Info']).addCallbacks(function(modules) {
            data = modules[0].getAll();
         }, function(err) {
            IoC.resolve('ILogger').error('Layer', 'Can\'t load EngineUser/Info', err);
         });
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
      isNewEnvironment: function() {
         return !!(document && document.getElementsByTagName('html')[0].controlNodes);
      },
      loadActivity: function(parallelDefRes, loadDepsDef, result) {
         parallelDefRes.addCallbacks(function() {
            finishLoad(loadDeferred, result);
         }, function(e) {
            IoC.resolve('ILogger').error('Layer', 'Can\'t load data providers', e);
            loadDepsDef.addCallback(function() {
               finishLoad(loadDeferred, result);
            });
         });
      },
      load: function(deps, force) {
         if (!this.isNewEnvironment() && !force) { // Для старого окружения не грузим слои совместимости
            return (new Deferred()).callback();
         }
         if (!loadDeferred) {
            var mainDeferred;
            var loadDepsDef = new Deferred();
            var self = this;
            loadDeferred = new Deferred();

            /*Если jQuery есть, то не будем его перебивать. В старом функционале могли подтянуться плагины
            * например, autosize*/
            if (window && window.jQuery) {
               compatibleDeps.splice(0, 1);

               // также не будем загружать jQuery отдельно, до загрузки остальных зависимостей,
               // так как он уже есть на странице
               jQueryModuleName = '';
            }

            deps = (deps || []).concat(compatibleDeps);

            var parallelDef = new ParallelDeferred(),
               result;

            // Сначала отдельно загрузим jQuery, чтобы можно было безопасно загружать другие модули,
            // которые могут ее использовать
            //load jquery if it was not loaded
            if (window && window.$ && window.$.fn && window.$.fn.jquery === '3.3.1') {
               mainDeferred = new Deferred();
               mainDeferred.callback();
            } else {
               mainDeferred = moduleStubs.require([jQueryModuleName]);
            }

            mainDeferred.addCallback(function loadDeps() {
               moduleStubs.require(deps).addCallback(function(_result) {
                  if (window && window.$) {
                     Constants.$win = $(window);
                     Constants.$doc = $(document);
                     Constants.$body = $('body');
                  }

                  // constants.compat = tempCompatVal; //TODO выпилить
                  if (window) {
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
                  }
                  result = _result;
                  loadDepsDef.callback(result);
               }).addErrback(function(e) {
                  IoC.resolve('ILogger').error('Layer', 'Can\'t load dependencies', e);
                  loadDepsDef.errback(e);
               });
            });

            parallelDef.push(loadDepsDef);
            var parallelDefRes = parallelDef.done().getResult();

            // var tempCompatVal = constants.compat;
            Constants.compat = true;

            // для тестов и демок не нужно грузить ни дата провайдеры, ни активность
            if (window && window.contents && window.contents.modules && window.contents.modules.OnlineSbisRu) {
               Constants.systemExtensions = true;
               Constants.userConfigSupport = true;
               loadDataProviders(parallelDef);
               parallelDefRes.addCallbacks(function() {
                  moduleStubs.require(['optional!WS3MiniCard/MiniCard']).addCallback(function() {
                     self.loadActivity(parallelDefRes, loadDepsDef, result);
                  }).addErrback(function(err) {
                     IoC.resolve('ILogger').error('Layer', 'Can\'t load UserActivity', err);
                     self.loadActivity(parallelDefRes, loadDepsDef, result);
                  });
               }, function(err) {
                  IoC.resolve('ILogger').error('Layer', 'Can\'t load ' + JSON.stringify(deps), err);
                  moduleStubs.require(['optional!WS3MiniCard/MiniCard']).addCallback(function() {
                     self.loadActivity(parallelDefRes, loadDepsDef, result);
                  }).addErrback(function(activityErr) {
                     IoC.resolve('ILogger').error('Layer', 'Can\'t load UserActivity', activityErr);
                     self.loadActivity(parallelDefRes, loadDepsDef, result);
                  });
               });
            } else {
               parallelDefRes.addCallbacks(function() {
                  self.loadActivity(parallelDefRes, loadDepsDef, result);
               }, function(err) {
                  IoC.resolve('ILogger').error('Layer', 'Can\'t load ' + JSON.stringify(deps), err);
                  self.loadActivity(parallelDefRes, loadDepsDef, result);
               });
            }
         }

         // возвращаем свой Deferred на каждый запрос, чтобы никто не мог
         // испортить результат loadDeferred
         return loadDeferred.createDependent();
      }
   };
});
