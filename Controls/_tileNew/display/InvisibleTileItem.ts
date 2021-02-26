import {OptionsToPropertyMixin, VersionableMixin} from 'Types/entity';
import { mixin } from 'Types/util';
import { TemplateFunction } from 'UI/Base';
import * as ItemTemplate from 'wml!Controls/_tileNew/render/items/Invisible';

export default class InvisibleTileItem extends mixin<VersionableMixin, OptionsToPropertyMixin>(VersionableMixin, OptionsToPropertyMixin) {
    protected _$theme: string;

    protected _$tileWidth: number;

    protected _$leftPadding: string;

    protected _$rightPadding: string;

    protected _$topPadding: string;

    protected _$bottomPadding: string;

    getTemplate(): TemplateFunction {
        return ItemTemplate;
    }

    getTileWidth(): number {
        return this._$tileWidth;
    }

    setTileWidth(tileWidth: number): void {
        if (this._$tileWidth !== tileWidth) {
            this._$tileWidth = tileWidth;
            this._nextVersion();
        }
    }

    getTheme(): string {
        return this._$theme;
    }

    setTheme(theme: string): void {
        if (this._$theme !== theme) {
            this._$theme = theme;
            this._nextVersion();
        }
    }

    getTopPadding(): string {
        return this._$topPadding;
    }

    getBottomPadding(): string {
        return this._$bottomPadding;
    }

    getLeftPadding(): string {
        return this._$leftPadding;
    }

    getRightPadding(): string {
        return this._$rightPadding;
    }

    getInvisibleClasses(): string {
        let classes = `controls-TileView__item controls-TileView__item_theme-${this.getTheme()}`;
        classes += ` controls-TileView__item_spacingLeft_${this.getLeftPadding()}_theme-${this.getTheme()}`;
        classes += ` controls-TileView__item_spacingRight_${this.getRightPadding()}_theme-${this.getTheme()}`;
        classes += ` controls-TileView__item_spacingTop_${this.getTopPadding()}_theme-${this.getTheme()}`;
        classes += ` controls-TileView__item_spacingBottom_${this.getBottomPadding()}_theme-${this.getTheme()}`;
        classes += ' controls-TileView__item_invisible';
        return classes;
    }

    getInvisibleStyles(templateWidth?: number): string {
        const width = templateWidth || this.getTileWidth();
        return `-ms-flex-preferred-size: ${width}px; flex-basis: ${width}px;`;
    }
}

Object.assign(InvisibleTileItem.prototype, {
    '[Controls/_tileNew/InvisibleTileItem]': true,
    _moduleName: 'Controls/tileNew:InvisibleTileItem',
    _$theme: 'default',
    _$leftPadding: 'default',
    _$rightPadding: 'default',
    _$topPadding: 'default',
    _$bottomPadding: 'default',
    _$tileWidth: null
});
