const checksum = (digits, coefficients) => {
  const sum = coefficients.reduce((acc, coefficient, index) => {
    return acc + coefficient * Number(digits[index]);
  }, 0);
  return (sum % 11) % 10;
};

export const validateInn = (value) => {
  const inn = String(value).trim();
  if (!/^\d{10}$|^\d{12}$/.test(inn)) return false;

  if (inn.length === 10) {
    return Number(inn[9]) === checksum(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
  }

  const first = checksum(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
  const second = checksum(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
  return Number(inn[10]) === first && Number(inn[11]) === second;
};
