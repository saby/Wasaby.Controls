import {IViewOptions} from './View';
import {IHeadingOptions} from './Heading';

export default {
    _getExpanded(options: IViewOptions | IHeadingOptions, expanded: boolean): boolean {
        if (options.hasOwnProperty('expanded')) {
            return options.expanded === undefined ? expanded : options.expanded;
        }
        return expanded;
    }
};
