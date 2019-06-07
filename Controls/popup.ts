/**
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
 * @includes Global Controls/_popup/Global
 * @includes GlobalTemplate wml!Controls/_popup/Global/Global
 * @includes PreviewerTemplate wml!Controls/_popup/Global/Global
 * @public
 * @author Kraynov D.
 */

import Confirmation = require('Controls/_popup/Opener/Confirmation');
import Stack = require('Controls/_popup/Opener/Stack');
import Edit = require('Controls/_popup/Opener/Edit');
import Notification = require('Controls/_popup/Opener/Notification');
import Sticky = require('Controls/_popup/Opener/Sticky');
import InfoboxTarget = require('Controls/_popup/InfoBox');
import PreviewerTarget = require('Controls/_popup/Previewer');
import Manager = require('Controls/_popup/Manager');
import Controller = require('Controls/_popup/Manager/ManagerController');
import Container = require('Controls/_popup/Manager/Container');
import GlobalTemplate = require('wml!Controls/_popup/Global/Global');
import PreviewerTemplate = require('Controls/_popup/Previewer/PreviewerTemplate');

import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import EditContainer = require('Controls/_popup/Opener/Edit/Container');

export {default as Global} from './_popup/Global';
export {default as Dialog} from './_popup/Opener/Dialog';
export {default as Infobox} from './_popup/Opener/InfoBox';
export {default as Previewer} from './_popup/Opener/Previewer';

export {
    Confirmation,
    Stack,
    Edit,
    Notification,
    Sticky,
    InfoboxTarget,
    PreviewerTarget,
    Manager,
    Controller,
    Container,
    GlobalTemplate,
    PreviewerTemplate,

    BaseOpener,
    EditContainer
};
