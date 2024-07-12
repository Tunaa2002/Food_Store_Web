export const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(numValue)) {
        return String(value);
    }

    return numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};