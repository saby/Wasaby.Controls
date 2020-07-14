import {assert} from 'chai';
import {BaseControl, ListViewModel} from 'Controls/list';
import {RecordSet} from 'Types/collection';
import * as Config from 'Env/Config';

describe('Controls/list_clean/BaseControl', () => {
    // https://online.sbis.ru/opendoc.html?guid=9a6f0437-ea6d-4d7f-b163-25dc8f244c64 пункт 3
    describe('BaseControl watcher groupHistoryId', () => {

        const GROUP_HISTORY_ID_NAME: string = 'MY_NEWS';
        const GROUP_HISTORY_ID_VALUE: string = 'Крайнов Дмитрий';

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
            Config.UserConfig.setParam(
                'LIST_COLLAPSED_GROUP_' + GROUP_HISTORY_ID_NAME, JSON.stringify([GROUP_HISTORY_ID_VALUE])
            );
            baseControl = new BaseControl(baseControlCfg);
        });

        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
        });

        it('CollapsedGroup empty', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isFalse(!!baseControl._listViewModel._options.collapsedGroups);
        });
        it('updated CollapsedGroups', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();

            await baseControl._beforeUpdate({...baseControlCfg, groupHistoryId: GROUP_HISTORY_ID_NAME});

            assert.equal(baseControl._listViewModel._options.collapsedGroups[0], GROUP_HISTORY_ID_VALUE);
        });
    });
});
