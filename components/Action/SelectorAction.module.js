define('js!SBIS3.CONTROLS.Action.SelectorAction', [
       'js!SBIS3.CONTROLS.Action.Action',
       'js!SBIS3.CONTROLS.Action.DialogMixin',
       'Core/core-merge'
    ],
    function (Action, DialogMixin, сMerge) {
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
             var cfg = SelectorAction.superclass._buildComponentConfig.call(metaConfig),
                 chooseCfg = {
                    handlers: {
                       onSelectComplete: function(event, meta) {
                          this.sendCommand('close', meta);
                       }
                    },
                    selectedItems: metaConfig.selectedItems,
                    multiselect: metaConfig.multiselect,
                    selectionType: metaConfig.selectionType
                 };

             return сMerge(cfg, chooseCfg);
          },
          _doExecute: function(meta) {
             return this._opendEditComponent(meta, meta.template || this._options.template);
          }
       });
       return SelectorAction;
    });