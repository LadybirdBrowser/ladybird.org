const faqs = [
  {
    file: "when",
    question: "When is it coming",
    content: `
We are targeting Summer 2026 for a first Alpha version on Linux and macOS. This
will be aimed at developers and early adopters.`,
  },
  {
    file: "number-of-devs",
    question: "How many people are working on the browser today",
    content: `
We currently have 4 paid full-time engineers working on Ladybird. There is also
a large community of volunteer contributors.`,
  },
  {
    file: "hiring-plan",
    question: "What's the hiring plan",
    content: `
We have 3 new full-time engineers starting soon. Going forward, we would like to
grow the team at a reasonable pace. Building the right team is more important
than building it quickly.`,
  },
  {
    file: "no-code-policy",
    question: 'What does "No code from other browsers" really mean',
    content: `
The focus of the Ladybird project is to build a new browser engine from the
ground up. We don't use code from Blink, WebKit, Gecko, or any other browser
engine.

<br />

For historical reasons, the browser uses various libraries from the SerenityOS
project, which has a strong culture of writing _everything_ from scratch. Now
that Ladybird has forked from SerenityOS, it is no longer bound by this culture,
and we will be making use of 3rd party libraries for common functionality (e.g
image/audio/video formats, encryption, graphics, etc.)

<br />
We are already using some of the same 3rd party libraries that other browsers
use, but we will never adopt another browser engine instead of building our own.`,
  },
  {
    file: "windows-support",
    question: "Will Ladybird work on Windows",
    content: `
We don't have anyone actively working on Windows support, and there are
considerable changes required to make it work well outside a Unix-like
environment.

<br />
We would like to do Windows eventually, but it's not a priority at the moment.`,
  },
  {
    file: "mobile-support",
    question: "Will Ladybird work on mobile devices",
    content: `
We don't have anyone actively working on an Android or iOS port. More effort
will be put into mobile once we have the desktop versions in a good state.

<br />

While there is the start of an Android port in the project repository, mobile is
not a priority at the moment.
`,
  },
  {
    file: "sponsor-tiers",
    question: "What are the sponsor tiers",
    content: `
- **Platinum** USD 100,000
- **Gold** USD 50,000
- **Silver** USD 10,000
- **Bronze** USD 5,000

<br />
Sponsorships run for one year, then you are welcome to renew.

<br />
Sponsors will have their logos displayed on our website, and will be thanked in
updates / on social media.

<br />
Please **[contact us](mailto:contact@ladybird.org)** if you are interested in
sponsorship.`,
  },
  {
    file: "independance",
    question: 'How can you be "independent" if you have sponsors',
    content: `
All sponsorships are in the form of unrestricted donations. Board seats and other
forms of influence are not for sale.`,
  },
  {
    file: "why-cpp",
    question:
      "Why build a new browser in C++ when safer and more modern languages are available",
    content: `
Ladybird started as a component of the SerenityOS hobby project, which only
allows C++. The choice of language was not so much a technical decision, but
more one of personal convenience. Andreas was most comfortable with C++ when
creating SerenityOS, and now we have almost half a million lines of modern C++
to maintain.

<br />
However, now that Ladybird has forked and become its own independent project,
all constraints previously imposed by SerenityOS are no longer in effect. We are
actively evaluating a number of alternatives and will be adding a mature
successor language to the project in the near future. This process is already
quite far along, and prototypes exist in multiple languages.`,
  },
];

import fs from "fs";
import path from "path";

faqs.forEach((faq, index) => {
  const { file, question, content } = faq;
  const mdxContent = `---
question: ${question}
order: ${index}
---

${content.trim()}`;

  fs.writeFileSync(path.join(__dirname, `${file}.mdx`), mdxContent);
});
