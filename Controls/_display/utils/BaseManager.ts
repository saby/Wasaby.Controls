export default class BaseManager<TCollection = unknown> {
    protected _collection: TCollection;

    constructor(collection: TCollection) {
        this._collection = collection;
    }
}
