export type TCRUDOperationResult = Promise<{
    status: 'success' | 'cancelled'
}>;
