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

            logicParent: null,
            _decOptions: null,

            applyNewOptions: function(newOptions) {
               this._options = newOptions;
               this._applyOptions();
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

            _applyOptions: function(){

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
                  this._applyOptions();
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
               if (this._options.enabled === undefined) {
                  return this._options.parentEnabled;
               }
               return this._options.enabled;
            },

            isVisible: function(){
               if (this._options.visible === undefined) {
                  return this._options.parentVisible;
               }
               return this._options.visible;
            },

            destroy: function() {
               BaseCompatible.destroy.call(this);
            }

         });

      return Base;

   });