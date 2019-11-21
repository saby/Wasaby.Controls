/**
 * Библиотека контролов, которые служат для поддержки навигации, позволяющей  пользователю перейти c текущей страницы/документа на любой уровень вложенности.
 * @library Controls/breadcrumbs
 * @includes Path Controls/_breadcrumbs/Path
 * @includes HeadingPath Controls/_breadcrumbs/HeadingPath
 * @author Авраменко А. С.
 */

/*
 * Breadcrumbs library
 * @library Controls/breadcrumbs
 * @includes Path Controls/_breadcrumbs/Path
 * @includes HeadingPath Controls/_breadcrumbs/HeadingPath
 * @author Авраменко А. С.
 */
import ItemTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemTemplate');

export {default as Path} from './_breadcrumbs/Path';
export {default as View} from './_breadcrumbs/View';
export {default as HeadingPath} from './_breadcrumbs/HeadingPath';
export {default as HeadingPathBack} from './_breadcrumbs/HeadingPath/Back';
export {default as HeadingPathCommon} from './_breadcrumbs/HeadingPath/Common';
export {ItemTemplate};
