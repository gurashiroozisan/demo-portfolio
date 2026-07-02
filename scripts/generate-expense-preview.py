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
    ("Pending", "5", "#F59E0B"),
    ("Approved", "Y186,400", "#F43F5E"),
    ("Rejected", "1", "#EF4444"),
]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 380, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 162), "By Category", fill="#8892A8", font=font_sm)
cx, cy, r = 210, 290, 80
for start, extent, color in [(0, 120, "#F43F5E"), (120, 90, "#8B5CF6"), (210, 80, "#3B82F6"), (290, 70, "#22C55E")]:
    draw.pieslice([cx - r, cy - r, cx + r, cy + r], start, start + extent, fill=color)

draw.rounded_rectangle([420, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((436, 162), "Monthly Trend", fill="#8892A8", font=font_sm)
points = [(460, 380), (560, 340), (660, 360), (740, 300)]
for i in range(len(points) - 1):
    draw.line([points[i], points[i + 1]], fill="#F43F5E", width=3)
for p in points:
    draw.ellipse([p[0] - 5, p[1] - 5, p[0] + 5, p[1] + 5], fill="#F43F5E")

draw.text((40, 440), "ExpenseFlow - Expense Demo", fill="#E8ECF4", font=font_title)

out_dir = Path(__file__).resolve().parent.parent / "expense-demo" / "assets" / "images"
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / "preview.png"
img.save(out, "PNG")
print("Saved", out)
