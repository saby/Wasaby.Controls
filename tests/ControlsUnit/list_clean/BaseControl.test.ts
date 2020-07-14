import {assert} from 'chai';
import {BaseControl, ListViewModel} from 'Controls/list';
import * as Env from 'Env/Env';
import {RecordSet} from 'Types/collection';

describe('Controls/list_clean/BaseControl', () => {
    // https://online.sbis.ru/opendoc.html?guid=9a6f0437-ea6d-4d7f-b163-25dc8f244c64
    describe('BaseControl created _inertialScrolling', () => {
        const baseControlCfg = {
            viewName: 'Controls/List/ListView',
            keyProperty: 'id',
            viewModelConstructor: ListViewModel,
            items: new RecordSet({
                keyProperty: 'id',
                rawData: []
            })
        };
        let baseControl;

        beforeEach(() => {
            Env.detection.isMobileIOS = true;
            baseControl = new BaseControl(baseControlCfg);
        });

        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
            if (typeof window === 'undefined') {
                Env.detection.isMobileIOS = undefined;
            } else {
                Env.detection.isMobileIOS = false;
            }
        });

        it('_inertialScrolling == null', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isFalse(!!baseControl._inertialScrolling);
        });
        it('created _inertialScrolling', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            baseControl.scrollMoveSyncHandler();
            assert.isTrue(!!baseControl._inertialScrolling);
        });
    });
});
