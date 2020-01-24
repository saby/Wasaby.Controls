import {Control, TemplateFunction} from 'UI/Base';

import * as Template from 'wml!Controls-demo/listRender/listRender';
import 'css!Controls-demo/Controls-demo';

export default class ListRenderDemo extends Control {
    protected _template: TemplateFunction = Template;
}
