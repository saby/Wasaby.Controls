import { TreeGridFooterCell } from 'Controls/treeGridNew';
import {CssClassesAssert} from 'ControlsUnit/CustomAsserts';

describe('Controls/treeGrid_clean/Display/HasNodeWithChildren/TreeGridFooterCell', () => {
    const mockedOwner = {
        getColumnsConfig: () => [{}],
        getColumnsCount: () => 2,
        getStickyColumnsCount: () => 0,
        getExpanderSize: () => '',
        getActionsTemplateConfig: () => {},
        hasMultiSelectColumn: () => false,
        getMultiSelectVisibility: () => 'visible',
        hasColumnScroll: () => false,
        getLeftPadding: () => '',
        getRightPadding: () => '',
        hasItemActionsSeparatedCell: () => false,
        getColumnIndex: () => 0
    } as any;

    it('exists item with expander', () => {

        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: true,
            column: {},
            owner: mockedOwner
        });

        CssClassesAssert.include(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );
    });

    it('not exists item with expander', () => {
        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: false,
            column: {},
            owner: mockedOwner
        });

        CssClassesAssert.notInclude(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );
    });

    it('setHasNodeWithChildren', () => {
        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: false,
            column: {},
            owner: mockedOwner
        });

        CssClassesAssert.notInclude(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );

        footerCell.setHasNodeWithChildren(true);
        CssClassesAssert.include(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );
    });
});
