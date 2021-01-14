import { Collection, CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

/**
 * Режимы отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @typedef {String} TVisibility
 * @variant visible Маркер отображается всегда, даже если не задана опция {@link markedKey}.
 * @variant hidden Маркер скрыт и не отображается для всех записей. Можно отключить выделение маркером для отдельной записи, о чем подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/#item здесь}.
 * @variant onactivated Макер отображается при активации списка, например при клике по записи.
 */
export type TVisibility = 'visible' | 'hidden' | 'onactivated';
export enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}

/**
 * Опции контроллера
 * @interface Controls/_marker/interface/IOptions
 * @public
 * @author Панихин К.А.
 */
export interface IOptions extends IMarkerListOptions {
   model: Collection<Model, CollectionItem<Model>>;
}

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера} в списках.
 * @public
 * @author Панихин К.А.
 */
export interface IMarkerListOptions {


   /**
    * @cfg {TVisibility} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
    * @demo Controls-demo/list_new/Marker/OnActivated/Index В примере опция markerVisibility установлена в значение "onactivated".
    * @default onactivated
    * @see markedKey
    * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
    * @see Controls/list:IList#beforeMarkedKeyChanged
    * @see Controls/list:IList#markedKeyChanged
    */

   /*ENG
    * @cfg {String} Determines when marker is visible.
    * @variant visible The marker is always displayed, even if the marked key entry is not specified.
    * @variant hidden The marker is always hidden.
    * @variant onactivated - The marker is displayed on List activating. For example, when user mark a record.
    * @default onactivated
    * @demo Controls-demo/list_new/Marker/OnActivated/Index
    */
   markerVisibility?: TVisibility;

   /**
    * @cfg {Types/source:CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
    * @remark
    * Если сделан bind на эту опцию, но она передана изначально в значении undefined,
    * то установка маркера работает аналогично тому, как если бы bind не был задан (по внутреннему состоянию контрола).
    * @demo Controls-demo/list_new/Marker/Visible/Index
    * @see markerVisibility
    * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
    * @see Controls/list:IList#beforeMarkedKeyChanged
    * @see Controls/list:IList#markedKeyChanged
    */

   /*ENG
    * @cfg {Number} Identifier of the marked collection item.
    */
   markedKey?: CrudEntityKey;

   /**
    * @typedef {String} MarkerPosition
    * @variat left Расположение маркера слева
    * @variat right Расположение маркера справа
    */
   /**
    * Опция сделана для master. Опция непубличная, т.к. в стандарт её вносить пока не будут
    * https://online.sbis.ru/opendoc.html?guid=b0bc13cd-986e-44fc-ab6a-93bcd0465ba1
    *
    * @cfg {MarkerPosition} Расположение маркера.
    * @default left
    * @private
    */
   markerPosition?: 'left' | 'right';
}
