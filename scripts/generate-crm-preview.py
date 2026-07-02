# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0B0F19")
draw = ImageDraw.Draw(img)

font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)

kpis = [("Total", "8", "#3B82F6"), ("Active", "3", "#3B82F6"), ("Follow-up", "4", "#F59E0B")]
for i, (label, val, color) in enumerate(kpis):
    x = 40 + i * 250
    draw.rounded_rectangle([x, 40, x + 220, 120], radius=8, fill="#141B2D", outline="#2a3040")
    draw.text((x + 16, 52), label, fill="#8892A8", font=font_sm)
    draw.text((x + 16, 78), val, fill=color, font=font_lg)

draw.rounded_rectangle([40, 150, 760, 420], radius=8, fill="#141B2D", outline="#2a3040")
headers = ["Name", "Company", "Status", "Follow-up"]
for i, h in enumerate(headers):
    draw.text((56 + i * 170, 168), h, fill="#8892A8", font=font_sm)

rows = [
    ("Tanaka", "Bloom Inc.", "Active", "Jul 5"),
    ("Sato", "Salon R", "Won", "Aug 12"),
    ("Suzuki", "Individual", "Lead", "Jul 3"),
    ("Takahashi", "Tech Co.", "Active", "Jul 4"),
]
for r, row in enumerate(rows):
    y = 200 + r * 48
    draw.line([(56, y + 36), (744, y + 36)], fill="#2a3040")
    for c, cell in enumerate(row):
        color = "#3B82F6" if cell == "Active" else "#22C55E" if cell == "Won" else "#A78BFA" if cell == "Lead" else "#E8ECF4"
        draw.text((56 + c * 170, y + 10), cell, fill=color, font=font_sm)

draw.text((40, 440), "CRM Lite - Customer Management", fill="#E8ECF4", font=font_title)

out = r"c:\Users\akimi\Desktop\programming\for work tool\crm-demo\assets\images\preview.png"
img.save(out, "PNG")
print("Saved", out)
