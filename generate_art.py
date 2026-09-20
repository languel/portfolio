import zlib
import struct
import math
import random

def make_png(width, height, rgb_bytes):
    line_bytes = width * 3
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter type 0: None
        raw.extend(rgb_bytes[y * line_bytes : (y + 1) * line_bytes])
    
    compressed = zlib.compress(bytes(raw), 9)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        return struct.pack('>I', len(data)) + c + crc

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png

def upscale(grid, src_w, src_h, scale=4):
    dst_w = src_w * scale
    dst_h = src_h * scale
    out = bytearray(dst_w * dst_h * 3)
    for y in range(dst_h):
        sy = y // scale
        for x in range(dst_w):
            sx = x // scale
            src_idx = (sy * src_w + sx) * 3
            dst_idx = (y * dst_w + x) * 3
            out[dst_idx] = grid[src_idx]
            out[dst_idx + 1] = grid[src_idx + 1]
            out[dst_idx + 2] = grid[src_idx + 2]
    return dst_w, dst_h, out

BAYER4 = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5]
]

def dither(val, x, y, levels=8):
    threshold = (BAYER4[y % 4][x % 4] / 16.0) - 0.5
    v = val + threshold / levels
    v = max(0.0, min(1.0, v))
    return int(round(v * (levels - 1)) * (255 / (levels - 1)))

def hash2d(x, y, seed=1337):
    n = (x * 374761393 + y * 668265263 + seed * 1013904223) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return (n ^ (n >> 16)) / 4294967295.0

