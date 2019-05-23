import {QueryNavigationType} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Record} from 'Types/entity';
import Env = require('Env/Env');
import {default as IAdditionalQueryParams, Direction, DirectionCfg} from './interface/IAdditionalQueryParams';

interface IPositionHasMore {
   before: boolean;
   after: boolean;
}


declare type FieldCfg = any;
declare type Field = any[];
declare type PositionCfg = any;
declare type Position = any[];

interface IPositionBoth {
   before: Position;
   after: Position;
}

declare type PositionBoth = Position | IPositionBoth;
declare type HasMore = boolean | IPositionHasMore;

// TODO use type from Types
interface IListMetaForPositionNavigation {
   more: HasMore;
   nextPosition?: PositionBoth;
}

export interface IPositionNavigationOptions {
   field: FieldCfg;
   position: PositionCfg;
   direction: DirectionCfg;
   limit: number;
}

/**
 *
 * @author Крайнов Дмитрий
 * @public
 */
class PositionNavigation {
   protected _more: HasMore;
   protected _beforePosition: Position = null;
   protected _afterPosition: Position = null;
   protected _options: IPositionNavigationOptions;
   protected _savedMeta: IListMetaForPositionNavigation;

   // TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
   protected _positionByMeta: boolean = null;

   constructor(cfg: IPositionNavigationOptions) {
      this._options = cfg;

      if (this._options.field === undefined) {
         throw new Error('Option field is undefined in PositionNavigation');
      }
      if (this._options.position === undefined) {
         throw new Error('Option position is undefined in PositionNavigation');
      }
      if (this._options.direction === undefined) {
         throw new Error('Option direction is undefined in PositionNavigation');
      }
      if (this._options.limit === undefined) {
         throw new Error('Option limit is undefined in PositionNavigation');
      }

      this._more = {
         before: false,
         after: false
      };
   }

   private _resolveDirection(loadDirection: Direction, optDirection: DirectionCfg): DirectionCfg {
      let navDirection;
      if (loadDirection === 'down') {
         navDirection = 'after';
      } else if (loadDirection === 'up') {
         navDirection = 'before';
      } else {
         navDirection = optDirection;
      }
      return navDirection;
   }

   private _resolveField(optField: FieldCfg): Field {
      return (optField instanceof Array) ? optField : [optField];
   }

   private _resolvePosition(item: Record, optField: FieldCfg): Position {
      let navField: Field;
      let navPosition: Position;
      let fieldValue: any;

      navField = this._resolveField(optField);
      navPosition = [];
      for (let i = 0; i < navField.length; i++) {
         fieldValue = item.get(navField[i]);
         navPosition.push(fieldValue);
      }
      return navPosition;
   }

   prepareQueryParams(loadDirection: Direction): IAdditionalQueryParams {
      let navDirection: DirectionCfg;
      let navPosition: Position;
      let sign: string = '';
      let additionalFilter: object;
      let navField: Field;

      navDirection = this._resolveDirection(loadDirection, this._options.direction);
      if (loadDirection === 'up') {
         navPosition = this._beforePosition;
      } else if (loadDirection === 'down') {
         navPosition = this._afterPosition;
      } else {
         if (this._options.position instanceof Array) {
            navPosition = this._options.position;
         } else {
            navPosition = [this._options.position];
         }
      }

      navField = this._resolveField(this._options.field);
      switch (navDirection) {
         case 'after': sign = '>='; break;
         case 'before': sign = '<='; break;
         case 'both': sign = '~'; break;
      }

      additionalFilter = {};
      for (let i = 0; i < navField.length; i++) {
         additionalFilter[navField[i] + sign] = navPosition[i];
      }

      return {
         filter: additionalFilter,
         limit: this._options.limit,
         meta: {
            navigationType: QueryNavigationType.Position
         }
      };
   }

   // TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
   // TODO argument type
   setState(model: any): void {
      if (!this._positionByMeta) {
         const beforePosition = model.getFirstItem();
         const afterPosition = model.getLastItem();
         if (afterPosition !== undefined) {
            this._afterPosition = this._resolvePosition(afterPosition, this._options.field);
         }
         if (beforePosition !== undefined) {
            this._beforePosition = this._resolvePosition(beforePosition, this._options.field);
         }
      }
   }

   calculateState(list: RecordSet, loadDirection: Direction): void {
      let metaNextPosition: PositionBoth;
      let more: HasMore;
      let navDirection: DirectionCfg;

      let edgeElem: Record;
      this._savedMeta = list.getMetaData();
      more = this._savedMeta.more;
      metaNextPosition = this._savedMeta.nextPosition;
      if (typeof more === 'boolean') {
         if (loadDirection || this._options.direction !== 'both') {
            navDirection = this._resolveDirection(loadDirection, this._options.direction);
            this._more[navDirection] = more;
         } else {
            Env.IoC.resolve('ILogger')
               .error('QueryParamsController/Position', 'Wrong type of \"more\" value. Must be object');
         }
      } else {
         if (more instanceof Object) {
            if (!loadDirection &&  this._options.direction === 'both') {
               this._more = more;
            } else {
               Env.IoC.resolve('ILogger')
                  .error('QueryParamsController/Position', 'Wrong type of \"more\" value. Must be boolean');
            }
         }
      }

      // if we have "nextPosition" in meta we must set this position for next query
      // else we set this positions from records
      this._positionByMeta = null;
      if (metaNextPosition) {
         if (metaNextPosition instanceof Array) {
            if (loadDirection || this._options.direction !== 'both') {
               if (loadDirection === 'down' || this._options.direction === 'after') {
                  this._afterPosition = metaNextPosition;
                  this._positionByMeta = true;
               } else if (loadDirection === 'up' || this._options.direction === 'before') {
                  this._beforePosition = metaNextPosition;
                  this._positionByMeta = true;
               }
            } else {
               Env.IoC.resolve('ILogger')
                  .error('QueryParamsController/Position', 'Wrong type of \"nextPosition\" value. Must be object');
            }
         } else {
            if (!loadDirection && this._options.direction === 'both') {
               if (metaNextPosition.before && metaNextPosition.before instanceof Array
                     && metaNextPosition.after && metaNextPosition.after instanceof Array) {
                  this._beforePosition = metaNextPosition.before;
                  this._afterPosition = metaNextPosition.after;
                  this._positionByMeta = true;
               } else {
                  Env.IoC.resolve('ILogger')
                     .error('QueryParamsController/Position',
                        'Wrong type of \"nextPosition\" value. Must be Object width `before` and `after` properties.' +
                        'Each properties must be Arrays');
               }
            } else {
               Env.IoC.resolve('ILogger')
                  .error('QueryParamsController/Position', 'Wrong type of \"nextPosition\" value. Must be Array');
            }
         }

      } else {
         if (list.getCount()) {
            if (loadDirection !== 'down') {
               edgeElem = list.at(0);
               this._beforePosition = this._resolvePosition(edgeElem, this._options.field);
            }
            if (loadDirection !== 'up') {
               edgeElem = list.at(list.getCount() - 1);
               this._afterPosition = this._resolvePosition(edgeElem, this._options.field);
            }
         }
      }
   }

   getLoadedDataCount(): void {
      // TODO
   }

   getAllDataCount(): void {
      // TODO
   }

   hasMoreData(loadDirection: Direction): boolean {
      let navDirection: DirectionCfg;
      if (loadDirection === 'up') {
         navDirection = 'before';
      } else if (loadDirection === 'down') {
         navDirection = 'after';
      }
      return this._more[navDirection];
   }

   setEdgeState(direction: Direction): void {
      // TODO
   }

   destroy(): void {
      this._options = null;
      this._more = null;
      this._afterPosition = null;
      this._beforePosition = null;
      this._positionByMeta = null;
   }
}

export default PositionNavigation;
