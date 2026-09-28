export const config = {
  game: {
    title: "SCAVENGER GAME",
    shortTitle: "Scav Game",
    universe: "Rain World (Unofficial Roblox Experience)",
    tagline: "SURVIVE THE CYCLE. FEAR THE RAIN. TRUST NO ONE.",
    description: "An upcoming multiplayer survival experience on Roblox set in the harsh universe of Rain World. Play as a scavenger, fend off hostile creatures, and reach shelter before the downpour starts.",
    links: {
      discord: "https://discord.gg/GWbeunT72J",
      robloxGroup: "https://www.roblox.com/communities/13362782/Oxygen-Lows-Group",
      robloxGame: "https://www.roblox.com/communities/13362782/Oxygen-Lows-Group"
    },
    milestones: [
      {
        id: "closed-alpha",
        name: "Selective / Closed Alpha",
        date: "2027-01-01T00:00:00Z",
        displayDate: "January 1, 2027",
        status: "Upcoming Phase"
      },
      {
        id: "open-alpha",
        name: "Open Alpha Testing",
        date: "2027-02-01T00:00:00Z",
        displayDate: "February 1, 2027",
        status: "Upcoming Phase"
      },
      {
        id: "full-release",
        name: "Full Launch",
        date: "2027-04-01T00:00:00Z",
        displayDate: "April 1, 2027",
        status: "Target Release"
      }
    ]
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    defenderApiKey: process.env.DEFENDER_API_KEY || "",
    defenderOfflineMode: !process.env.DEFENDER_API_KEY
  }
};
