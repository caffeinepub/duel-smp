import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  public type PlayerId = Text;
  public type MatchId = Text;
  public type Hearts = Nat;
  public type BetMode = { #agreed; #blind };
  public type MatchStatus = { #pending; #complete };

  public type Player = {
    id : PlayerId;
    displayName : Text;
    currentHearts : Hearts;
    wins : Nat;
    losses : Nat;
    heartsWon : Nat;
    heartsLost : Nat;
    eliminated : Bool;
  };

  public type Duel = {
    id : MatchId;
    player1 : PlayerId;
    player2 : PlayerId;
    p1Bet : Hearts;
    p2Bet : Hearts;
    betMode : BetMode;
    timestamp : Time.Time;
    status : MatchStatus;
    winner : ?PlayerId;
    heartsTransferred : Nat;
  };

  module Player {
    public func compare(p1 : Player, p2 : Player) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  module Duel {
    public func compare(d1 : Duel, d2 : Duel) : Order.Order {
      Text.compare(d1.id, d2.id);
    };
  };

  var nextMatchId = 0;

  let players = Map.empty<PlayerId, Player>();
  let duels = Map.empty<MatchId, Duel>();

  public shared ({ caller }) func addPlayer(id : PlayerId, displayName : Text) : async Player {
    if (players.containsKey(id)) {
      Runtime.trap("Player already exists");
    };

    let newPlayer : Player = {
      id;
      displayName;
      currentHearts = 10;
      wins = 0;
      losses = 0;
      heartsWon = 0;
      heartsLost = 0;
      eliminated = false;
    };

    players.add(id, newPlayer);
    newPlayer;
  };

  public query ({ caller }) func getPlayer(id : PlayerId) : async Player {
    switch (players.get(id)) {
      case (null) { Runtime.trap("Player not found") };
      case (?player) { player };
    };
  };

  func convertPlayerToTuple(player : Player) : (PlayerId, Player) {
    (player.id, player);
  };

  public shared ({ caller }) func updatePlayer(player : Player) : async Player {
    if (players.containsKey(player.id)) {
      players.add(player.id, player);
      player;
    } else {
      Runtime.trap("Player not found");
    };
  };

  public shared ({ caller }) func createDuel(
    player1 : PlayerId,
    player2 : PlayerId,
    p1Bet : Hearts,
    p2Bet : Hearts,
    betMode : BetMode,
  ) : async Duel {
    switch (players.get(player1), players.get(player2)) {
      case (?_, ?_) {};
      case (null, _) { Runtime.trap("Player 1 does not exist") };
      case (_, null) { Runtime.trap("Player 2 does not exist") };
    };

    if (p1Bet < 1 or p1Bet > 5 or p2Bet < 1 or p2Bet > 5) {
      Runtime.trap(" bet must be between 1" # "and 5 hearts");
    };

    for ((_, p) in players.entries()) {
      if (p.id == player1 or p.id == player2) {
        if (p.currentHearts < p1Bet or p.currentHearts < p2Bet) {
          Runtime.trap("One or both players do not have enough hearts to cover their bets");
        };
      };
    };

    let matchId = nextMatchId.toText();
    nextMatchId += 1;

    let newDuel : Duel = {
      id = matchId;
      player1;
      player2;
      p1Bet;
      p2Bet;
      betMode;
      timestamp = Time.now();
      status = #pending;
      winner = null;
      heartsTransferred = 0;
    };

    duels.add(matchId, newDuel);
    newDuel;
  };

  public shared ({ caller }) func completeMatch(matchId : MatchId, winnerId : PlayerId) : async Duel {
    let duel = switch (duels.get(matchId)) {
      case (null) { Runtime.trap("Duel not found") };
      case (?duel) { duel };
    };

    let p1 = switch (players.get(duel.player1)) {
      case (null) { Runtime.trap("Player 1 not found") };
      case (?player) { player };
    };
    let p2 = switch (players.get(duel.player2)) {
      case (null) { Runtime.trap("Player 2 not found") };
      case (?player) { player };
    };

    let winner = if (winnerId == p1.id) { p1 } else { p2 };
    let loser = if (winnerId == p1.id) { p2 } else { p1 };

    let newWins = winner.wins + 1;
    let newLosses = loser.losses + 1;

    let winnerUpdated = {
      winner with
      currentHearts = winner.currentHearts + duel.heartsTransferred;
      heartsWon = winner.heartsWon + duel.heartsTransferred;
      wins = newWins;
    };

    let loserUpdated = {
      loser with
      currentHearts = if (duel.heartsTransferred > loser.currentHearts) {
        0;
      } else {
        loser.currentHearts - duel.heartsTransferred;
      };
      heartsLost = loser.heartsLost + duel.heartsTransferred;
      losses = newLosses;
      eliminated = loser.currentHearts <= duel.heartsTransferred;
    };

    players.add(winnerId, winnerUpdated);
    players.add(loser.id, loserUpdated);

    let updatedDuel = {
      duel with
      status = #complete;
      winner = ?winnerId;
      heartsTransferred = duel.heartsTransferred + duel.p1Bet + duel.p2Bet;
    };
    duels.add(matchId, updatedDuel);
    updatedDuel;
  };

  public query ({ caller }) func getAllPlayers() : async [Player] {
    players.values().toArray().sort();
  };

  public query ({ caller }) func getAllDuels() : async [Duel] {
    duels.values().toArray().sort();
  };

  public shared ({ caller }) func generateRandomDuel() : async Duel {
    let eligiblePlayers = List.empty<PlayerId>();
    for ((_, p) in players.entries()) {
      if (p.currentHearts > 0) {
        eligiblePlayers.add(p.id);
      };
    };

    let eligibleSize = eligiblePlayers.size();
    if (eligibleSize < 2) {
      Runtime.trap("There are not enough players to generate a random duel");
    };

    let idIter = eligiblePlayers.toArray().values();
    let player1 = switch (idIter.next(), idIter.next()) {
      case (?p1, ?p2) { (p1, p2) };
      case (_, _) { Runtime.trap("Two eligible players are needed") };
    };

    await createDuel(player1.0, player1.1, 1, 1, #agreed);
  };

  public query ({ caller }) func getMatchById(matchId : MatchId) : async Duel {
    switch (duels.get(matchId)) {
      case (null) { Runtime.trap("Duel not found") };
      case (?duel) { duel };
    };
  };

  public shared ({ caller }) func isPlayerEligible(id : PlayerId) : async Bool {
    switch (players.get(id)) {
      case (null) { false };
      case (?player) { player.currentHearts > 0 };
    };
  };

  public shared ({ caller }) func removePlayer(id : PlayerId) : async () {
    players.remove(id);
  };

  public shared ({ caller }) func updateHearts(id : PlayerId, hearts : Hearts) : async () {
    let player = switch (players.get(id)) {
      case (null) { Runtime.trap("Player does not exist") };
      case (?player) { player };
    };

    let updatedPlayer = { player with currentHearts = hearts };
    players.add(id, updatedPlayer);
  };

  public shared ({ caller }) func resetGame() : async () {
    players.clear();
    duels.clear();
    nextMatchId := 0;
  };
};
