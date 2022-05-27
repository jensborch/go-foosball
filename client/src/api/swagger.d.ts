declare namespace Definitions {
    export interface AddPlayer {
        nickname: string;
        ranking?: number;
    }
    export interface AddTable {
        id: number;
    }
    export interface Color {
        left: string;
        right: string;
    }
    export interface CreatePlayer {
        nickname: string;
        realname?: string;
        rfid?: string;
    }
    export interface CreateTable {
        color?: Color;
        name?: string;
    }
    export interface CreateTournament {
        initial: number;
        name: string;
        score: number;
    }
    export interface Error {
        error?: string;
    }
    export interface Game {
        created?: string;
        leftPlayers?: string[];
        leftScore?: number;
        rightPlayers?: string[];
        rightScore?: number;
        tableId?: number;
        updated?: string;
        winner?: string;
    }
    export interface GameResult {
        players: string[];
        winner: string;
    }
    export interface GameStartEvent {
        id?: string;
    }
    export interface Player {
        created?: string;
        nickname: string;
        realname?: string;
        rfid?: string;
        updated?: string;
    }
    export interface Table {
        color: Color;
        created?: string;
        id?: number;
        name: string;
        updated?: string;
    }
    export interface Tournament {
        created?: string;
        id?: number;
        initial: number;
        name: string;
        score: number;
        updated?: string;
    }
    export interface TournamentPlayer {
        active?: boolean;
        nickname?: string;
        ranking?: number;
        realname?: string;
        rfid?: string;
    }
    export interface TournamentTable {
        created?: string;
        id?: number;
        table?: Table;
        updated?: string;
    }
}
declare namespace Paths {
    namespace Games {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.Game[];
            }
        }
    }
    namespace Games$Id {
        namespace Get {
            namespace Parameters {
                /**
                 * Game ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Game ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Game;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Players {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.Player[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                player: Parameters.Player;
            }
            namespace Parameters {
                export type Player = Definitions.CreatePlayer;
            }
            namespace Responses {
                export type $201 = Definitions.Player;
                export type $400 = Definitions.Error;
                export type $409 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Players$Id {
        namespace Delete {
            namespace Parameters {
                /**
                 * Player ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Player ID */ Parameters.Id;
            }
            namespace Responses {
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
        namespace Get {
            namespace Parameters {
                /**
                 * Player ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Player ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Player;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tables {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.Table[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                table: Parameters.Table;
            }
            namespace Parameters {
                export type Table = Definitions.CreateTable;
            }
            namespace Responses {
                export type $200 = Definitions.Table;
                export type $400 = Definitions.Error;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tables$Id {
        namespace Get {
            namespace Parameters {
                /**
                 * Table ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Table ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Table;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.Tournament[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                tournament: Parameters.Tournament;
            }
            namespace Parameters {
                export type Tournament = Definitions.CreateTournament;
            }
            namespace Responses {
                export type $200 = Definitions.Tournament;
                export type $400 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$Id {
        namespace Delete {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Tournament;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdEventsGame {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.GameStartEvent;
            }
        }
    }
    namespace Tournaments$IdEventsPlayer {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.TournamentPlayer;
            }
        }
    }
    namespace Tournaments$IdGames {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Game[];
            }
        }
    }
    namespace Tournaments$IdGamesRandom {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.Game[];
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdGamesStart {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdPlayers {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.TournamentPlayer[];
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
        namespace Post {
            export interface BodyParameters {
                player: Parameters.Player;
            }
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
                export type Player = Definitions.AddPlayer;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.TournamentPlayer;
                export type $400 = Definitions.Error;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdPlayers$Player {
        namespace Delete {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
                /**
                 * Player ID
                 */
                export type Player = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
                player: /* Player ID */ Parameters.Player;
            }
            namespace Responses {
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdTables {
        namespace Get {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $200 = Definitions.TournamentTable[];
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
        namespace Post {
            export interface BodyParameters {
                table: Parameters.Table;
            }
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
                export type Table = Definitions.AddTable;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $201 = Definitions.TournamentTable;
                export type $400 = Definitions.Error;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdTables$TableGames {
        namespace Post {
            export interface BodyParameters {
                game: Parameters.Game;
            }
            namespace Parameters {
                export type Game = Definitions.GameResult;
                /**
                 * Tournament ID
                 */
                export type Id = string;
                /**
                 * Table ID
                 */
                export type Table = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
                table: /* Table ID */ Parameters.Table;
            }
            namespace Responses {
                export type $200 = Definitions.Game;
                export type $400 = Definitions.Error;
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
    namespace Tournaments$IdTables$TableId {
        namespace Delete {
            namespace Parameters {
                /**
                 * Tournament ID
                 */
                export type Id = string;
                /**
                 * Table ID
                 */
                export type TableId = string;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
                tableId: /* Table ID */ Parameters.TableId;
            }
            namespace Responses {
                export type $404 = Definitions.Error;
                export type $500 = Definitions.Error;
            }
        }
    }
}
