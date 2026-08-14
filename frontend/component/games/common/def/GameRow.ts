import type { IGameConfig } from "@/domain/constant/games";
import type { GameTranslations } from "@/component/i18n/Game/en.i18n";

export interface IGameRowProps {
  game: IGameConfig;
  gt: GameTranslations;
  onClick: () => void;
  playLabel: string;
}
