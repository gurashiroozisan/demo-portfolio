# -*- coding: utf-8 -*-
"""Generate preview thumbnails for desktop utility demos."""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = r"c:\Users\akimi\Desktop\programming\for work tool"
FONT = "C:/Windows/Fonts/segoeui.ttf"
FONT_B = "C:/Windows/Fonts/segoeuib.ttf"

def make_preview(title, accent, subtitle, out_path):
    W, H = 800, 500
    img = Image.new("RGB", (W, H), "#0f1419")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([60, 40, 740, 460], radius=10, fill="#1e1e1e", outline="#3c3c3c")
    draw.rectangle([60, 40, 740, 68], fill="#323233")
    for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        draw.ellipse([76 + i * 20, 50, 88 + i * 20, 62], fill=c)
    f = ImageFont.truetype(FONT, 14)
    fb = ImageFont.truetype(FONT_B, 18)
    draw.text((320, 48), title, fill="#858585", font=f)
    draw.rounded_rectangle([100, 120, 700, 400], radius=8, fill="#252526", outline="#3c3c3c")
    draw.text((120, 140), subtitle, fill=accent, font=fb)
    draw.rectangle([120, 200, 680, 240], fill="#2d2d2d")
    draw.rectangle([120, 260, 680, 300], fill="#2d2d2d")
    draw.rectangle([120, 320, 400, 360], fill=accent)
    draw.text((200, 332), "Run Demo", fill="#fff", font=f)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    print("OK", out_path)

demos = [
    ("rename-demo", "BatchRename", "#0078d4", "Rename 24 files at once"),
    ("pdf-merge-demo", "PDF Stitch", "#e74c3c", "Merge PDFs in one click"),
    ("duplicate-demo", "DupScan", "#f39c12", "Find duplicate files"),
    ("resize-demo", "ResizeKit", "#9b59b6", "Batch resize images"),
    ("snippet-demo", "SnipPaste", "#1abc9c", "Quick text snippets"),
]
for folder, title, accent, sub in demos:
    make_preview(title, accent, sub, os.path.join(BASE, folder, "assets", "images", "preview.png"))
