import {TemplateFunction, Control} from 'UI/Base';

import * as template from 'wml!Controls/_columns/ColumnsInnerView';

export default class ColumnsInnerView extends Control {
    _template: TemplateFunction = template;
}
