/// <amd-module name="Controls/_dataSource/_error/Mode" />
/**
 * Перечисляемое множество возможных способов отображения парковочного шаблона ошибки
 * @typedef {Object} Controls/_dataSource/_error/Mode
 * @property {string} dialog в диалоговом окне
 * @property {string} page во всю страницу
 * @property {string} include в области контрола
 * @public
 * @author Санников К.А.
 */
enum Mode {
    dialog = 'dialog',
    page = 'page',
    include = 'include'
}

export default Mode;
