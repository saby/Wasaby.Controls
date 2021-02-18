export default abstract class GroupCell<T> {
    readonly '[Controls/_display/grid/mixins/GroupCell]': boolean;

    getContentTextClasses(theme: string): string {
        return 'controls-ListView__groupContent-text ' +
            `controls-ListView__groupContent-text_theme-${theme} ` +
            `controls-ListView__groupContent-text_default_theme-${theme} `;
    }

    getExpanderClasses(expanderVisible: boolean, expanderAlign: string, theme: string): string {
        let classes = '';
        const expander = expanderAlign === 'right' ? 'right' : 'left';
        if (expanderVisible !== false) {
            if (!this.isExpanded()) {
                classes += ' controls-ListView__groupExpander_collapsed';
                classes += ` controls-ListView__groupExpander_collapsed_${expander}`;
            }

            classes += ` controls-ListView__groupExpander controls-ListView__groupExpander_theme-${theme}` +
                ` controls-ListView__groupExpander_${expander}_theme-${theme}` +
                ` controls-ListView__groupExpander-iconSize_default_theme-${theme}`;
        }
        return classes;
    }

    shouldDisplayLeftSeparator(separatorVisibility: boolean,
                               textVisible: boolean,
                               columnAlignGroup: number,
                               textAlign: string): boolean {
        return separatorVisibility !== false && textVisible !== false &&
            (columnAlignGroup !== undefined || textAlign !== 'left');
    }

    shouldDisplayRightSeparator(separatorVisibility: boolean,
                                textVisible: boolean,
                                columnAlignGroup: number,
                                textAlign: string): boolean {
        return separatorVisibility !== false &&
            (columnAlignGroup !== undefined || textAlign !== 'right' || textVisible === false);
    }

    abstract isExpanded(): boolean;
}
