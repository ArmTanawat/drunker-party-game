// Shared Fisher-Yates-ish shuffle, used by any game that needs randomization
// (player order, role assignment, question order, etc.)
export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
