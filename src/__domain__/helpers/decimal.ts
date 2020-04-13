export const decimal = (equation: number | string, precision = 3) => +parseFloat(equation?.toString()).toFixed(precision);
