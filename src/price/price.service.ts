import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Price } from './price';
import { Observable } from 'rxjs';
import { Rates } from './rates.interface';
import { decimal } from '../helpers';

const DEFAULT_EXCHANGE_RATES = {
    base: 'EUR',
    date: new Date().toISOString().split('T')[0],
    rates: {
        CAD: 1.5299,
        HKD: 8.3625,
        ISK: 155.7,
        PHP: 54.805,
        DKK: 7.4689,
        HUF: 365.15,
        CZK: 27.539,
        AUD: 1.8004,
        RON: 4.8307,
        SEK: 10.952,
        IDR: 17918.68,
        INR: 82.216,
        BRL: 5.6893,
        RUB: 82.8075,
        HRK: 7.63,
        JPY: 117.1,
        THB: 35.601,
        CHF: 1.0547,
        SGD: 1.5489,
        PLN: 4.5765,
        BGN: 1.9558,
        TRY: 7.2296,
        CNY: 7.6476,
        NOK: 11.2628,
        NZD: 1.8423,
        ZAR: 20.2642,
        USD: 1.0785,
        MXN: 26.547,
        ILS: 3.9267,
        GBP: 0.8785,
        KRW: 1332.82,
        MYR: 4.7006,
    },
};

const EXCHANGE_RATES_API = 'https://api.exchangeratesapi.io/latest';

@Injectable()
export class PriceService {
    constructor(private httpService: HttpService) {}

    private exchangeRates: Rates = DEFAULT_EXCHANGE_RATES;

    getCurrencyExchangeRates(): Observable<AxiosResponse<Rates>> {
        return this.httpService.get(EXCHANGE_RATES_API);
    }

    async getExchangeRateToEuro(currency: string): Promise<number> {
        const currencyFormatted = this.formatCurrency(currency);
        if (currencyFormatted === 'EUR') {
            return 1;
        }
        if (!this.exchangeRates || new Date().getTime() + 1 * 24 * 60 * 60 * 1000 > new Date().getTime()) {
            const rates = await this.getCurrencyExchangeRates().toPromise();
            this.exchangeRates = rates.data;
        }
        return this.exchangeRates.rates[currencyFormatted];
    }

    formatCurrency(currency: string) {
        return currency.toUpperCase();
    }

    async getRatio(input: string, output: string): Promise<number> {
        const euroToInput = await this.getExchangeRateToEuro(input);
        const euroToOutput = await this.getExchangeRateToEuro(output);
        return decimal(euroToOutput) / decimal(euroToInput);
    }

    async convertPrice(price: Price = {amount: 0, currency: 'EUR'}, currency: string): Promise<Price> {
        const newPrice = new Price();
        newPrice.currency = this.formatCurrency(currency);
        newPrice.amount = decimal(price.amount) * decimal(await this.getRatio(price.currency, currency));
        return newPrice;
    }
}
