import { GCard } from "@/component/common/GCard";
import type { GGradient } from "@/component/common/tokens";
import { GButton } from "@/component/common/GButton";

interface GameCardProps {
  name: string;
  desc: string;
  onClick: () => void;
  gradient: GGradient;
  playLabel: string;
}

function GameCard({ name, desc, onClick, playLabel }: GameCardProps) {
  return (
    <GCard variant="interactive" padding="lg" className="text-start h-full">
      <h3 className="text-lg font-bold text-text mb-1">{name}</h3>
      <p className="text-xs text-text-secondary mb-4">{desc}</p>
      <GButton variant="secondary" onClick={onClick}>
        {playLabel}
      </GButton>
    </GCard>
  );
}

export { GameCard };
