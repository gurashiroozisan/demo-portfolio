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
    ("Work Days", "462", "#22C55E"),
    ("Overtime", "142h", "#8B5CF6"),
    ("Absent", "12", "#F59E0B"),
]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 162), "Monthly Overtime (hours)", fill="#8892A8", font=font_sm)
for i, h in enumerate([90, 130, 110, 150, 140, 170]):
    x = 80 + i * 110
    draw.rectangle([x, 400 - h, x + 60, 400], fill="#8B5CF6")

draw.text((40, 440), "TimeTrack - Attendance Demo", fill="#E8ECF4", font=font_title)

out_dir = Path(__file__).resolve().parent.parent / "attendance-demo" / "assets" / "images"
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / "preview.png"
img.save(out, "PNG")
print("Saved", out)
