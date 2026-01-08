import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MOODS = [
  { mood: "Happy", emoji: "😊" },
  { mood: "Chill", emoji: "😌" },
  { mood: "Energetic", emoji: "⚡" },
  { mood: "Inspired", emoji: "✨" },
  { mood: "Melancholic", emoji: "🌧️" },
  { mood: "Romantic", emoji: "💖" },
  { mood: "Party", emoji: "🎉" },
  { mood: "Focused", emoji: "🎧" },
  { mood: "Calm", emoji: "🌿" },
];

function simpleHeuristic(input: string): { mood: string; emoji: string } {
  const text = input.toLowerCase();
  if (/(happy|joy|smile|great|awesome|yay)/.test(text)) return { mood: "Happy", emoji: "😊" };
  if (/(sad|blue|down|cry|alone)/.test(text)) return { mood: "Melancholic", emoji: "🌧️" };
  if (/(party|dance|club|friday|celebrate)/.test(text)) return { mood: "Party", emoji: "🎉" };
  if (/(love|heart|romance|kiss)/.test(text)) return { mood: "Romantic", emoji: "💖" };
  if (/(focus|work|study|deep)/.test(text)) return { mood: "Focused", emoji: "🎧" };
  if (/(chill|relax|calm|peace)/.test(text)) return { mood: "Chill", emoji: "😌" };
  if (/(run|gym|lift|pump|energy|hype)/.test(text)) return { mood: "Energetic", emoji: "⚡" };
  return FALLBACK_MOODS[Math.floor(Math.random() * FALLBACK_MOODS.length)];
}

export async function generateMood(params: {
  caption?: string | null;
  audioUrl?: string | null;
  photoUrl?: string | null;
}): Promise<{ mood: string; emoji: string }> {
  const { caption, audioUrl, photoUrl } = params;
  const context = [caption, audioUrl, photoUrl].filter(Boolean).join(" | ");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return simpleHeuristic(context);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You will be given content describing a social whisper (caption and optional media links). Infer a concise emotional mood label (one or two words) and an appropriate single emoji. Reply ONLY as JSON with keys mood and emoji. Content: ${context || "(no content)"}`;
    const result = await model.generateContent(prompt);
    const text = (await result.response.text()).trim();
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      const json = JSON.parse(text.slice(firstBrace, lastBrace + 1));
      if (typeof json.mood === "string" && typeof json.emoji === "string") {
        return { mood: json.mood, emoji: json.emoji };
      }
    }
    return simpleHeuristic(context);
  } catch (err) {
    return simpleHeuristic(context);
  }
}
