// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace YT {
		const PlayerState: {
			ENDED: number;
			PLAYING: number;
			PAUSED: number;
			BUFFERING: number;
			CUED: number;
		};

		interface PlayerOptions {
			height?: string | number;
			width?: string | number;
			videoId?: string;
			playerVars?: Record<string, unknown>;
			events?: {
				onReady?: (event: { target: Player }) => void;
				onStateChange?: (event: OnStateChangeEvent) => void;
				onError?: (event: { data: number }) => void;
			};
		}

		interface OnStateChangeEvent {
			data: number;
			target: Player;
		}

		class Player {
			constructor(el: string | HTMLElement, options: PlayerOptions);
			playVideo(): void;
			pauseVideo(): void;
			stopVideo(): void;
			seekTo(seconds: number, allowSeekAhead: boolean): void;
			loadVideoById(videoId: string): void;
			cueVideoById(videoId: string): void;
			getCurrentTime(): number;
			getDuration(): number;
			getVolume(): number;
			setVolume(volume: number): void;
			mute(): void;
			unMute(): void;
			isMuted(): boolean;
			destroy(): void;
		}
	}
}

export {};
