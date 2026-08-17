import { InlineKeyboard } from 'grammy';
import { getUser, updateUserFont, getUserCount } from '../database/db';

const fontsList = [
  { id: 'bold', label: '𝐁𝐨𝐥𝐝' },
  { id: 'italic', label: '𝐼𝑡𝑎𝑙𝑖𝑐' },
  { id: 'bold_italic', label: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄' },
  { id: 'monospace', label: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
  { id: 'script', label: '𝒮𝒸𝓇𝒾𝓅𝓉' },
  { id: 'bold_script', label: '𝓡𝓸𝓾𝓷𝓭' },
  { id: 'double_struck', label: '𝔻𝕠𝕦𝕓𝕝𝕖' },
  { id: 'sans_serif', label: '𝖲𝖺𝗇𝗌' },
  { id: 'sans_bold', label: '𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱' },
  { id: 'circled', label: 'Ⓒⓘⓡⓒⓛⓔⓓ' },
  { id: 'circled_dark', label: '🅒🅘🅡🅒🅛🅔🅓' },
  { id: 'squared', label: '🅂🅖🅄🄰🅁🄴🄳' },
  { id: 'squared_dark', label: '🅰🅱🅒' },
  { id: 'fullwidth', label: 'Ｆｕｌｌｗｉｄｔｈ' },
  { id: 'strikethrough', label: 'S̶t̶r̶i̶k̶e̶' },
  { id: 'underlined', label: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲' }
];

export function buildKeyboard(page: number = 0) {
  const keyboard = new InlineKeyboard();
  const itemsPerPage = 8;
  const totalPages = Math.ceil(fontsList.length / itemsPerPage);
  const start = page * itemsPerPage;
  const currentFonts = fontsList.slice(start, start + itemsPerPage);

  currentFonts.forEach((font, index) => {
    keyboard.text(font.label, `font_${font.id}`);
    if (index % 2 === 1) keyboard.row();
  });

  if (currentFonts.length % 2 !== 0) keyboard.row();

  const navRow = [];
  if (page > 0) navRow.push(InlineKeyboard.text('⬅️ Orqaga', `page_${page - 1}`));
  navRow.push(InlineKeyboard.text(`📄 ${page + 1}/${totalPages}`, 'ignore'));
  if (page < totalPages - 1) navRow.push(InlineKeyboard.text('Keyingisi ➡️', `page_${page + 1}`));

  keyboard.row(...navRow);
  return keyboard;
}

export async function handleStart(ctx: any) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const user = getUser(userId);
  const guideText = 
    `Assalomu alaykum!\n\n` +
    `<b>Botdan foydalanish ketma-ketligi:</b>\n` +
    `1️⃣ Quyidagi tugmalardan o'zingizga yoqqan shriftni tanlang.\n` +
    `2️⃣ Menga istalgan matningizni yuboring.\n` +
    `3️⃣ Men uni siz tanlagan shriftga o'girib beraman!\n\n` +
    `Hozirgi tanlangan shrift: <b>${user.selected_font}</b>`;

  await ctx.reply(guideText, { 
    parse_mode: "HTML", 
    reply_markup: buildKeyboard(0) 
  });
}

export async function handlePageSwitch(ctx: any) {
  const data = ctx.callbackQuery?.data;
  if (!data || data === 'ignore') return await ctx.answerCallbackQuery();

  const page = parseInt(data.replace('page_', ''), 10);
  if (isNaN(page)) return await ctx.answerCallbackQuery();

  try {
    await ctx.editMessageReplyMarkup({ reply_markup: buildKeyboard(page) });
  } catch (err) {
    //
  }
  await ctx.answerCallbackQuery();
}

export async function handleFontChange(ctx: any) {
  const userId = ctx.from?.id;
  const data = ctx.callbackQuery?.data;
  if (!userId || !data) return;

  const selectedFont = data.replace('font_', '');
  updateUserFont(userId, selectedFont);

  await ctx.answerCallbackQuery({ text: `Shrift ${selectedFont} ga o'zgartirildi!` });
  await ctx.reply(
    `Shrift <b>${selectedFont}</b> uslubiga o'zgardi!\n\nEndi menga matn yuborishingiz mumkin.`,
    { parse_mode: "HTML" }
  );
}

export async function handleStats(ctx: any) {
  const ADMIN_ID = 123456789; // Telegram ID raqamingizni kiriting

  if (ctx.from?.id !== ADMIN_ID) {
    return ctx.reply("Sizda bu buyruqni bajarish huquqi yo'q!");
  }

  const count = getUserCount();
  await ctx.reply(`📊 Botdan foydalanayotgan jami foydalanuvchilar: <b>${count}</b> ta`, { parse_mode: "HTML" });
}