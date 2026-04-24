export interface Track {
	id: string;
	title: string;
	artist: string;
}

// Just YouTube video IDs — metadata is fetched automatically via oEmbed
export const playlistIds: string[] = [
	"Ho_2xO-UpFA", "Ok2HZegdGvo", "uWg5A0npyak", "BHtrk66t7Ps", "wL8TE9nVFm0", "ootQs7sVulY",
	"imBlPXbAv6E", "wlCWTm0HAuE", "pNNMr5glICM", "__hLiNfqZ_c", "i5L9gHsqSQk", "monJkVSJUQ0",
	"-yNHlKAzyVA", "iFbbnzR2E88", "BKjzf2j6Zmk", "3a7jLiSCtpU", "V00VrmmoWPw", "KvHYFl0kqIk",
	"QI2kMNHKC2M", "VwFANM6YIc4", "r9Yn-UaeW1M", "RvegizX3GqY", "TOd_r4hBZJI", "O-eloLbhTfQ",
	"di_L7O56ZXE", "5XZGVcHysNk", "UcVDFKY_-Tc", "AU5upmhndCM", "kygPUxOs03c", "wuO4_P_8p-Q",
	"xp8z7pconzw"
];

export async function fetchTrackMeta(id: string): Promise<Track> {
	try {
		const res = await fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
		);
		if (!res.ok) throw new Error(`oEmbed ${res.status}`);
		const data = await res.json();

		const raw: string = data.title ?? "";
		const author: string = data.author_name ?? "";

		// YouTube titles are usually "Artist - Song" or "Song"
		const dashIdx = raw.indexOf(" - ");
		let title: string;
		let artist: string;

		if (dashIdx !== -1) {
			artist = raw.slice(0, dashIdx).trim();
			title = raw.slice(dashIdx + 3).trim();
		} else {
			title = raw;
			artist = author;
		}

		// Strip YouTube Music "- Topic" suffix from artist
		artist = artist.replace(/\s*-\s*Topic$/i, "").trim();

		// Strip common YouTube suffixes
		title = title
			.replace(/\s*\(Official\s*(Music\s*)?Video\)/i, "")
			.replace(/\s*\[Official\s*(Music\s*)?Video\]/i, "")
			.replace(/\s*\(Official\s*Audio\)/i, "")
			.replace(/\s*\[Official\s*Audio\]/i, "")
			.replace(/\s*\(Lyrics?\)/i, "")
			.replace(/\s*\[Lyrics?\]/i, "")
			.replace(/\s*\(HD\)/i, "")
			.trim();

		return { id, title, artist };
	} catch {
		return { id, title: id, artist: "Unknown" };
	}
}

export async function fetchPlaylist(ids: string[]): Promise<Track[]> {
	return Promise.all(ids.map(fetchTrackMeta));
}
