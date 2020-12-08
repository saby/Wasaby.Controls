
export default class DataCellCompatibility<T> {
    get item(): T {
        return this.getOwner().contents;
    }
}
