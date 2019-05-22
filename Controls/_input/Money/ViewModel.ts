import BaseViewModel = require('Controls/_input/Base/ViewModel');
import NumberViewModel = require('Controls/_input/Number/ViewModel');

class ViewModel extends BaseViewModel {
    handleInput = NumberViewModel.prototype.handleInput;
}

export default ViewModel;
