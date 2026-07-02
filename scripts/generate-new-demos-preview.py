# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

BASE = r"c:\Users\akimi\Desktop\programming\for work tool"
font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)

def save(path, img):
    img.save(path, "PNG")
    print("Saved", path)

# SyncBridge
W, H = 800, 500
img = Image.new("RGB", (W, H), "#0B0F19")
d = ImageDraw.Draw(img)
d.rounded_rectangle([30, 30, 370, 470], radius=10, fill="#141B2D", outline="#2a3040")
d.text((50, 50), "Triggers", fill="#8B5CF6", font=font_sm)
for i, t in enumerate(["New Order", "Webhook", "Sheet Sync"]):
    d.rounded_rectangle([50, 90 + i * 55, 350, 130 + i * 55], radius=6, fill="#1C2540", outline="#3a4050")
    d.text((65, 102 + i * 55), t, fill="#E8ECF4", font=font_sm)
d.rounded_rectangle([400, 30, 770, 470], radius=10, fill="#141B2D", outline="#2a3040")
d.text((420, 50), "Spreadsheet Sync", fill="#8892A8", font=font_sm)
headers = ["Time", "Event", "Status"]
for i, h in enumerate(headers):
    d.text((420 + i * 110, 85), h, fill="#8892A8", font=font_sm)
rows = [("14:32", "order_1042", "OK"), ("14:28", "inquiry_88", "OK"), ("14:15", "webhook", "OK")]
for r, row in enumerate(rows):
    y = 115 + r * 40
    for c, cell in enumerate(row):
        col = "#22C55E" if cell == "OK" else "#E8ECF4"
        d.text((420 + c * 110, y), cell, fill=col, font=font_sm)
d.text((30, 455), "SyncBridge - API Integration", fill="#E8ECF4", font=font_title)
save(f"{BASE}/api-sync-demo/assets/images/preview.png", img)

# FlowBoard Kanban
img = Image.new("RGB", (W, H), "#0B0F19")
d = ImageDraw.Draw(img)
cols = [("Todo", "#8892A8"), ("Doing", "#F59E0B"), ("Done", "#22C55E")]
for i, (name, color) in enumerate(cols):
    x = 30 + i * 255
    d.rounded_rectangle([x, 40, x + 235, 430], radius=10, fill="#141B2D", outline="#2a3040")
    d.text((x + 16, 55), name, fill=color, font=font_sm)
    for j in range(2 if i < 2 else 1):
        cy = 90 + j * 95
        d.rounded_rectangle([x + 12, cy, x + 223, cy + 80], radius=6, fill="#1C2540", outline="#3a4050")
        d.text((x + 24, cy + 14), f"Task {i*2+j+1}", fill="#E8ECF4", font=font_sm)
        d.text((x + 24, cy + 38), "Owner: Yamada", fill="#8892A8", font=font_sm)
d.text((30, 455), "FlowBoard - Kanban", fill="#E8ECF4", font=font_title)
save(f"{BASE}/kanban-demo/assets/images/preview.png", img)

# MemberPortal
img = Image.new("RGB", (W, H), "#0B0F19")
d = ImageDraw.Draw(img)
d.rounded_rectangle([200, 60, 600, 420], radius=12, fill="#141B2D", outline="#2a3040")
d.text((230, 85), "MemberPortal", fill="#EC4899", font=font_lg)
d.text((230, 125), "Profile | Orders | Checkout", fill="#8892A8", font=font_sm)
d.rounded_rectangle([230, 160, 570, 220], radius=6, fill="#1C2540", outline="#3a4050")
d.text((245, 178), "Order #1042 - Paid", fill="#E8ECF4", font=font_sm)
d.rounded_rectangle([230, 240, 570, 360], radius=6, fill="#1C2540", outline="#EC4899")
d.text((245, 258), "Card **** 4242", fill="#E8ECF4", font=font_sm)
d.text((245, 290), "Pay JPY 12,800", fill="#EC4899", font=font_lg)
d.text((30, 455), "MemberPortal - Member & Payment", fill="#E8ECF4", font=font_title)
save(f"{BASE}/portal-demo/assets/images/preview.png", img)
