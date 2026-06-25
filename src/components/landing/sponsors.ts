export type Sponsor = {
  name: string;
  href?: string;
  logo?: string;
  logoClass?: string;
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
      },
      {
        name: "Cloudflare",
        href: "https://www.cloudflare.com/",
        logo: "/assets/img/sponsors/cloudflare.svg",
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
      },
      {
        name: "Proton VPN",
        href: "https://protonvpn.com/",
        logo: "/assets/img/sponsors/protonvpn.svg",
      },
      {
        name: "ohne-makler.net",
        href: "https://www.ohne-makler.net/",
        logo: "/assets/img/sponsors/ohne-makler.svg",
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
      },
      {
        name: "Axeptio",
        href: "https://www.axept.io/",
        logo: "/assets/img/sponsors/axeptio.svg",
      },
      { name: "Andreas Mähler" },
      {
        name: "CodeRabbit",
        href: "https://coderabbit.link/ladybird",
        logo: "/assets/img/sponsors/coderabbit.svg",
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
      },
      { name: "Bastian Müller", href: "https://www.turbolent.com/" },
      {
        name: "Sourcegraph",
        href: "https://sourcegraph.com/",
        logo: "/assets/img/sponsors/sourcegraph.svg",
      },
      {
        name: "SerpApi",
        href: "https://serpapi.com",
        logo: "/assets/img/sponsors/serpapi.svg",
      },
      { name: "The Primeagen", href: "https://terminal.shop/" },
      {
        name: "Scraping Fish",
        href: "https://scrapingfish.com/",
        logo: "/assets/img/sponsors/scraping-fish.svg",
      },
      {
        name: "K15t",
        href: "https://www.k15t.com",
        logo: "/assets/img/sponsors/k15t.svg",
      },
      {
        name: "Unkey",
        href: "https://www.unkey.com",
        logo: "/assets/img/sponsors/unkey.svg",
      },
      {
        name: "Gravwell",
        href: "https://www.gravwell.io/",
        logo: "/assets/img/sponsors/gravwell.png",
      },
      { name: "Anonymous Chromium Developer" },
      {
        name: "Kinde Australia Pty Ltd",
        href: "https://kinde.com/?utm_source=ladybird&utm_medium=sponsor&utm_campaign=ladybirdsponsor",
        logo: "/assets/img/sponsors/kinde.svg",
      },
      {
        name: "Zeroramp",
        href: "https://zeroramp.com",
        logo: "/assets/img/sponsors/zeroramp.svg",
      },
    ],
  },
  {
    name: "Copper",
    sponsors: [
      { name: "Travis Heinström", href: "https://heinstrom.com" },
      { name: "Sjors Witteveen", href: "https://kabutops.com" },
      {
        name: "Philip Lonsing",
        href: "https://www.linkedin.com/in/philiplonsing/",
      },
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
      },
      {
        name: "OakHost",
        href: "https://www.oakhost.net",
        logo: "/assets/img/sponsors/oakhost.svg",
      },
    ],
  },
];

export const previousSponsors: SponsorTier[] = [
  {
    name: "Gold",
    sponsors: [
      {
        name: "Ahrefs",
        href: "https://ahrefs.com/",
        logo: "/assets/img/sponsor-ahrefs.svg",
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
      },
      {
        name: "WorkOS",
        href: "https://www.workos.com/",
        logo: "/assets/img/sponsor-workos.svg",
      },
      {
        name: "Packet Clearing House",
        href: "https://www.pch.net/",
        logo: "/assets/img/sponsor-pch.svg",
        logoClass: "sponsor-logo--large",
      },
      {
        name: "Null Games",
        href: "https://www.null.com/",
        logo: "/assets/img/sponsor-null.svg",
      },
      {
        name: "Playbit",
        href: "https://www.playb.it/",
        logo: "/assets/img/sponsor-playbit.svg",
      },
    ],
  },
  {
    name: "Bronze",
    sponsors: [
      {
        name: "Tuple",
        href: "https://www.tuple.app/",
        logo: "/assets/img/sponsor-tuple.svg",
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
    ],
  },
];
