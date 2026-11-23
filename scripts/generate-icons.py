#!/usr/bin/env python3
"""Generate the starter's app icons (no dependencies): a Vendure Blue chevron on the
near-black Vendure `primary` surface. Replace with your own brand assets.

    python3 scripts/generate-icons.py
"""
import math
import struct
import zlib

BG = (0x13, 0x17, 0x19)      # neutral-900 (Vendure primary, light mode)
BRAND = (0x17, 0xC1, 0xFF)   # Vendure Blue
WHITE = (0xFF, 0xFF, 0xFF)


def png(path, w, h, pixels):
    raw = b''.join(b'\x00' + bytes(pixels[y * w * 4:(y + 1) * w * 4]) for y in range(h))
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xFFFFFFFF)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    data += chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    open(path, 'wb').write(data)


def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def chevron_cov(x, y, size, scale):
    """Coverage (0..1) of a rounded 'V' chevron centred in a size×size canvas."""
    c = size / 2
    half_w, top, bottom, stroke = 0.30 * size * scale, c - 0.20 * size * scale, c + 0.22 * size * scale, 0.075 * size * scale
    cov = 0
    for sx in (0.25, 0.75):
        for sy in (0.25, 0.75):
            px, py = x + sx, y + sy
            d = min(seg_dist(px, py, c - half_w, top, c, bottom), seg_dist(px, py, c + half_w, top, c, bottom))
            cov += 1 if d <= stroke else 0
    return cov / 4


def render(size, scale, fg, bg=None, rounded=0.0):
    px = []
    r = rounded * size
    for y in range(size):
        for x in range(size):
            a_bg = 1.0
            if bg is None:
                a_bg = 0.0
            elif r:
                # rounded-rect mask (for the favicon)
                cx = min(max(x + 0.5, r), size - r)
                cy = min(max(y + 0.5, r), size - r)
                a_bg = 1.0 if math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r else 0.0
            cov = chevron_cov(x, y, size, scale)
            base = bg or (0, 0, 0)
            rgb = [round(fg[i] * cov + base[i] * (1 - cov)) for i in range(3)]
            alpha = max(a_bg, cov) if bg is not None else cov
            if bg is None:
                rgb = list(fg)
            px += rgb + [round(alpha * 255)]
    return px


def main():
    out = 'assets/images/'
    png(out + 'icon.png', 1024, 1024, render(1024, 1.0, BRAND, BG))
    # Android adaptive icon: foreground must sit inside the 66% safe zone.
    png(out + 'android-icon-foreground.png', 1024, 1024, render(1024, 0.62, BRAND))
    png(out + 'android-icon-background.png', 1024, 1024, [*BG, 255] * (1024 * 1024))
    png(out + 'android-icon-monochrome.png', 1024, 1024, render(1024, 0.62, WHITE))
    png(out + 'splash-icon.png', 512, 512, render(512, 1.0, BRAND))
    png(out + 'favicon.png', 48, 48, render(48, 1.0, BRAND, BG, rounded=0.2))
    print('icons written to', out)


if __name__ == '__main__':
    main()
