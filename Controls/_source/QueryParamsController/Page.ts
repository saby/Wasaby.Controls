import {QueryNavigationType} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {default as IAdditionalQueryParams, Direction} from './interface/IAdditionalQueryParams';

export interface IPageNavigationOptions {
   page?: number;
   pageSize?: number;
   hasMore?: boolean;
}
/**
 *
 * @author Крайнов Дмитрий
 * @public
 */
class PageNavigation {
   protected _nextPage: number = 1;
   protected _prevPage: number = -1;
   protected _more: boolean | number = null;
   protected _page: number = 0;
   protected _options: IPageNavigationOptions | null;

   constructor(cfg: IPageNavigationOptions) {
      this._options = cfg;
      this._page = cfg.page || 0;
      if (this._page !== undefined) {
         this._prevPage = this._page - 1;
         this._nextPage = this._page + 1;
      }
      if (!this._options.pageSize) {
         throw new Error('Option pageSize is undefined in PageNavigation');
      }
   }

   prepareQueryParams(direction: Direction): IAdditionalQueryParams {
      const addParams: IAdditionalQueryParams = {};
      let neededPage: number;

      addParams.meta = {
         navigationType: QueryNavigationType.Page
      };

      if (direction === 'down') {
         neededPage = this._nextPage;
      } else if (direction === 'up') {
         neededPage = this._prevPage;
      } else {
         neededPage = this._page;
      }

      addParams.offset = neededPage * this._options.pageSize;
      addParams.limit = this._options.pageSize;

      if (this._options.hasMore === false) {
         addParams.meta.hasMore = false;
      }

      return addParams;
   }

   setState(): void {
      // TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
   }

   calculateState(list: RecordSet, direction: Direction): void {
      const meta = list.getMetaData();

      if (this._options.hasMore === false) {
         // meta.more can be undefined is is not error
         if (meta.more && (typeof meta.more !== 'number')) {
            throw new Error('"more" Parameter has incorrect type. Must be numeric');
         }
      } else {
         // meta.more can be undefined is is not error
         if (meta.more && (typeof meta.more !== 'boolean')) {
            throw new Error('"more" Parameter has incorrect type. Must be boolean');
         }
      }
      this._more = meta.more;

      if (direction === 'down') {
         this._nextPage++;
      } else if (direction === 'up') {
         this._prevPage--;
      } else {

         // Если направление не указано,
         // значит это расчет параметров после начальной загрузки списка или после перезагрузки
         this._nextPage = this._page + 1;
         this._prevPage = this._page - 1;
      }
   }

   getAllDataCount(): boolean | number {
      return this._more;
   }

   getLoadedDataCount(): number {
      return this._nextPage * this._options.pageSize;
   }

   hasMoreData(direction: Direction): boolean {
      if (direction === 'down') {

         if (this._options.hasMore === false) {

            // в таком случае в more приходит общее число записей в списке
            // значит умножим номер след. страницы на число записей на одной странице и сравним с общим
            return typeof this._more === 'boolean' ? this._more : this.getLoadedDataCount() < this.getAllDataCount();
         } else {
            // !! for TypeScript
            return !!this._more;
         }
      } else if (direction === 'up') {
         return this._prevPage >= 0;
      } else {
         throw new Error('Parameter direction is not defined in hasMoreData call');
      }
   }

   setEdgeState(direction: Direction): void {
      if (direction === 'up') {
         this._page = 0;
      } else if (direction === 'down') {
         if (typeof this._more === 'number') {
            this._page = this._more / this._options.pageSize - 1;
         } else {
            this._page = -1;
         }
      } else {
         throw new Error('Wrong argument Direction in NavigationController::setEdgeState');
      }
   }

   destroy(): void {
      this._options = null;
   }
}

export default PageNavigation;
