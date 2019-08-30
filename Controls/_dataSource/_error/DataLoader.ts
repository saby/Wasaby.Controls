import {Control, TemplateFunction, IControlOptions } from 'UI/Base';
import Controller from 'Controls/_dataSource/_error/Controller';
import Mode from 'Controls/_dataSource/_error/Mode';
import * as template from 'wml!Controls/_dataSource/_error/DataLoader';
import requestDataUtil, {ISourceConfig, IRequestDataResult} from 'Controls/_dataSource/requestDataUtil';
import {PrefetchProxy} from 'Types/source';
import {ViewConfig} from 'Controls/_dataSource/_error/Handler';

interface IErrorContainerReceivedState {
   sources?: ISourceConfig[];
   errorViewConfig?: ViewConfig;
}

interface IErrorContainerOptions extends IControlOptions {
   sources: ISourceConfig[];
}

/**
 * Контрол, позволяющий обработать загрузку из нескольких источников данных. В случае возникновения проблем получения
 * данных у одного из истоников, будет выведена соответствующая ошибка.
 * @class Controls/_dataSource/_error/DataLoader
 * @extends UI/Base:Control
 * @control
 * @public
 * @author Сухоручкин А.С
 *
 * @name Controls/_dataSource/_error/DataLoader#sources
 * @cfg {Array.<ISourceConfig>} Конфигурации осточников данных.
 */

/**
 * @typedef {Object} ISourceConfig
 * @property {ICrud} source {@link Controls/list:DataContainer#source}
 * @property {Array|function|IList} fastFilterSource? {@link Controls/_filter/Controller#fastFilterSource}
 * @property {Object} navigation? {@link Controls/list:DataContainer#navigation}
 * @property {String} historyId? {@link Controls/_filter/Controller#historyId}
 * @property {Object} filter? {@link Controls/list#filter}
 * @property {Object} sorting? {@link Controls/list/ISorting#sorting}
 * @property {?Object[]} historyItems? {@link  Controls/_filter/Controller#historyItems}
 */

export default class DataLoader extends Control<IErrorContainerOptions> {
   protected _template: TemplateFunction = template;
   private _sources: ISourceConfig[];
   private _errorViewConfig: ViewConfig;
   private _errorController: Controller = new Controller({});

   protected _beforeMount({sources}: IErrorContainerOptions,
                          ctx?: unknown,
                          receivedState?: IErrorContainerReceivedState): Promise<IErrorContainerReceivedState> | void {
      if (receivedState) {
         this._sources = receivedState.sources;
         this._errorViewConfig = receivedState.errorViewConfig;
      } else {
         const sourcesPromises: Array<Promise<IRequestDataResult>> = [];
         sources.forEach((sourceConfig: ISourceConfig) => {
            sourcesPromises.push(requestDataUtil(sourceConfig));
         });

         return Promise.all(sourcesPromises).then((loadedSources) => {
            const sourcesConfigurations: ISourceConfig[] = [];

            loadedSources.forEach((loadedSource, sourceIndex) => {
               sourcesConfigurations[sourceIndex] = {...sources[sourceIndex]};
               sourcesConfigurations[sourceIndex].source = new PrefetchProxy({
                  target: sources[sourceIndex].source,
                  data: {query: loadedSource.data}
               });
               sourcesConfigurations[sourceIndex].historyItems = loadedSource.historyItems;
            });

            this._sources = sourcesConfigurations;
            return {sources: sourcesConfigurations};
         }).catch((err) => {
            return this._errorController.process({
               error: err,
               mode: Mode.include
            }).then((errorViewConfig: ViewConfig) => {
               this._errorViewConfig = errorViewConfig;
               return {errorViewConfig};
            });
         });
      }
   }
}
