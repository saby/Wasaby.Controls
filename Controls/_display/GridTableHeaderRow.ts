import GridHeaderRow, {IOptions as IGridHeaderRowOptions} from './GridHeaderRow';

export default class GridTableHeaderRow<T> extends GridHeaderRow<T> {
    getItemClasses(templateHighlightOnHover: boolean = true,
                   theme: string = 'default',
                   style: string = 'default',
                   cursor: string = 'pointer',
                   clickable: boolean = true): string {
        return '';
    }
}
