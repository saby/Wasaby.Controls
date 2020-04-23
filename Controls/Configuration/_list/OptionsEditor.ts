import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/_list/OptionsEditor/OptionsEditor';
import tmplNotify = require('Controls/Utils/tmplNotify');
import 'css!Controls/Configuration/_list/OptionsEditor/OptionsEditor';

export default class ListEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = tmplNotify;
}