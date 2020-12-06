/**
 * Базовый интерфейс действия над записью
 * @interface Controls/_actions/interface/IAction
 * @public
 * @author Крайнов Д.О.
 */
export default interface IAction {
    /**
     * Запускает действие над записью
     */
    execute(): Promise<void | 'fullReload'>;
}
