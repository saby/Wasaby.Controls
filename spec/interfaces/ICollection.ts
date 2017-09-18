/**
 * базовый интерфейс для работы с коллекциями, рекордсетами и т.п.
 */
interface ICollection{
    forEach(fn: (item) => {});
};

export = ICollection;