import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaxHandlerService {
  constructor() {}

  calcTaxAmount(taxType: number, amount: number, discount: number, companyTaxValue: number): number {
    let total = 0;
    if (taxType === 1) total = ((+amount - +discount) * +companyTaxValue) / (100 + +companyTaxValue);
    if (taxType === 2) total = (+amount - +amount * (+discount / 100)) * (+companyTaxValue / 100);
    return +total <= 0 ? 0 : +total.toFixed(2);
  }

  calcAmountWithoutTax(taxType: number, amount: number, discount: number, taxAmount: number): number {
    let total = 0;
    if (taxType === 1) total = +amount - +discount - +taxAmount;
    if (taxType === 2) total = +amount;
    return +total <= 0 ? 0 : +total.toFixed(2);
  }

  calcTotalWithTax(amount: number, discount: number, taxAmount: number, transportationAmount: number): number {
    const total = +amount + +discount + +taxAmount + +transportationAmount;
    return +total <= 0 ? 0 : +total.toFixed(2);
  }

  calcTotalWithoutTax(withoutTaxAmount: number, transportationAmount: number): number {
    const total = +withoutTaxAmount + +transportationAmount;
    return +total <= 0 ? 0 : +total.toFixed(2);
  }
}
