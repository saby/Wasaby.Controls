import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

export function items(items: RecordSet<Record>): RecordSet<Record> {
    items.each((item) => {
        const iconValue = item.get('icon') || item.get('buttonIcon');
        const iconStyleValue = item.get('iconStyle') || item.get('buttonIconStyle') || 'secondary';
        const viewModeValue = item.get('viewMode') || item.get('buttonViewMode');
        let captionValue = '';
        const readOnlyValue = item.get('buttonReadOnly') || item.get('readOnly');

        if (viewModeValue && viewModeValue !== 'toolButton') {
            captionValue = item.get('caption') || item.get('buttonCaption')
        } else if (item.get('title') && !item.get('buttonViewMode')) {
            captionValue = item.get('title');
        }

        item.set('icon', iconValue);
        item.set('iconStyle', iconStyleValue);
        item.set('viewMode', viewModeValue || 'link');
        item.set('caption', captionValue);
        item.set('readOnly', readOnlyValue);

        if (iconValue && iconValue.split(' ').length === 1) {
            item.set('iconSize', 'm');
        }
    });

    return items;
}
