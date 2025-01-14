import OpenAI from "openai";

export const analyze = async (prompt: string): Promise<string> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content || 'Cevap alınamadı.';
  } catch (error) {
    console.error('OpenAI Hatası:', error);
    throw new Error('OpenAI ile bağlantı kurulamadı.');
  }
};
