# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#0F1117")

for i in range(200, 0, -1):
    alpha = int(12 * (i / 200))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([W // 2 - i * 3, -80, W // 2 + i * 3, i * 2], fill=(108, 142, 255, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

draw = ImageDraw.Draw(img)

for x in range(0, W, 60):
    draw.line([(x, 0), (x, H)], fill="#1a1d27", width=1)
for y in range(0, H, 60):
    draw.line([(0, y), (W, y)], fill="#1a1d27", width=1)

draw.rectangle([80, 280, 140, 284], fill="#6C8EFF")

font_en_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 72)
font_jp = ImageFont.truetype("C:/Windows/Fonts/YuGothM.ttc", 36)
font_jp_sm = ImageFont.truetype("C:/Windows/Fonts/YuGothM.ttc", 24)
font_tag = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 18)

draw.text((80, 120), "PORTFOLIO HUB", fill="#6C8EFF", font=font_tag)
draw.text((80, 160), "Demo Portfolio", fill="#F0F0F5", font=font_en_lg)
draw.text((80, 310), "Web制作・LP制作 事例集", fill="#C8CCD8", font=font_jp)
draw.text((80, 380), "美容室 / カフェ / 士業 / 整体 / リフォーム / コーポレート", fill="#8B90A0", font=font_jp_sm)

tags = ["LP", "HP", "Demo", "2026"]
tx = 80
for tag in tags:
    tw = int(draw.textlength(tag, font=font_tag)) + 32
    draw.rounded_rectangle([tx, 480, tx + tw, 520], radius=20, outline="#2a3040", width=1, fill="#1A1D27")
    draw.text((tx + 16, 490), tag, fill="#8B90A0", font=font_tag)
    tx += tw + 12

draw.line([(1050, 80), (1120, 80), (1120, 150)], fill="#6C8EFF", width=3)
draw.line([(80, 550), (80, 580), (150, 580)], fill="#6C8EFF", width=3)

out = r"c:\Users\akimi\Desktop\programming\for work tool\assets\og-image.png"
img.save(out, "PNG", optimize=True)
print("Saved", out)
