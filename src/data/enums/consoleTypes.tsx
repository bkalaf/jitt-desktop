export const consoleTypes = {
    ps1: 'Playstation 1',
    ps2: 'Playstation 2',
    ps3: 'Playstation 3',
    nes: 'Nintendo',
    snes: 'Super Nintendo',
    gmb: 'Gameboy',
    gmba: 'Gambeboy Advance',
    wii: 'Nintendo Wii',
    sega: 'Sega',
    xbox: 'Microsoft Xbox'
};

export type ConsoleType = keyof typeof consoleTypes;