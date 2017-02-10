define('js!SBIS3.CONTROLS.Action.SelectorAction', [
       'js!SBIS3.CONTROLS.Action.Action',
       'js!SBIS3.CONTROLS.Action.DialogMixin',
       'js!SBIS3.CONTROLS.Utils.IndicatorUtil',
      'js!SBIS3.CONTROLS.Utils.Query',
       'Core/core-merge',
       'Core/Deferred'
    ],
    function (Action, DialogMixin, IndicatorUtil, Query, cMerge, Deferred) {
       'use strict';
       /**
       * Класс, который описывает действие открытия окна с заданным шаблоном. Из этого окна можно осуществлять выбор.
       * @class SBIS3.CONTROLS.Action.SelectorAction
       * @public
       * @extends SBIS3.CONTROLS.Action.Action
       * @mixes SBIS3.CONTROLS.Action.DialogMixin
       *
       * @demo SBIS3.CONTROLS.Demo.DemoSelectorAction
       *
       * @author Герасимов Александр Максимович
       */
       var SelectorAction = Action.extend([DialogMixin], /** @lends SBIS3.CONTROLS.Action.SelectorAction.prototype */{
          _buildComponentConfig: function(metaConfig) {
             var cfg = SelectorAction.superclass._buildComponentConfig.call(this, metaConfig);

             function onSelectComplete(event, meta) {
                this.sendCommand('close', meta);
             }

             cMerge(cfg, {
                selectedItems: metaConfig.selectedItems,
                multiselect: metaConfig.multiselect,
                selectionType: metaConfig.selectionType
             });

             if(cfg.handlers) {
                if (cfg.handlers.onSelectComplete) {
                   cfg.handlers.onSelectComplete = [cfg.handlers.onSelectComplete, onSelectComplete];
                } else {
                   cfg.handlers.onSelectComplete = onSelectComplete;
                }
             } else {
                cfg.handlers = {
                   onSelectComplete: onSelectComplete
                }
             }

             return cfg;
          },

          _createComponent: function(config, meta, mode) {
             var self = this,
                 initializingDeferred;


             if(config.dataSource) {
                IndicatorUtil.showLoadingIndicator();
                initializingDeferred = Query(config.dataSource, [config.queryFilter])
                   .addCallback(function(dataSet) {
                      return dataSet.getAll();
                   })
                   .addErrback(function(err) {
                      //Помечаем ошибку обработанной, чтобы остальные подписанты на errback не показывали свой алерт
                      error.processed = true;
                      require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager'], function(InformationPopupManager){
                         InformationPopupManager.showMessageDialog({
                            message: error.message,
                            status: 'error'
                         });
                      });
                      return err;
                   })
                   .addBoth(function() {
                      IndicatorUtil.hideLoadingIndicator();
                   });
             } else {
                initializingDeferred = Deferred.success(config.componentOptions.items || []);
             }

             $ws.require(config.template).addCallback(function(res) {
                initializingDeferred.addCallback(function(items) {
                   config.componentOptions.items = items;
                   SelectorAction.superclass._createComponent.call(self, config, meta, mode);
                   return items;
                });
                return res;
             });
          }
       });
       return SelectorAction;
    });