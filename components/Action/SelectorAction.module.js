define('js!SBIS3.CONTROLS.Action.SelectorAction',
   [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.DialogMixin',
      'js!SBIS3.CONTROLS.Utils.OpenDialog',
      'Core/core-merge',
      'Core/Deferred',
      'Core/Context',
      'Core/Indicator',
      'Core/helpers/Function/forAliveOnly'
   ],
    function (Action, DialogMixin, OpenDialogUtil, cMerge, Deferred, Context, Indicator, forAliveOnly) {
       'use strict';
       /**
       * Класс, который описывает действие открытия окна с заданным шаблоном. Из этого окна можно осуществлять выбор.
       * @class SBIS3.CONTROLS.Action.SelectorAction
       * @extends SBIS3.CONTROLS.Action.Action
       *
       * @mixes SBIS3.CONTROLS.Action.DialogMixin
       *
       * @demo SBIS3.CONTROLS.Demo.DemoSelectorAction
       *
       * @public
       * @author Герасимов Александр Максимович
       */
       var SelectorAction = Action.extend([DialogMixin], /** @lends SBIS3.CONTROLS.Action.SelectorAction.prototype */{
          _buildComponentConfig: function(metaConfig) {
             /* Необходимо клонировать metaConfig, чтобы не испортить оригинальный объект */
             var cfg = cMerge({}, SelectorAction.superclass._buildComponentConfig.call(this, metaConfig), {clone: true});

             function onSelectComplete(event, meta) {
                this.sendCommand('close', meta);
             }
             
             if(metaConfig.hasOwnProperty('multiselect')) {
                cfg.multiselect = metaConfig.multiselect;
             }
             
             if(metaConfig.selectedItems) {
                cfg.selectedItems = metaConfig.selectedItems.clone();
             }
             
             if(metaConfig.selectionType) {
                cfg.selectionType = metaConfig.selectionType;
             }

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
                var componentContext = config.context || Context.createContext(self, null, Context.global);
                if(items) {
                   componentContext.setValue('items', items);
                   config.context = componentContext;
                }
                SelectorAction.superclass._createComponent.call(self, config, meta, mode);
             }

             function errorProcess(err) {
                OpenDialogUtil.errorProcess(err);
             }

             Indicator.setMessage('Загрузка...', true);
             require([config.template], function(component) {
                compOptions = OpenDialogUtil.getOptionsFromProto(component, config);

                /* dataSource - передан, делаем запрос, а потом открываем */
                if(compOptions.dataSource && component.prototype.getItemsFromSource) {
                   initializingDeferred = component.prototype.getItemsFromSource.call(component.prototype, config, meta)
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

                initializingDeferred.addCallback(forAliveOnly(function(items) {
                   initializeComplete(items);
                   return items;
                }, self));
             });
          }
       });
       return SelectorAction;
    });