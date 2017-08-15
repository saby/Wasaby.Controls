define([
   'Core/Abstract',
   'js!SBIS3.CORE.Control/Control.compatible',
   'js!SBIS3.CONTROLS.RangeMixin'
], function (Abstract, Control, RangeMixin) {
   'use strict';

   describe('SBIS3.CONTROLS.RangeMixin', function () {

      let RangeControlClass = Abstract.extend([Control, RangeMixin], {
            _propertiesChangedLock: 0,
            _propertiesChangedCnt: 0,
         }),
         rangeControl;

      beforeEach(function () {
         rangeControl = new RangeControlClass({});
      });

      afterEach(function () {
         rangeControl.destroy();
         rangeControl = null;
      });

      describe('.setRange', function(){
         it('should generate only one onPropertiesChanged event', function () {
            let onPropertiesChanged = sinon.spy(),
               onPropertyChanged = sinon.spy();
            rangeControl.subscribe('onPropertiesChanged', onPropertiesChanged);
            rangeControl.subscribe('onPropertyChanged', onPropertyChanged);
            rangeControl.setRange(1, 1);
            assert(onPropertiesChanged.calledOnce, `onPropertiesChanged called ${onPropertiesChanged.callCount}`);
            assert(onPropertyChanged.calledTwice, `onPropertyChanged called ${onPropertyChanged.callCount}`);
         });
      });

   });

});
