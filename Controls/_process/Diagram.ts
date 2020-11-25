import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls/_process/Diagram');
import {calculateViewData} from './DiagramUtils';

export interface IDiagramCategory {
    name: string;
    value: number;
}

export interface IDiagramOptions extends IControlOptions {
    data: IDiagramCategory[];
    borderVisible: boolean;
}

/**
 * Диаграмма состояния процесса.
 * Позволяет получить наглядную информацию по состоянию выполнения некоторого процесса в разрезе нескольких категорий.
 *
 * @remark
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2fproсess%2fDiagram%2fIndex">демо-пример</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_process.less">переменные тем оформления</a>
 *
 * @class Controls/_process/Diagram
 * @extends UI/Base:Control
 * @author Колесов В.А.
 *
 * @public
 * @demo Controls-demo/process/Diagram/Base/Index
 */
class Diagram extends Control<IDiagramOptions> {
    protected _viewData: number[];
    protected _template: TemplateFunction = controlTemplate;

    protected _beforeMount(options?: IDiagramOptions): void {
        this._viewData = calculateViewData(options.data);
    }

    protected _beforeUpdate(options?: IDiagramOptions): void {
        if (options.data !== this._options.data) {
            this._viewData = calculateViewData(options.data);
        }
    }

    static _theme: string[] = ['Controls/process'];
}
export default Diagram;

/**
 * @typedef {Object} IDiagramCategory
 * @property {string} name Имя категории
 * @property {number} value Значение категории
 */
/**
 * @name Controls/_process/Diagram#data
 * @cfg {IDiagramCategory[]} Задает набор категорий, задающих диаграмму
 * @demo Controls-demo/process/Diagram/Base/Index
 */

/**
 * @name Controls/_process/Diagram#borderVisible
 * @cfg {Boolean} Задает видимость границы вокруг контрола
 * @demo Controls-demo/process/Diagram/BorderVisible/Index
 */
