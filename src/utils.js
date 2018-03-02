const RGBToHSL = function RGBToHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = void 0,
        s = void 0,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Number(h.toFixed(2)), Number(s.toFixed(2)), Number(l.toFixed(2))]
};

const HSLToRGB = function HSLToRGB(h, s, l) {
    h = parseFloat(h);
    s = parseFloat(s);
    l = parseFloat(l);
    let _r = void 0,
        _g = void 0,
        _b = void 0;
    if (s == 0) {
        _r = _g = _b = l; // achromatic
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        _r = hue2rgb(p, q, h + 1 / 3);
        _g = hue2rgb(p, q, h);
        _b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(_r * 255), Math.round(_g * 255), Math.round(_b * 255)]
};

const calculateColor = (x, y, r, g, b, color) => {
    color.R = calculateRGB(r, x, y);
    color.G = calculateRGB(g, x, y);
    color.B = calculateRGB(b, x, y);
    return generateColor('rgb', color)
}

const calculateRGB = (num, x, y) => {
    return Math.round((255 - (255 - num) * (x / 400)) * (1 - y / 400))
}

const componentToHex = c => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

const generateColor = (type, color) => {
    switch (type) {
        case 'rgb':
            [color.H, color.S, color.L] = RGBToHSL(color.R, color.G, color.B)
            color.hex = rgbToHex(color.R, color.G, color.B)
            break;
        case 'hsl':
            [color.R, color.G, color.B] = HSLToRGB(color.H, color.S, color.L)
            color.hex = rgbToHex(color.R, color.G, color.B)
            break;
        case 'hex':
            const [R, G, B] = hexToRgb(color.hex);
            [color.H, color.S, color.L] = RGBToHSL(R, G, B);
            [color.R, color.G, color.B] = [R, G, B];
            console.log(color)
        break;

    }
    return color
}


const gPositionByColor = (color) => {
    let R = {
            name: 'r',
            value: color.R,
            calculate: null
        },
        G = {
            name: 'g',
            value: color.G,
            calculate: null
        },
        B = {
            name: 'b',
            value: color.B,
            calculate: null
        },
        _array = [R, G, B];
    _array.sort(function (b, a) {
        return a.value - b.value
    })
    let bgColor, position = {}
    if (_array[0].value == _array[1].value) {
        _array[0].calculate = 255;
        _array[1].calculate = 255;
        _array[2].calculate = 0;
        bgColor = 'rgb(' + R.calculate + ',' + G.calculate + ',' + B.calculate + ')';
        let y = 400 * (1 - _array[0].value / 255),
            x = 400 * (1 - _array[2].value / _array[0].value);
        position.top = y - 9 + 'px';
        position.left = x - 9 + 'px';

    } else {
        _array[0].calculate = 255;
        _array[2].calculate = 0;
        let y = 400 * (1 - _array[0].value / 255),
            x = 400 * (1 - _array[2].value / _array[0].value);
        _array[1].calculate = 255 - (400 / x) * (255 - 400 * _array[1].value / (400 - y))
        bgColor = 'rgb(' + Math.round(R.calculate) + ',' + Math.round(G.calculate) + ',' + Math.round(B.calculate) + ')';
        position.top = y - 9 + 'px';
        position.left = x - 9 + 'px';
    }

    return [bgColor, position]
}

const calculatePositionOnLine = (bgColor) => {
    const _bgred = parseInt(bgColor.slice(4, -1).split(',')[0]),
        _bggreen = parseInt(bgColor.slice(4, -1).split(',')[1]),
        _bgblue = parseInt(bgColor.slice(4, -1).split(',')[2]);
    const [H, S, L] = RGBToHSL(_bgred, _bggreen, _bgblue)
    return H
}

const gTarget = (target,min,length) => {
    if(target < min){
        return min
    } else if(target > min + length){
        return min + length
    }
    return target
}

export {
    calculateColor,
    generateColor,
    gPositionByColor,
    calculatePositionOnLine,
    gTarget
};