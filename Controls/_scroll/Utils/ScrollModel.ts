import ScrollState, {IScrollState} from './ScrollState';

export default class ScrollModel extends ScrollState {
    updateState(newState: IScrollState): boolean {
        let isScrollStateUpdated = false;
        Object.keys(newState).forEach((key) => {
            if (this[key] !== newState[key]) {
                this[key] = newState[key];
                isScrollStateUpdated = true;
            }
        });
        return isScrollStateUpdated;
    }
}
