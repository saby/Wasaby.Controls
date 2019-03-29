import MaskViewModel from 'Controls/_input/DateTime/MaskViewModel';
import Mask = require('Controls/_input/Mask');

class Component extends Mask {
    private _getViewModelConstructor() {
        return MaskViewModel;
    }
};

export default Component;
