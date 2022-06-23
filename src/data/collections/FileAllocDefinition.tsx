import { faFile, faFolder, faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { ObjectId } from 'bson';
import useLocalRealm from '../../hooks/useLocalRealm';
import { TypeDefinitionFunction, OutputDef, ReferenceDef } from '../definitions';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { FormControl } from '../definitions/FormControl';
import { InputEle } from '../definitions/InputEle';
import { TextInputDef } from '../definitions/TextInputDef';

export function FileAllocDefinition({ children }: { children: TypeDefinitionFunction<{}>; }) {
    const realm = useLocalRealm();
    return (
        <Definitions>
            <Definition
                name='_id'
                displayName='ID'
                icon={faKey}
                iconSize='lg'
                tooltipFunction='x => x.toHexString()'
                required
                readOnly
                convertFromFD={(x: string) => new ObjectId(x)}
                convertToFD={(x: ObjectId) => x.toHexString()}
                init={() => new ObjectId()}
                Control={InputEle}
                Field={FormControl}>
                {children}
            </Definition>
            <OutputDef
                name='type'
                children={children}
                toSummary={(x) => x.fsItem == null ? (
                    <DuotoneIcon icon={faFolder} primary='orange' secondary='navy' size='lg' />
                ) : (
                    <DuotoneIcon icon={faFile} primary='violet' secondary='red' size='lg' />
                )} />
            <TextInputDef name='name' children={children} />
            <TextInputDef name='originalName' children={children} />
            <ReferenceDef name='parent' lookupTable='fs-alloc' label='materializedPath' children={children} />
            <TextInputDef name='materializedPath' displayName='path' children={children} />
            <ReferenceDef name='fsItem' displayName='file' lookupTable='fs-item' filter='fsAlloc.@count === 0' children={children} label='name' />
        </Definitions>
    );
}
