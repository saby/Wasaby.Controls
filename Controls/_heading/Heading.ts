import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import headingTemplate = require('wml!Controls/_heading/Heading/Heading');
import {descriptor as EntityDescriptor} from 'Types/entity';
import {
    ITooltip,
    ITooltipOptions,
    ICaption,
    ICaptionOptions,
    IFontColorStyle,
    IFontColorStyleOptions,
    IFontSize,
    IFontSizeOptions
} from 'Controls/interface';

export interface IHeadingOptions extends IControlOptions, ICaptionOptions, ITooltipOptions, IFontColorStyleOptions, IFontSizeOptions {

}

/**
 * Простой заголовок с поддержкой различных стилей отображения и размеров.
 *
 * @remark
 * Может использоваться самостоятельно или в составе сложных заголовков, состоящих из {@link Controls/heading:Separator}, {@link Controls/heading:Counter} и {@link Controls/heading:Title}.
 * Для одновременной подсветки всех частей сложного заголовка при наведении используйте класс controls-Header_all__clickable на контейнере.
 *
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FHeaders%2FstandartDemoHeader">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/content-managment/heading/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_heading.less">переменные тем оформления</a>
 *
 * @class Controls/_heading/Heading
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 *
 * @implements Controls/_interface/ITooltip
 * @implements Controls/_interface/ICaption
 * @implements Controls/_interface/IFontColorStyle
 * @implements Controls/_interface/IFontSize
 */

/*
 * Heading with support different display styles and sizes. Can be used independently or as part of complex headings(you can see it in <a href="/materials/Controls-demo/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>) consisting of a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
 *
 * <a href="/materials/Controls-demo/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 *
 * @class Controls/_heading/Heading
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 *
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_heading/Heading/HeadingStyles
 */

class Header extends Control<IHeadingOptions> implements ICaption, ITooltip, IFontColorStyle, IFontSize {
    protected _template: TemplateFunction = headingTemplate;

    static _theme: string[] = ['Controls/heading', 'Controls/Classes'];

    static getDefaultOptions(): object {
        return {
            fontSize: 'l',
            fontColorStyle: 'secondary'
        };
    }

    static getOptionTypes(): object {
        return {
            caption: EntityDescriptor(String),
        };
    }

    '[Controls/_interface/ITooltip]': true;
    '[Controls/_interface/ICaption]': true;
}

export default Header;
