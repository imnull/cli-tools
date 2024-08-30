export type TTableChars = {
    LT: string;
    RT: string;
    RB: string;
    LB: string;
    CM: string;
    LM: string;
    RM: string;
    CT: string;
    CB: string;
    H: string;
    V: string;
}

export const TABLE_CHARS_LIST: TTableChars[] = [
    {
        LT: '┌',
        RT: '┐',
        RB: '┘',
        LB: '└',
        CM: '┼',
        LM: '├',
        RM: '┤',
        CT: '┬',
        CB: '┴',
        H: '─',
        V: '│'
    },
    {
        LT: '╔',
        RT: '╗',
        RB: '╝',
        LB: '╚',
        CM: '╬',
        LM: '╠',
        RM: '╣',
        CT: '╦',
        CB: '╩',
        H: '═',
        V: '║'
    },
]

export const TABLE_CHARS: TTableChars = TABLE_CHARS_LIST[0]