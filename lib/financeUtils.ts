/**
 * Standard Auto Loan Payment Formula
 * P = [r*PV] / [1 - (1 + r)^-n]
 * 
 * P = Monthly Payment
 * r = Monthly Interest Rate (APR / 100 / 12)
 * PV = Present Value (Vehicle Price - Down Payment - Trade In)
 * n = Number of Months (Term)
 */

export function calculateMonthlyPayment(
    price: number,
    downPayment: number = 0,
    tradeIn: number = 0,
    apr: number = 6.4,
    term: number = 72
): number {
    const principal = price - downPayment - tradeIn;
    if (principal <= 0) return 0;

    const monthlyInterest = (apr / 100) / 12;

    // If interest is 0, just divide principal by months
    if (monthlyInterest === 0) return principal / term;

    const x = Math.pow(1 + monthlyInterest, term);
    const monthlyPayment = (principal * x * monthlyInterest) / (x - 1);

    return Math.round(monthlyPayment);
}

/**
 * Reversed formula: Find the max vehicle price based on a target monthly payment
 * PV = [P * (1 - (1 + r)^-n)] / r
 */
export function calculateMaxPrice(
    targetPayment: number,
    downPayment: number = 0,
    tradeIn: number = 0,
    apr: number = 6.4,
    term: number = 72
): number {
    if (targetPayment <= 0) return downPayment + tradeIn;

    const monthlyInterest = (apr / 100) / 12;

    if (monthlyInterest === 0) return (targetPayment * term) + downPayment + tradeIn;

    const x = Math.pow(1 + monthlyInterest, term);
    const principal = (targetPayment * (x - 1)) / (x * monthlyInterest);

    return Math.round(principal + downPayment + tradeIn);
}
