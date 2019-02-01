/// <amd-module name="Controls/_error/types/Template" />
import Control from 'Controls/_error/types/Control';
type TemplateFunction = () => string;
type Template = string | TemplateFunction | FunctionConstructor | Control;

export default Template;
