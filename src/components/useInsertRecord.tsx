import { generateRandomString } from '../common';
import { useForm } from '../hooks/useForm';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useViewContext } from '../hooks/useViewContext';
import { $cn } from '../util/$cn';
import { ButtonGroup } from './ButtonGroup';
import { Btn } from './providers/Btn';
import { FormProvider } from './providers/FormProvider';
import { useMetaDataContext } from './Toaster';
import { determineGridSize } from './determineGridSize';
import { convertFromFormData } from './convertFromFormData';
import { ViewHeader } from './ViewHeader';
import { useLocalRealm } from '../hooks/useLocalRealm';

export function useInsertRecord<T extends { _id: Realm.BSON.ObjectId }>() {
    const [collection] = useRoutedCollection(true);
    const metadata = useMetaDataContext();
    const Controls = metadata.getInputControls(collection);
    const Payload = metadata.getFormPayload(collection);
    const convert = convertFromFormData(Payload as any, metadata.getInfoFor, collection);
    const [handleSubmit, register, formRef, onInput] = useForm<T, T>(convert, Payload as any);
    const id = generateRandomString(24);
    const qty = Controls.length;
    const { data } = useViewContext();
    const realm = useLocalRealm();
    return function () {
        const [gridClassNames, spanClassNames, gridSpan] = determineGridSize(qty);
        const spread = $cn({}, {}, gridClassNames);
        return (
            <FormProvider register={register}>
                <section className='container flex'>
                    <form
                        onSubmit={handleSubmit((fd: any) => {
                            let result: Result<T> = {} as any;
                            realm.write(() => {
                                result = realm.create<T>(collection, fd, Realm.UpdateMode.Modified) as any as Result<T>;
                                return Promise.resolve(result);
                            });
                            return Promise.resolve(result as any as Result<T>);
                        })}
                        ref={formRef}
                        id={id}
                        onInput={onInput}
                        className='items-center justify-center m-auto border-4 border-double shadow-xl min-w-fit rounded-xl shadow-white border-sky-dark px-3 py-1.5'>
                        <header className={`${spanClassNames} items-center justify-center flex`}>
                            <ViewHeader collection={collection} subtitle='Insert New Record' />
                        </header>
                        <Controls />
                        <footer className={`flex mx-5 my-1 w-1/2 items-center justify-center ${spanClassNames}`}>
                            <ButtonGroup className='grid grid-cols-3'>
                                <Btn type='button' className=''>
                                    Cancel
                                </Btn>
                                <input type='reset' />
                                <input type='submit' />
                            </ButtonGroup>
                        </footer>
                    </form>
                </section>
            </FormProvider>
        );
    };
}
