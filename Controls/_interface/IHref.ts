/**
 * Интерфейс опций контролов, которые могут работать в режиме гиперссылки.
 *
 * @public
 * @author Красильников А.С.
 */
export interface IHrefOptions {
   /**
    * Адрес документа, на который следует перейти.
    * @default undefined
    * @remark При задании этой опции контрол начинает работать как гиперссылка. Если необходимо открыть вложенный документ на новой вкладке, используйте attr:target="_blank".
    * @demo Controls-demo/Input/Label/Href/Index
    * @demo Controls-demo/Buttons/Href/Index
    */
   href?: string;
}

/**
 * Интерфейс для контролов, которые могут работать в режиме гиперссылки.
 *
 * @public
 * @author Красильников А.С.
 */
export default interface IHref {
   readonly '[Controls/_interface/IHref]': boolean;
}
