import {assert} from 'chai';
import {__ValueInField, BaseViewModel} from 'Controls/input';

describe('Controls/input:ValueInField', () => {
    let inst: __ValueInField;
    const fieldValue = 'test field';
    const field: HTMLInputElement = {
        value: fieldValue
    } as HTMLInputElement;
    const model = new BaseViewModel({}, 'test model');
    const stateValue = model.displayValue;
    beforeEach(() => {
        inst = new __ValueInField();
    });
    it('Control is be mount', () => {
        inst.beforeMount(stateValue);
        assert.equal(inst.detectFieldValue({model}), stateValue);
    });
    it('Control is mounted', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        assert.equal(inst.detectFieldValue({model, field}), fieldValue);
    });
    it('Start processing the input', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        inst.startInputProcessing();
        assert.equal(inst.detectFieldValue({model, field}), stateValue);
        inst.afterUpdate();
        assert.equal(inst.detectFieldValue({model, field}), fieldValue);
    });
    it('Field is be mount.', () => {
        assert.equal(inst.detectFieldValue({model}), model.displayValue);
    });
});
