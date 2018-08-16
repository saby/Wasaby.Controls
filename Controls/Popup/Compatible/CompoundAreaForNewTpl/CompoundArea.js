/**
 * Created by as.krasilnikov on 13.04.2018.
 */
define('Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
      'Core/vdom/Synchronizer/Synchronizer',
      'Core/Control',
      'Core/Deferred',
      'css!Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea'
   ],
   function(CompoundControl,
      template,
      Sync,
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
            }
         },
         init: function() {
            moduleClass.superclass.init.apply(this, arguments);
            var self = this;
            this._onCloseHandler = this._onCloseHandler.bind(this);
            this._onResultHandler = this._onResultHandler.bind(this);
            this._onResizeHandler = this._onResizeHandler.bind(this);
            this._onCloseHandler.control = this._onResultHandler.control = this;

            this._runInBatchUpdate('CompoundArea - init - ' + this._id, function() {
               var def = new Deferred();

               require([this._options.innerComponentOptions.template], function(ctr) {
                  if (!self._options.isTMPL(self._options.innerComponentOptions.template)) {
                     self._vDomTemplate = control.createControl(ctr, self._options.innerComponentOptions, $('.vDomWrapper', self.getContainer()));
                     self._afterMountHandler();

                     var replaceVDOMContainer = function() {
                        //Отлавливаем события с дочернего vdom компонента
                        self._getRootContainer().eventProperties = {
                           'on:close': [{
                              fn: self._createFnForEvents(self._onCloseHandler),
                              args: []
                           }],
                           'on:controlResize': [{
                              fn: self._createFnForEvents(self._onResizeHandler),
                              args: []
                           }],
                           'on:sendresult': [{
                              fn: self._createFnForEvents(self._onResultHandler),
                              args: []
                           }]
                        };
                     };
                     self._getRootContainer().addEventListener('DOMNodeRemoved', function() {
                        replaceVDOMContainer();
                     });

                  }
                  def.callback();
               });

               return def;
            });
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

         _getRootContainer: function() {
            var container = this._vDomTemplate.getContainer();
            return container.get ? container.get(0) : container;
         },

         destroy: function() {
            moduleClass.superclass.destroy.apply(this, arguments);
            Sync.unMountControlFromDOM(this._vDomTemplate, this._vDomTemplate._container);
         },
         _modifyOptions: function(cfg) {
            var cfg = moduleClass.superclass._modifyOptions.apply(this, arguments);
            require([cfg.template]);
            return cfg;
         },

         _forceUpdate: function() {
            // Заглушка для ForceUpdate которого на compoundControl нет
         }
      });

      moduleClass.dimensions = {
         resizable: false
      };

      return moduleClass;
   });
