const RGBToHSL = (r, g, b) =>{
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
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
    this._inputRGB[3].value = h.toFixed(2);
    this._inputRGB[4].value = s.toFixed(2);
    this._inputRGB[5].value = l.toFixed(2);
}

const HSLToRGB = (h, s, l) => {
    h = parseFloat(h);
    s = parseFloat(s);
    l = parseFloat(l);
    let _r, _g, _b;
    if (s == 0) {
        _r = _g = _b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        _r = hue2rgb(p, q, h + 1 / 3);
        _g = hue2rgb(p, q, h);
        _b = hue2rgb(p, q, h - 1 / 3);
    }
    this._inputRGB[0].value = Math.round(_r * 255);
    this._inputRGB[1].value = Math.round(_g * 255);
    this._inputRGB[2].value = Math.round(_b * 255);
}

export { HSLToRGB, RGBToHSL }
