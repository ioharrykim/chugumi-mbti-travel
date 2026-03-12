import { LETTER_COLORS } from '@/lib/constants';
import { GrowthTip, MbtiComparisonRow, ResultType } from '@/lib/types';

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const STORY_MARGIN_X = 84;

const palette = {
  ink: '#10213F',
  muted: '#7A869C',
  softText: 'rgba(16, 33, 63, 0.7)',
  border: 'rgba(255,255,255,0.82)',
  white: 'rgba(255,255,255,0.86)',
  blue: '#55B6FF',
  indigo: '#2D62D9',
  coral: '#FF9270',
  sun: '#FFC86A',
};

export interface StoryExportImage {
  fileName: string;
  title: string;
  url: string;
}

interface StoryExportInput {
  actualMbti: string;
  chugumiMbti: string;
  resultType: ResultType;
  comparisonRows: MbtiComparisonRow[];
  matchRate: number;
  matchMessage: string;
  growthTips: GrowthTip[];
}

interface FontFamilies {
  display: string;
  strong: string;
  body: string;
}

type BrandLogoAsset = HTMLImageElement | null;

interface TextLayout {
  fontSize: number;
  height: number;
  lineHeight: number;
  lines: string[];
}

interface FitTextOptions {
  family: string;
  fontWeight?: number;
  letterSpacing?: number;
  lineHeightRatio?: number;
  maxHeight: number;
  maxWidth: number;
  maxFontSize: number;
  minFontSize?: number;
  text: string;
}

interface DrawTextOptions extends FitTextOptions {
  align?: CanvasTextAlign;
  color?: string;
  x: number;
  y: number;
}

function getFontFamilies(): FontFamilies {
  const styles = getComputedStyle(document.documentElement);

  return {
    display: styles.getPropertyValue('--font-display').trim() || 'sans-serif',
    strong: styles.getPropertyValue('--font-strong').trim() || 'sans-serif',
    body: styles.getPropertyValue('--font-body').trim() || 'sans-serif',
  };
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient,
  strokeStyle?: string,
) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function setFont(ctx: CanvasRenderingContext2D, family: string, size: number, weight = 400) {
  ctx.font = `${weight} ${size}px ${family}`;
}

function textWidth(ctx: CanvasRenderingContext2D, text: string, letterSpacing = 0) {
  if (!text) return 0;
  return ctx.measureText(text).width + Math.max(0, text.length - 1) * letterSpacing;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing = 0,
) {
  let cursor = x;

  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + letterSpacing;
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  letterSpacing = 0,
) {
  const blocks = text.replace(/\r\n?/g, '\n').split('\n');
  const lines: string[] = [];

  blocks.forEach((rawBlock) => {
    const block = rawBlock.trim();

    if (!block) {
      lines.push('');
      return;
    }

    let current = '';
    for (const char of block) {
      const next = `${current}${char}`;
      const nextWidth = textWidth(ctx, next, letterSpacing);

      if (nextWidth > maxWidth && current) {
        lines.push(current.trimEnd());
        current = char === ' ' ? '' : char;
        continue;
      }

      if (nextWidth > maxWidth) {
        lines.push(char);
        current = '';
        continue;
      }

      current = next;
    }

    if (current.trim()) {
      lines.push(current.trimEnd());
    }
  });

  while (lines.length > 1 && !lines[lines.length - 1]) {
    lines.pop();
  }

  return lines.length ? lines : [''];
}

function fitTextBlock(ctx: CanvasRenderingContext2D, options: FitTextOptions): TextLayout {
  const {
    family,
    fontWeight = 400,
    letterSpacing = 0,
    lineHeightRatio = 1.3,
    maxHeight,
    maxWidth,
    maxFontSize,
    minFontSize = 12,
    text,
  } = options;

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    setFont(ctx, family, fontSize, fontWeight);
    const lines = wrapText(ctx, text, maxWidth, letterSpacing);
    const lineHeight = Math.round(fontSize * lineHeightRatio);
    const height = Math.max(lines.length, 1) * lineHeight;

    if (height <= maxHeight) {
      return { fontSize, height, lineHeight, lines };
    }
  }

  setFont(ctx, family, minFontSize, fontWeight);
  const lines = wrapText(ctx, text, maxWidth, letterSpacing);
  const lineHeight = Math.round(minFontSize * lineHeightRatio);

  return {
    fontSize: minFontSize,
    height: Math.max(lines.length, 1) * lineHeight,
    lineHeight,
    lines,
  };
}

