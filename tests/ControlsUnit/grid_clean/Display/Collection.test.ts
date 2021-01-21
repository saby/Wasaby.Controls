import { assert } from 'chai';
import { GridCollection } from 'Controls/display';

describe('Controls/grid_clean/Display/Collection', () => {
    describe('Update options', () => {
        describe('multiSelectVisibility', () => {
            it('Initialize with multiSelectVisibility==="hidden" and set it to "visible"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [{
                        displayProperty: 'id',
                        resultTemplate: () => 'result'
                    }],
                    footer: [{
                        template: () => 'footer'
                    }],
                    header: [{
                        template: () => 'header'
                    }],
                    resultsPosition: 'top'
                });

                let columnItems = gridCollection.at(0).getColumns();
                assert.strictEqual(columnItems.length, 1);

                let headerItems = gridCollection.getHeader().getRow().getColumns();
                assert.strictEqual(headerItems.length, 1);

                let resultsItems = gridCollection.getResults().getColumns();
                assert.strictEqual(resultsItems.length, 1);

                let footerItems = gridCollection.getFooter().getColumns();
                assert.strictEqual(footerItems.length, 1);

                // setMultiSelectVisibility
                gridCollection.setMultiSelectVisibility('visible');

                columnItems = gridCollection.at(0).getColumns();
                assert.strictEqual(columnItems.length, 2);

                headerItems = gridCollection.getHeader().getRow().getColumns();
                assert.strictEqual(headerItems.length, 2);

                resultsItems = gridCollection.getResults().getColumns();
                assert.strictEqual(resultsItems.length, 2);

                footerItems = gridCollection.getFooter().getColumns();
                assert.strictEqual(footerItems.length, 2);
            });

            it('Initialize with multiSelectVisibility==="visible" and set it to "hidden"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [{
                        displayProperty: 'id',
                        resultTemplate: () => 'result'
                    }],
                    footer: [{
                        template: () => 'footer'
                    }],
                    header: [{
                        template: () => 'header'
                    }],
                    resultsPosition: 'top',
                    multiSelectVisibility: 'visible'
                });

                let columnItems = gridCollection.at(0).getColumns();
                assert.strictEqual(columnItems.length, 2);

                let headerItems = gridCollection.getHeader().getRow().getColumns();
                assert.strictEqual(headerItems.length, 2);

                let resultsItems = gridCollection.getResults().getColumns();
                assert.strictEqual(resultsItems.length, 2);

                let footerItems = gridCollection.getFooter().getColumns();
                assert.strictEqual(footerItems.length, 2);

                // setMultiSelectVisibility
                gridCollection.setMultiSelectVisibility('hidden');

                columnItems = gridCollection.at(0).getColumns();
                assert.strictEqual(columnItems.length, 1);

                headerItems = gridCollection.getHeader().getRow().getColumns();
                assert.strictEqual(headerItems.length, 1);

                resultsItems = gridCollection.getResults().getColumns();
                assert.strictEqual(resultsItems.length, 1);

                footerItems = gridCollection.getFooter().getColumns();
                assert.strictEqual(footerItems.length, 1);
            });
        });
    });
});