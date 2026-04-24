/**
 * OKLCH Color System - Source of Truth
 *
 * All colors defined in OKLCH for perceptual uniformity.
 * Format: [L, C, H] where:
 *   L = Lightness (0-1)
 *   C = Chroma (0-0.4)
 *   H = Hue (0-360 degrees)
 *
 * These values are used to generate:
 * - CSS custom properties (runtime)
 * - Font palette overrides (build-time, converted to hex)
 */

// OKLCH color type: [lightness, chroma, hue]
export type OklchColor = [number, number, number];

export const colors = {
	dark: {
		bg: {
			primary: [0.28, 0.02, 70] as OklchColor,
			secondary: [0.24, 0.02, 70] as OklchColor,
		},
		text: {
			primary: [0.96, 0.01, 90] as OklchColor,
			secondary: [0.92, 0.01, 90] as OklchColor,
			muted: [0.70, 0.01, 90] as OklchColor,
		},
	},
	light: {
		bg: {
			primary: [0.95, 0.02, 80] as OklchColor,    // warm cream
			secondary: [0.91, 0.025, 75] as OklchColor, // slightly darker cream
		},
		text: {
			primary: [0.25, 0.02, 70] as OklchColor,
			secondary: [0.35, 0.02, 70] as OklchColor,
			muted: [0.50, 0.02, 70] as OklchColor,
		},
	},
	// Accent palette (shared between themes)
	accent: {
		yellow: [0.87, 0.17, 85] as OklchColor,
		orange: [0.70, 0.20, 45] as OklchColor,
		purple: [0.72, 0.15, 300] as OklchColor,
		blue: [0.62, 0.18, 255] as OklchColor,
		green: [0.68, 0.16, 165] as OklchColor,
		amber: [0.75, 0.16, 70] as OklchColor,
	},
} as const;

// Nabla font palette definitions
// Each palette has 10 color slots (0-9) that map to different parts of the 3D letter
export const nablaPalettes = {
	// Default warm palette
	warm: {
		0: [0.70, 0.20, 45] as OklchColor,   // primary face
		1: [0.75, 0.18, 55] as OklchColor,   // secondary
		2: [0.85, 0.15, 80] as OklchColor,   // highlight
		3: [0.85, 0.15, 80] as OklchColor,
		4: [0.78, 0.17, 60] as OklchColor,
		5: [0.90, 0.10, 75] as OklchColor,   // light accent
		6: [0.65, 0.20, 40] as OklchColor,   // shadow
		7: [0.82, 0.16, 70] as OklchColor,
		8: [0.88, 0.12, 85] as OklchColor,
		9: [0.98, 0.01, 90] as OklchColor,   // white
	},
	purple: {
		0: [0.65, 0.18, 300] as OklchColor,
		1: [0.70, 0.16, 305] as OklchColor,
		2: [0.78, 0.14, 310] as OklchColor,
		3: [0.78, 0.14, 310] as OklchColor,
		4: [0.60, 0.20, 295] as OklchColor,
		5: [0.85, 0.10, 315] as OklchColor,
		6: [0.55, 0.22, 290] as OklchColor,
		7: [0.70, 0.16, 305] as OklchColor,
		8: [0.90, 0.08, 310] as OklchColor,
		9: [0.98, 0.01, 90] as OklchColor,
	},
	blue: {
		0: [0.58, 0.18, 255] as OklchColor,
		1: [0.65, 0.16, 260] as OklchColor,
		2: [0.75, 0.14, 265] as OklchColor,
		3: [0.75, 0.14, 265] as OklchColor,
		4: [0.52, 0.20, 250] as OklchColor,
		5: [0.82, 0.10, 270] as OklchColor,
		6: [0.48, 0.22, 245] as OklchColor,
		7: [0.65, 0.16, 260] as OklchColor,
		8: [0.88, 0.08, 265] as OklchColor,
		9: [0.98, 0.01, 90] as OklchColor,
	},
	green: {
		0: [0.65, 0.16, 165] as OklchColor,
		1: [0.72, 0.14, 160] as OklchColor,
		2: [0.80, 0.12, 155] as OklchColor,
		3: [0.80, 0.12, 155] as OklchColor,
		4: [0.58, 0.18, 170] as OklchColor,
		5: [0.86, 0.08, 150] as OklchColor,
		6: [0.52, 0.20, 175] as OklchColor,
		7: [0.72, 0.14, 160] as OklchColor,
		8: [0.90, 0.06, 155] as OklchColor,
		9: [0.98, 0.01, 90] as OklchColor,
	},
	yellow: {
		0: [0.78, 0.16, 85] as OklchColor,
		1: [0.82, 0.14, 90] as OklchColor,
		2: [0.88, 0.12, 95] as OklchColor,
		3: [0.88, 0.12, 95] as OklchColor,
		4: [0.72, 0.18, 80] as OklchColor,
		5: [0.92, 0.08, 95] as OklchColor,
		6: [0.68, 0.20, 75] as OklchColor,
		7: [0.82, 0.14, 90] as OklchColor,
		8: [0.95, 0.05, 95] as OklchColor,
		9: [0.98, 0.01, 90] as OklchColor,
	},
} as const;

/**
 * Convert OKLCH to CSS string
 */
export function oklchToCss([l, c, h]: OklchColor): string {
	return `oklch(${(l * 100).toFixed(0)}% ${c.toFixed(2)} ${h})`;
}

/**
 * Get all accent colors as CSS strings
 */
export function getAccentColors(): string[] {
	return Object.values(colors.accent).map(oklchToCss);
}
