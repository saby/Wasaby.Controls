
export default class IntersectionObserverSyntheticEntry {
    nativeEntry: IntersectionObserverEntry;
    data: object;

    constructor(nativeEntry: IntersectionObserverEntry, data?: object) {
        this.nativeEntry = nativeEntry;
        this.data = data;
    }
}
