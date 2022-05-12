declare namespace Definitions {
    export interface ModelColor {
        left: string;
        right: string;
    }
    export interface ModelGameJson {
        created?: string;
        leftPlayers?: string[];
        leftScore?: number;
        rightPlayers?: string[];
        rightScore?: number;
        tableId?: number;
        updated?: string;
        winner?: string;
    }
    export interface ModelPlayer {
        created?: string;
        id?: number;
        nickname: string;
        realname?: string;
        rfid?: string;
        updated?: string;
    }
    export interface ModelTable {
        color: ModelColor;
        created?: string;
        id?: number;
        name: string;
        updated?: string;
    }
    export interface ModelTournament {
        created?: string;
        id?: number;
        initial: number;
        name: string;
        score: number;
        updated?: string;
    }
    export interface ModelTournamentTable {
        created?: string;
        id?: number;
        table?: ModelTable;
        updated?: string;
    }
    export interface ResourcesAddPlayer2TournamentRepresenatation {
        nickname: string;
        ranking?: number;
    }
    export interface ResourcesCreatePlayerRequest {
        nickname: string;
        realname?: string;
        rfid?: string;
    }
    export interface ResourcesCreateTableRepresentation {
        color?: ModelColor;
        name?: string;
    }
    export interface ResourcesErrorResponse {
        error?: string;
    }
    export interface ResourcesGameRepresentation {
        players: string[];
        winner: string;
    }
    export interface ResourcesPlayerRepresenatation {
        active?: boolean;
        nickname?: string;
        ranking?: number;
        realname?: string;
        rfid?: string;
    }
    export interface ResourcesTableRepresentation {
        id: number;
    }
    export interface ResourcesTournamentCreateRepresentation {
        initial: number;
        name: string;
        score: number;
    }
}
declare namespace Paths {
    namespace Games {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.ModelGameJson[];
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
                export type $200 = Definitions.ModelGameJson;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
    namespace Players {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.ModelPlayer[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                player: Parameters.Player;
            }
            namespace Parameters {
                export type Player = Definitions.ResourcesCreatePlayerRequest;
            }
            namespace Responses {
                export type $201 = Definitions.ModelPlayer;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $409 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $200 = Definitions.ModelPlayer;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
    namespace Tables {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.ModelTable[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                table: Parameters.Table;
            }
            namespace Parameters {
                export type Table = Definitions.ResourcesCreateTableRepresentation;
            }
            namespace Responses {
                export type $201 = Definitions.ModelTable;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $200 = Definitions.ModelTable;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
    namespace Tournaments {
        namespace Get {
            namespace Responses {
                export type $200 = Definitions.ModelTournament[];
            }
        }
        namespace Post {
            export interface BodyParameters {
                tournament: Parameters.Tournament;
            }
            namespace Parameters {
                export type Tournament = Definitions.ResourcesTournamentCreateRepresentation;
            }
            namespace Responses {
                export type $201 = Definitions.ModelTournament;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $200 = Definitions.ModelTournament;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
    namespace Tournaments$IdEvents {
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
                export type $200 = Definitions.ResourcesPlayerRepresenatation;
                export type $400 = string;
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
                export type $200 = Definitions.ModelGameJson[];
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
                export type $200 = Definitions.ModelGameJson[];
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $200 = Definitions.ResourcesPlayerRepresenatation[];
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type Player = Definitions.ResourcesAddPlayer2TournamentRepresenatation;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $201 = Definitions.ResourcesPlayerRepresenatation;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $200 = Definitions.ModelTournamentTable[];
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type Table = Definitions.ResourcesTableRepresentation;
            }
            export interface PathParameters {
                id: /* Tournament ID */ Parameters.Id;
            }
            namespace Responses {
                export type $201 = Definitions.ModelTournamentTable;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
    namespace Tournaments$IdTables$TableGames {
        namespace Post {
            export interface BodyParameters {
                game: Parameters.Game;
            }
            namespace Parameters {
                export type Game = Definitions.ResourcesGameRepresentation;
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
                export type $200 = Definitions.ModelGameJson;
                export type $400 = Definitions.ResourcesErrorResponse;
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
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
                export type $404 = Definitions.ResourcesErrorResponse;
                export type $500 = Definitions.ResourcesErrorResponse;
            }
        }
    }
}
