import zlib
import struct

def create_png(width, height, r, g, b, a=255):
    # Minimal valid PNG generator in pure Python without extra dependencies
    width_byte = struct.pack('>I', width)
    height_byte = struct.pack('>I', height)
    
    # 8-bit RGBA
    bit_depth = b'\x08'
    color_type = b'\x06'
    compression_method = b'\x00'
    filter_method = b'\x00'
    interlace_method = b'\x00'
    
    ihdr_data = width_byte + height_byte + bit_depth + color_type + compression_method + filter_method + interlace_method
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc
    
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            # Gradient effect from blue to purple with border radius illusion
            dist_x = min(x, width - 1 - x)
            dist_y = min(y, height - 1 - y)
            corner_radius = max(2, int(width * 0.2))
            
            # Simple rounded corners
            if dist_x < corner_radius and dist_y < corner_radius:
                corner_dx = corner_radius - dist_x
                corner_dy = corner_radius - dist_y
                if corner_dx * corner_dx + corner_dy * corner_dy > corner_radius * corner_radius:
                    raw_data.extend([0, 0, 0, 0])
                    continue
            
            ratio = y / max(1, height - 1)
            cur_r = int(59 * (1 - ratio) + 139 * ratio)
            cur_g = int(130 * (1 - ratio) + 92 * ratio)
            cur_b = int(246 * (1 - ratio) + 246 * ratio)

            # Draw a subtle center glyph/select line
            mid_y_start = int(height * 0.4)
            mid_y_end = int(height * 0.6)
            mid_x_start = int(width * 0.25)
            mid_x_end = int(width * 0.75)
            if mid_y_start <= y <= mid_y_end and mid_x_start <= x <= mid_x_end:
                cur_r, cur_g, cur_b = 255, 255, 255
            
            raw_data.extend([cur_r, cur_g, cur_b, 255])
            
    compressed = zlib.compress(bytes(raw_data))
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc
    
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    
    header = b'\x89PNG\r\n\x1a\n'
    return header + ihdr_chunk + idat_chunk + iend_chunk

for size in [16, 48, 128]:
    png_bytes = create_png(size, size, 59, 130, 246)
    with open(f"/opt/lampp/htdocs/super-select-dropdown/icons/icon{size}.png", "wb") as f:
        f.write(png_bytes)
print("Icons created successfully.")
