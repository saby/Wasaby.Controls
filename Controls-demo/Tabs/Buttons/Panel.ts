import {Control, TemplateFunction} from 'UI/Base';
import Template = require('wml!Controls-demo/Tabs/Buttons/Panel');
import {RecordSet} from "Types/collection";

const TABS_COUNT = 10;
const TABS_ITEMS = [];
for (let i = 0; i < TABS_COUNT; i++) {
    TABS_ITEMS.push({
        id: i,
        title: 'tab' + i
    });
}

export default class SwitchableArea extends Control {
    protected _items = new RecordSet({
        rawData: TABS_ITEMS
    });
    protected _template: TemplateFunction = Template;
};
