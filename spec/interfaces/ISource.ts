/**
 * Интерфейс работы с источником данных
 */
interface ISource{
    query(args?);
};

export = ISource;