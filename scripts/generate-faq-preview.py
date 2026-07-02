# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

W, H = 800, 500
img = Image.new("RGB", (W, H), "#0f172a")
draw = ImageDraw.Draw(img)

font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_lg = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)

# Page background gradient hint
for y in range(H):
    r = int(15 + y * 0.02)
    g = int(23 + y * 0.03)
    b = int(42 + y * 0.04)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

draw.text((40, 50), "LUMIERE Salon", fill="#10B981", font=font_lg)
draw.text((40, 85), "Beauty salon demo page", fill="#8892A8", font=font_sm)

# Chat widget
draw.rounded_rectangle([480, 120, 760, 420], radius=12, fill="#141B2D", outline="#2a3040")
draw.rounded_rectangle([480, 120, 760, 165], radius=12, fill="#1C2540")
draw.ellipse([496, 132, 528, 164], fill="#10B981")
draw.text((538, 132), "HelpBot", fill="#E8ECF4", font=font_title)
draw.text((538, 152), "Online", fill="#10B981", font=font_sm)

# Bot message
draw.rounded_rectangle([496, 180, 720, 240], radius=8, fill="#1C2540")
draw.text((508, 192), "Hello! How can I help?", fill="#E8ECF4", font=font_sm)
draw.text((508, 212), "Hours, pricing, booking...", fill="#8892A8", font=font_sm)

# Suggestion chips
chips = ["Hours", "Pricing", "Booking", "Access"]
for i, chip in enumerate(chips):
    x = 496 + (i % 2) * 120
    y = 255 + (i // 2) * 32
    draw.rounded_rectangle([x, y, x + 100, y + 24], radius=12, outline="#10B981")
    draw.text((x + 12, y + 5), chip, fill="#10B981", font=font_sm)

# User message
draw.rounded_rectangle([580, 330, 744, 365], radius=8, fill="#10B981")
draw.text((592, 340), "Business hours?", fill="#fff", font=font_sm)

# FAB
draw.ellipse([700, 430, 756, 486], fill="#10B981")

draw.text((40, 440), "HelpBot - FAQ Chatbot", fill="#E8ECF4", font=font_title)

out = r"c:\Users\akimi\Desktop\programming\for work tool\faq-bot-demo\assets\images\preview.png"
img.save(out, "PNG")
print("Saved", out)
