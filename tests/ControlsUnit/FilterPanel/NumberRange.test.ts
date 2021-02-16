import {NumberRangeEditor} from 'Controls/filterPanel';
import {assert} from 'chai';

describe('Controls/filterPanel:NumberRangeEditor', () => {

    describe('_handleInputCompleted', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        let changesNotified = false;
        numberRangeEditor._children = {
            numberRangeValidate: {
                validate: () => {}
            }
        };
        numberRangeEditor._notifyExtendedValue = () => {
            changesNotified = true;
        };

        it('minValue is null', () => {
            numberRangeEditor._handleInputCompleted(null, 1);
            assert.isFalse(changesNotified);
        });

        it('minValue is 0', () => {
            numberRangeEditor._minValue = 0;
            numberRangeEditor._maxValue = 5;
            numberRangeEditor._handleInputCompleted(null, 1);
            assert.isTrue(changesNotified);
        });
    });
});
