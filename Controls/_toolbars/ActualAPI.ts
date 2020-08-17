import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

export function items(items: RecordSet<Record>): RecordSet<Record> {
    items.each((item) => {
        const iconStyleValue = item.get('iconStyle') || 'secondary';
        const iconSize = item.get('iconSize') || 'm';
        const viewModeValue = item.get('viewMode');
        let captionValue = '';

        if (viewModeValue && viewModeValue !== 'toolButton') {
            captionValue = item.get('caption');
        } else if (item.get('title') && !viewModeValue) {
            captionValue = item.get('title');
        }

        item.set('iconStyle', iconStyleValue);
        item.set('viewMode', viewModeValue || 'link');
        item.set('caption', captionValue);
        item.set('iconSize', iconSize);
    });

    return items;
}