function drawTextBlock(ctx: CanvasRenderingContext2D, options: DrawTextOptions) {
  const {
    align = 'left',
    color = palette.ink,
    family,
    fontWeight = 400,
    letterSpacing = 0,
    lineHeightRatio = 1.3,
    maxHeight,
    maxWidth,
    maxFontSize,
    minFontSize = 12,
    text,
    x,
    y,
  } = options;

  const layout = fitTextBlock(ctx, {
    family,
    fontWeight,
    letterSpacing,
    lineHeightRatio,
    maxHeight,
    maxWidth,
    maxFontSize,
    minFontSize,
    text,
  });

  setFont(ctx, family, layout.fontSize, fontWeight);
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';

  layout.lines.forEach((line, index) => {
    const lineWidth = textWidth(ctx, line, letterSpacing);
    let drawX = x;

    if (align === 'center') {
      drawX = x + (maxWidth - lineWidth) / 2;
    }
    if (align === 'right') {
      drawX = x + maxWidth - lineWidth;
    }

    drawLine(ctx, line, drawX, y + index * layout.lineHeight, letterSpacing);
  });

  return layout;
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
  gradient.addColorStop(0, '#F7FBFF');
  gradient.addColorStop(0.34, '#ECF8FF');
  gradient.addColorStop(0.68, '#FFF8EF');
  gradient.addColorStop(1, '#EEF8FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#6B87A8';
  ctx.lineWidth = 1;
  for (let x = 0; x <= STORY_WIDTH; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, STORY_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= STORY_HEIGHT; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STORY_WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  const orbA = ctx.createRadialGradient(170, 190, 20, 170, 190, 240);
  orbA.addColorStop(0, 'rgba(255,200,106,0.22)');
  orbA.addColorStop(1, 'rgba(255,200,106,0)');
  ctx.fillStyle = orbA;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const orbB = ctx.createRadialGradient(920, 160, 40, 920, 160, 280);
  orbB.addColorStop(0, 'rgba(85,182,255,0.24)');
  orbB.addColorStop(1, 'rgba(85,182,255,0)');
  ctx.fillStyle = orbB;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
}

function drawAccent(ctx: CanvasRenderingContext2D, x: number, y: number, width = 92) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, palette.coral);
  gradient.addColorStop(1, palette.blue);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, 4);
}

function drawBrandLogo(ctx: CanvasRenderingContext2D, fonts: FontFamilies, brandLogo: BrandLogoAsset) {
  if (brandLogo) {
    const maxWidth = 194;
    const maxHeight = 122;
    const scale = Math.min(maxWidth / brandLogo.width, maxHeight / brandLogo.height);
    const width = brandLogo.width * scale;
    const height = brandLogo.height * scale;

    ctx.drawImage(brandLogo, 128, 99 + (maxHeight - height) / 2, width, height);
    return;
  }

  drawTextBlock(ctx, {
    text: '추구미',
    x: 130,
    y: 108,
    maxWidth: 180,
    maxHeight: 110,
    family: fonts.display,
    maxFontSize: 88,
    minFontSize: 72,
    fontWeight: 800,
    lineHeightRatio: 0.9,
  });
}

function drawHeader(ctx: CanvasRenderingContext2D, fonts: FontFamilies, title: string, brandLogo: BrandLogoAsset) {
  fillRoundedRect(ctx, 84, 72, 912, 178, 74, 'rgba(255,255,255,0.72)', palette.border);

  drawBrandLogo(ctx, fonts, brandLogo);

  drawAccent(ctx, 376, 150, 78);

  drawTextBlock(ctx, {
    text: '여행\nMBTI',
    x: 478,
    y: 118,
    maxWidth: 240,
    maxHeight: 96,
    family: fonts.strong,
    maxFontSize: 32,
    minFontSize: 24,
    fontWeight: 700,
    lineHeightRatio: 1.02,
    letterSpacing: 4,
    color: palette.muted,
    align: 'center',
  });

  drawTextBlock(ctx, {
    text: title,
    x: 712,
    y: 126,
    maxWidth: 220,
    maxHeight: 48,
    family: fonts.strong,
    maxFontSize: 34,
    minFontSize: 24,
    fontWeight: 700,
    lineHeightRatio: 1,
    letterSpacing: 3,
    color: '#9BA4B5',
    align: 'center',
  });
}

