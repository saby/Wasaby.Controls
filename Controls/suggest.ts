/**
 * Библиотека контролов, позволяющих выводить подсказку при вводе текста.
 * @library Controls/suggest
 * @includes Input Controls/_suggest/Input
 * @includes SearchInput Controls/_suggest/Input/Search/Suggest
 * @includes Selector Controls/_suggest/Selector
 * @includes ISuggest Controls/_suggest/ISuggest
 *
 * @public
 * @author Крайнов Д.О.
 */

/*
 * suggest library
 * @library Controls/suggest
 * @includes Input Controls/_suggest/Input
 * @includes SearchInput Controls/_suggest/Input/Search/Suggest
 * @includes Selector Controls/_suggest/Selector
 * @includes ISuggest Controls/_suggest/ISuggest
 *
 * @public
 * @author Крайнов Д.О.
 */

import Input = require('Controls/_suggest/Input');
import _InputController = require('Controls/_suggest/_InputController');
import _InputControllerEmptyTemplate = require('wml!Controls/_suggest/_InputController/empty');
import InputRender = require('Controls/_suggest/Input/Render');
import SearchInput from 'Controls/_suggest/Input/Search/Suggest';
import LoadService from 'Controls/_suggest/LoadService';

export {default as Selector} from './_suggest/Selector';

export {
   Input,
   _InputController,
   _InputControllerEmptyTemplate,
   SearchInput,
   InputRender,
   LoadService
};
