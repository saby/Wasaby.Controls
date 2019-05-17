/**
 * popupTemplate library
 * @library Controls/popupTemplate
 * @includes CloseButton Controls/_popupTemplate/CloseButton
 * @includes Stack Controls/_popupTemplate/Stack
 * @includes Dialog Controls/_popupTemplate/Dialog
 * @includes Confirmation Controls/_popupTemplate/Confirmation
 * @includes InfoBox Controls/_popupTemplate/InfoBox
 * @includes Notification Controls/_popupTemplate/Notification/Base
 * @includes NotificationSimple Controls/_popupTemplate/Notification/Simple
 * @includes NotificationStyles Controls/_popupTemplate/Notification/NotificationStyles
 * @includes DialogStyles Controls/_popupTemplate/Dialog/DialogStyles
 * @includes ConfirmationStyles Controls/_popupTemplate/Confirmation/ConfirmationStyles
 * @includes CloseButtonStyles Controls/_popupTemplate/CloseButton/CloseButtonStyles
 * @public
 * @author Kraynov D.
 */

import CloseButton = require('Controls/_popupTemplate/CloseButton');
import Stack = require('Controls/_popupTemplate/Stack');
import Dialog = require('Controls/_popupTemplate/Dialog');
import Confirmation = require('Controls/_popupTemplate/Confirmation');
import InfoBox = require('Controls/_popupTemplate/InfoBox');
import Notification = require('Controls/_popupTemplate/Notification/Base');
import NotificationSimple = require('Controls/_popupTemplate/Notification/Simple');

import BaseController = require('Controls/_popupTemplate/BaseController');
import ConfirmationDialog = require('Controls/_popupTemplate/Confirmation/Opener/Dialog');
import DialogController = require('Controls/_popupTemplate/Dialog/Opener/DialogController');
import StickyController = require('Controls/_popupTemplate/Sticky/StickyController');
import InfoBoxController = require('Controls/_popupTemplate/InfoBox/Opener/InfoBoxController');
import StackController = require('Controls/_popupTemplate/Stack/Opener/StackController');
import NotificationController = require('Controls/_popupTemplate/Notification/Opener/NotificationController');
import PreviewerController = require('Controls/_popupTemplate/Previewer/PreviewerController');
import templateInfoBox = require('Controls/_popupTemplate/InfoBox/Opener/resources/template');

export {
   CloseButton,
   Stack,
   Dialog,
   Confirmation,
   InfoBox,
   Notification,
   NotificationSimple,

   BaseController,
   ConfirmationDialog,
   DialogController,
   StickyController,
   InfoBoxController,
   StackController,
   NotificationController,
   PreviewerController,
   templateInfoBox
};
