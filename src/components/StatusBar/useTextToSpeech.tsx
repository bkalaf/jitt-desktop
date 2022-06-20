import { useReactiveVar } from '@apollo/client';
import { $textToSpeech } from '../MainWindow';


export function useTextToSpeech() {
    return $textToSpeech
}
