import {TemplateFunction} from 'UI/Base';
/**
 * Интерфейс подсказки поля ввода.
 *
 * @interface Controls/_input/interface/IPlaceholder
 * @public
 *
 * @author Красильников А.С.
 */
export interface IPlaceholderOptions {
    /**
     * @name Controls/_input/interface/IPlaceholder
     * @cfg {String|TemplateFunction} Строка или шаблон, содержащие текст подсказки, который будет отображаться в поле ввода.
     * @demo Controls-demo/Input/Placeholders/Index
     */
    placeholder: string | TemplateFunction;
}

interface IPlaceholder {
    readonly '[Controls/_interface/IPlaceholder]': boolean;
}

export default IPlaceholder;
