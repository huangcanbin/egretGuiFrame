namespace frame.animation
{
	export interface IAnimation
	{
		// readonly isPlaying: boolean;
		// readonly currentFrame: number;
		// readonly currentLabel: string;
		// readonly totalFrames: number;
		gotoAndPlay(label: string): void;
		gotoAndStop(label: string): void;
		// nextFrame(): void;
		// play(): void;
		// prevFrame(): void;
		// stop(): void;
	}
}