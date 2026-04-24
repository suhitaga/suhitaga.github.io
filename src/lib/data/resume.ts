export interface Entry {
	date: string;
	title: string;
	link?: string;
	location?: string;
	description: string;
}

export interface ContactLink {
	label: string;
	value: string;
	href: string;
}

export interface ResumeData {
	quote: string;
	work: Entry[];
	features: Entry[];
	projects: Entry[];
	sideProjects: Entry[];
	education: Entry[];
	contact: ContactLink[];
}

export const resumeData: ResumeData = {
	quote: "expressing ourselves might be difficult, but we still try... we must.",

	work: [
		{
			date: "2025",
			title: "Founding Engineering at trufflepig Corp",
			link: "https://trufflepig.ai",
			location: "San Francisco, CA",
			description: "[React + Rust] building spreadsheets integrated with AI from scratch"
		},
		{
			date: "2024 — 2025",
			title: "Founding Product Engineer and Designer at Curio Interactive Inc.",
			link: "https://heycurio.com",
			location: "Redwood City, CA",
			description: "[React Native + F# + C] building amazing experiences for kids!"
		},
		{
			date: "2023 — 2024",
			title: "Founding Engineer at ClanTrust",
			location: "Remote",
			description: "[React Native] developed an e2e app experience for a p2p micro-lending platform"
		},
		{
			date: "2022 — 2023",
			title: "Software Engineer at Pickle",
			link: "https://www.trypickle.co/",
			location: "Los Angeles, CA",
			description: "[React + Next.js] built a marketplace and management software to broker brand sponsorship deals with creators"
		},
		{
			date: "2022 — 2022",
			title: "Data Intern at University of Southern California",
			link: "https://careers.usc.edu/",
			location: "Los Angeles, CA",
			description: "[Python + Excel] analyzed statistics for students who graduated and where they work after graduation"
		},
		{
			date: "2021 — 2021",
			title: "Design & Software Intern at ReveryLab",
			link: "https://www.pocketkado.com/",
			location: "Remote",
			description: "[Flutter + Rive] built the product website and created in-app animations and interactions including creating novel features with state machines"
		}
	],

	features: [
		{
			date: "2022",
			title: "Blackboard with a Boost on The Browser Company",
			link: "https://www.youtube.com/watch?v=qeH1OV1VxdQ",
			description: "made a cool boost and video for BCNY"
		}
	],

	projects: [
		{
			date: "2023",
			title: "Engineering Lead at HackSC",
			link: "https://github.com/hacksc/hibiscus",
			description: "[React + Next.js + AWS] an open source and centralized platform to organize hackathons!"
		}
	],

	sideProjects: [
		{
			date: "2021",
			title: "Redlino",
			link: "https://github.com/suhitaga/redlino",
			description: "[Flutter] an app for interfacing with your fave celebs"
		},
		{
			date: "2020",
			title: "Voc-AB",
			link: "https://github.com/dhruvr4/Vocab",
			description: "[React Native] a vocabulary learning app"
		}
	],

	education: [
		{
			date: "2021 — 2025",
			title: "University of Southern California",
			link: "https://www.usc.edu/",
			location: "Los Angeles, CA",
			description: "bachelor's in applied and computational math"
		},
		{
			date: "2019 — 2020",
			title: "Arizona State University",
			link: "https://www.asu.edu/",
			location: "Tempe, AZ",
			description: "computer science (software eng.)"
		}
	],

	contact: [
		{ label: "LinkedIn", value: "suhitaga", href: "https://linkedin.com/in/suhitaga" },
		{ label: "GitHub", value: "suhitaga", href: "https://github.com/suhitaga" },
		{ label: "Email", value: "suhit@suhit.me", href: "mailto:suhit@suhit.me" },
		{ label: "Twitter", value: "suhitdoingstuff", href: "https://twitter.com/suhitdoingstuff" }
	]
};
