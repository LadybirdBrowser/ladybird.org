export type Sponsor = {
  name: string;
  href?: string;
  // Logos are drawn for the dark theme. Add a logoLight variant for the light
  // theme unless the logo already reads well on both backgrounds.
  logo?: string;
  logoLight?: string;
};

export type SponsorTier = {
  name: string;
  sponsors: Sponsor[];
};

export const currentSponsors: SponsorTier[] = [
  {
    name: "Platinum",
    sponsors: [
      {
        name: "FUTO",
        href: "https://www.futo.org/",
        logo: "/assets/img/sponsors/futo.svg",
      },
      {
        name: "Shopify",
        href: "https://www.shopify.com/",
        logo: "/assets/img/sponsors/shopify.svg",
        logoLight: "/assets/img/sponsors/shopify-light.svg",
      },
      {
        name: "Cloudflare",
        href: "https://www.cloudflare.com/",
        logo: "/assets/img/sponsors/cloudflare.svg",
        logoLight: "/assets/img/sponsors/cloudflare-light.svg",
      },
    ],
  },
  {
    name: "Gold",
    sponsors: [
      {
        name: "Human Rights Foundation",
        href: "https://hrf.org/program/ai-for-individual-rights/",
        logo: "/assets/img/sponsors/hrf.svg",
        logoLight: "/assets/img/sponsors/hrf-light.svg",
      },
      {
        name: "Proton VPN",
        href: "https://protonvpn.com/",
        logo: "/assets/img/sponsors/protonvpn.svg",
        logoLight: "/assets/img/sponsors/protonvpn-light.svg",
      },
    ],
  },
  {
    name: "Silver",
    sponsors: [
      { name: "Mitchell Hashimoto", href: "https://mitchellh.com" },
      { name: "Paul Copplestone", href: "https://paul.copplest.one" },
      {
        name: "37signals",
        href: "https://37signals.com/",
        logo: "/assets/img/sponsors/37signals.svg",
        logoLight: "/assets/img/sponsors/37signals-light.svg",
      },
      {
        name: "Axeptio",
        href: "https://www.axept.io/",
        logo: "/assets/img/sponsors/axeptio.svg",
        logoLight: "/assets/img/sponsors/axeptio-light.svg",
      },
      { name: "Andreas Mähler" },
      {
        name: "CodeRabbit",
        href: "https://coderabbit.link/ladybird",
        logo: "/assets/img/sponsors/coderabbit.svg",
        logoLight: "/assets/img/sponsors/coderabbit-light.svg",
      },
    ],
  },
  {
    name: "Bronze",
    sponsors: [
      {
        name: "JetBrains",
        href: "https://www.jetbrains.com/",
        logo: "/assets/img/sponsors/jetbrains.svg",
        logoLight: "/assets/img/sponsors/jetbrains-light.svg",
      },
      { name: "Bastian Müller", href: "https://www.turbolent.com/" },
      {
        name: "Sourcegraph",
        href: "https://sourcegraph.com/",
        logo: "/assets/img/sponsors/sourcegraph.svg",
        logoLight: "/assets/img/sponsors/sourcegraph-light.svg",
      },
      {
        name: "SerpApi",
        href: "https://serpapi.com",
        logo: "/assets/img/sponsors/serpapi.svg",
        logoLight: "/assets/img/sponsors/serpapi-light.svg",
      },
      { name: "The Primeagen", href: "https://terminal.shop/" },
      {
        name: "K15t",
        href: "https://www.k15t.com",
        logo: "/assets/img/sponsors/k15t.svg",
        logoLight: "/assets/img/sponsors/k15t-light.svg",
      },
      {
        name: "Unkey",
        href: "https://www.unkey.com",
        logo: "/assets/img/sponsors/unkey.svg",
        logoLight: "/assets/img/sponsors/unkey-light.svg",
      },
      {
        name: "Gravwell",
        href: "https://www.gravwell.io/",
        logo: "/assets/img/sponsors/gravwell.svg",
        logoLight: "/assets/img/sponsors/gravwell-light.svg",
      },
      { name: "Anonymous Chromium Developer" },
      {
        name: "Kinde Australia Pty Ltd",
        href: "https://kinde.com/?utm_source=ladybird&utm_medium=sponsor&utm_campaign=ladybirdsponsor",
        logo: "/assets/img/sponsors/kinde.svg",
        logoLight: "/assets/img/sponsors/kinde-light.svg",
      },
      {
        name: "Zeroramp",
        href: "https://zeroramp.com",
        logo: "/assets/img/sponsors/zeroramp.svg",
        logoLight: "/assets/img/sponsors/zeroramp-light.svg",
      },
      {
        name: "Arnav Guleria",
      },
    ],
  },
  {
    name: "Copper",
    sponsors: [
      { name: "Travis Heinström", href: "https://heinstrom.com" },
      { name: "Sjors Witteveen", href: "https://kabutops.com" },
      { name: "b1ack0wl", href: "http://www.b1ack0wl.com/" },
      { name: "Gian Giovani", href: "https://wejick.wordpress.com" },
      { name: "Timely Learning", href: "https://www.timely-learning.com" },
      { name: "Coursiv", href: "https://coursiv.io" },
      { name: "Andrew Mead", href: "https://mead.io" },
      { name: "styfle", href: "https://styfle.dev" },
      { name: "Tyler Horvath", href: "http://www.tylerhorvath.space" },
      { name: "Hnefatafl Org", href: "https://hnefatafl.org" },
      { name: "Softwired Technologies", href: "https://softwiredtech.com" },
      { name: "Zain Allarakhia", href: "https://za1.co" },
      { name: "zacoons", href: "https://zacoons.com" },
      { name: "Jakub Stęplowski", href: "https://jakubsteplow.ski" },
      { name: "wheelofnames.com", href: "https://wheelofnames.com" },
      { name: "All Things Secured", href: "https://www.allthingssecured.com" },
      { name: "publicqi", href: "https://x.com/publicqi" },
    ],
  },
  {
    name: "Infrastructure Sponsors",
    sponsors: [
      {
        name: "Blacksmith",
        href: "https://www.blacksmith.sh",
        logo: "/assets/img/sponsors/blacksmith.svg",
        logoLight: "/assets/img/sponsors/blacksmith-light.svg",
      },
      {
        name: "OakHost",
        href: "https://www.oakhost.net",
        logo: "/assets/img/sponsors/oakhost.svg",
        logoLight: "/assets/img/sponsors/oakhost-light.png",
      },
    ],
  },
];

