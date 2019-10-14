/**
 * Библиотека контролов, отвечающих за отображение разных вариантов кнопок. Также библиотека содержит публичные интерфейсы, необходимые для работы кнопок.
 * @library Controls/buttons
 * @includes Button Controls/_buttons/Button
 * @includes IHref Controls/_buttons/interface/IHref
 * @includes IClick Controls/_buttons/interface/IClick
 * @includes IButton Controls/_buttons/interface/IButton
 * @author Красильников А.С.
 */

/*
 * Buttons library
 * @library Controls/buttons
 * @includes Button Controls/_buttons/Button
 * @includes IHref Controls/_buttons/interface/IHref
 * @includes IClick Controls/_buttons/interface/IClick
 * @includes IButton Controls/_buttons/interface/IButton
 * @author Красильников А.С.
 */

export {default as Button} from './_buttons/Button';
export {default as ActualApi} from './_buttons/ActualApi';
export {IHref as IHref} from './_buttons/interface/IHref';
export {IClick as IClick} from './_buttons/interface/IClick';
export {IButton as IButton} from './_buttons/interface/IButton';

