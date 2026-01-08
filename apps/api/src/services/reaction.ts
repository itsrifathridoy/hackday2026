import { prisma } from "@repo/db";

export async function getReactionCountsForWhisper(whisperId: string) {
  const reactions = await prisma.reaction.groupBy({
    by: ["type"],
    where: { whisperId },
    _count: true,
  });

  const counts = {
    love: 0,
    calm: 0,
    sad: 0,
    angry: 0,
    rainbow: 0,
  };

  reactions.forEach((reaction: { type: string; _count: number }) => {
    if (reaction.type in counts) {
      counts[reaction.type as keyof typeof counts] = reaction._count;
    }
  });

  return counts;
}

export async function getReactionCountsForWhispers(whisperIds: string[]) {
  if (whisperIds.length === 0) return {};

  const reactions = await prisma.reaction.groupBy({
    by: ["whisperId", "type"],
    where: { whisperId: { in: whisperIds } },
    _count: true,
  });

  const countsMap: Record<string, { love: number; calm: number; sad: number; angry: number; rainbow: number }> = {};

  whisperIds.forEach((id) => {
    countsMap[id] = { love: 0, calm: 0, sad: 0, angry: 0, rainbow: 0 };
  });

  reactions.forEach((reaction: { whisperId: string; type: string; _count: number }) => {
    if (reaction.whisperId in countsMap && reaction.type in countsMap[reaction.whisperId]) {
      countsMap[reaction.whisperId][reaction.type as keyof typeof countsMap[string]] = reaction._count;
    }
  });

  return countsMap;
}
