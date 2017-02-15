define('js!SBIS3.CONTROLS.Action.SelectorAction',
   [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.DialogMixin',
      'js!SBIS3.CONTROLS.Utils.Query',
      'js!SBIS3.CONTROLS.Utils.OpenDialog',
      'Core/core-merge',
      'Core/Deferred',
      'Core/Context',
      'Core/Indicator'
   ],
    function (Action, DialogMixin, Query, OpenDialogUtil, cMerge, Deferred, Context, Indicator) {
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

             function initializeComplete(items) {
                var componentContext = config.context || new Context().setPrevious(Context.global);
                if(items) {
                   componentContext.setValue('items', items);
                   config.context = componentContext;
                }
                SelectorAction.superclass._createComponent.call(self, config, meta, mode);
             }

             function errorProcess(err) {
                OpenDialogUtil.errorProcess(err);
;             }

             Indicator.setMessage('Загрузка...', true);
             require([config.template], function(component) {
                compOptions = OpenDialogUtil.getOptionsFromProto(component, config);

                /* dataSource - передан, делаем запрос, а потом открываем */
                if(compOptions.dataSource && component.prototype.getItemsFromSource) {
                   initializingDeferred = component.prototype.getItemsFromSource.call(component.prototype, config)
                      .addCallback(function(dataSet) {
                         return dataSet.getAll();
                      })
                      .addErrback(function(err) {
                         errorProcess(err);
                         return err;
                      })
                      .addBoth(function(res) {
                         Indicator.hide();
                         return res;
                      });
                } else {
                   /* Если не передан - открываем сразу */
                   Indicator.hide();
                   initializingDeferred = Deferred.success(config.componentOptions.items || []);
                }

                initializingDeferred.addCallback(function(items) {
                   initializeComplete(items);
                   return items;
                });
             });
          }
       });
       return SelectorAction;
    });