function drawSectionKicker(ctx: CanvasRenderingContext2D, fonts: FontFamilies, label: string, x: number, y: number) {
  drawAccent(ctx, x, y + 30, 92);
  drawTextBlock(ctx, {
    text: label,
    x: x + 112,
    y,
    maxWidth: 420,
    maxHeight: 50,
    family: fonts.strong,
    maxFontSize: 30,
    minFontSize: 22,
    fontWeight: 700,
    letterSpacing: 4,
    lineHeightRatio: 1.1,
    color: palette.muted,
  });
}

function drawCodeRow(ctx: CanvasRenderingContext2D, fonts: FontFamilies, code: string, y: number) {
  const size = 136;
  const gap = 30;
  const startX = (STORY_WIDTH - (size * 4 + gap * 3)) / 2;

  code.split('').forEach((letter, index) => {
    const boxX = startX + index * (size + gap);
    fillRoundedRect(ctx, boxX, y, size, size, 34, 'rgba(255,255,255,0.74)');
    drawTextBlock(ctx, {
      text: letter,
      x: boxX,
      y: y + 24,
      maxWidth: size,
      maxHeight: 88,
      family: fonts.display,
      maxFontSize: 84,
      minFontSize: 72,
      fontWeight: 800,
      lineHeightRatio: 1,
      color: LETTER_COLORS[index] ?? palette.ink,
      align: 'center',
    });
  });
}

function drawEmojiBubble(ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number) {
  fillRoundedRect(ctx, x, y, 168, 168, 42, 'rgba(255,255,255,0.74)');
  ctx.font = '82px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(emoji, x + 42, y + 34);
}

function drawMbtiPanel(
  ctx: CanvasRenderingContext2D,
  fonts: FontFamilies,
  options: { label: string; code: string; x: number; y: number; width: number; height: number; tone?: string; codeColor: string },
) {
  const { label, code, x, y, width, height, tone = 'rgba(255,255,255,0.74)', codeColor } = options;

  fillRoundedRect(ctx, x, y, width, height, 48, tone);
  drawTextBlock(ctx, {
    text: label,
    x,
    y: y + 42,
    maxWidth: width,
    maxHeight: 44,
    family: fonts.strong,
    maxFontSize: 32,
    minFontSize: 24,
    fontWeight: 700,
    lineHeightRatio: 1,
    letterSpacing: 4,
    color: '#9BA4B5',
    align: 'center',
  });
  drawTextBlock(ctx, {
    text: code,
    x,
    y: y + 108,
    maxWidth: width,
    maxHeight: 110,
    family: fonts.display,
    maxFontSize: 88,
    minFontSize: 66,
    fontWeight: 800,
    lineHeightRatio: 1,
    color: codeColor,
    align: 'center',
  });
}

function drawTagFlow(ctx: CanvasRenderingContext2D, fonts: FontFamilies, tags: string[], x: number, y: number, maxWidth: number) {
  let currentX = x;
  let currentY = y;
  const rowGap = 16;
  const tagGap = 14;

  tags.forEach((tag) => {
    setFont(ctx, fonts.strong, 28, 700);
    const width = textWidth(ctx, tag) + 50;
    if (currentX + width > x + maxWidth) {
      currentX = x;
      currentY += 74 + rowGap;
    }

    fillRoundedRect(ctx, currentX, currentY, width, 64, 32, 'rgba(85,182,255,0.12)');
    drawTextBlock(ctx, {
      text: tag,
      x: currentX + 24,
      y: currentY + 17,
      maxWidth: width - 30,
      maxHeight: 30,
      family: fonts.strong,
      maxFontSize: 28,
      minFontSize: 24,
      fontWeight: 700,
      lineHeightRatio: 1,
      color: palette.indigo,
    });

    currentX += width + tagGap;
  });
}

