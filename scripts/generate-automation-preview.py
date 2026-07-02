# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0B0F19")
draw = ImageDraw.Draw(img)

font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)

kpis = [("Total Sales", "Y348,600", "#22C55E"), ("Count", "42", "#3B82F6"), ("Avg", "Y8,300", "#F59E0B")]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 162), "Monthly Revenue", fill="#8892A8", font=font_sm)
for i, h in enumerate([120, 180, 150, 220, 200, 260]):
    x = 80 + i * 110
    draw.rectangle([x, 400 - h, x + 60, 400], fill="#3B82F6")

draw.text((40, 440), "SalesFlow - Automation Demo", fill="#E8ECF4", font=font_title)

out = r"c:\Users\akimi\Desktop\programming\for work tool\automation-demo\assets\images\preview.png"
img.save(out, "PNG")
print("Saved", out)
