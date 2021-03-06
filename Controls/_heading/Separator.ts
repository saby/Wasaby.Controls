import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import separatorTemplate = require('wml!Controls/_heading/Separator/Separator');
import {descriptor as EntityDescriptor} from 'Types/entity';
import 'css!Controls/heading';

export interface ISeparatorOptions extends IControlOptions {
    style?: 'primary' | 'secondary';
}

/**
 * Разделитель заголовков с поддержкой некоторых стилей отображения.
 *
 * @remark
 * Используется в составе сложных заголовков, состоящих из {@link Controls/heading:Separator}, {@link Controls/heading:Counter} и {@link Controls/heading:Title}.
 * Для одновременной подсветки всех частей сложного заголовка при наведении используйте класс controls-Header_all__clickable на контейнере.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/content-managment/heading/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_heading.less переменные тем оформления}
 *
 *
 * @class Controls/_heading/Separator
 * @extends UI/Base:Control
 * @implements Controls/_interface/ICaption
 * @public
 * @author Красильников А.С.
 *
 * @demo Controls-demo/Heading/Separators/Index
 */

/*
 * Heading separator with support some display styles. Used as part of complex headings(you can see it in Demo-example)
 * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a> and a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>.
 *
 * <a href="/materials/Controls-demo/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 * @class Controls/_heading/Separator
 * @extends UI/Base:Control
 *
 * @public
 * @author Красильников А.С.
 *
 * @demo Controls-demo/Heading/Separators/Index
 */

class Separator extends Control<ISeparatorOptions> {
    protected _template: TemplateFunction = separatorTemplate;

    static getDefaultOptions(): object {
        return {
            style: 'secondary'
        };
    }

    static getOptionTypes(): object {
        return {
            style: EntityDescriptor(String).oneOf([
                'secondary',
                'primary'
            ])
        };
    }
}

Object.defineProperty(Separator, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return Separator.getDefaultOptions();
   }
});

/**
 * @name Controls/_heading/Separator#style
 * @cfg {String} Стиль отображения иконки. В теме онлайна есть только один стиль отображения.
 * @variant primary
 * @variant secondary
 * @default secondary
 */

/*
 * @name Controls/_heading/Separator#style
 * @cfg {String} Icon display style. In the online theme has only one display style.
 * @variant primary
 * @variant secondary
 * @default secondary
 */
export default Separator;
