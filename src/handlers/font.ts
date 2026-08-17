import { getUser } from '../database/db';
import { convertText } from '../utils/fonts';

export async function handleTextMessage(ctx: any) {
  const userId = ctx.from?.id;
  const text = ctx.message?.text;

  if (!userId || !text) return;

  const user = getUser(userId);
  const converted = convertText(text, user.selected_font);

  await ctx.reply(converted);
}
export async function handleNonTextMessage(ctx: any) {
  await ctx.reply("Iltimos, matn yuboring!");
}