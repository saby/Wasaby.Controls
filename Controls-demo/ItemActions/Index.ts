import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { load } from 'Core/library';
import * as Template from 'wml!Controls-demo/ItemActions/ItemActions';

interface IIndexSource {
    link: string;
    name: string;
    children?: IIndexSource[];
}

const sources: IIndexSource[][] = [
    [
        {
            link: 'Controls-demo/ItemActions/listVisible/Index',
            name: 'Опции записи всегда видимы в плоском списке'
        },
        {
            link: 'Controls-demo/ItemActions/listDelayed/Index',
            name: 'Опции записи видимы c задержкой 100мс в плоском списке'
        }
    ],
    [
        {
            link: 'Controls-demo/ItemActions/gridVisible/Index',
            name: 'Опции записи всегда видимы в таблице'
        },
        {
            link: 'Controls-demo/ItemActions/gridDelayed/Index',
            name: 'Опции записи видимы c задержкой 100мс в таблице'
        }
    ]
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _sources: IIndexSource[][];

    protected _beforeMount(options: IControlOptions): Promise<any> {
        const dependencies: any[] = [];
        this._sources = sources;
        this._sources
            .reduce((acu, source) => acu.concat(source), [])
            .forEach((source) => {
                dependencies.push(load(source.link));
            });
        return Promise.all(dependencies);
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