function drawGuideCard(
  ctx: CanvasRenderingContext2D,
  fonts: FontFamilies,
  tip: GrowthTip,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  fillRoundedRect(ctx, x, y, width, height, 52, 'rgba(255,255,255,0.78)', palette.border);
  fillRoundedRect(ctx, x + 28, y + 28, 92, 92, 28, 'rgba(85,182,255,0.1)');
  ctx.font = '52px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.fillText(tip.icon, x + 47, y + 48);

  drawTextBlock(ctx, {
    text: tip.direction,
    x: x + 144,
    y: y + 34,
    maxWidth: width - 172,
    maxHeight: 32,
    family: fonts.strong,
    maxFontSize: 28,
    minFontSize: 20,
    fontWeight: 700,
    letterSpacing: 3,
    lineHeightRatio: 1,
    color: '#9BA4B5',
  });

  drawTextBlock(ctx, {
    text: tip.title,
    x: x + 144,
    y: y + 72,
    maxWidth: width - 172,
    maxHeight: 92,
    family: fonts.display,
    maxFontSize: width < 500 ? 46 : 54,
    minFontSize: 28,
    fontWeight: 800,
    lineHeightRatio: 0.98,
    color: palette.ink,
  });

  const bulletText = tip.tips
    .split('|')
    .map((item) => `• ${item}`)
    .join('\n');

  drawTextBlock(ctx, {
    text: bulletText,
    x: x + 34,
    y: y + 164,
    maxWidth: width - 68,
    maxHeight: height - 198,
    family: fonts.body,
    maxFontSize: width < 500 ? 24 : 26,
    minFontSize: 16,
    fontWeight: 300,
    lineHeightRatio: 1.32,
    color: palette.softText,
  });
}

function renderResultStory(
  ctx: CanvasRenderingContext2D,
  fonts: FontFamilies,
  input: StoryExportInput,
  brandLogo: BrandLogoAsset,
) {
  drawBackground(ctx);
  drawHeader(ctx, fonts, '결과', brandLogo);

  fillRoundedRect(ctx, STORY_MARGIN_X, 304, 912, 720, 74, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '나의 추구미 결과', 146, 390);

  drawTextBlock(ctx, {
    text: input.resultType.title,
    x: 146,
    y: 476,
    maxWidth: 540,
    maxHeight: 170,
    family: fonts.display,
    maxFontSize: 76,
    minFontSize: 42,
    fontWeight: 800,
    lineHeightRatio: 0.95,
    color: palette.ink,
  });

  drawTextBlock(ctx, {
    text: input.resultType.sub,
    x: 146,
    y: 664,
    maxWidth: 540,
    maxHeight: 150,
    family: fonts.strong,
    maxFontSize: 44,
    minFontSize: 24,
    fontWeight: 700,
    lineHeightRatio: 1.08,
    color: palette.softText,
  });

  drawEmojiBubble(ctx, input.resultType.emoji, 736, 474);
  drawCodeRow(ctx, fonts, input.chugumiMbti, 838);

  fillRoundedRect(ctx, STORY_MARGIN_X, 1052, 912, 520, 68, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '결과 설명', 146, 1130);
  drawTextBlock(ctx, {
    text: input.resultType.description,
    x: 146,
    y: 1220,
    maxWidth: 760,
    maxHeight: 300,
    family: fonts.body,
    maxFontSize: 38,
    minFontSize: 20,
    fontWeight: 300,
    lineHeightRatio: 1.35,
    color: palette.softText,
  });

  fillRoundedRect(ctx, STORY_MARGIN_X, 1604, 912, 194, 56, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '결과 키워드', 146, 1650);
  drawTagFlow(
    ctx,
    fonts,
    input.resultType.hashtags.split(/\s+/).filter(Boolean),
    146,
    1710,
    760,
  );
}