def gen_project(idx, w=128, h=128):
    pixels = bytearray(w * h * 3)
    
    def set_px(x, y, r, g, b):
        if 0 <= x < w and 0 <= y < h:
            i = (y * w + x) * 3
            pixels[i] = max(0, min(255, int(r)))
            pixels[i+1] = max(0, min(255, int(g)))
            pixels[i+2] = max(0, min(255, int(b)))

    cx, cy = w / 2, h / 2
    random.seed(idx * 733 + 42)

    if idx == 1:
        # Project 1: The Monolith
        for y in range(h):
            for x in range(w):
                bg = int(12 + (y / h) * 16)
                if hash2d(x, y, 101) > 0.985 and y < h * 0.65:
                    s_bright = int(110 + hash2d(x, y, 102) * 130)
                    bg = s_bright
                if y > h * 0.65:
                    fy = (y - h * 0.65) / (h * 0.35)
                    grid_h = any(abs(y - int(h * 0.65 + (k / 10.0)**1.8 * (h * 0.35))) <= 0.6 for k in range(1, 11))
                    nx = (x - cx) / max(1.0, (fy * 70.0))
                    grid_v = abs(nx - round(nx)) < 0.08
                    bg = 55 if (grid_h or grid_v) else int(18 + fy * 14)
                set_px(x, y, bg, bg, bg + 4)

        for y in range(int(h * 0.12), int(h * 0.76)):
            prog = (y - h * 0.12) / (h * 0.64)
            half_w = int(5 + prog * 18)
            for x in range(int(cx - half_w), int(cx + half_w + 1)):
                nx = (x - cx) / float(half_w)
                if nx < 0:
                    val = 0.65 - prog * 0.2 + (nx + 1.0) * 0.15
                else:
                    val = 0.28 - prog * 0.12 + (1.0 - nx) * 0.12
                if abs(x - cx) <= 1:
                    if y % 8 < 6:
                        set_px(x, y, 225, 235, 255)
                    else:
                        set_px(x, y, 80, 100, 140)
                else:
                    d_val = dither(val, x, y, 9)
                    set_px(x, y, d_val, d_val, d_val + 6)
        for x in range(int(cx - 28), int(cx + 29)):
            dist = abs(x - cx) / 28.0
            set_px(x, int(h * 0.76), int(10 * dist), int(10 * dist), int(14 * dist))

    elif idx == 2:
        # Project 2: Megacity Spire
        for y in range(h):
            for x in range(w):
                bg = int(12 + (y / h) * 15)
                if hash2d(x, y, 202) > 0.99 and y < h * 0.4:
                    bg = 140
                set_px(x, y, bg, bg + 2, bg + 4)

        distant_towers = [(20, 100, 18, 55), (55, 95, 22, 60), (88, 100, 20, 50), (110, 105, 16, 45)]
        for bx, by, bw, bh in distant_towers:
            for dy in range(bh):
                py = by - dy
                for dx in range(-bw // 2, bw // 2 + 1):
                    px = bx + dx
                    c = 36 if dx < 0 else 24
                    set_px(px, py, c, c + 3, c + 6)

        fg_towers = [
            (28, 118, 24, 70), (52, 122, 28, 92), (78, 120, 26, 82), (102, 115, 22, 64)
        ]
        for bx, by, bw, bh in fg_towers:
            for dy in range(bh):
                py = by - dy
                for dx in range(-bw // 2, bw // 2 + 1):
                    px = bx + dx
                    if dx < 0:
                        shade = 0.55 - (dy / float(bh)) * 0.15
                    else:
                        shade = 0.28 - (dy / float(bh)) * 0.1
                    if (dy % 6 == 0) and (abs(dx) % 4 == 0) and hash2d(px, py, 404) > 0.42:
                        win_c = 220 if hash2d(px, py, 505) > 0.2 else 140
                        set_px(px, py, win_c - 10, win_c, win_c + 10)
                    else:
                        d_val = dither(shade, px, py, 7)
                        set_px(px, py, d_val, d_val + 2, d_val + 5)
            for ay in range(by - bh - 14, by - bh):
                set_px(bx, ay, 180, 185, 195)
            set_px(bx, by - bh - 15, 235, 80, 80)

    elif idx == 3:
        # Project 3: Modular Deep Space Probe
        for y in range(h):
            for x in range(w):
                bg = int(10 + (y / h) * 10)
                if hash2d(x, y, 303) > 0.985:
                    bg = int(120 + hash2d(x, y, 304) * 120)
                set_px(x, y, bg, bg, bg + 5)
        
        for r in range(22):
            for a in range(72):
                ang = a * (math.pi / 36)
                dx = int(math.cos(ang) * r * 0.65)
                dy = int(math.sin(ang) * (r * 0.3) - 24)
                dish_shade = dither(max(0.1, (22 - r) / 22.0 * 0.8), int(cx) + dx, int(cy) + dy, 6)
                set_px(int(cx) + dx, int(cy) + dy, dish_shade, dish_shade + 2, dish_shade + 8)
        for fy in range(int(cy - 40), int(cy - 24)):
            set_px(int(cx), fy, 220, 230, 240)
            
        for py in range(int(cy - 12), int(cy + 13)):
            for px in range(int(cx - 54), int(cx - 18)):
                is_frame = (px == int(cx - 54) or px == int(cx - 18) or py == int(cy - 12) or py == int(cy + 12) or px % 7 == 0 or py % 4 == 0)
                c = 190 if is_frame else 48
                set_px(px, py, c - 10, c, c + 15)
            for px in range(int(cx + 18), int(cx + 55)):
                is_frame = (px == int(cx + 18) or px == int(cx + 54) or py == int(cy - 12) or py == int(cy + 12) or px % 7 == 0 or py % 4 == 0)
                c = 190 if is_frame else 48
                set_px(px, py, c - 10, c, c + 15)
        
        for y in range(int(cy - 18), int(cy + 24)):
            for x in range(int(cx - 14), int(cx + 15)):
                nx = (x - cx) / 14.0
                intensity = math.sqrt(max(0.0, 1.0 - nx * nx))
                v = dither(intensity * 0.75, x, y, 7)
                set_px(x, y, v, v + 2, v + 6)
        for ox in range(-3, 4):
            for oy in range(-3, 4):
                if ox*ox + oy*oy <= 9:
                    set_px(int(cx) + ox, int(cy + 4) + oy, 230, 245, 255)

    elif idx == 4:
        # Project 4: Microcode Architecture / Dense Circuit Board
        for y in range(h):
            for x in range(w):
                set_px(x, y, 10, 12, 14)
        for y in range(6, h - 6, 6):
            for x in range(6, w - 6, 6):
                set_px(x, y, 22, 25, 30)

        # Draw multiple chip blocks
        chips = [
            (cx, cy, 38, 38),
            (28, 28, 20, 20),
            (w - 28, 28, 20, 20),
            (28, h - 28, 20, 20),
            (w - 28, h - 28, 20, 20),
        ]
        for cpx, cpy, cw, ch in chips:
            for y in range(int(cpy - ch/2), int(cpy + ch/2 + 1)):
                for x in range(int(cpx - cw/2), int(cpx + cw/2 + 1)):
                    border = (x == int(cpx - cw/2) or x == int(cpx + cw/2) or y == int(cpy - ch/2) or y == int(cpy + ch/2))
                    if border:
                        set_px(x, y, 180, 190, 200)
                    else:
                        d_v = dither(0.3, x, y, 5)
                        set_px(x, y, d_v, d_v + 3, d_v + 5)
            # Pins around each chip
            for px in range(int(cpx - cw/2 + 3), int(cpx + cw/2 - 2), 3):
                set_px(px, int(cpy - ch/2 - 2), 170, 180, 195)
                set_px(px, int(cpy + ch/2 + 2), 170, 180, 195)
            for py in range(int(cpy - ch/2 + 3), int(cpy + ch/2 - 2), 3):
                set_px(int(cpx - cw/2 - 2), py, 170, 180, 195)
                set_px(int(cpx + cw/2 + 2), py, 170, 180, 195)

        # Dense interconnect bus lines
        buses = [
            [(38, 28), (cx - 20, 28), (cx - 20, cy - 20)],
            [(w - 38, 28), (cx + 20, 28), (cx + 20, cy - 20)],
            [(38, h - 28), (cx - 20, h - 28), (cx - 20, cy + 20)],
            [(w - 38, h - 28), (cx + 20, h - 28), (cx + 20, cy + 20)],
            [(28, 38), (28, h - 38)],
            [(w - 28, 38), (w - 28, h - 38)],
            [(cx, cy - 20), (cx, 10)],
            [(cx, cy + 20), (cx, h - 10)],
            [(cx - 20, cy), (10, cy)],
            [(cx + 20, cy), (w - 10, cy)],
        ]
        for bus in buses:
            for j in range(len(bus) - 1):
                p1, p2 = bus[j], bus[j+1]
                steps = int(max(abs(p2[0] - p1[0]), abs(p2[1] - p1[1]))) + 1
                for s in range(steps):
                    tx = int(round(p1[0] + (p2[0] - p1[0]) * (s / float(steps))))
                    ty = int(round(p1[1] + (p2[1] - p1[1]) * (s / float(steps))))
                    set_px(tx, ty, 140, 155, 175)
        # Glowing status LEDs
        for lx, ly in [(cx - 8, cy - 8), (cx + 8, cy - 8), (cx, cy + 6), (28, 28), (w - 28, 28)]:
            for ox in range(-1, 2):
                for oy in range(-1, 2):
                    set_px(int(lx + ox), int(ly + oy), 220, 240, 255)

    elif idx == 5:
        # Project 5: Celestial Eclipse & Ringed Planet
        for y in range(h):
            for x in range(w):
                bg = int(8 + (y / h) * 12)
                if hash2d(x, y, 501) > 0.985:
                    s_val = int(120 + hash2d(x, y, 502) * 120)
                    bg = s_val
                set_px(x, y, bg, bg, bg + 2)

        pr = 36
        for a in range(360):
            ang = a * (math.pi / 180.0)
            sin_a = math.sin(ang)
            cos_a = math.cos(ang)
            if sin_a < 0:
                for r in range(44, 58):
                    rx = int(cx + cos_a * r)
                    ry = int(cy + sin_a * (r * 0.35))
                    if math.hypot(rx - cx, ry - cy) > pr:
                        d_v = dither((58 - abs(r - 51) * 3) / 60.0 * 0.7, rx, ry, 6)
                        set_px(rx, ry, d_v, d_v + 2, d_v + 6)

        for y in range(int(cy - pr), int(cy + pr + 1)):
            for x in range(int(cx - pr), int(cx + pr + 1)):
                dx = x - cx
                dy = y - cy
                dist = math.hypot(dx, dy)
                if dist <= pr:
                    lx, ly, lz = -0.55, -0.7, 0.45
                    norm_z = math.sqrt(max(0.0, pr*pr - dx*dx - dy*dy)) / pr
                    dot = (dx/pr) * lx + (dy/pr) * ly + norm_z * lz
                    band = math.sin(dy * 0.28 + math.sin(dx * 0.12) * 2.2) * 0.12
                    val = max(0.0, min(1.0, dot * 0.9 + 0.35 + band)) * (norm_z ** 0.3)
                    d_val = dither(val, x, y, 10)
                    set_px(x, y, d_val, d_val + 2, d_val + 6)

        for a in range(360):
            ang = a * (math.pi / 180.0)
            sin_a = math.sin(ang)
            cos_a = math.cos(ang)
            if sin_a >= 0:
                for r in range(44, 58):
                    rx = int(cx + cos_a * r)
                    ry = int(cy + sin_a * (r * 0.35))
                    d_v = dither((58 - abs(r - 51) * 3) / 60.0 * 0.9, rx, ry, 7)
                    set_px(rx, ry, d_v + 5, d_v + 7, d_v + 12)

    elif idx == 6:
        # Project 6: Cybernetic Skull & Neural Interface
        for y in range(h):
            for x in range(w):
                bg = 11 if (x % 16 == 0 or y % 16 == 0) else 8
                set_px(x, y, bg, bg + 2, bg + 4)

        # Skull cranium & jaw
        for y in range(16, 114):
            ny = (y - 16) / 98.0
            if ny < 0.38:
                hw = int(math.sqrt(max(0.0, 1.0 - ((ny - 0.38) / 0.38)**2)) * 34)
            elif ny < 0.65:
                # cheekbones & temple
                hw = int(32 - (ny - 0.38) * 24)
            elif ny < 0.82:
                # maxilla
                hw = int(22 - (ny - 0.65) * 12)
            else:
                # chin
                hw = int(18 - (ny - 0.82) * 25)
            hw = max(3, hw)

            for dx in range(-hw, hw + 1):
                px = int(cx + dx)
                nx = dx / float(hw)
                # 3D sphere/cylinder lighting
                light = 0.55 - abs(nx) * 0.35 - (ny - 0.5) * 0.15
                
                # Eye sockets
                in_eye = (44 <= y <= 58) and (8 <= abs(dx) <= 22)
                # Nasal aperture
                in_nose = (60 <= y <= 72) and (abs(dx) <= int((y - 60) * 0.5))
                # Teeth slots
                in_teeth = (80 <= y <= 92) and (abs(dx) <= 16) and (abs(dx) % 4 == 0)

                if in_eye:
                    # Glowing red/white cybernetic ocular core on left eye
                    if dx < 0 and 48 <= y <= 54 and 12 <= abs(dx) <= 18:
                        set_px(px, y, 240, 245, 255)
                    else:
                        set_px(px, y, 10, 12, 15)
                elif in_nose or in_teeth:
                    set_px(px, y, 15, 16, 20)
                else:
                    d_v = dither(light, px, y, 9)
                    set_px(px, y, d_v, d_v + 2, d_v + 5)
        # Temple cyber cables
        for py in range(50, 110, 2):
            set_px(int(cx - 36 + (py - 50)*0.1), py, 90, 100, 115)
            set_px(int(cx + 36 - (py - 50)*0.1), py, 70, 80, 95)

    elif idx == 7:
        # Project 7: Mineral Resonance / Crystal Cluster
        for y in range(h):
            for x in range(w):
                bg = int(10 + (y / h) * 16)
                if hash2d(x, y, 701) > 0.988:
                    bg = int(140 + hash2d(x, y, 702) * 100)
                set_px(x, y, bg, bg, bg + 4)
        
        crystals = [
            (cx, cy + 26, 76, 20, 0),
            (cx - 24, cy + 30, 56, 15, -0.22),
            (cx + 24, cy + 32, 60, 16, 0.24),
            (cx - 38, cy + 36, 42, 12, -0.42),
            (cx + 38, cy + 38, 44, 13, 0.38),
        ]
        for sx, sy, sh, sw, rot in crystals:
            for dy in range(sh):
                prog = dy / float(sh)
                cw = int((1.0 - abs(prog - 0.3) * 1.25) * sw)
                cw = max(1, cw)
                py = int(sy - dy)
                for dx in range(-cw, cw + 1):
                    px = int(sx + dx + (dy - sh / 2) * rot)
                    if dx < 0:
                        v = 0.72 - (dx / -cw) * 0.35
                    else:
                        v = 0.38 + (dx / cw) * 0.35
                    if dy > sh - 5:
                        v = 0.98
                    d_val = dither(v, px, py, 9)
                    set_px(px, py, d_val - 4, d_val + 2, d_val + 10)
        for _ in range(30):
            mx = int(cx + random.uniform(-45, 45))
            my = int(cy + random.uniform(-40, 20))
            set_px(mx, my, 220, 240, 255)

    elif idx == 8:
        # Project 8: Wireframe Mountain Horizon & Synth Sun
        for y in range(h):
            for x in range(w):
                set_px(x, y, 9, 10, 13)

        scx, scy, sr = cx, int(h * 0.40), 30
        for y in range(scy - sr, scy + sr):
            for x in range(int(scx - sr), int(scx + sr)):
                d = math.hypot(x - scx, y - scy)
                if d <= sr:
                    slit = (y - (scy - sr)) / float(2 * sr)
                    line_gap = int(2 + slit * 4)
                    if (y % line_gap) != 0:
                        v = 0.65 + (1.0 - slit) * 0.35
                        d_val = dither(v, x, y, 6)
                        set_px(x, y, d_val, d_val, d_val + 2)

        # Wireframe Mountain Landscape (perspective heightmap grid)
        for row in range(16):
            fy = (row / 15.0) ** 1.8
            base_y = int(h * 0.44 + fy * (h * 0.54))
            line_pts = []
            for col in range(33):
                col_x = int(col * (w / 32.0))
                nx = (col_x - cx) / float(w / 2)
                # Mountain ridge elevation
                m_height = (math.sin(nx * 4.2) * 12.0 + math.sin(nx * 9.0) * 6.0 + 10.0) * ((1.0 - fy) ** 1.3)
                py = int(base_y - m_height)
                line_pts.append((col_x, py))
            # Draw horizontal wireframe segment
            for col in range(32):
                p1, p2 = line_pts[col], line_pts[col+1]
                steps = max(abs(p2[0] - p1[0]), abs(p2[1] - p1[1])) + 1
                for s in range(steps):
                    lx = int(p1[0] + (p2[0] - p1[0]) * (s / float(steps)))
                    ly = int(p1[1] + (p2[1] - p1[1]) * (s / float(steps)))
                    c = int(fy * 170 + 45)
                    set_px(lx, ly, c - 10, c, c + 15)

    elif idx == 9:
        # Project 9: Hyperdimensional Torus Knot
        for y in range(h):
            for x in range(w):
                set_px(x, y, 11, 12, 15)

        for y in range(h):
            for x in range(w):
                d = math.hypot(x - cx, y - cy)
                if d < 55:
                    v = int((1.0 - d / 55.0) * 22)
                    set_px(x, y, 11 + v, 12 + v, 15 + v + 3)

        steps = 4500
        for step in range(steps):
            t = (step / float(steps)) * math.pi * 4.0
            p = 3
            q = 4
            r = 0.5 * (2.0 + math.sin(q * t))
            kx = r * math.cos(p * t) * 28.0
            ky = r * math.sin(p * t) * 28.0
            kz = math.cos(q * t) * 18.0

            px = int(cx + kx)
            py = int(cy + ky)
            tube_r = int(3 + (kz + 18) / 36.0 * 2.5)
            
            for ox in range(-tube_r, tube_r + 1):
                for oy in range(-tube_r, tube_r + 1):
                    if ox*ox + oy*oy <= tube_r * tube_r:
                        depth_norm = (kz + 18) / 36.0
                        shade = max(0.12, min(0.96, depth_norm * 0.7 + (ox * -0.2 - oy * 0.2) / float(tube_r)))
                        d_val = dither(shade, px + ox, py + oy, 8)
                        set_px(px + ox, py + oy, d_val, d_val + 2, d_val + 5)

    elif idx == 10:
        # Project 10: Glitch Waveform & Oscillograph
        for y in range(h):
            for x in range(w):
                bg = 8 if y % 2 == 0 else 14
                set_px(x, y, bg, bg + 2, bg + 3)

        for x in range(w):
            w1 = cy - 8 + math.sin(x * 0.11) * 20 + math.cos(x * 0.035) * 14
            w2 = cy - 8 + math.sin(x * 0.055 + 1.2) * 32 + (math.sin(x * 0.28) * 8 if 35 < x < 95 else 0)
            
            for y in range(h):
                d1 = abs(y - w1)
                d2 = abs(y - w2)
                if d1 < 2.5:
                    v = int(245 - d1 * 75)
                    set_px(x, y, v - 20, v, v + 25)
                elif d2 < 2.0:
                    v = int(185 - d2 * 65)
                    set_px(x, y, v, v, v)
        
        for bx in range(12, w - 12, 4):
            bar_h = int(math.sin(bx * 0.22) * 16 + math.cos(bx * 0.1) * 8 + 20)
            for by in range(h - 18 - bar_h, h - 18):
                if by == h - 18 - bar_h:
                    set_px(bx, by, 220, 240, 255)
                    set_px(bx + 1, by, 220, 240, 255)
                else:
                    set_px(bx, by, 110, 125, 145)
                    set_px(bx + 1, by, 110, 125, 145)

    elif idx == 11:
        # Project 11: Tactical Assault Mecha Rig
        for y in range(h):
            for x in range(w):
                bg = int(10 + (y / h) * 14)
                if (x % 24 == 0) or (y % 24 == 0):
                    bg += 8
                set_px(x, y, bg, bg + 2, bg + 4)

        # Hangar floor
        for y in range(112, h):
            for x in range(w):
                set_px(x, y, 22, 24, 28)
        # Shadow underneath
        for sx in range(int(cx - 36), int(cx + 37)):
            set_px(sx, 114, 8, 8, 10)
            set_px(sx, 115, 12, 12, 15)

        # Upper missile pods & shoulder shields
        for px in range(int(cx - 36), int(cx - 20)):
            for py in range(24, 46):
                c = 85 if (px % 4 == 0 or py % 6 == 0) else 50
                set_px(px, py, c, c + 3, c + 6)
        for px in range(int(cx + 20), int(cx + 37)):
            for py in range(24, 46):
                c = 70 if (px % 4 == 0 or py % 6 == 0) else 40
                set_px(px, py, c, c + 3, c + 6)

        # Heavy Torso Chassis
        for y in range(28, 64):
            prog = (y - 28) / 36.0
            hw = int(22 - prog * 7)
            for x in range(int(cx - hw), int(cx + hw + 1)):
                nx = (x - cx) / float(hw) if hw > 0 else 0
                val = 0.65 - abs(nx) * 0.35
                d_val = dither(val, x, y, 8)
                set_px(x, y, d_val, d_val + 2, d_val + 4)

        # Cockpit canopy / visor
        for cy_box in range(36, 44):
            for cx_box in range(int(cx - 10), int(cx + 11)):
                set_px(cx_box, cy_box, 230, 245, 255)

        # Hydraulic Pelvis & Two articulated legs
        for y in range(62, 70):
            for x in range(int(cx - 10), int(cx + 11)):
                set_px(x, y, 60, 65, 75)

        leg_joints = [
            [(cx - 14, 68), (cx - 26, 88), (cx - 22, 110), (cx - 26, 114)],
            [(cx + 14, 68), (cx + 26, 88), (cx + 22, 110), (cx + 26, 114)],
        ]
        for leg in leg_joints:
            for j in range(len(leg) - 1):
                p1, p2 = leg[j], leg[j+1]
                steps = 35
                for s in range(steps):
                    lx = int(p1[0] + (p2[0] - p1[0]) * (s / float(steps)))
                    ly = int(p1[1] + (p2[1] - p1[1]) * (s / float(steps)))
                    for ox in range(-3, 4):
                        for oy in range(-3, 4):
                            set_px(lx + ox, ly + oy, 110, 118, 128)
            foot = leg[-1]
            for fx in range(int(foot[0] - 8), int(foot[0] + 9)):
                for fy in range(int(foot[1]), int(foot[1] + 4)):
                    set_px(fx, fy, 160, 170, 180)

    elif idx == 12:
        # Project 12: Arcane Cybernetic Sigil & Orbital Glyphs
        for y in range(h):
            for x in range(w):
                set_px(x, y, 10, 11, 13)

        for r in [52, 44, 34, 22, 10]:
            for a in range(360):
                ang = a * (math.pi / 180.0)
                if r == 52 and (a % 10 < 3):
                    continue
                if r == 44 and (a % 15 < 4):
                    continue
                px = int(cx + math.cos(ang) * r)
                py = int(cy + math.sin(ang) * r)
                set_px(px, py, 140, 150, 165)

        for a in range(8):
            ang = a * (math.pi / 4.0)
            for r in range(12, 56):
                px = int(cx + math.cos(ang) * r)
                py = int(cy + math.sin(ang) * r)
                is_tick = (r % 8 == 0) or (r > 48)
                c = 210 if is_tick else 110
                set_px(px, py, c - 10, c, c + 15)

        for s in range(4):
            a1 = s * (math.pi / 2.0) + math.pi / 4.0
            a2 = (s + 1) * (math.pi / 2.0) + math.pi / 4.0
            p1x, p1y = cx + math.cos(a1) * 28, cy + math.sin(a1) * 28
            p2x, p2y = cx + math.cos(a2) * 28, cy + math.sin(a2) * 28
            for step in range(60):
                px = int(p1x + (p2x - p1x) * (step / 60.0))
                py = int(p1y + (p2y - p1y) * (step / 60.0))
                set_px(px, py, 190, 200, 215)

        for y in range(int(cy - 6), int(cy + 7)):
            for x in range(int(cx - 6), int(cx + 7)):
                if abs(x - cx) + abs(y - cy) <= 6:
                    set_px(x, y, 235, 245, 255)

    return pixels

# Generate all 12 projects and upscale 4x to 512x512
for i in range(1, 13):
    px = gen_project(i, 128, 128)
    up_w, up_h, up_px = upscale(px, 128, 128, scale=4)
    png_bytes = make_png(up_w, up_h, up_px)
    path = f"images/project-{i:02d}.png"
    with open(path, "wb") as f:
        f.write(png_bytes)
    print(f"Generated {path} ({up_w}x{up_h}, {len(png_bytes)} bytes)")
