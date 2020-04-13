export interface IPriceRepository {
    getExchangeRateToEuro(inCurrency: string): Promise<number>;
}
