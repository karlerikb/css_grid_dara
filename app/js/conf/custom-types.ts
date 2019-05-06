import { PhaseOne } from "../game/phase-one";
import { PhaseTwo } from "../game/phase-two";

export type Phase = PhaseOne | PhaseTwo;

export type EventListenerCollection = {
  pieceActivation: (e: MouseEvent) => void
};