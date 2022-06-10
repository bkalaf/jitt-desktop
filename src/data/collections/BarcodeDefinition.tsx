import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React, { useCallback } from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { barcodeTypes } from '../enums';
import { FormControl } from '../definitions/FormControl';
import Barcode from 'react-barcode';
import { checkDigit } from '../definitions/checkDigit';
import { classifyBarcode } from '../definitions/classifyBarcode';
import { EnumDef } from '../definitions/EnumDef';
import { CheckboxDef, TextInputDef } from '../definitions/TextInputDef';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction, uniqueValidator } from '../definitions/index';

export function BarcodeDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
    const realm = useLocalRealm();
    const onBlur = useCallback((ev: React.FocusEvent<HTMLInputElement>) => {
        const target = ev.target;
        const form = target.form;
        console.log(`target`, target);
        console.log(`form`, form);
        const value = ev.target.value;
        (form?.elements.namedItem('type') as HTMLInputElement).value = classifyBarcode(value) ?? '';
        (form?.elements.namedItem('valid') as HTMLInputElement).checked = checkDigit(value)[0];
    }, []);
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

            <TextInputDef name='description' children={children} />

            <TextInputDef
                name='barcode'
                validators={[uniqueValidator('barcode', 'barcode')]}
                children={children}
                onBlur={onBlur}
                toSummary={(x) => <Barcode width={1} height={25} fontSize={10} value={x} />}
            />
            <EnumDef name='type' children={children} enumMap={barcodeTypes} />

            <CheckboxDef name='valid' children={children} />
        </Definitions>
    );
}
