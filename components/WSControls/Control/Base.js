/**
 * Created by dv.zuev on 02.06.2017.
 */
define('js!WSControls/Control/Base',
   ['Core/core-extend',
      'Core/core-functions',
      'Core/helpers/generate-helpers',
      'Core/EventBus',
      'js!WS.Data/Entity/InstantiableMixin',
      'Core/Abstract.compatible',
      'is!compatibleLayer?js!SBIS3.CORE.Control/Control.compatible',
      'is!compatibleLayer?js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible',
      'is!compatibleLayer?js!SBIS3.CORE.BaseCompatible'
   ],

   function (extend,
             cFunctions,
             generate,
             EventBus,
             InstantiableMixin,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible) {

      'use strict';

      var Base = extend.extend([AbstractCompatible,
            ControlCompatible||{},
            AreaAbstractCompatible||{},
            BaseCompatible||{},
            InstantiableMixin],
         {
            _controlName: 'WSControls/Control/Base',
            iWantVDOM: true,
            VDOMReady: false,


            _sendCommandFn: null,
            parentSendCommand: null,
            logicParent: null,
            _decOptions: null,
            _eventsPile: {},
            _transientProperties: ['rawData', 'data', 'parentSendCommand', 'focusing'],
            _overrideTemplateOptsFn: null,
            _commandHandlers: [],

            _handlers: null,
            /**
             * basic states
             */
            enabled: true,
            visible: true,

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
               this._options = newOptions;
               this.applyOptions();
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

            _getDecOptions: function(){
               return this._decOptions;
            },

            _getMarkup: function(rootKey) {
               if (BaseCompatible) {
                  return BaseCompatible._getMarkup.call(this, rootKey);
               }
               var decOpts = this._getDecOptions();
               return this._template(this, decOpts, rootKey, true)[0];
            },

            _applyChangedOptions: function() {

            },
            applyOptions: function(){

            },

            _parseDecOptions: function(cfg){
               this._decOptions = {};
               /**
                * Опциями для декорирования могут быть лишь фиксированные опции
                */
               if (cfg['class'] || cfg['className']) {
                  this._decOptions['class'] = (cfg['class']?cfg['class']+' ':'') + (cfg['className']?cfg['className']:'');
               }
               if (cfg['style']) {
                  this._decOptions['style'] = cfg['style'];
               }
               if (cfg['data-component']) {
                  this._decOptions['data-component'] = cfg['data-component'];
               }
            },

            constructor: function (cfg) {
               this.logicParent = cfg.logicParent;
               if (!this.deprecatedContr) {
                  this._options = cFunctions.shallowClone(cfg);
                  this.applyOptions();
                  this._parseDecOptions(cfg);

                  this._handlers = {};
                  this._options.eventBusId = generate.randomId();
                  if (cfg.name) {
                     EventBus.channel(cfg.eventBusId, {
                        waitForPermit: true
                     });
                  }
               } else {
                  this._parseDecOptions(cfg);
                  this.deprecatedContr(cfg);
               }
            },

            _setDirty: function(){
               this._notify('onPropertyChange');
            },

            //FROM COMPATIBLE
            isBuildVDom: function(){
               return BaseCompatible?BaseCompatible.isBuildVDom.call(this):true;
            },

            isEnabled: function(){
               return this._options.enabled;
            }




         });

      return Base;

   });