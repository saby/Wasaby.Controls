import {assert} from 'chai';
import {__ValueInField} from 'Controls/input';

describe('Controls/input:ValueInField', () => {
    let inst: __ValueInField;
    const stateValue = 'test';
    const fieldValue = 'test field';
    const field: HTMLInputElement = {
        value: fieldValue
    } as HTMLInputElement;
    beforeEach(() => {
        inst = new __ValueInField();
    });
    it('Control is be mount', () => {
        inst.beforeMount(stateValue);
        assert.equal(inst.detectFieldValue(), stateValue);
    });
    it('Control is mounted', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        assert.equal(inst.detectFieldValue(field), fieldValue);
    });
    it('Start processing the input', () => {
        const filedValueLength = fieldValue.length;

        inst.beforeMount(stateValue);
        inst.afterMount();
        inst.startInputProcessing();
        assert.equal(inst.detectFieldValue(field), stateValue);
        inst.afterUpdate();
        assert.equal(inst.detectFieldValue(field), fieldValue);
    });
});
