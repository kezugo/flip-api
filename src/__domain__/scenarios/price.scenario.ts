import { NotFoundException } from '@nestjs/common';

import { decimal } from '../helpers/decimal';
import { IPriceRepository } from '../repositories/price.repository';

export class PriceScenario {
    constructor(private readonly priceRepository: IPriceRepository) {}

    private async getRatio(input: string, output: string): Promise<number> {
        const euroToInput = await this.priceRepository.getExchangeRateToEuro(input.toUpperCase());
        const euroToOutput = await this.priceRepository.getExchangeRateToEuro(output.toUpperCase());
        if (!euroToInput || !euroToOutput) {
            throw new NotFoundException(`Rate for ${input} or ${output} not found.`);
        }
        return decimal(euroToOutput) / decimal(euroToInput);
    }

    async convertPrice(amount: number, inCurrency, outCurrency: string): Promise<number> {
        const newAmount = decimal(amount) * decimal(await this.getRatio(inCurrency, outCurrency));
        return newAmount;
    }
}
