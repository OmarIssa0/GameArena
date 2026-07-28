export interface IGameAction {
  type: string;
  payload: unknown;
  timestamp: number;
}