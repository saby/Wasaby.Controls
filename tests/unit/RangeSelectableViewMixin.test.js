define([
   'Core/Abstract',
   'Lib/Control/Control.compatible',
   'SBIS3.CONTROLS/Mixins/RangeMixin',
   'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin'
], function (Abstract, Control, RangeMixin, RangeSelectableViewMixin) {
   'use strict';

   describe('SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin', function () {

      let RangeControlClass = Abstract.extend([Control, RangeMixin, RangeSelectableViewMixin], {
         }),
         rangeControl;

      beforeEach(function () {
         rangeControl = new RangeControlClass({selectionType: 'single'});
      });

      afterEach(function () {
         rangeControl.destroy();
         rangeControl = null;
      });

      describe('._onRangeItemElementClick', function(){
         it('should not update view if range did not changed', function () {
            rangeControl.setRange(1, 1);
            let validateRangeSelectionItemsView = sinon.spy(rangeControl, 'validateRangeSelectionItemsView');
            rangeControl._onRangeItemElementClick(1, 1);
            validateRangeSelectionItemsView.restore();
            sinon.assert.notCalled(validateRangeSelectionItemsView);
         });
         it('should update view if range changed', function () {
            rangeControl.setRange(1, 1);
            sinon.stub(rangeControl, 'validateRangeSelectionItemsView');
            rangeControl._onRangeItemElementClick(1, 2);
            sinon.assert.calledOnce(rangeControl.validateRangeSelectionItemsView);
            rangeControl.validateRangeSelectionItemsView.restore();
         });
      });

   });

});
