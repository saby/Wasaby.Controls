import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dataSource/error/DataLoader/DataLoader');
import 'css!Controls-demo/Controls-demo';
import { Memory } from 'Types/source';
import { fetch } from 'Browser/Transport';
import * as ErrorController from 'Controls/Utils/ErrorController';
import { getBaseTemplateForMode } from 'SbisEnvUI/_Maintains/Parking/templates';
import { Error as RPCError } from 'Browser/_Transport/RPC';
import { SbisService } from 'Types/source';
// import { Handler } from "Controls/_dataSource/error";

const handlerEmployee = ({ mode, error }) => {
    console.log('[handler]', error);
    if (error.url === 'some/employee/url') {
        return {
            template: getBaseTemplateForMode(mode),
            options: {
                message: 'К сожалению функционал для вас недоступен.',
                details: 'Оформите подписку и повторите попытку',
                image: '/cdn/Maintenance/1.0.0/img/EXCLUSIVE.png'
            }
        };
    }
};

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _sources;
    // static _theme: string[] = ['Controls/Classes'];
    protected _errorController: ErrorController = new ErrorController({
        // @ts-ignore
        handlers: [handlerEmployee]
    });

    protected _beforeMount(): void {
        this._sources = [
            {
                /* source: new Memory({
                    data: [
                        { id: 1, title: 'React v.16.7' },
                        { id: 2, title: 'React v.16.8' },
                        { id: 3, title: 'React v.16.9' },
                        { id: 4, title: 'React v.16.10' },
                        { id: 5, title: 'React v.16.10.1' },
                        { id: 6, title: 'React v.16.11' },
                        { id: 7, title: 'React v.16.12.0' }
                    ]
                }) */
                source: new SbisService({
                    endpoint: 'Employee'
                })
            },
            {
                source: new Memory({
                    data: [
                        { id: 1, title: 'Angular v.6.0.0' },
                        { id: 2, title: 'Angular v.7.0.0' },
                        { id: 3, title: 'Angular v.8.0.0' }
                    ]
                })
            }
        ];
    }

    throwError(): void {
        const error = new fetch.Errors.HTTP({
            httpError: 500,
            url: 'some/employee/url',
            message: 'some error message',
            details: 'some details'
        });
        // @ts-ignore
        this._errorController.process({ error, mode: 'include' });
    }
}
export default ViewModes;
