/**
 * Search library
 * @library Controls/search
 * @includes InputContainer Controls/_search/Input/Container
 * @includes Misspell Controls/_search/Misspell
 * @includes MisspellContainer Controls/_search/Misspell/Container
 * @includes Controller Controls/_search/Controller
 * @includes Input Controls/_search/Input/Search
 * @public
 * @author Kraynov D.
 */

import InputContainer = require('Controls/_search/Input/Container');
import Misspell = require('Controls/_search/Misspell');
import MisspellContainer = require('Controls/_search/Misspell/Container');
import Controller = require('Controls/_search/Controller');
import Input = require('Controls/_search/Input/Search');

import getSwitcherStrFromData = require('Controls/_search/Misspell/getSwitcherStrFromData');

export {
   InputContainer,
   Misspell,
   MisspellContainer,
   Controller,
   Input,

   getSwitcherStrFromData
}
