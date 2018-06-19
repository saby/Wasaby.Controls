/**
 * Created by as.krasilnikov on 13.04.2018.
 */
define('Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea',
      'Core/vdom/Synchronizer/Synchronizer',
      'Core/Control'
   ],
   function(CompoundControl,
      template,
      Sync,
      control) {
      /**
       * Слой совместимости для открытия новых шаблонов в старых попапах
      **/
      var  moduleClass = CompoundControl.extend({
         _dotTplFn: template,
         init: function() {
            moduleClass.superclass.init.apply(this, arguments);
            var self = this;
            this._onCloseHandler = this._onCloseHandler.bind(this);
            this._onCloseHandler.control = this;
            require([this._options.innerComponentOptions.template], function(ctr) {
               var vDomTemplate = control.createControl(ctr, self._options.innerComponentOptions, $('.vDomWrapper', self.getContainer()));
               self._vDomTemplate = vDomTemplate;
               var container = vDomTemplate.getContainer();
               container = container.get ? container.get(0) : container; //берем ноду
               var replaceVDOMContainer = function() {
                  var container = vDomTemplate.getContainer();
                  container.eventProperties = { 'on:close': [{
                     fn: self._onCloseHandler,
                     args: []
                  }]};
               };
               if (self._options._initCompoundArea) {
                  self._notifyOnSizeChanged(self, self);
                  self._options._initCompoundArea(self);
               }
               container.addEventListener('DOMNodeRemoved', replaceVDOMContainer);
            });
         },
         _onCloseHandler: function() {
            this.sendCommand('close');
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
            //Заглушка для ForceUpdate которого на compoundControl нет
         }
      });

      moduleClass.dimensions = {
         resizable: false
      };

      return moduleClass;
   }
);
