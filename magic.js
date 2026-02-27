// Универсальные хелперы для калькуляторов ЭхоКГ

function normalizeNumber(value) {
    if (value === undefined || value === null) return NaN;
    if (typeof value === 'number') return value;
    const num = parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? NaN : num;
}

// Градиент по допплеру: 4 * v^2
function calcGradientFromVelocity(value) {
    const v = normalizeNumber(value);
    if (isNaN(v)) return NaN;
    return 4 * Math.pow(v, 2);
}

// Фракция укорочения: (КДР - КСР) / КДР * 100
function calcFractionShortening(kdr, ksr) {
    const kdrNum = normalizeNumber(kdr);
    const ksrNum = normalizeNumber(ksr);
    if (isNaN(kdrNum) || isNaN(ksrNum) || kdrNum === 0) return NaN;
    return (kdrNum - ksrNum) / kdrNum * 100;
}

// Универсальное отношение num/denom с опциональным множителем
function calcRatio(num, denom, multiplier = 1) {
    const n = normalizeNumber(num);
    const d = normalizeNumber(denom);
    if (isNaN(n) || isNaN(d) || d === 0) return NaN;
    return (n / d) * multiplier;
}

