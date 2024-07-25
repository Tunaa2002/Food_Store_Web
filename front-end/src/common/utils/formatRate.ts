const formatRate = (rate_avg: number | undefined): number => {
    if (rate_avg === undefined) {
        return 0;
    }
    return parseFloat(rate_avg.toFixed(1));
};

export default formatRate;
