/**
 * Библиотека контролов, открывающих всплывающие окна. Существуют окна нескольких видов, которые различаются внешним видом и алгоритмом позиционирования.
 * @library Controls/popup
 * @includes Confirmation Controls/_popup/Opener/Confirmation
 * @includes Dialog Controls/_popup/Opener/Dialog
 * @includes Stack Controls/_popup/Opener/Stack
 * @includes Edit Controls/_popup/Opener/Edit
 * @includes Notification Controls/_popup/Opener/Notification
 * @includes Sticky Controls/_popup/Opener/Sticky
 * @includes InfoboxTarget Controls/_popup/InfoBox
 * @includes PreviewerTarget Controls/_popup/Previewer
 * @includes InfoboxButton Controls/_popup/InfoBox/InfoboxButton
 * @includes EditContainer Controls/_popup/Opener/Edit/Container
 * @includes IStackPopupOptions Controls/_popup/interface/IStack
 * @includes IStickyPopupOptions Controls/_popup/interface/ISticky
 * @includes IDialogPopupOptions Controls/_popup/interface/IDialog
 * @includes IConfirmationOptions Controls/_popup/interface/IConfirmation
 * @includes IBaseOpener Controls/_popup/interface/IBaseOpener
 * @public
 * @author Крайнов Д.О.
 */

/*
 * popup library
 * @library Controls/popup
 * @includes Confirmation Controls/_popup/Opener/Confirmation
 * @includes Dialog Controls/_popup/Opener/Dialog
 * @includes Stack Controls/_popup/Opener/Stack
 * @includes Edit Controls/_popup/Opener/Edit
 * @includes Notification Controls/_popup/Opener/Notification
 * @includes Sticky Controls/_popup/Opener/Sticky
 * @includes InfoboxTarget Controls/_popup/InfoBox
 * @includes PreviewerTarget Controls/_popup/Previewer
 * @includes InfoboxButton Controls/_popup/InfoBox/InfoboxButton
 * @includes EditContainer Controls/_popup/Opener/Edit/Container
 * @includes IStackPopupOptions Controls/_popup/interface/IStack
 * @includes IStickyPopupOptions Controls/_popup/interface/ISticky
 * @includes IStickyPopupOptions Controls/_popup/interface/IDialog
 * @includes IConfirmationOptions Controls/_popup/interface/IConfirmation
 * @includes IBaseOpener Controls/_popup/interface/IBaseOpener
 * @public
 * @author Крайнов Д.О.
 */

/*
 * @includes Global Controls/_popup/Global
 * @includes GlobalTemplate wml!Controls/_popup/Global/Global
 * @includes PreviewerTemplate wml!Controls/_popup/Global/Global
 */

import Edit = require('Controls/_popup/Opener/Edit');
import InfoboxTarget = require('Controls/_popup/InfoBox');
import PreviewerTarget = require('Controls/_popup/Previewer');
import Manager = require('Controls/_popup/Manager');
import Controller = require('Controls/_popup/Manager/ManagerController');
import Container = require('Controls/_popup/Manager/Container');
import GlobalTemplate = require('wml!Controls/_popup/Global/Global');
import PreviewerTemplate = require('Controls/_popup/Previewer/PreviewerTemplate');

import EditContainer = require('Controls/_popup/Opener/Edit/Container');

export {default as Global} from './_popup/Global';
export {default as Stack} from './_popup/Opener/Stack';
export {default as Dialog} from './_popup/Opener/Dialog';
export {default as Sticky} from './_popup/Opener/Sticky';
export {default as Infobox} from './_popup/Opener/InfoBox';
export {default as Previewer} from './_popup/Opener/Previewer';
export {default as Confirmation} from './_popup/Opener/Confirmation';
export {default as InfoboxButton} from './_popup/InfoBox/InfoboxButton';
export {default as BaseOpener} from 'Controls/_popup/Opener/BaseOpener';
export {default as Notification} from 'Controls/_popup/Opener/Notification';
export {default as IPopup, IPopupOptions, IPopupItem, IPopupSizes, IPopupPosition, IEventHandlers} from './_popup/interface/IPopup';
export {IStackPopupOptions} from './_popup/interface/IStack';
export {IStickyPopupOptions} from './_popup/interface/ISticky';
export {IDialogPopupOptions} from './_popup/interface/IDialog';
export {IConfirmationOptions} from './_popup/interface/IConfirmation';

export {
    Edit,
    InfoboxTarget,
    PreviewerTarget,
    Manager,
    Controller,
    Container,
    GlobalTemplate,
    PreviewerTemplate,

    EditContainer
};