export const previousSponsors: SponsorTier[] = [
  {
    name: "Gold",
    sponsors: [
      {
        name: "ohne-makler.net",
        href: "https://www.ohne-makler.net/",
        logo: "/assets/img/sponsors/ohne-makler.svg",
      },
      {
        name: "Ahrefs",
        href: "https://ahrefs.com/",
        logo: "/assets/img/sponsor-ahrefs.svg",
        logoLight: "/assets/img/sponsor-ahrefs-light.svg",
      },
      { name: "Guillermo Rauch", href: "https://rauchg.com/" },
    ],
  },
  {
    name: "Silver",
    sponsors: [
      {
        name: "Cling",
        href: "https://www.cling.com/",
        logo: "/assets/img/sponsor-cling.svg",
        logoLight: "/assets/img/sponsor-cling-light.svg",
      },
      {
        name: "WorkOS",
        href: "https://www.workos.com/",
        logo: "/assets/img/sponsor-workos.svg",
        logoLight: "/assets/img/sponsor-workos-light.svg",
      },
      {
        name: "Packet Clearing House",
        href: "https://www.pch.net/",
        logo: "/assets/img/sponsor-pch.svg",
        logoLight: "/assets/img/sponsor-pch-light.svg",
      },
      {
        name: "Null Games",
        href: "https://www.null.com/",
        logo: "/assets/img/sponsor-null.svg",
        logoLight: "/assets/img/sponsor-null-light.svg",
      },
      {
        name: "Playbit",
        href: "https://www.playb.it/",
        logo: "/assets/img/sponsor-playbit.svg",
        logoLight: "/assets/img/sponsor-playbit-light.svg",
      },
    ],
  },
  {
    name: "Bronze",
    sponsors: [
      {
        name: "Scraping Fish",
        href: "https://scrapingfish.com/",
        logo: "/assets/img/sponsors/scraping-fish.svg",
        logoLight: "/assets/img/sponsors/scraping-fish-light.svg",
      },
      {
        name: "Tuple",
        href: "https://www.tuple.app/",
        logo: "/assets/img/sponsor-tuple.svg",
        logoLight: "/assets/img/sponsor-tuple-light.svg",
      },
    ],
  },
  {
    name: "Copper",
    sponsors: [
      { name: "Mark Goetz", href: "https://markandrewgoetz.com" },
      { name: "SimonBitwise", href: "https://nomis.dk" },
      {
        name: "Optimising.com.au",
        href: "https://www.optimising.com.au/?utm_source=ladybird&utm_medium=website&utm_campaign=sponsor",
      },
      { name: "Guillaume Knispel" },
      { name: "Broadband Map", href: "https://broadbandmap.com" },
      { name: "Jonathan Lahijani", href: "https://jonathanlahijani.com" },
      { name: "Puter", href: "https://puter.com" },
      { name: "Follower24.de", href: "https://www.follower24.de" },
      { name: "Clément Sibille", href: "https://lisible.xyz/" },
      {
        name: "Philip Lonsing",
        href: "https://www.linkedin.com/in/philiplonsing/",
      },
    ],
  },
];
