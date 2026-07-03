# -*- coding: utf-8 -*-
"""Generate rich card preview images for LP/HP demos with sparse hero placeholders."""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = r"c:\Users\akimi\Desktop\programming\for work tool"
FONT = "C:/Windows/Fonts/meiryo.ttc"
FONT_B = "C:/Windows/Fonts/meiryob.ttc"
W, H = 800, 500


def font(size, bold=False):
    path = FONT_B if bold else FONT
    return ImageFont.truetype(path, size, index=0)


def save(path, img):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("Saved", path)


def media_preview():
    img = Image.new("RGB", (W, H), "#FAFAF8")
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 48], fill="#FFFFFF")
    d.line([0, 48, W, 48], fill="#E8E6E1", width=1)
    d.text((24, 14), "Tech & Life", fill="#1A1A18", font=font(18, True))
    d.text((620, 16), "記事一覧  カテゴリ", fill="#5C5C58", font=font(12))
    d.rounded_rectangle([700, 12, 776, 36], radius=4, fill="#F5E8E4")
    d.text((712, 16), "登録", fill="#D4543A", font=font(11))

    d.rectangle([0, 48, W, 200], fill="#2A2826")
    d.rectangle([0, 140, W, 200], fill="#1A1A18")
    d.text((24, 72), "MEDIA", fill="#D4543A", font=font(10))
    d.text((24, 92), "テクノロジーと、暮らしの交差点。", fill="#FFFFFF", font=font(22, True))
    d.text((24, 128), "ガジェット・働き方・ライフスタイル", fill="#C8C6C2", font=font(12))

    d.text((24, 218), "LATEST ARTICLES", fill="#D4543A", font=font(10))
    d.text((24, 236), "最新記事", fill="#1A1A18", font=font(16, True))

    cards = [
        ("テクノロジー", "AIが変える働き方", True),
        ("ライフスタイル", "ミニマルデスク術", False),
        ("ガジェット", "軽量ノートPC比較", False),
        ("キャリア", "副業の税金基礎", False),
    ]
    for i, (cat, title, featured) in enumerate(cards):
        if featured:
            x, y, cw, ch = 24, 268, 752, 72
            d.rounded_rectangle([x, y, x + cw, y + ch], radius=4, fill="#FFFFFF", outline="#E8E6E1")
            d.rectangle([x, y, x + 4, y + ch], fill="#D4543A")
        else:
            col = i - 1
            x = 24 + (col % 3) * 252
            y = 352 + (col // 3) * 0
            cw, ch = 236, 118
            d.rounded_rectangle([x, y, x + cw, y + ch], radius=4, fill="#FFFFFF", outline="#E8E6E1")
        d.text((x + 16, y + 14), cat.upper(), fill="#D4543A", font=font(9))
        d.text((x + 16, y + 32), title, fill="#1A1A18", font=font(13, True))
        d.rectangle([x + 16, y + 54, x + cw - 16, y + 60], fill="#F0EFEC")
        d.rectangle([x + 16, y + 68, x + cw - 80, y + 74], fill="#F0EFEC")

    save(f"{BASE}/media-site/assets/images/preview.png", img)


def saas_preview():
    img = Image.new("RGB", (W, H), "#0F0A1A")
    d = ImageDraw.Draw(img)

    for y in range(H):
        t = y / H
        r = int(15 + t * 8)
        g = int(10 + t * 5)
        b = int(26 + t * 12)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    d.rectangle([0, 0, W, 52], fill="#1A1230")
    d.text((24, 16), "TaskPilot", fill="#A78BFA", font=font(18, True))
    d.text((520, 18), "機能  料金", fill="#9B93B0", font=font(12))
    d.rounded_rectangle([660, 14, 776, 38], radius=6, fill="#7C5CFC")
    d.text((678, 18), "無料で始める", fill="#FFFFFF", font=font(11))

    d.text((24, 72), "PROJECT MANAGEMENT SAAS", fill="#A78BFA", font=font(10))
    d.text((24, 92), "チームのタスク管理を、", fill="#F0EDF8", font=font(20, True))
    d.text((24, 118), "もっとスマートに。", fill="#F0EDF8", font=font(20, True))
    d.rounded_rectangle([24, 148, 200, 180], radius=8, fill="#7C5CFC")
    d.text((42, 158), "14日間無料", fill="#FFFFFF", font=font(11))

    d.rounded_rectangle([280, 68, 776, 280], radius=12, fill="#1A1230", outline="#3D2F6E")
    cols = [("Todo", "#9B93B0"), ("Doing", "#F59E0B"), ("Done", "#22C55E")]
    for i, (name, color) in enumerate(cols):
        x = 300 + i * 155
        d.text((x, 88), name, fill=color, font=font(11, True))
        for j in range(2):
            cy = 112 + j * 72
            d.rounded_rectangle([x, cy, x + 135, cy + 58], radius=6, fill="#14102A", outline="#2E2550")
            d.text((x + 12, cy + 12), f"Task {i * 2 + j + 1}", fill="#E8E4F4", font=font(10))
            d.rectangle([x + 12, cy + 32, x + 100, cy + 38], fill="#2E2550")

    features = ["カンバン", "ガント", "レポート", "連携"]
    for i, name in enumerate(features):
        x = 24 + i * 188
        d.rounded_rectangle([x, 300, x + 172, 380], radius=10, fill="#1A1230", outline="#3D2F6E")
        d.text((x + 16, 318), name, fill="#F0EDF8", font=font(12, True))
        d.rectangle([x + 16, 342, x + 156, 348], fill="#2E2550")
        d.rectangle([x + 16, 358, x + 120, 364], fill="#2E2550")

    d.rounded_rectangle([24, 400, 776, 480], radius=10, fill="#5B3FD4")
    d.text((280, 430), "Starter  ¥0  /  Pro  ¥1,980  /  Business", fill="#FFFFFF", font=font(13, True))

    save(f"{BASE}/saas-lp/assets/images/preview.png", img)


def gyosei_preview():
    img = Image.new("RGB", (W, H), "#F7F8FA")
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 56], fill="#1A2B4A")
    d.text((24, 12), "行政書士 田中事務所", fill="#FFFFFF", font=font(14, True))
    d.text((24, 32), "Tanaka Administrative Scrivener", fill="#8FA4C4", font=font(8))
    d.text((580, 20), "業務内容  ご相談の流れ", fill="#C8D4E4", font=font(11))
    d.rounded_rectangle([700, 16, 776, 40], radius=2, fill="#3D6BB3")
    d.text((712, 22), "無料相談", fill="#FFFFFF", font=font(10))

    d.rectangle([0, 56, W, 190], fill="#0F1A2E")
    d.text((24, 80), "ADMINISTRATIVE SCRIVENER", fill="#8FA4C4", font=font(9))
    d.text((24, 100), "法的手続きを、", fill="#FFFFFF", font=font(20, True))
    d.text((24, 126), "確実にサポート。", fill="#FFFFFF", font=font(20, True))
    d.text((24, 158), "ビザ・会社設立・許認可申請", fill="#A8B8CC", font=font(11))
    d.rounded_rectangle([24, 168, 140, 188], fill="#3D6BB3")
    d.text((36, 172), "初回相談無料", fill="#FFFFFF", font=font(9))

    d.text((300, 210), "SERVICES", fill="#3D6BB3", font=font(10))
    d.text((300, 228), "業務内容", fill="#1A2B4A", font=font(16, True))

    services = [
        ("ビザ・在留資格", ["在留資格変更", "永住許可", "帰化申請"]),
        ("会社設立・法人", ["会社設立登記", "役員変更", "本店移転"]),
        ("許認可申請", ["飲食店許可", "建設業許可", "古物商許可"]),
    ]
    for i, (title, items) in enumerate(services):
        x = 24 + i * 252
        d.rounded_rectangle([x, 260, x + 236, 460], radius=2, fill="#FFFFFF", outline="#D8DEE8")
        d.rectangle([x, 260, x + 236, 263], fill="#3D6BB3")
        d.text((x + 16, 278), title, fill="#1A2B4A", font=font(12, True))
        d.rectangle([x + 16, 302, x + 220, 318], fill="#EEF2F7")
        for j, item in enumerate(items):
            d.text((x + 16, 328 + j * 28), f"・{item}", fill="#5A6B7D", font=font(10))

    save(f"{BASE}/gyosei-lp/assets/images/preview.png", img)


def hero_from_preview(preview_path, hero_path, size=(1600, 900)):
    img = Image.open(preview_path).convert("RGB")
    img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(hero_path, "JPEG", quality=88, optimize=True)
    print("Saved", hero_path)


if __name__ == "__main__":
    media_preview()
    saas_preview()
    gyosei_preview()

    for folder in ("media-site", "saas-lp", "gyosei-lp"):
        preview = f"{BASE}/{folder}/assets/images/preview.png"
        hero = f"{BASE}/{folder}/assets/images/hero.jpg"
        hero_from_preview(preview, hero)
