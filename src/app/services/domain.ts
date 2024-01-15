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

  voice?: Voice;
  voiceID: number;
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
  count: number;
};

export type Guild = {
  id: number;
  name: string;
  inGameID: number;
  inGameAlias: string;
  gameID: number;
  count: number;
};

export type NPC = {
  id: number;
  name: string;
  inGameID: number;
  inGameAlias: string;
  gameID: number;
  voiceID: number;
  guildID: number;
  count: number;
};

export type Voice = {
  id: number;
  name: string;
  count: number;
};

export type PagedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  results: T[];
};

export type RecordingsResponse = PagedResponse<Recording>;

export type VoicesResponse = Array<Voice>;

export type NPCsResponse = PagedResponse<NPC>;

export type GuildsResponse = PagedResponse<Guild>;

export type SourceFileResponse = PagedResponse<SourceFile>;

export function isNonEmpty(v: any) {
  return (
    v !== undefined &&
    v !== null &&
    v !== "" &&
    (Array.isArray(v) ? v.length > 0 : false) &&
    v !== 0
  );
}