function renderCompareStory(
  ctx: CanvasRenderingContext2D,
  fonts: FontFamilies,
  input: StoryExportInput,
  brandLogo: BrandLogoAsset,
) {
  drawBackground(ctx);
  drawHeader(ctx, fonts, '비교', brandLogo);

  fillRoundedRect(ctx, STORY_MARGIN_X, 304, 912, 604, 74, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '실제 VS 추구미', 146, 390);

  drawMbtiPanel(ctx, fonts, {
    label: '실제 MBTI',
    code: input.actualMbti,
    x: 146,
    y: 500,
    width: 788,
    height: 194,
    codeColor: palette.ink,
  });

  drawTextBlock(ctx, {
    text: '→',
    x: 0,
    y: 718,
    maxWidth: STORY_WIDTH,
    maxHeight: 80,
    family: fonts.display,
    maxFontSize: 84,
    minFontSize: 62,
    fontWeight: 800,
    lineHeightRatio: 1,
    color: palette.coral,
    align: 'center',
  });

  drawMbtiPanel(ctx, fonts, {
    label: '추구미 MBTI',
    code: input.chugumiMbti,
    x: 146,
    y: 800,
    width: 788,
    height: 194,
    tone: 'rgba(85,182,255,0.1)',
    codeColor: palette.indigo,
  });

  fillRoundedRect(ctx, STORY_MARGIN_X, 940, 912, 370, 68, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '일치율', 146, 1016);
  drawTextBlock(ctx, {
    text: `${input.matchRate}%`,
    x: 146,
    y: 1110,
    maxWidth: 310,
    maxHeight: 120,
    family: fonts.display,
    maxFontSize: 98,
    minFontSize: 70,
    fontWeight: 800,
    lineHeightRatio: 1,
    color: palette.ink,
  });

  fillRoundedRect(ctx, 480, 1188, 416, 34, 17, 'rgba(255,255,255,0.84)');
  const progressGradient = ctx.createLinearGradient(480, 0, 896, 0);
  progressGradient.addColorStop(0, palette.coral);
  progressGradient.addColorStop(0.55, palette.blue);
  progressGradient.addColorStop(1, palette.indigo);
  fillRoundedRect(ctx, 480, 1188, 416 * (input.matchRate / 100), 34, 17, progressGradient);

  drawTextBlock(ctx, {
    text: input.matchMessage,
    x: 146,
    y: 1262,
    maxWidth: 760,
    maxHeight: 92,
    family: fonts.body,
    maxFontSize: 36,
    minFontSize: 20,
    fontWeight: 300,
    lineHeightRatio: 1.28,
    color: palette.softText,
  });

  fillRoundedRect(ctx, STORY_MARGIN_X, 1346, 912, 452, 68, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '축별 비교', 146, 1422);

  const cardWidth = 392;
  const cardHeight = 122;
  const cardGap = 20;
  input.comparisonRows.forEach((row, index) => {
    const column = index % 2;
    const line = Math.floor(index / 2);
    const cardX = 146 + column * (cardWidth + cardGap);
    const cardY = 1500 + line * (cardHeight + cardGap);

    fillRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 34, 'rgba(255,255,255,0.74)');
    drawTextBlock(ctx, {
      text: row.label,
      x: cardX + 24,
      y: cardY + 20,
      maxWidth: 190,
      maxHeight: 28,
      family: fonts.strong,
      maxFontSize: 24,
      minFontSize: 18,
      fontWeight: 700,
      lineHeightRatio: 1,
      color: palette.muted,
    });
    drawTextBlock(ctx, {
      text: `${row.actual} → ${row.chugumi}`,
      x: cardX + 24,
      y: cardY + 56,
      maxWidth: 190,
      maxHeight: 42,
      family: fonts.display,
      maxFontSize: 40,
      minFontSize: 28,
      fontWeight: 800,
      lineHeightRatio: 1,
      color: row.changed ? palette.indigo : palette.ink,
    });
    drawTextBlock(ctx, {
      text: row.changed ? '변화' : '유지',
      x: cardX + 236,
      y: cardY + 46,
      maxWidth: 132,
      maxHeight: 34,
      family: fonts.strong,
      maxFontSize: 24,
      minFontSize: 18,
      fontWeight: 700,
      letterSpacing: 2,
      lineHeightRatio: 1,
      color: row.changed ? palette.indigo : '#9BA4B5',
      align: 'center',
    });
  });
}

