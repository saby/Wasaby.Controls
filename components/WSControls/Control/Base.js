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

            /**
             * Состояния режима совместимости
             */
            iWantVDOM: true, //позволяет сделать из VDOM контрола не VDOM контрол, не АПИ
            VDOMReady: false, //состояние, которое используется в bootup для принятия решения маунтить контрол или он уже привязан к дому
            /**
             * Состояния с которыми не докнца ясно, что делать.
             * НЕ АПИ.
             * logicParent хранит ссылку на логического родителя для регистрации в нем
             * _decOptions - набор атрибутов, которые были на теге при создании
             * (контрол могли создать через new и положить на контейнер, у которого есть класс или какие-нибудь другие атрибуты)
             */
            logicParent: null,
            _decOptions: null,
            /**
             * Логика вынесена в функцию для переопределения поведения легкого инстанса
             * @returns {null}
             * @private
             * @deprecated
             */
            _getDecOptions: function(){
               return this._decOptions;
            },
            /**
             * Создание объекта с опциями для декорирования
             * @param cfg
             * @private
             * @deprecated
             */
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
            /**
             * Метод для bootup, который показвает на то какого типа будет результат функции шаблонизации компонента
             * @returns {boolean}
             */
            isBuildVDom: function(){
               return BaseCompatible?BaseCompatible.isBuildVDom.call(this):true;
            },

            /**
             * Применяем новый набор опций для компонента. Вызывается из DirtyChecking
             * @param newOptions
             */
            applyNewOptions: function(newOptions) {
               this._options = newOptions;
               this._applyOptions();
            },

            /**
             * Метод, который возвращает разметку для компонента
             * @param rootKey
             * @returns {*}
             * @private
             */
            _getMarkup: function(rootKey) {
               if (BaseCompatible) {
                  return BaseCompatible._getMarkup.call(this, rootKey);
               }
               var decOpts = this._getDecOptions();
               return this._template(this, decOpts, rootKey, true)[0];
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

            //<editor-fold desc="API">

            /**
             * Запланировать перерисовку компонента
             * @private
             */
            _setDirty: function(){
               this._notify('onPropertyChange');
            },

            /**
             * Рассчетное свойство, если свое не определено - берем родительское свойство
             * @returns {parentEnabled|*}
             */
            isEnabled: function(){
               if (this._options.enabled === undefined) {
                  return this._options.parentEnabled;
               }
               return this._options.enabled;
            },

            /**
             * Рассчетное свойство, если свое не определено - берем родительское свойство
             * @returns {parentVisible|*}
             */
            isVisible: function(){
               if (this._options.visible === undefined) {
                  return this._options.parentVisible;
               }
               return this._options.visible;
            },

            /**
             * Точка входа перед шаблонизацией
             * @private
             */
            _applyOptions: function(){
            },

            /**
             * Точка завершения шаблонизации
             */
            buildComplete: function(){

            },

            /**
             * Точка разрушения компонента
             */
            destroy: function() {
               if (BaseCompatible) {
                  BaseCompatible.destroy.call(this);
               }
            }

            //</editor-fold>
         });

      return Base;

   });