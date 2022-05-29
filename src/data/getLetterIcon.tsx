import {
    faSquare,
    faSquareA,
    faSquareB,
    faSquareC,
    faSquareD,
    faSquareE,
    faSquareF,
    faSquareG,
    faSquareH,
    faSquareI,
    faSquareJ,
    faSquareK,
    faSquareL,
    faSquareM,
    faSquareN,
    faSquareO,
    faSquareP,
    faSquareQ,
    faSquareR,
    faSquareS,
    faSquareT,
    faSquareU,
    faSquareV,
    faSquareW,
    faSquareX,
    faSquareY,
    faSquareZ
} from '@fortawesome/pro-duotone-svg-icons';


export function getLetterIcon(s: string) {
    switch (s.toUpperCase()) {
        case 'A':
            return faSquareA;
        case 'B':
            return faSquareB;
        case 'C':
            return faSquareC;
        case 'D':
            return faSquareD;
        case 'E':
            return faSquareE;
        case 'F':
            return faSquareF;
        case 'G':
            return faSquareG;
        case 'H':
            return faSquareH;
        case 'I':
            return faSquareI;
        case 'J':
            return faSquareJ;
        case 'K':
            return faSquareK;
        case 'L':
            return faSquareL;
        case 'M':
            return faSquareM;
        case 'N':
            return faSquareN;
        case 'O':
            return faSquareO;
        case 'P':
            return faSquareP;
        case 'Q':
            return faSquareQ;
        case 'R':
            return faSquareR;
        case 'S':
            return faSquareS;
        case 'T':
            return faSquareT;
        case 'U':
            return faSquareU;
        case 'V':
            return faSquareV;
        case 'W':
            return faSquareW;
        case 'X':
            return faSquareX;
        case 'Y':
            return faSquareY;
        case 'Z':
            return faSquareZ;
        case ' ':
            return faSquare;

        default:
            break;
    }
}
