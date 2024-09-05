export const languages = {
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
};

export const defaultLang = "en";

export const ui = {
  en: {
    // Navigation
    "nav.about": "About",
    "nav.news": "News",
    "nav.gi": "Get Involved",
    "nav.sponsors": "Sponsors",
    "nav.faq": "FAQ",
    "nav.donate": "Donate",

    // Language Picker
    "language-picker.language": "Language",

    // Hero
    "hero.welcomeTo": "Welcome to ",
    "hero.aTrulyIndependent": "a truly independent",
    "hero.webBrowser": "web browser.",
    "hero.paragraph":
      "We are building a brand-new browser from scratch, backed by a non-profit.",
    "hero.getInvolved": "Get Involved",

    // About
    "about.title": "About",
    // Paragraph
    "about.paragraph":
      "Ladybird is a brand-new browser & web engine. Driven by a web standards first approach, Ladybird aims to render the modern web with good performance, stability and security.",
    // Paragraph 2
    "about.paragraph2":
      "From its humble beginnings as an HTML viewer for the SerenityOS hobby operating system project, Ladybird has since grown into a cross-platform browser supporting Linux, macOS, and other Unix-like systems.",
    // Paragraph 3
    "about.paragraph3":
      "Ladybird is currently in heavy development. We are targeting a first Alpha release for early adopters in 2026.",

    // Why
    "why.title": "What makes ",
    "why.titlePart2": "unique",
    // Card
    "why.card.title": "Truly independent",
    "why.card.paragraph":
      "No code from other browsers. We're building a new engine, based on web standards.",
    // Card 2
    "why.card2.title": "Singular focus",
    "why.card2.paragraph": "We are focused on one thing: the web browser.",
    // Card 3
    "why.card3.title": "No monetization",
    "why.card3.paragraph":
      'No "default search deals", crypto tokens, or other forms of user monetization, ever.',

    // Posts
    "posts.title": "News & Announcements",

    // Get Involved
    "gi.title": "Get Involved",
    // Paragraph
    "gi.paragraph":
      "Ladybird is currently in heavy development, and there's work to be done in all areas of the browser.",
    // Paragraph 2
    "gi.paragraph2":
      "We're welcoming new developers every week. The main community hub is ",
    "gi.paragraph2DiscordLink": "our Discord Server",
    // Paragraph 3
    "gi.paragraph3": "All the code is hosted on",
    "gi.paragraph3Part2":
      "Clone it, build it, and join our Discord if you want to collaborate on it! We're looking forward to seeing you there. ",
    // Links
    "gi.joinDiscord": "Join Discord",
    "gi.getTheCode": "Get the code",

    // Sponsors
    "sponsors.title": "Sponsors",
    // Tiers
    "sponsors.platinum": "Platinum",
    "sponsors.gold": "Gold",
    "sponsors.silver": "Silver",
    "sponsors.bronze": "Bronze",

    // Donate
    "donate.title": "Become a ",
    "donate.titlePart2": "supporter",
    // Paragraph
    "donate.paragraph":
      "Ladybird is funded entirely by sponsorships and donations from people and companies who care about the open web.",
    // Paragraph 2
    "donate.paragraph2":
      "We accept one-time and recurring monthly donations via ",
    // Paragraph 3
    "donate.paragraph3":
      "If you or your company would like to make a large donation, we would be happy to display your logo on this website! Please ",
    "donate.paragraph3Link": "contact us",
    "donate.paragraph3Part2": " about becoming a sponsor.",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    // Question 1
    "faq.question1.title": "When is it coming?",
    "faq.question1.paragraph":
      "We are targeting Summer 2026 for a first Alpha version on Linux and macOS. This will be aimed at developers and early adopters.",
    // Question 2
    "faq.question2.title": "How many people are working on the browser today?",
    "faq.question2.paragraph":
      "We currently have 6 paid full-time engineers working on Ladybird. There is also a large community of volunteer contributors.",
    // Question 3
    "faq.question3.title": "What's the hiring plan?",
    "faq.question3.paragraph":
      "We have 1 new full-time engineer starting soon. Going forward, we would like to grow the team at a reasonable pace. Building the right team is more important than building it quickly.",
    "faq.question3.paragraphPart2":
      "We will strive to maintain 18 months of runway at all times.",
    // Question 4
    "faq.question4.title":
      'What does "No code from other browsers" really mean?',
    "faq.question4.paragraph":
      "The focus of the Ladybird project is to build a new browser engine from the ground up. We don't use code from Blink, WebKit, Gecko, or any other browser engine.",
    "faq.question4.paragraph2":
      "For historical reasons, the browser uses various libraries from the SerenityOS project, which has a strong culture of writing ",
    "faq.question4.paragraph2Italic": "everything",
    "faq.question4.paragraph2Part2":
      "from scratch. Now that Ladybird has forked from SerenityOS, it is no longer bound by this culture, and we will be making use of 3rd party libraries for common functionality (e.g image/audio/video formats, encryption, graphics, etc.) ",
    "faq.question4.paragraph3":
      "We are already using some of the same 3rd party libraries that other browsers use, but we will never adopt another browser engine instead of building our own.",
    // Question 5
    "faq.question5.title": "Will Ladybird work on Windows?",
    "faq.question5.paragraph":
      "We don't have anyone actively working on Windows support, and there are considerable changes required to make it work well outside a Unix-like environment.",
    "faq.question5.paragraph2":
      " We would like to do Windows eventually, but it's not a priority at the moment.",
    // Question 6
    "faq.question6.title": "Will Ladybird work on mobile devices?",
    "faq.question6.paragraph":
      "We don't have anyone actively working on an Android or iOS port. More effort will be put into mobile once we have the desktop versions in a good state.",
    "faq.question6.paragraph2":
      " While there is the start of an Android port in the project repository, mobile is not a priority at the moment.",
    // Question 7
    "faq.question7.title": "What are the sponsor tiers?",
    "faq.question7.paragraph":
      "Sponsorships run for one year, then you are welcome to renew.",
    "faq.question7.paragraph2":
      "Sponsors will have their logos displayed on our website, and will be thanked in updates / on social media.",
    "faq.question7.paragraph3": "Please ",
    "faq.question7.paragraph3Link": "contact us",
    "faq.question7.paragraph3part2": " if you are interested in sponsorship.",
    // Question 8
    "faq.question8.title": 'How can you be "independent" if you have sponsors?',
    "faq.question8.paragraph":
      " All sponsorships are in the form of unrestricted donations. Board seats and other forms of influence are not for sale.",
    // Question 9
    "faq.question9.title":
      "Why build a new browser in C++ when safer and more modern languages are available?",
    "faq.question9.paragraph":
      "Ladybird started as a component of the SerenityOS hobby project, which only allows C++. The choice of language was not so much a technical decision, but more one of personal convenience. Andreas was most comfortable with C++ when creating SerenityOS, and now we have almost half a million lines of modern C++ to maintain.",
    "faq.question9.paragraph2":
      "However, now that Ladybird has forked and become its own independent project, all constraints previously imposed by SerenityOS are no longer in effect.",
    "faq.question9.paragraph3":
      "We have evaluated a number of alternatives, and will begin incremental adoption of ",
    "faq.question9.paragraph3Part2":
      " as a successor language, once Swift version 6 is released. (",
    "faq.question9.paragraph3MoreBackgroundLink": "More background.",

    // Footer
    // Newsletter
    "newsletter.title": "Sign up for our newsletter",
    "newsletter.paragraph":
      "We'll e-mail you once a month with updates about Ladybird.",
    "newsletter.email.placeholder": "Your e-mail",
    // Navigation
    "footer.contactUs": "Contact Us",
    // Bottom part
    "footer.allRightsReserved": "All rights reserved.",
  },

  de: {
    // Navigation
    "nav.about": "Über uns",
    "nav.news": "Neuigkeiten",
    "nav.gi": "Mitmachen",
    "nav.sponsors": "Sponsoren",
    "nav.faq": "FAQ",
    "nav.donate": "Spenden",

    // Language Picker
    "language-picker.language": "Sprache",

    // Hero
    "hero.welcomeTo": "Willkommen bei ",
    "hero.aTrulyIndependent": "ein wirklich unabhängiger",
    "hero.webBrowser": "Web Browser.",
    "hero.paragraph":
      "Wir bauen einen brandneuen Browser von Grund auf, der von einer gemeinnützigen Organisation unterstützt wird.",
    "hero.getInvolved": "Jetzt Mitmachen",

    // About
    "about.title": "Über",
    // Paragraph
    "about.paragraph":
      "Ladybird ist ein brandneuer Browser und eine neue Web-Engine. Ladybird verfolgt einen Ansatz, bei dem Webstandards im Vordergrund stehen, und zielt darauf ab, das moderne Web mit guter Leistung, Stabilität und Sicherheit darzustellen.",
    // Paragraph 2
    "about.paragraph2":
      "Seit seinen bescheidenen Anfängen als HTML-Viewer für das Hobby-Betriebssystemprojekt SerenityOS hat sich Ladybird zu einem plattformübergreifenden Browser entwickelt, der Linux, macOS und andere Unix-ähnliche Systeme unterstützt.",
    // Paragraph 3
    "about.paragraph3":
      "Ladybird befindet sich derzeit in einer intensiven Entwicklungsphase. Wir planen eine erste Alpha-Version für frühe Anwender im Jahr 2026.",

    // Why
    "why.title": "Was ",
    "why.titlePart2": "besonders macht",
    // Card
    "why.card.title": "Wirklich unabhängig",
    "why.card.paragraph":
      "Kein Code aus anderen Browsern. Wir bauen eine neue Engine, die auf Webstandards basiert. ",
    // Card 2
    "why.card2.title": "Einzigartiger Fokus",
    "why.card2.paragraph":
      "Wir konzentrieren uns auf eine Sache: den Webbrowser.",
    // Card 3
    "why.card3.title": "Keine Monetarisierung",
    "why.card3.paragraph":
      "Keine Suchmaschinen Deals, Krypto-Token oder andere Formen der Nutzermonetarisierung, niemals.",

    // Posts
    "posts.title": "Neuigkeiten & Ankündigungen",

    // Get Involved
    "gi.title": "Mitmachen",
    // Paragraph
    "gi.paragraph":
      "Ladybird wird derzeit intensiv weiterentwickelt, und es gibt in allen Bereichen des Browsers noch einiges zu tun.",
    // Paragraph 2
    "gi.paragraph2":
      "Wir nehmen jede Woche neue Entwickler auf. Der wichtigste Knotenpunkt der Gemeinschaft ist ",
    "gi.paragraph2DiscordLink": "unser Discord Server",
    // Paragraph 3
    "gi.paragraph3": "Der gesamte Code wird gehostet auf",
    "gi.paragraph3Part2":
      "Klont es, baut es und tretet unserem Discord bei, wenn ihr daran mitarbeiten wollt! Wir freuen uns darauf, dich dort zu sehen.",
    // Links
    "gi.joinDiscord": "Discord beitreten",
    "gi.getTheCode": "Hol dir den Code",

    // Sponsors
    "sponsors.title": "Sponsoren",
    // Tiers
    "sponsors.platinum": "Platin",
    "sponsors.gold": "Gold",
    "sponsors.silver": "Silber",
    "sponsors.bronze": "Bronze",

    // Donate
    "donate.title": "Werde ein ",
    "donate.titlePart2": "Unterstützer",
    // Paragraph
    "donate.paragraph":
      "Ladybird finanziert sich ausschließlich durch Sponsorengelder und Spenden von Menschen und Unternehmen, denen das offene Web am Herzen liegt.",
    // Paragraph 2
    "donate.paragraph2":
      "Wir akzeptieren einmalige und wiederkehrende monatliche Spenden über ",
    // Paragraph 3
    "donate.paragraph3":
      "Wenn Sie oder Ihr Unternehmen eine größere Spende machen möchten, würden wir uns freuen, Ihr Logo auf dieser Website zu zeigen! Bitte ",
    "donate.paragraph3Link": "kontaktiere uns",
    "donate.paragraph3Part2": " um Sponsor zu werden.",

    // FAQ
    "faq.title": "Häufig gestellte Fragen",
    // Question 1
    "faq.question1.title": "Wann erscheint der Browser?",
    "faq.question1.paragraph":
      "Wir planen für den Sommer 2026 eine erste Alpha-Version für Linux und macOS. Diese wird sich an Entwickler und Early Adopters richten.",
    // Question 2
    "faq.question2.title": "Wie viele Personen arbeiten heute an dem Browser?",
    "faq.question2.paragraph":
      "Derzeit arbeiten 6 bezahlte Vollzeit-Entwickler an Ladybird. Außerdem gibt es eine große Gemeinschaft von Freiwilligen, die mitarbeiten.",
    // Question 3
    "faq.question3.title": "Wie sieht der Einstellungsplan aus?",
    "faq.question3.paragraph":
      "Wir haben 1 neuen Vollzeit-Entwickler, der bald anfängt. In Zukunft möchten wir das Team in einem angemessenen Tempo wachsen lassen. Es ist wichtiger, das richtige Team aufzubauen, als es schnell aufzubauen.",
    "faq.question3.paragraphPart2":
      "Wir werden uns bemühen, die Geldreserven stets 18 Monate lang aufrechtzuerhalten.",
    // Question 4
    "faq.question4.title":
      "Was bedeutet „Kein Code von anderen Browsern“ wirklich?",
    "faq.question4.paragraph":
      "Der Schwerpunkt des Ladybird-Projekts liegt auf der Entwicklung einer neuen Browser-Engine von Grund auf. Wir verwenden keinen Code von Blink, WebKit, Gecko oder einer anderen Browser-Engine.",
    "faq.question4.paragraph2":
      "Aus historischen Gründen verwendet der Browser verschiedene Bibliotheken des SerenityOS-Projekt, bei dem es üblich ist, ",
    "faq.question4.paragraph2Italic": "alles",
    "faq.question4.paragraph2Part2":
      "von Grund auf neu zu schreiben. Da Ladybird sich von SerenityOS abgespalten hat, ist es nun nicht mehr an diese Kultur gebunden, und wir werden Bibliotheken von Drittanbietern für allgemeine Funktionen verwenden (z.B. Bild-/Audio-/Videoformate, Verschlüsselung, Grafiken, usw.).",
    "faq.question4.paragraph3":
      "Wir verwenden bereits einige der gleichen Bibliotheken von Drittanbietern, die auch von anderen Browsern verwendet werden, aber wir werden niemals eine andere Browser-Engine übernehmen, anstatt unsere eigene zu entwickeln.",
    // Question 5
    "faq.question5.title": "Wird Ladybird unter Windows funktionieren?",
    "faq.question5.paragraph":
      "Wir haben niemanden, der aktiv an der Windows-Unterstützung arbeitet, und es sind beträchtliche Änderungen erforderlich, damit es außerhalb einer Unix-ähnlichen Umgebung gut funktioniert.",
    "faq.question5.paragraph2":
      " Wir würden gerne irgendwann Windows einführen, aber das hat im Moment keine Priorität.",
    // Question 6
    "faq.question6.title":
      "Wird Ladybird auch auf mobilen Geräten funktionieren?",
    "faq.question6.paragraph":
      "Wir haben niemanden, der aktiv an einer Android- oder iOS-Portierung arbeitet. Sobald wir die Desktop-Versionen in einem guten Zustand haben, werden wir uns mehr um mobile Geräte kümmern.",
    "faq.question6.paragraph2":
      "Es gibt zwar den Beginn einer Android-Portierung im Projekt-Repository, aber Mobile hat im Moment keine Priorität.",
    // Question 7
    "faq.question7.title": "Was sind die Sponsorenstufen?",
    "faq.question7.paragraph":
      "Die Sponsorings gelten für ein Jahr und können dann verlängert werden.",
    "faq.question7.paragraph2":
      "Die Logos der Sponsoren werden auf unserer Website angezeigt, und sie werden in Aktualisierungen und in den sozialen Medien gewürdigt.",
    "faq.question7.paragraph3": "Bitte ",
    "faq.question7.paragraph3Link": "kontaktiere uns",
    "faq.question7.paragraph3part2":
      " wenn Interesse an einem Sponsoring besteht.",
    // Question 8
    "faq.question8.title":
      "Wie können Sie „unabhängig“ sein, wenn Sie Sponsoren haben?",
    "faq.question8.paragraph":
      " Alle Förderungen erfolgen in Form von nicht zweckgebundenen Spenden. Sitze im Verwaltungsrat und andere Formen des Einflusses sind nicht käuflich.",
    // Question 9
    "faq.question9.title":
      "Warum einen neuen Browser in C++ entwickeln, wenn es sicherere und modernere Sprachen gibt?",
    "faq.question9.paragraph":
      "Ladybird begann als eine Komponente des SerenityOS-Hobbyprojekts, das nur C++ zulässt. Die Wahl der Sprache war nicht so sehr eine technische Entscheidung, sondern eher eine der persönlichen Bequemlichkeit. Andreas fühlte sich bei der Entwicklung von SerenityOS mit C++ am wohlsten, und jetzt haben wir fast eine halbe Million Zeilen modernes C++ zu pflegen.",
    "faq.question9.paragraph2":
      "Da sich Ladybird nun aber abgespalten hat und zu einem eigenständigen Projekt geworden ist, sind alle Beschränkungen, die zuvor von SerenityOS auferlegt wurden, nicht mehr gültig.",
    "faq.question9.paragraph3":
      "Wir haben eine Reihe von Alternativen geprüft und werden mit der schrittweisen Einführung von ",
    "faq.question9.paragraph3Part2":
      " als Nachfolgesprache beginnen, sobald Swift Version 6 veröffentlicht ist. (",
    "faq.question9.paragraph3MoreBackgroundLink": "Mehr Informationen.",

    // Footer
    // Newsletter
    "newsletter.title": "Melde dich für unseren Newsletter an",
    "newsletter.paragraph":
      "Wir schicken dir einmal im Monat eine E-Mail mit Neuigkeiten über Ladybird.",
    "newsletter.email.placeholder": "Deine E-Mail",
    // Navigation
    "footer.contactUs": "Kontaktiere uns",
    // Bottom part
    "footer.allRightsReserved": "Alle Rechte vorbehalten.",
  },
} as const;
