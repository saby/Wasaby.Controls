import {descriptor} from 'Types/entity';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_decorator/WrapURLs/WrapURLs';

/**
 * Декорирует текст таким образом, что все ссылки в нем становятся активными и выделяются цветом.
 * Активная ссылка - это элемент страници, клик пользователя по которой приводит к переходу на внешний ресурс.
 * @remark
 * Поддерживаемые ссылки:
 * 1. Ссылка на web-страници.
 * 2. Ссылка на email.
 *
 * @class Controls/_decorator/WrapURLs
 * @extends UI/Base:Control
 *
 * @public
 * @author Красильников А.С.
 */

export interface IWrapURLsOptions extends IControlOptions {
    /**
     * @name Controls/_decorator/WrapURLs#text
     * @cfg {String} Текст для преобразования.
     */
    text: string;
    /**
     * @name Controls/_decorator/WrapURLs#newTab
     * @cfg {Boolean} Открыть ссылку в новой вкладке.
     */

    /*
     * @name Controls/_decorator/WrapURLs#newTab
     * @cfg {Boolean} Open link in new tab.
     */
    newTab?: boolean;
}

interface IMap {
    result: number;
    openDelimiter: number;
    linkHref: number;
    schemeHref: number;
    emailAddress: number;
    plainValue: number;
    closeDelimiter: number;
}

interface ILink {
    type: 'link';
    href: string;
    scheme: string;
}

interface IEmail {
    type: 'email';
    address: string;
}

interface IPlain {
    type: 'plain';
    value: string;
}

type Path = ILink | IEmail | IPlain;

class WrapURLs extends Control<IWrapURLsOptions, void> {
    protected _parsedText: Path[] = null;

    protected _template: TemplateFunction = template;

    protected _beforeMount(options: IWrapURLsOptions): void {
        this._parsedText = WrapURLs.parseText(options.text);
    }

    protected _beforeUpdate(newOptions: IWrapURLsOptions): void {
        if (newOptions.text !== this._options.text) {
            this._parsedText = WrapURLs.parseText(newOptions.text);
        }
    }

    /**
     * $1 - Opening delimiter.
     * $2 - Web link.
     * $3 - Scheme to access the web resource.
     * $4 - Email address.
     * $5 - Plain text.
     * $6 - Closing delimiter.
     */
    private static parseRegExp: RegExp = /([({\[⟨<«„‘'"]?)(?:(((?:https?|ftp|file):\/\/|www\.)\S+?)|(\S+@\S+(?:\.\S{2,6}?))|(\S*?))([)}\]⟩>»”’'".,:]?(?:\s|$))/g;

    private static mapExec: IMap = {
        result: 0,
        openDelimiter: 1,
        linkHref: 2,
        schemeHref: 3,
        emailAddress: 4,
        plainValue: 5,
        closeDelimiter: 6
    };

    private static pushLink(original: Path[], href: string, scheme: string): Path[] {
        if (!(href || scheme)) {
            return original;
        }

        original.push({
            href, scheme,
            type: 'link'
        });

        return original;
    }

    private static pushEmail(original: Path[], address: string): Path[] {
        if (!address) {
            return original;
        }

        original.push({
            address,
            type: 'email'
        });

        return original;
    }

    private static pushPlain(original: Path[], value: string): Path[] {
        if (!value) {
            return original;
        }

        const type = 'plain';
        const last: Path = original[original.length - 1];

        if (last && last.type === type) {
            last.value += value;
        } else {
            original.push({value, type});
        }

        return original;
    }

    private static parseText(text: string): Path[] {
        let iteration: number = 1;
        const maxIterations = 10000;
        const parsedText: Path[] = [];
        let exec: RegExpExecArray = null;

        // tslint:disable-next-line
        while (exec = WrapURLs.parseRegExp.exec(text)) {
            if (text.length === WrapURLs.parseRegExp.lastIndex && !exec[WrapURLs.mapExec.result]) {
                WrapURLs.parseRegExp.lastIndex = 0;
                break;
            }

            WrapURLs.pushPlain(parsedText, exec[WrapURLs.mapExec.openDelimiter]);
            WrapURLs.pushLink(parsedText, exec[WrapURLs.mapExec.linkHref], exec[WrapURLs.mapExec.schemeHref]);
            WrapURLs.pushEmail(parsedText, exec[WrapURLs.mapExec.emailAddress]);
            WrapURLs.pushPlain(parsedText, exec[WrapURLs.mapExec.plainValue]);
            WrapURLs.pushPlain(parsedText, exec[WrapURLs.mapExec.closeDelimiter]);

            /**
             * Protection against looping.
             */
            if (iteration >= maxIterations) {
                break;
            }
            iteration++;
        }

        return parsedText;
    }

    static getOptionTypes() {
        return {
            text: descriptor(String).required()
        };
    }

    static getDefaultOptions() {
        return {
            newTab: true
        };
    }
}

export default WrapURLs;
