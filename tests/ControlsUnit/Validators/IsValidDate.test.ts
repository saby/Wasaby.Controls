import {isValidDate} from 'Controls/validate';
import {Date, Time, DateTime} from 'Types/entity';

describe('Controls.Validators.IsValidDate', () => {
    [{
        value: null,
        resp: true
    }, {
        value: new Date(2019, 0, 1),
        resp: true
    }, {
        value: new Date('Invalid'),
        resp: 'Дата заполнена некорректно'
    }, {
        value: new Time('Invalid'),
        resp: 'Время заполнено некорректно'
    }, {
        value: new DateTime('Invalid'),
        resp: 'Дата или время заполнены некорректно'
    }].forEach((test) => {
        it(`should return ${test.resp} for ${test.value}`, () => {
            assert.equal(isValidDate({
                value: test.value
            }), test.resp);
        });
    });
});
