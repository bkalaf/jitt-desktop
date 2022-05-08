import { Fieldset } from './elements/Fieldset';
import { FormElement, Input } from './elements/Input';
import { Output } from './elements/Output';
import { Select } from './elements/Select';
import { Textarea } from './elements/Textarea';
import { FormBaseElements } from './FormBaseElements';

export function getBaseElement(formBaseElement: FormBaseElements): FormElement {
    switch (formBaseElement) {
        case 'fieldset':
            return Fieldset;
        case 'input':
            return Input;
        case 'output':
            return Output;
        case 'select':
            return Select;
        case 'textarea':
            return Textarea;
    }
}
