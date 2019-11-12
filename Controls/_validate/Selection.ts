import SelectionContainer from 'Controls/_validate/SelectionContainer';
import {IoC} from 'Env/Env';

IoC.resolve('ILogger').warn('Validate', 'Use SelectionContainer instead Selection');

export default SelectionContainer;