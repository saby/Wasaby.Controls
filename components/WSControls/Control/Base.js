/**
 * Created by dv.zuev on 02.06.2017.
 */

define('js!WSControls/Control/Base',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!WS.Data/Entity/InstantiableMixin'
   ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             InstantiableMixin) {

      'use strict';

      var Base = extend.extend([AbstractCompatible,
            ControlCompatible,
            AreaAbstractCompatible,
            BaseCompatible,
            InstantiableMixin],
         {
            _controlName: 'WSControls/Control/Base',
            iWantVDOM: false,

            _sendCommandFn: null,
            parentSendCommand: null,
            logicParent: null,
            _eventsPile: {},
            _transientProperties: ['rawData', 'data', 'parentSendCommand', 'focusing'],
            _overrideTemplateOptsFn: null,
            _commandHandlers: [],

            _sendCommand: function(command) {
               var
                  handlers = this._commandHandlers,
                  parentSend = this.get('parentSendCommand'),
                  result;

               if (handlers[command]) {
                  result = handlers[command].apply(this, functionalHelpers.argumentsToArray(arguments).slice(1));
               } else if (parentSend) {
                  result = parentSend.apply(this, arguments);
               }
               return result;
            },

            _overrideChildrenOptions: function(childOptions) {
               var
                  visible = this._options.visible!==undefined?this._options.visible:true,
                  enabled = this._options.enabled!==undefined?this._options.enabled:true;

               if (!visible || !enabled) {
                  if (!visible) {
                     childOptions.visible = false;
                  }

                  if (!enabled) {
                     childOptions.enabled = false;
                  }
               }

               childOptions.parentSendCommand = this._sendCommandFn;

               return childOptions;
            },

            _addObservableListenters: function (newOptions) {},

            getDefaultOptions: function () {
               return {};
            },

            _afterApplyOptions: function(fromConstructor, oldOptions, newOptions) {
            },

            _initializeCommandHandlers: function initializeCommandHandlers() {
               if (this.commands) {
                  for (var command in this.commands) {
                     this._declareCommand(command, this.commands[command]);
                  }
               }
            },

            _declareCommand: function(command, handler) {
               this._commandHandlers[command] = handler.bind(this);
            },

            _overrideTemplateOpts: function(model) {
               return model;
            },

            _validateOptions: function(newOptions) {
               return newOptions;
            },

            _getMarkup: function(rootKey) {
               var decOpts = this._prepareDecOptions();
               return this._template(this, decOpts, rootKey, true)[0];
            },

            _applyChangedOptions: function(newOptions) {
               Object.getOwnPropertyNames(newOptions).forEach(function (prop) {
                  this[prop] = newOptions[prop];

               }, this);
            },

            constructor: function (cfg) {
               this.logicParent = cfg.logicParent;
               this.deprecatedContr(cfg);
            }




         });

      return Base;

   });