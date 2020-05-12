import {assert} from 'chai';
import {__ValueInField} from 'Controls/input';

describe('Controls/input:ValueInField', () => {
    let inst: __ValueInField;
    const stateValue = 'test';
    const fieldValue = 'test field';
    const field = {
        value: fieldValue
    };
    beforeEach(() => {
       inst = new __ValueInField();
    });
    it('Control is be mount', () => {
        inst.beforeMount(stateValue);
        assert.equal(inst.detectFieldValue(field), stateValue);
    });
    it('Control is mounted', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        assert.equal(inst.detectFieldValue(field), fieldValue);
    });
});
