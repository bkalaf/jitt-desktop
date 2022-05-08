import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary, useQuery } from 'react-query';
import { SortDescriptor } from 'realm';
import { toTitleCase } from '../../common/text/toTitleCase';
import { useSchema } from '../useSchema';
import { useCollectionParam } from '../useCollectionParam';
import { Spinner } from '../Spinner';
import { useProvideInsertCommand } from '../../hooks/useProvideInsertCommand';
import { Boundary } from './Boundary';
import { useRealm } from '../../hooks/useRealm';
import { Queries } from '../../queries';
import { RowComponent, useDAL } from './useDAL';
import { useRoutedCollection } from '../../hooks/useRoutedCollection';
import { URLSearchParamsInit } from 'react-router-dom';
import { useSelection } from './useSelection';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import React from 'react';
const { fetchAll } = Queries;

export function useLocalRealm() {
    const realm = useRealm();
    if (!realm) throw new Error('useLocalRealm called: no realm');
    return realm;
}

export function deepEq(x1: any, x2: any) {
    // console.log('x1', 'x2', x1, x2, x1 === x2);
    return x1 === x2;
}
export function Grid<T extends Record<string, any>>() {
    useWhyDidYou('Grid', {});
    console.group('Grid');
    const collectionName = useRoutedCollection();
    const {
        td: { onDeleteClick, onSelectClick },
        tr: { deleteEnabled, isSelected, onClick }
    } = useSelection();
    const { ToHeader, ToRow, ToColGroup, sorted } = useDAL(collectionName);
    const realm = useLocalRealm();
    const { data } = useQuery(['selectAll', collectionName], fetchAll(realm)(collectionName, sorted), {
        suspense: true
    });

    console.groupEnd();
    return React.memo(
        (props: { d: Realm.Results<any> }) => (
            <InnerGrid
                Headers={ToHeader}
                Row={ToRow}
                ColGroup={ToColGroup}
                collectionName={collectionName}
                data={props.d!}
                onSelectClick={onSelectClick}
                onDeleteClick={onDeleteClick}
                deleteEnabled={deleteEnabled}
                isSelected={isSelected}
                onClick={onClick}
            />
        ),
        (a, b) => a.d.length === b.d.length
    )({ d: data! });
}
export function InnerGrid(props: {
    Headers: React.MemoExoticComponent<() => JSX.Element>;
    ColGroup: React.MemoExoticComponent<() => JSX.Element>;
    collectionName: string;
    Row: RowComponent;
    data: Realm.Results<any>;
    onSelectClick: (ev: React.MouseEvent<HTMLElement>) => void;
    onDeleteClick: (ev: React.MouseEvent<HTMLElement>) => void;
    deleteEnabled: (oid: string) => boolean;
    isSelected: (oid: string) => boolean;
    onClick: (ev: React.MouseEvent<HTMLElement>) => void;
}) {
    useWhyDidYou('InnerGrid', props);
    const { Row, Headers, ColGroup, collectionName, data, onDeleteClick, deleteEnabled, onSelectClick, isSelected, onClick } = props;
    return (
        <Boundary>
            <section className='flex w-full h-auto'>
                <div className='flex flex-col w-full'>
                    <table className='text-white border-collapse table-auto'>
                        <caption>{toTitleCase(collectionName)}</caption>
                        <ColGroup />
                        <Headers />
                        <tbody>
                            {data?.map((x) => (
                                <Row
                                    key={x._id.toHexString()}
                                    data={x}
                                    deleteClick={onDeleteClick}
                                    deleteEnabled={deleteEnabled}
                                    isSelected={isSelected}
                                    onClick={onClick}
                                    selectClick={onSelectClick}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-grow'></div>
            </section>
        </Boundary>
    );
}
