import {create} from 'Types/di';
import {PrefetchProxy, IData, ICrud} from 'Types/source';
import {instanceOfMixin, instanceOfModule} from 'Core/core-instance';
import {factory} from 'Types/chain';
import {List, RecordSet} from 'Types/collection';
import {Model} from 'Types/entity';

function getModel(sourceModel: string | typeof Model, config: unknown): Model {
    return typeof sourceModel === 'string' ? create(sourceModel, config) : new sourceModel(config);
}

function getSourceModel(source: IData|PrefetchProxy): Model|string {
    let model;

    if (source instanceof PrefetchProxy) {
        model = (source.getOriginal() as IData).getModel();
    } else {
        model = source.getModel();
    }

    return model;
}

/**
 * Приводит записи к модели источника данных
 * @param {Types/collection:IList|Array} items массив записей
 * @param {Types/source:ISource} dataSource Источник
 * @param {String} idProperty поле элемента коллекции, которое является идентификатором записи.
 * @returns {Types/collection:IList|undefined|Array}
 */
export function ToSourceModel(
    items: RecordSet,
    dataSource: IData&ICrud,
    idProperty: string
): RecordSet|List<Model>|List<void> {
    let dataSourceModel;
    let dataSourceModelInstance;
    let newRec;

    if (items) {
        if (dataSource && instanceOfMixin(dataSource, 'Types/_source/ICrud')) {
            dataSourceModel = getSourceModel(dataSource);

            /* Создадим инстанс модели, который указан в dataSource,
             чтобы по нему проверять модели которые выбраны в поле связи */
            dataSourceModelInstance = getModel(dataSourceModel, {});

            factory(items).each((rec: Model, index: number) => {
                /* Создадим модель указанную в сорсе, и перенесём адаптер и формат из добавляемой записи,
                 чтобы не было конфликтов при мерже полей этих записей */
                if (dataSourceModelInstance._moduleName !== rec._moduleName) {
                    (newRec = getModel(dataSourceModel, {
                        adapter: rec.getAdapter(),
                        format: rec.getFormat()
                    })).merge(rec);
                    if (instanceOfModule(items, 'Types/collection:List')) {
                        items.replace(newRec, index);
                    } else {
                        items[index] = newRec;
                    }
                }
            });
        }

        /* Элементы, установленные из дилогов выбора / автодополнения могут иметь другой первичный ключ,
           отличный от поля с ключём, установленного в поле связи.
           Это связно с тем, что "связь" устанавливается по опеределённому полю,
           и не обязательному по первичному ключу у записей в списке. */
        factory(items).each((rec: Model) => {
            if (instanceOfModule(rec, 'Types/entity:Model') &&
                rec.getKeyProperty() !== idProperty &&
                rec.get(idProperty) !== undefined) {
                rec.setKeyProperty(idProperty);
            }
        });
    }

    return items;
}
