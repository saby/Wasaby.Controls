/**
 * Библиотека контролов, которые служат для задания набора шаблонов, из которых в каждый момент времени может отображаться только один, с возможностью переключения между этими шаблонами.
 * @library Controls/tabs
 * @includes Buttons Controls/_tabs/Buttons
 * @includes ITabsButtonsOptions Controls/_tabs/interface/ITabsButtons
 * @public
 * @author Крайнов Д.О.
 */

/*
 * tabs library
 * @library Controls/tabs
 * @includes Buttons Controls/_tabs/Buttons
 * @includes ITabsButtonsOptions Controls/_tabs/interface/ITabsButtons
 * @public
 * @author Крайнов Д.О.
 */

export {default as Buttons} from 'Controls/_tabs/Buttons';
export {default as AdaptiveButtons} from 'Controls/_tabs/AdaptiveButtons';
export {ITabsButtons, ITabsButtonsOptions} from 'Controls/_tabs/interface/ITabsButtons';
export {ITabsButtonsTemplate, ITabsButtonsTemplateOptions} from 'Controls/_tabs/interface/ITabsButtonsTemplate';
export {ITabsAdaptiveButtons, ITabsAdaptiveButtonsOptions} from 'Controls/_tabs/interface/ITabsAdaptiveButtons';
import buttonsItemTemplate = require('wml!Controls/_tabs/Buttons/ItemTemplate');

export {
   buttonsItemTemplate
};
