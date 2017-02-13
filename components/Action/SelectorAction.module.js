define('js!SBIS3.CONTROLS.Action.SelectorAction',
   [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.DialogMixin',
      'js!SBIS3.CONTROLS.Utils.IndicatorUtil',
      'js!SBIS3.CONTROLS.Utils.Query',
      'Core/core-merge',
      'Core/Deferred',
      'Core/Context'
   ],
    function (Action, DialogMixin, IndicatorUtil, Query, cMerge, Deferred, Context) {
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
                 compOptions = {},
                 initializingDeferred;


             require([config.template], function(component) {
                /* Если dataSource не передан в конфиге пробуем достать с прототипа */
                if(!config.dataSource && component.prototype.getComponentOptions) {
                   compOptions = component.prototype.getComponentOptions.call(component.prototype, config);
                }

                /* dataSource - передан, делаем запрос, а потом открываем */
                if( (config.dataSource || compOptions.dataSource) && component.prototype.getItemsFromSource) {
                   IndicatorUtil.showLoadingIndicator();
                   initializingDeferred =
                      component.prototype.getItemsFromSource.call(component.prototype, config)
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
                         .addBoth(function(res) {
                            IndicatorUtil.hideLoadingIndicator();
                            return res;
                         });
                } else {
                   /* Если не передан - открываем сразу */
                   initializingDeferred = Deferred.success(config.componentOptions.items || []);
                }

                initializingDeferred.addCallback(function(items) {
                   var componentContext = config.context || new Context().setPrevious(Context.global);
                   if(items) {
                      componentContext.setValue('items', items);
                      config.context = componentContext;
                   }
                   SelectorAction.superclass._createComponent.call(self, config, meta, mode);
                   return items;
                });
             });
          }
       });
       return SelectorAction;
    });