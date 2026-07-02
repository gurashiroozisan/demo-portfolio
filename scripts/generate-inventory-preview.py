# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0B0F19")
draw = ImageDraw.Draw(img)

font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)

kpis = [
    ("Products", "20", "#14B8A6"),
    ("Low Stock", "7", "#F59E0B"),
    ("Out of Stock", "3", "#EF4444"),
]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 480, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 162), "Stock by Category", fill="#8892A8", font=font_sm)
heights = [180, 120, 90, 150, 60, 140]
for i, h in enumerate(heights):
    x = 70 + i * 65
    draw.rectangle([x, 400 - h, x + 45, 400], fill="#14B8A6")

draw.rounded_rectangle([510, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((526, 162), "Turnover", fill="#8892A8", font=font_sm)
draw.ellipse([550, 210, 720, 380], outline="#2a3040", width=2)
draw.pieslice([560, 220, 710, 370], start=0, end=220, fill="#14B8A6")
draw.pieslice([560, 220, 710, 370], start=220, end=300, fill="#3B82F6")
draw.pieslice([560, 220, 710, 370], start=300, end=360, fill="#8892A8")

draw.text((40, 440), "StockAlert - Inventory Demo", fill="#E8ECF4", font=font_title)

out_dir = Path(__file__).resolve().parent.parent / "inventory-demo" / "assets" / "images"
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / "preview.png"
img.save(out, "PNG")
print("Saved", out)
