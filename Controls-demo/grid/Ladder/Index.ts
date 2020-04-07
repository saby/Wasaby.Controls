import {Control, TemplateFunction} from 'UI/Base';
import 'css!Controls-demo/Controls-demo';

import * as Template from 'wml!Controls-demo/grid/Ladder/Ladder';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
