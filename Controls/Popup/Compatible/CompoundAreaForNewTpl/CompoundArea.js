/**
 * Created by as.krasilnikov on 13.04.2018.
 */
define('Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
      'Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper',
      'Core/vdom/Synchronizer/Synchronizer',
      'Core/vdom/Synchronizer/resources/SyntheticEvent',
      'Core/Control',
      'Core/Deferred',
      'css!?Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea'
   ],
   function(CompoundControl,
      template,
      ComponentWrapper,
      Sync,
      SyntheticEvent,
      control,
      Deferred) {
      /**
       * Слой совместимости для открытия новых шаблонов в старых попапах
       * */
      var moduleClass = CompoundControl.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               isTMPL: function(template) {
                  return template.indexOf('tmpl!') === 0; // Если передали просто tmpl в качестве шаблона - нельзя вызывать createControl
               }
            },
            _isVDomTemplateMounted: false
         },
         init: function() {
            moduleClass.superclass.init.apply(this, arguments);
            var self = this;
            this._onCloseHandler = this._onCloseHandler.bind(this);
            this._onResultHandler = this._onResultHandler.bind(this);
            this._onResizeHandler = this._onResizeHandler.bind(this);
            this._beforeCloseHandler = this._beforeCloseHandler.bind(this);
            this._onCloseHandler.control = this._onResultHandler.control = this;

            this._panel = this.getParent();
            this._panel.subscribe('onBeforeClose', this._beforeCloseHandler);

            this._runInBatchUpdate('CompoundArea - init - ' + this._id, function() {
               var def = new Deferred();
               var replaceVDOMContainer = function() {
                  var
                     rootContainer = self._getRootContainer(),
                     additionalEventProperties = {
                        'on:close': self._createEventProperty(self._onCloseHandler),
                        'on:resize': self._createEventProperty(self._onResizeHandler),
                        'on:sendresult': self._createEventProperty(self._onResultHandler),
                        'on:register': self._createEventProperty(self._onRegisterHandler),
                        'on:unregister': self._createEventProperty(self._onRegisterHandler)
                     };

                  //Отлавливаем события с дочернего vdom компонента
                  for (var event in additionalEventProperties) {
                     if (additionalEventProperties.hasOwnProperty(event)) {
                        rootContainer.eventProperties[event] = rootContainer.eventProperties[event] || [];
                        rootContainer.eventProperties[event].push(additionalEventProperties[event]);
                     }
                  }
               };

               require([this._options.innerComponentOptions.template], function() {
                  if (!self._options.isTMPL(self._options.innerComponentOptions.template)) {
                     self._vDomTemplate = control.createControl(ComponentWrapper, self._options.innerComponentOptions, $('.vDomWrapper', self.getContainer()));
                     self._afterMountHandler();
                  } else {
                     // Если нам передали шаблон строкой, то компонент уже построен. Обратимся к нему через DOM.
                     self._vDomTemplate = $('.vDomWrapper', self.getContainer())[0].controlNodes[0].control;
                     if (self._options._initCompoundArea) {
                        self._notifyOnSizeChanged(self, self);
                        self._options._initCompoundArea(self);
                     }
                     replaceVDOMContainer();
                  }

                  self._getRootContainer().addEventListener('DOMNodeRemoved', function() {
                     replaceVDOMContainer();
                  });

                  def.callback();
               });

               return def;
            });
         },

         _createEventProperty: function(handler) {
            return {
               fn: this._createFnForEvents(handler),
               args: []
            };
         },

         //Создаем обработчик события, который положим в eventProperties узла
         _createFnForEvents: function(callback) {
            var fn = callback;

            //Нужно для событийного канала vdom'a.
            //У fn.control позовется forceUpdate. На compoundArea его нет, поэтому ставим заглушку
            fn.control = {
               _forceUpdate: this._forceUpdate
            };
            return fn;
         },

         _beforeCloseHandler: function(event) {
            //Если позвали закрытие панели до того, как построился VDOM компонент - дожидаемся когда он построится
            //Только после этого закрываем панель
            if (!this._isVDomTemplateMounted) {
               this._closeAfterMount = true;
               event.setResult(false);
            }
         },

         // Обсудили с Д.Зуевым, другого способа узнать что vdom компонент добавился в dom нет.
         _afterMountHandler: function() {
            var self = this;
            self._baseAfterMount = self._vDomTemplate._afterMount;
            self._vDomTemplate._afterMount = function() {
               self._baseAfterMount.apply(this, arguments);
               if (self._options._initCompoundArea) {
                  self._notifyOnSizeChanged(self, self);
                  self._options._initCompoundArea(self);
               }
               self._isVDomTemplateMounted = true;
               if (self._closeAfterMount) {
                  self.sendCommand('close');
               }
            };
         },
         _onResizeHandler: function() {
            this._notifyOnSizeChanged();
         },
         _onCloseHandler: function() {
            this._options.onCloseHandler && this._options.onCloseHandler(this._result);
            this.sendCommand('close', this._result);
            this._result = null;
         },
         _onResultHandler: function(event, result) {
            this._result = result;
            if (this._options.onResultHandler) {
               this._options.onResultHandler(this._result);
            }
         },
         _onRegisterHandler: function(event, eventName, emitter, handler) {
            if (['mousemove', 'touchmove', 'mouseup', 'touchend'].indexOf(eventName) !== -1) {
               if (handler) {
                  this._compoundHandlers = this._compoundHandlers || {};
                  this._compoundHandlers[eventName] = function(event) {
                     handler.apply(emitter, [new SyntheticEvent(event)]);
                  };
                  document.body.addEventListener(eventName, this._compoundHandlers[eventName]);
               } else if (this._compoundHandlers && this._compoundHandlers[eventName]) {
                  document.body.removeEventListener(eventName, this._compoundHandlers[eventName]);
                  this._compoundHandlers[eventName] = null;
               }
            }
         },

         _getRootContainer: function() {
            var container = this._vDomTemplate.getContainer();
            return container.get ? container.get(0) : container;
         },

         destroy: function() {
            moduleClass.superclass.destroy.apply(this, arguments);
            if (this._vDomTemplate) {
               Sync.unMountControlFromDOM(this._vDomTemplate, this._vDomTemplate._container);
            }
         },
         _modifyOptions: function(cfg) {
            var cfg = moduleClass.superclass._modifyOptions.apply(this, arguments);
            require([cfg.template]);
            return cfg;
         },

         _forceUpdate: function() {
            // Заглушка для ForceUpdate которого на compoundControl нет
         },

         setInnerComponentOptions: function(newOptions) {
            //https://online.sbis.ru/opendoc.html?guid=037ab701-0148-478c-9ef0-07365d1fa3c1
            this._vDomTemplate._options = newOptions;
            this._vDomTemplate._forceUpdate();
         },
      });

      moduleClass.dimensions = {
         resizable: false
      };

      return moduleClass;
   });
