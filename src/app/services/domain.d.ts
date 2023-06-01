export type RecordingsResponse = {
  total: number;
  page: number;
  pageSize: number;
  results: Recording[];
};

export type VoicesResponse = Array<Voice>

export type NPCsResponse = {
  total: number;
  page: number;
  pageSize: number;
  results: NPC[];
}

export type Recording = {
  id: number;
  wave: string;
  transcript: string;
  gameID: number;
  game?: Game;
  sourceFileID: number;
  sourceFile?: SourceFile;
  npcID: number | null;
  npc?: NPC;
  guildID: number | null;
  guild?: Guild;
};

export type Game = {
  id: number;
  name: string;
};

export type SourceFile = {
  id: number;
  name: string;
  type: "guild" | "svm" | "mission";
  gameID: number;
};

export type Guild = {
  id: number;
  name: string;
  inGameID: number;
  inGameAlias: string;
  gameID: number;
};

export type NPC = {
  id: number;
  name: string;
  inGameID: number;
  inGameAlias: string;
  gameID: number;
  voiceID: number;
  guildID: number;
};

export type Voice = {
  id: number;
  name: string;
};
