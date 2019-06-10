/**
 * Buttons library
 * @library Controls/buttons
 * @includes Button Controls/_buttons/Button
 * @includes ButtonStyles Controls/_buttons/ButtonStyles
 * @author Михайловский Д. С.
 */

import buttonTemplate = require('wml!Controls/_buttons/Button');

export {default as Button} from './_buttons/Button';
export {default as ActualApi} from './_buttons/ActualApi';
export {buttonTemplate};
