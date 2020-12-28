import { assert } from 'chai';
import { GridHeaderRow } from 'Controls/display';

const THEME = 'UnitTests';

describe('Controls/grid_clean/Display/HeaderRow', () => {
    describe('Controls/grid_clean/Display/HeaderRow/Spacing', () => {
        it('Padding set in owner', () => {
            const columns = [{}, {}, {}];
            const header = [{}, {}, {}];

            const mockedHeaderOwner = {
                getStickyColumnsCount: () => 0,
                hasMultiSelectColumn: () => false,
                getColumnsConfig: () => columns,
                getHeaderConfig: () => header,
                hasItemActionsSeparatedCell: () => false,
                getLeftPadding: () => 's',
                getRightPadding: () => 's',
                isStickyHeader: () => false,
                hasColumnScroll: () => false
            };

            const mockedHeaderModel = {
                isMultiline: () => false
            }

            const headerRow = new GridHeaderRow({
                header,
                headerModel: mockedHeaderModel,
                columns,
                owner: mockedHeaderOwner
            });
            const columnItems = headerRow.getColumns();
            assert.strictEqual(columnItems.length, 3);

            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol_s_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_s_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_s_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_s_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_s_theme-${THEME}`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol_s_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight`) !== -1);
        });

        it('Padding set in columns', () => {
            const columns = [{
                cellPadding: {
                    left: 'l',
                    right: 'l'
                }
            }, {
                cellPadding: {
                    left: 'xl',
                    right: 'xl'
                }
            }, {
                cellPadding: {
                    left: 'xs',
                    right: 'xs'
                }
            }];
            const header = [{}, {}, {}];

            const mockedHeaderOwner = {
                getStickyColumnsCount: () => 0,
                hasMultiSelectColumn: () => false,
                getColumnsConfig: () => columns,
                getHeaderConfig: () => header,
                hasItemActionsSeparatedCell: () => false,
                getLeftPadding: () => 's',
                getRightPadding: () => 's',
                isStickyHeader: () => false,
                hasColumnScroll: () => false
            };

            const mockedHeaderModel = {
                isMultiline: () => false
            }

            const headerRow = new GridHeaderRow({
                header,
                headerModel: mockedHeaderModel,
                columns,
                owner: mockedHeaderOwner
            });
            const columnItems = headerRow.getColumns();
            assert.strictEqual(columnItems.length, 3);

            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol_s_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_l_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_xl_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_xl_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_xs_theme-${THEME}`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol_s_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight`) !== -1);
        });
        it('Padding set default value', () => {
            const columns = [{}, {}, {}];
            const header = [{}, {}, {}];

            const mockedHeaderOwner = {
                getStickyColumnsCount: () => 0,
                hasMultiSelectColumn: () => false,
                getColumnsConfig: () => columns,
                getHeaderConfig: () => header,
                hasItemActionsSeparatedCell: () => false,
                getLeftPadding: () => 'default',
                getRightPadding: () => 'default',
                isStickyHeader: () => false,
                hasColumnScroll: () => false
            };

            const mockedHeaderModel = {
                isMultiline: () => false
            }

            const headerRow = new GridHeaderRow({
                header,
                headerModel: mockedHeaderModel,
                columns,
                owner: mockedHeaderOwner
            });
            const columnItems = headerRow.getColumns();
            assert.strictEqual(columnItems.length, 3);

            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol_default_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft`) !== -1);
            assert.isFalse(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[0].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol`) !== -1);
            assert.isTrue(columnItems[1].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight_theme-${THEME}`) !== -1);

            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingFirstCol`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLeft_theme-${THEME}`) !== -1);
            assert.isTrue(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingLastCol_default_theme-${THEME}`) !== -1);
            assert.isFalse(columnItems[2].getWrapperClasses(THEME).indexOf(`controls-Grid__cell_spacingRight`) !== -1);
        });
    });
});
