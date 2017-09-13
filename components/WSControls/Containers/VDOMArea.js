define('js!WSControls/Containers/VDOMArea',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!WSControls/Containers/VDOMArea',
      'Core/Control',
      'Core/moduleStubs'
   ],
   function(CompoundControl,
            VDomAreaTpl,
            Control,
            moduleStubs) {

      var VDOMArea = CompoundControl.extend( /** @lends SBIS3.CONTROLS.CompoundControl.prototype */{
         _dotTplFn: VDomAreaTpl,

         init: function(){
            VDOMArea.superclass.init.apply(this, arguments);
            var self = this;

            moduleStubs.require([this._options.component]).addCallback(function(result){
               Control.createControl(result[0], self._options.componentOptions, self.getContainer().find('.vdom-component')[0]);
            });
         }
      });
      return VDOMArea;
   });