# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0f1419")
draw = ImageDraw.Draw(img)

# Window
draw.rounded_rectangle([60, 40, 740, 460], radius=10, fill="#1e1e1e", outline="#3c3c3c")
draw.rectangle([60, 40, 740, 68], fill="#323233")
for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
    draw.ellipse([76 + i * 20, 50, 88 + i * 20, 62], fill=c)

font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_b = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
draw.text((300, 48), "TidyDesk", fill="#858585", font=font)

# Sidebar
draw.rectangle([60, 68, 220, 460], fill="#252526")
draw.text((76, 88), "Downloads", fill="#0078d4", font=font)
draw.rectangle([76, 120, 204, 152], fill="#094771")
draw.text((88, 130), "Images", fill="#ccc", font=font)
draw.text((88, 158), "Documents", fill="#858585", font=font)

# File icons grid
icons = ["📄", "🖼", "🎬", "📦"]
for row in range(2):
    for col in range(4):
        x = 240 + col * 110
        y = 100 + row * 90
        draw.rounded_rectangle([x, y, x + 90, y + 70], radius=6, fill="#2d2d2d")

draw.rectangle([76, 400, 204, 432], fill="#0078d4")
draw.text((100, 410), "Organize", fill="#fff", font=font)

draw.text((60, 470), "TidyDesk - Desktop App Demo", fill="#8b949e", font=font_b)

out = r"c:\Users\akimi\Desktop\programming\for work tool\tidy-desk-demo\assets\images\preview.png"
import os
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, "PNG")
print("Saved", out)