function renderGuideStory(
  ctx: CanvasRenderingContext2D,
  fonts: FontFamilies,
  input: StoryExportInput,
  brandLogo: BrandLogoAsset,
) {
  drawBackground(ctx);
  drawHeader(ctx, fonts, '가이드', brandLogo);

  fillRoundedRect(ctx, STORY_MARGIN_X, 304, 912, 292, 74, 'rgba(255,255,255,0.78)', palette.border);
  drawSectionKicker(ctx, fonts, '성장 가이드', 146, 386);
  drawTextBlock(ctx, {
    text: '여행에서 바로 써먹는 변화 팁',
    x: 146,
    y: 472,
    maxWidth: 760,
    maxHeight: 112,
    family: fonts.display,
    maxFontSize: 62,
    minFontSize: 34,
    fontWeight: 800,
    lineHeightRatio: 0.96,
    color: palette.ink,
  });
  drawTextBlock(ctx, {
    text: '이번 테스트에서 바뀐 축만 골라 실제 행동 팁으로 정리했습니다.',
    x: 146,
    y: 620,
    maxWidth: 760,
    maxHeight: 70,
    family: fonts.body,
    maxFontSize: 34,
    minFontSize: 20,
    fontWeight: 300,
    lineHeightRatio: 1.3,
    color: palette.softText,
  });

  fillRoundedRect(ctx, STORY_MARGIN_X, 688, 912, 1110, 68, 'rgba(255,255,255,0.78)', palette.border);

  const tips = input.growthTips.length
    ? input.growthTips
    : [
        {
          direction: 'MATCH',
          icon: '🏆',
          title: '이미 추구미 여행자에 도달!',
          tips: '현실 성향과 이상적인 여행 캐릭터가 이미 완전히 맞아떨어지는 상태입니다.|이번 여행은 새로운 캐릭터를 만들기보다 원래 잘하던 방식을 더 세련되게 밀어주면 됩니다.',
        },
      ];

  if (tips.length <= 2) {
    const cardGap = 28;
    const cardHeight = tips.length === 1 ? 970 : 471;

    tips.forEach((tip, index) => {
      drawGuideCard(ctx, fonts, tip, 118, 742 + index * (cardHeight + cardGap), 844, cardHeight);
    });
    return;
  }

  const cardWidth = 410;
  const cardHeight = 500;
  const columnGap = 24;
  const rowGap = 24;

  tips.slice(0, 4).forEach((tip, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    drawGuideCard(
      ctx,
      fonts,
      tip,
      118 + column * (cardWidth + columnGap),
      742 + row * (cardHeight + rowGap),
      cardWidth,
      cardHeight,
    );
  });
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context를 가져오지 못했습니다.');
  }

  ctx.textBaseline = 'top';
  return { canvas, ctx };
}

function exportCanvas(canvas: HTMLCanvasElement) {
  return canvas.toDataURL('image/png');
}

async function loadBrandLogo(): Promise<BrandLogoAsset> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `${window.location.origin}/brand-logo.svg`;
  });
}

export async function generateStoryExportImages(input: StoryExportInput): Promise<StoryExportImage[]> {
  await document.fonts.ready;
  const fonts = getFontFamilies();
  const brandLogo = await loadBrandLogo();

  const stories = [
    {
      title: '1번 스토리',
      fileName: 'chugumi-story-1-result.png',
      render: (ctx: CanvasRenderingContext2D) => renderResultStory(ctx, fonts, input, brandLogo),
    },
    {
      title: '2번 스토리',
      fileName: 'chugumi-story-2-compare.png',
      render: (ctx: CanvasRenderingContext2D) => renderCompareStory(ctx, fonts, input, brandLogo),
    },
    {
      title: '3번 스토리',
      fileName: 'chugumi-story-3-guide.png',
      render: (ctx: CanvasRenderingContext2D) => renderGuideStory(ctx, fonts, input, brandLogo),
    },
  ];

  return stories.map((story) => {
    const { canvas, ctx } = createCanvas();
    story.render(ctx);
    return {
      fileName: story.fileName,
      title: story.title,
      url: exportCanvas(canvas),
    };
  });
}
