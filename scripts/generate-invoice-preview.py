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
    ("Total Billed", "Y6.9M", "#F59E0B"),
    ("Paid", "Y3.2M", "#22C55E"),
    ("Overdue", "Y1.3M", "#EF4444"),
]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 162), "Monthly Invoices", fill="#8892A8", font=font_sm)
for i, h in enumerate([100, 140, 120, 180, 160, 200]):
    x = 80 + i * 110
    draw.rectangle([x, 400 - h, x + 60, 400], fill="#F59E0B")

draw.ellipse([580, 200, 720, 340], outline="#2a3040", width=2)
draw.pieslice([590, 210, 710, 330], start=0, end=200, fill="#22C55E")
draw.pieslice([590, 210, 710, 330], start=200, end=300, fill="#F59E0B")
draw.pieslice([590, 210, 710, 330], start=300, end=360, fill="#EF4444")

draw.text((40, 440), "BillTrack - Invoice Demo", fill="#E8ECF4", font=font_title)

out_dir = Path(__file__).resolve().parent.parent / "invoice-demo" / "assets" / "images"
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / "preview.png"
img.save(out, "PNG")
print("Saved", out)
