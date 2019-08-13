export interface IExpandableOptions {
   expanded?: boolean;
}

/**
 * Интерфейс для контролов с возможностью переключения состояния развернутости.
 * @interface Controls/_interface/IExpandable
 * @public
 * @author Сухоручкин А.С.
 */

/*
 * Interface for components with switchable state of extensibility.
 * @interface Controls/_interface/IExpandable
 * @public
 * @author Сухоручкин А.С.
 */ 
export default interface IExpandable {
   readonly '[Controls/_toggle/interface/IExpandable]': boolean;
}
/**
 * @name Controls/_interface/IExpandable#expanded
 * @cfg {Boolean} Устанавливает состояние развернутости.
 */

/*
 * @name Controls/_interface/IExpandable#expanded
 * @cfg {Boolean} The state of extensibility.
 */ 
