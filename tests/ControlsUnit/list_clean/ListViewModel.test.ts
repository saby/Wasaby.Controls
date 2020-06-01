import { assert } from 'chai';
import { ListViewModel } from 'Controls/list';
import { view } from 'Controls/Constants';
import { RecordSet } from 'Types/collection';

interface ITestDataItem {
    key: number;
    caption: string;
    group?: string;
}

interface ITestResultResetCase {
    start: number;
    current: number;
}

const TEST_GROUP_SIZE = 3;

describe('Controls/list_clean/ListViewModel', () => {
    function generateData(count: number, splitIntoGroups: boolean): ITestDataItem[] {
        const result: ITestDataItem[] = [];
        for (let idx = 1; idx <= count; idx++) {
            const item: ITestDataItem = { key: idx, caption: 'item_' + idx };
            if (splitIntoGroups) {
                const groupIdx = idx % TEST_GROUP_SIZE;
                item.group = groupIdx ? 'group_' + groupIdx : view.hiddenGroup;
            }
            result.push(item);
        }
        return result;
    }
    describe('reset', () => {
        const itemsCount = 6;
        let items: RecordSet;

        beforeEach(() => {
            items = new RecordSet({
                rawData: generateData(itemsCount, true),
                keyProperty: 'key'
            });
        });

        afterEach(() => {
            items = undefined;
        });

        function checkCase(listViewModel: any, results: ITestResultResetCase[]): void {
            listViewModel.setIndexes(0, itemsCount);
            listViewModel.reset();
            assert.strictEqual(listViewModel._startIndex, results[0].start);
            assert.strictEqual(listViewModel._curIndex, results[0].current);
            assert.strictEqual(listViewModel._stopIndex, itemsCount);

            listViewModel.setIndexes(2, itemsCount);
            listViewModel.reset();
            assert.strictEqual(listViewModel._startIndex, results[1].start);
            assert.strictEqual(listViewModel._curIndex, results[1].current);
            assert.strictEqual(listViewModel._stopIndex, itemsCount);

            listViewModel.setIndexes(4, itemsCount);
            listViewModel.reset();
            assert.strictEqual(listViewModel._startIndex, results[2].start);
            assert.strictEqual(listViewModel._curIndex, results[2].current);
            assert.strictEqual(listViewModel._stopIndex, itemsCount);
        }

        it('Without virtual scroll.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
        });

        it('With virtual scroll.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                virtualScrollConfig: {},
                supportVirtualScroll: true
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
        });

        it('Without virtual scroll. With support stickyHeader.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                virtualScrollConfig: {},
                supportVirtualScroll: true
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
        });

        it('Without virtual scroll. With support stickyHeader and grouping.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                groupingKeyCallback: (item) => {
                    return item.get('group');
                }
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader and grouping.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                virtualScrollConfig: {},
                supportVirtualScroll: true,
                groupingKeyCallback: (item) => {
                    return item.get('group');
                }
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 0 },
                { start: 4, current: 3 }
            ]);
        });

        it('Without virtual scroll. With support stickyHeader and style="master".', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                style: 'master'
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader and style="master".', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                style: 'master',
                virtualScrollConfig: {},
                supportVirtualScroll: true
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 1 },
                { start: 4, current: 1 }
            ]);
        });

        it('Without virtual scroll. With support stickyHeader and style="masterClassic".', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                style: 'masterClassic'
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 0, current: 0 },
                { start: 0, current: 0 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader and style="masterClassic".', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                style: 'masterClassic',
                virtualScrollConfig: {},
                supportVirtualScroll: true
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 1 },
                { start: 4, current: 1 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader and style="master" and stickyMarkedItem=false.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                stickyMarkedItem: false,
                style: 'master',
                virtualScrollConfig: {}
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
        });

        it('With virtual scroll. With support stickyHeader and style="masterClassic" and stickyMarkedItem=false.', () => {
            const listViewModel = new ListViewModel({
                items,
                keyProperty: 'key',
                markedKey: null,
                stickyHeader: true,
                stickyMarkedItem: false,
                style: 'masterClassic',
                virtualScrollConfig: {}
            });
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
            listViewModel.setMarkedKey(2);
            checkCase(listViewModel, [
                { start: 0, current: 0 },
                { start: 2, current: 2 },
                { start: 4, current: 4 }
            ]);
        });
    });
});
