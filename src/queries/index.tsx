import { deleteById, deleteSelected } from './deleteById';
import { dropdown } from './dropdown';
import { insertMutation } from './insertMutation';
import { selectFromCollection } from './selectFromCollection';

export const Queries = {
    deleteById,
    dropdown,
    insert: insertMutation,
    fetchAll: selectFromCollection
};
export default {
    deleteById,
    deleteSelected,
    dropdown,
    insert: insertMutation,
    fetchAll: selectFromCollection
};
