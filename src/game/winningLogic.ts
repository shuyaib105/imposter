import { Player, WinnerStatus } from '../types';

export interface VotingResultCalculation {
  imposterId: string;
  imposterVotes: number;
  highestNonImposterVotes: number;
  voteCounts: Record<string, number>;
  winnerStatus: WinnerStatus;
}

/**
 * Implements the exact winning logic specified in the design doc:
 *
 * Let:
 * I = Number of votes received by the Imposter.
 * M = Highest number of votes received by any non-Imposter player.
 *
 * Rule 1: Imposter receives more votes (I > M) -> IMPOSTER LOSES. All other players win (GROUP_WIN).
 * Rule 2: Another player receives more votes (M > I) -> IMPOSTER WINS.
 * Rule 3: Voting tie (I = M) -> NO WINNER – TIE.
 */
export function calculateWinningLogic(
  players: Player[],
  votes: Record<string, string>, // voterId -> targetId
  imposterId: string
): VotingResultCalculation {
  const voteCounts: Record<string, number> = {};
  players.forEach((p) => {
    voteCounts[p.id] = 0;
  });

  // Tally valid votes
  Object.entries(votes).forEach(([voterId, targetId]) => {
    // Prohibit self-voting
    if (voterId !== targetId && voteCounts[targetId] !== undefined) {
      voteCounts[targetId] += 1;
    }
  });

  const imposterVotes = voteCounts[imposterId] || 0;

  let highestNonImposterVotes = 0;
  players.forEach((p) => {
    if (p.id !== imposterId) {
      const v = voteCounts[p.id] || 0;
      if (v > highestNonImposterVotes) {
        highestNonImposterVotes = v;
      }
    }
  });

  let winnerStatus: WinnerStatus = 'NONE';
  if (imposterVotes > highestNonImposterVotes) {
    winnerStatus = 'GROUP_WIN';
  } else if (highestNonImposterVotes > imposterVotes) {
    winnerStatus = 'IMPOSTER_WIN';
  } else {
    // imposterVotes === highestNonImposterVotes
    winnerStatus = 'TIE';
  }

  return {
    imposterId,
    imposterVotes,
    highestNonImposterVotes,
    voteCounts,
    winnerStatus,
  };
}
