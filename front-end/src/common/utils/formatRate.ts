const formatRate = (rate_avg: number | undefined | null): number => {
    if (typeof rate_avg !== 'number' || isNaN(rate_avg)) {
        return 0;
    }
    return parseFloat(rate_avg.toFixed(1));
};

export default formatRate;
