export interface Rates {
    base: string;
    date: string;
    rates: {
        [propName: string]: number;
    };
}
