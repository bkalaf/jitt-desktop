import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { FormControl } from '../definitions/FormControl';
import { TextInputDef } from '../definitions/TextInputDef';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction, ReferenceDef } from '../definitions/index';
import { EnumDef } from '../definitions/EnumDef';

export function CategoryDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='id' children={children} />
            <TextInputDef name='label' children={children} />
            <EnumDef
                name='node'
                enumMap={{
                    '0': '0',
                    '1': '1',
                    '2': '2'
                }}
                children={children}
            />
            <ReferenceDef children={children} displayName='Last Seen' label='when' name='activity' lookupTable='activity' />
        </Definitions>
    );
}
