import {assert} from 'chai';
import {calculateViewData} from 'Controls/_process/DiagramUtils';

describe('Controls/_process/DiagramUtils', () => {
    describe('calculateViewData', () => {
        it('1 category', () => {
            const result = [100];
            assert.deepEqual(result, calculateViewData([{name: 'category', value: 30}]), 'Wrong result of calculateViewData');
        });

        it('2 category', () => {
            const result = [40, 60];
            assert.deepEqual(result, calculateViewData([{name: 'category', value: 2}, {name: 'category', value: 3}]), 'Wrong result of calculateViewData');
        });

        it('3 category', () => {
            const result = [50, 20, 30];
            assert.deepEqual(result, calculateViewData([
                {name: 'category', value: 25},
                {name: 'category', value: 10},
                {name: 'category', value: 15}]), 'Wrong result of calculateViewData');
        });

        it('2 category. fractional', () => {
            const result = [33, 67];
            assert.deepEqual(result, calculateViewData([
                {name: 'category', value: 10},
                {name: 'category', value: 20}]), 'Wrong result of calculateViewData');
        });
    });
});
