# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0B0F19")
draw = ImageDraw.Draw(img)

font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
font_doc = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 12)

draw.rounded_rectangle([40, 40, 380, 420], radius=8, fill="#141B2D", outline="#2a3040")
draw.text((56, 52), "Input Form", fill="#8892A8", font=font_sm)
draw.rounded_rectangle([56, 80, 364, 110], radius=4, fill="#1C2540", outline="#2a3040")
draw.text((68, 88), "Client: Sample Corp", fill="#E8ECF4", font=font_doc)
for y, text in [(130, "Web Design    x1  Y500,000"), (160, "Support       x3  Y45,000"), (190, "+ Add line item")]:
    draw.text((68, y), text, fill="#8892A8" if y == 190 else "#E8ECF4", font=font_doc)
draw.rounded_rectangle([56, 360, 180, 390], radius=4, fill="#8B5CF6")
draw.text((72, 368), "PDF Export", fill="#fff", font=font_doc)

draw.rounded_rectangle([420, 40, 760, 420], radius=8, fill="#FFFFFF", outline="#2a3040")
draw.text((520, 58), "QUOTE", fill="#8B5CF6", font=font_lg)
draw.text((440, 100), "Sample Corp", fill="#333", font=font_doc)
draw.line([440, 130, 740, 130], fill="#8B5CF6", width=2)
for y, text in [(150, "Item          Qty    Amount"), (175, "Web Design     1   Y500,000"), (200, "Support        3    Y45,000")]:
    draw.text((440, y), text, fill="#555" if y == 150 else "#333", font=font_doc)
draw.line([440, 340, 740, 340], fill="#8B5CF6", width=2)
draw.text((440, 350), "Total", fill="#333", font=font_doc)
draw.text((640, 350), "Y599,500", fill="#8B5CF6", font=font_lg)

draw.text((40, 440), "QuoteQuick - Quote Demo", fill="#E8ECF4", font=font_title)

out_dir = Path(__file__).resolve().parent.parent / "quote-demo" / "assets" / "images"
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / "preview.png"
img.save(out, "PNG")
print("Saved", out)
