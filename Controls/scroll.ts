/**
 * Search library
 * @library Controls/scroll
 * @includes Scroll Controls/_scroll/Scroll
 * @includes Watcher Controls/_scroll/Scroll/Watcher
 * @includes StickyHeader Controls/_scroll/StickyHeader
 * @public
 * @author Kraynov D.
 */

import 'css!theme?Controls/_scroll/scroll';

import Container = require('Controls/_scroll/Scroll');
import Watcher = require('Controls/_scroll/Scroll/Watcher');
import StickyHeader = require('Controls/_scroll/StickyHeader');

export {
   Container,
   Watcher,
   StickyHeader
}
