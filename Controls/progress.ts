/// <amd-module name="Controls/progress" />
/**
 * Progress indicators library
 * @library Controls/progress
 * @includes StateIndicator Controls/_progress/StateIndicator
 * @includes Legend Controls/_progress/Legend
 * @author Колесов В.А.
 */

import 'css!theme?Controls/_progress/progress';

export {default as StateIndicator} from './_progress/StateIndicator';
export {default as Legend} from './_progress/Legend';