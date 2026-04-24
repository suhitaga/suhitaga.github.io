import { writable, derived } from 'svelte/store';

export type Layer = 'resume' | 'desktop' | 'room';

export type WindowId = 'resume' | 'blog' | 'music' | 'notebook';

export interface WindowState {
	id: WindowId;
	isOpen: boolean;
	isMinimized: boolean;
	zIndex: number;
}

interface AppState {
	currentLayer: Layer;
	windows: Record<WindowId, WindowState>;
	highestZIndex: number;
	monitorRevealed: boolean;
}

const initialState: AppState = {
	currentLayer: 'resume',
	windows: {
		resume: { id: 'resume', isOpen: true, isMinimized: false, zIndex: 1 },
		blog: { id: 'blog', isOpen: false, isMinimized: false, zIndex: 0 },
		music: { id: 'music', isOpen: false, isMinimized: false, zIndex: 0 },
		notebook: { id: 'notebook', isOpen: false, isMinimized: false, zIndex: 0 },
	},
	highestZIndex: 1,
	monitorRevealed: false,
};

function createAppState() {
	const { subscribe, set, update } = writable<AppState>(initialState);

	return {
		subscribe,

		// Layer transitions
		goToDesktop: () =>
			update((state) => ({
				...state,
				currentLayer: 'desktop',
				monitorRevealed: true,
				windows: {
					...state.windows,
					resume: { ...state.windows.resume, isMinimized: true },
				},
			})),

		goToRoom: () =>
			update((state) => ({
				...state,
				currentLayer: 'room',
			})),

		goToResume: () =>
			update((state) => ({
				...state,
				currentLayer: 'resume',
				windows: {
					...state.windows,
					resume: { ...state.windows.resume, isMinimized: false, isOpen: true },
				},
			})),

		// Window management
		openWindow: (id: WindowId) =>
			update((state) => {
				const newZIndex = state.highestZIndex + 1;
				return {
					...state,
					highestZIndex: newZIndex,
					windows: {
						...state.windows,
						[id]: { ...state.windows[id], isOpen: true, isMinimized: false, zIndex: newZIndex },
					},
				};
			}),

		closeWindow: (id: WindowId) =>
			update((state) => ({
				...state,
				windows: {
					...state.windows,
					[id]: { ...state.windows[id], isOpen: false },
				},
			})),

		minimizeWindow: (id: WindowId) =>
			update((state) => ({
				...state,
				windows: {
					...state.windows,
					[id]: { ...state.windows[id], isMinimized: true },
				},
			})),

		focusWindow: (id: WindowId) =>
			update((state) => {
				const newZIndex = state.highestZIndex + 1;
				return {
					...state,
					highestZIndex: newZIndex,
					windows: {
						...state.windows,
						[id]: { ...state.windows[id], zIndex: newZIndex },
					},
				};
			}),

		reset: () => set(initialState),
	};
}

export const appState = createAppState();

// Derived stores for convenience
export const currentLayer = derived(appState, ($state) => $state.currentLayer);
export const windows = derived(appState, ($state) => $state.windows);
export const monitorRevealed = derived(appState, ($state) => $state.monitorRevealed);
