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
 * Кликабельность заголовка зависит от {@link readOnly режима отображения}.
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
class Header extends Control<IHeadingOptions> implements ICaption, ITooltip, IFontColorStyle, IFontSize {
    protected _template: TemplateFunction = headingTemplate;

    readonly '[Controls/_interface/ICaption]': boolean = true;
    readonly '[Controls/_interface/ITooltip]': boolean = true;
    readonly '[Controls/_interface/IFontSize]': boolean = true;
    readonly '[Controls/_interface/IFontColorStyle]': boolean = true;

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
}

export default Header;

/**
 * @name Controls/_heading/Heading#readOnly
 * @cfg {Boolean} Определяет режим взаимодействия с контролом.
 * @default false
 * @remark
 * * true - заголовок не кликабельный.
 * * false - заголовок кликабельный.
 */
