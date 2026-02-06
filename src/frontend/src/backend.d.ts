import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PlayerId = string;
export interface Player {
    id: PlayerId;
    displayName: string;
    wins: bigint;
    heartsLost: bigint;
    losses: bigint;
    eliminated: boolean;
    heartsWon: bigint;
    currentHearts: Hearts;
}
export type Time = bigint;
export type Hearts = bigint;
export type MatchId = string;
export interface Duel {
    id: MatchId;
    status: MatchStatus;
    betMode: BetMode;
    winner?: PlayerId;
    heartsTransferred: bigint;
    player1: PlayerId;
    player2: PlayerId;
    p1Bet: Hearts;
    p2Bet: Hearts;
    timestamp: Time;
}
export enum BetMode {
    agreed = "agreed",
    blind = "blind"
}
export enum MatchStatus {
    pending = "pending",
    complete = "complete"
}
export interface backendInterface {
    addPlayer(id: PlayerId, displayName: string): Promise<Player>;
    completeMatch(matchId: MatchId, winnerId: PlayerId): Promise<Duel>;
    createDuel(player1: PlayerId, player2: PlayerId, p1Bet: Hearts, p2Bet: Hearts, betMode: BetMode): Promise<Duel>;
    generateRandomDuel(): Promise<Duel>;
    getAllDuels(): Promise<Array<Duel>>;
    getAllPlayers(): Promise<Array<Player>>;
    getMatchById(matchId: MatchId): Promise<Duel>;
    getPlayer(id: PlayerId): Promise<Player>;
    isPlayerEligible(id: PlayerId): Promise<boolean>;
    removePlayer(id: PlayerId): Promise<void>;
    resetGame(): Promise<void>;
    updateHearts(id: PlayerId, hearts: Hearts): Promise<void>;
    updatePlayer(player: Player): Promise<Player>;
}
