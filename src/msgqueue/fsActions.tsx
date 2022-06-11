// import { Tracing } from 'trace_events';

// export type $move = 'fs-action::move';
// export const $move: $move = 'fs-action::move';

// export type $delete = 'fs-action::delete';
// export const $delete: $delete = 'fs-action::delete';

// export type $rename = 'fs-action::rename';
// export const $rename: $rename = 'fs-action::rename';

// export type $convert = 'fs-action::convert';
// export const $convert: $convert = 'fs-action::convert';

// export type $removeBg = 'fs-action::remove-bg';
// export const $removeBg: $removeBg = 'fs-action::remove-bg';

// export type $upload = 'fs-action::upload';
// export const $upload: $upload = 'fs-action::upload';

// export type MoveAction = {
//     type: $move;
//     sourceFolder: string;
//     destinationFolder: string;
//     name: string;
// };
// export type DeleteAction = {
//     type: $delete;
//     folder: string;
//     name: string;
// };
// export type RenameAction = {
//     type: $rename;
//     folder: string;
//     originalName: string;
//     newName: string;
// };
// export type ConvertAction = {
//     type: $convert;
//     name: string;
//     newExtension: string;
//     folder: string;
// };
// export type RemoveBgAction = {
//     type: $removeBg;
//     folder: string;
//     name: string;
// };
// export type FileUploadKind = 'product-doc' | 'photo' | 'invoice' | 'receipt';

// export type UploadAction = {
//     type: $upload;
//     folder: string;
//     name: string;
//     kind: FileUploadKind;
// };

// export type FsActions = UploadAction | RemoveBgAction | ConvertAction | RenameAction | DeleteAction | MoveAction;

// function createUploadAction(folder: string, name: string, kind: FileUploadKind): UploadAction {
//     return {
//         folder,
//         kind,
//         name,
//         type: $upload
//     };
// }
// function createRemoveBgAction(folder: string, name: string): RemoveBgAction {
//     return {
//         folder,
//         name,
//         type: $removeBg
//     };
// }
// function createConvertAction(folder: string, name: string, newExtension: string): ConvertAction {
//     return {
//         folder,
//         name,
//         newExtension,
//         type: $convert
//     };
// }
// function createRenameAction(folder: string, originalName: string, newName: string): RenameAction {
//     return {
//         folder,
//         originalName,
//         newName,
//         type: $rename
//     };
// }
// function createDeleteAction(folder: string, name: string): DeleteAction {
//     return {
//         folder,
//         name,
//         type: $delete
//     };
// }
// function createMoveAction(sourceFolder: string, destinationFolder: string, name: string): MoveAction {
//     return {
//         sourceFolder,
//         destinationFolder,
//         name,
//         type: $move
//     };
// }

// export const actionCreator = {
//     move: createMoveAction,
//     delete: createDeleteAction,
//     rename: createRenameAction,
//     upload: createUploadAction,
//     convert: createConvertAction,
//     removeBg: createRemoveBgAction
// };

// export function fsReducer(action: FsActions, state: FsState) {

// }
// export function useFsActions() {}
