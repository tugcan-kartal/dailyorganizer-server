import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

export const analyze = async (prompt: string): Promise<string> => {
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