import { TreeGridFooterCell } from 'Controls/treeGridNew';
import {CssClassesAssert} from 'ControlsUnit/CustomAsserts';

describe('Controls/treeGrid_clean/Display/MultiSelectVisibility/FooterCell/getWrapperClasses', () => {

    it('exists item with expander', () => {
        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: true,
            column: {}
        });

        CssClassesAssert.include(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );
    });

    it('not exists item with expander', () => {
        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: false,
            column: {}
        });

        CssClassesAssert.notInclude(
            footerCell.getWrapperClasses('mockedTheme', 'mockedBG', 'mockedStyle', false),
            'controls-TreeGridView__footer__expanderPadding-default_theme-mockedTheme'
        );
    });

    it('setHasNodeWithChildren', () => {
        const footerCell = new TreeGridFooterCell({
            hasNodeWithChildren: false,
            column: {}
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
