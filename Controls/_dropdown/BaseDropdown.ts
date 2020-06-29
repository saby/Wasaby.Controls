import {Control, IControlOptions} from 'UI/Base';
import Env = require('Env/Env');
import {SyntheticEvent} from "Vdom/Vdom";
import IDropdownController from 'Controls/_dropdown/interface/IDropdownController';

const PRELOAD_DEPENDENCIES_HOVER_DELAY = 80;

class BaseDropdown extends Control<IControlOptions> {
    protected _controller: IDropdownController = null;

    protected _afterMount(): void {
        this._controller.registerScrollEvent();
    }

    protected _handleKeyDown(event): void {
        if (event.nativeEvent.keyCode === Env.constants.key.esc && this._popupId) {
            this._controller.closeMenu();
            event.stopPropagation();
        }
    }

    protected _handleClick(event: SyntheticEvent): void {
        // stop bubbling event, so the list does not handle click event.
        event.stopPropagation();
    }

    protected _handleMouseEnter(event: SyntheticEvent): void {
        if (!this._options.readOnly) {
            this._loadDependenciesTimer = setTimeout(this._controller.loadDependencies.bind(this._controller),
                PRELOAD_DEPENDENCIES_HOVER_DELAY);
        }
    }

    protected _handleMouseLeave(event: SyntheticEvent): void {
        clearTimeout(this._loadDependenciesTimer);
    }

    protected _onOpen(): void {
        this._notify('dropDownOpen');
    }

    protected _onClose(): void {
        this._popupId = null;
        this._controller.handleClose();
        this._notify('dropDownClose');
    }

    protected _footerClick(data): void {
        this._notify('footerClick', [data]);
        if (!this._$active) {
            this._controller.closeMenu();
        }
    }

    protected _selectorDialogOpened(data): void {
        this._initSelectorItems = data;
        this._controller.closeMenu();
    }

    protected closeMenu(): void {
        this._controller.closeMenu();
    }

    _beforeUnmount(): void {
        this._controller.destroy();
    }
}

export = BaseDropdown;
