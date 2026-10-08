/* =====================================================================
   YOUR CONTENT LIVES HERE
   ---------------------------------------------------------------------
   Every page reads from this one file. Change the text between the
   quotes, save, and refresh the browser.
   ===================================================================== */

window.SITE = {
  /* ---------- Who you are (home page) ---------- */
  firstName: "Nurdaulet",
  lastName: "Askar",
  tagline:
    "First-year Computer Science student at the University of York. I build full-stack mobile apps and solve algorithmic problems in C++.",
  motto: "Simple ideas, built carefully.",

  // Put your picture in the "assets" folder and name it photo.jpg
  photo: "assets/photo.jpg",
  // Which part of the photo stays visible when it is cropped: "top", "center" or "bottom"
  photoPosition: "top",

  email: "nurdauletaskar551@gmail.com",

  traits: ["York, UK", "Full-stack", "Mobile apps", "Competitive programming"],

  about: [
    "I'm a first-year Computer Science student at the University of York. I co-develop Approx, a location-based social platform built with React Native and Django that is now in closed beta on TestFlight, and I published a VS Code extension that tracks typing speed while you code.",
    "I have been into competitive programming since I was 13 and regularly solve algorithmic problems in C++. In summer 2026 I worked as a software tester intern at UMAG.",
  ],

  // Up to five links, shown as the coloured pills next to your photo.
  links: [
    { label: "Email", url: "mailto:nurdauletaskar551@gmail.com" },
    { label: "GitHub", url: "https://github.com/SwiftkeyC" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nurdaulet-askar-03350033a/" },
    { label: "Approx beta", url: "https://testflight.apple.com/join/WFrS8Zqj" },
  ],

  /* ---------- Skills (home + experience pages) ---------- */
  // The home page shows the first three of each group; the Experience page shows all.
  skills: [
    { group: "Languages", items: ["C++", "Python", "TypeScript", "JavaScript", "Go", "SQL", "Bash", "LaTeX"] },
    { group: "Frameworks", items: ["React Native", "Expo", "Django", "Django REST Framework", "Django Channels"] },
    {
      group: "Technologies",
      items: ["PostgreSQL", "Redis", "Docker", "Git", "GitHub Actions", "WebSockets", "REST APIs", "OAuth authentication"],
    },
    {
      group: "Cloud & deployment",
      items: ["Railway", "Cloudflare R2", "Cloudflare Workers AI (Llama 4)", "Cloudflare Media Transformations"],
    },
    { group: "Other", items: ["Competitive programming", "Linux", "Load testing (Locust)"] },
  ],

  /* ---------- Projects page ---------- */
  // tags  = short topics, used for the filter buttons and shown on the card
  // stack = full list of tools, shown in the pop-up
  projects: [
    {
      title: "Approx",
      year: "2025 — Present",
      role: "Social media platform · co-developed with a friend",
      summary:
        "A location-based social platform with a live map, proximity discovery, real-time chat, stories, clubs and a short-video feed.",
      description:
        "A full-stack project: a React Native (Expo) app on top of a Django REST API. The iOS app is released as a closed beta on TestFlight, open for anyone to join and try through a public invite link.",
      highlights: [
        "Real-time chat and notifications with Django Channels WebSockets over a Redis channel layer",
        "PostgreSQL data models with connection pooling and per-endpoint rate limiting",
        "Backend deployed on Railway as an ASGI (Uvicorn) web service with a separate background worker",
        "User media hosted in Cloudflare R2 object storage (S3 API) and served from a custom domain",
        "AI moderation pipeline for uploaded media: video frames are extracted with Cloudflare Media Transformations and classified by Llama 4 Scout on Workers AI, with flagged content held for human review",
        "Go microservices for the moderation worker and push-notification dispatcher, run with Docker Compose alongside Django, PostgreSQL and Redis for end-to-end local testing",
      ],
      tags: ["Mobile", "Full-stack", "AI"],
      stack: ["React Native", "Expo", "Django", "PostgreSQL", "Redis", "Go", "Railway", "Cloudflare R2", "Workers AI"],
      links: [{ label: "Join the TestFlight beta", url: "https://testflight.apple.com/join/WFrS8Zqj" }],
    },
    {
      title: "Live WPM Counting",
      year: "2026",
      role: "VS Code extension",
      summary: "A VS Code extension that tracks a programmer's typing speed (WPM) in real time while coding.",
      description:
        "Developed and published through the Visual Studio Code Marketplace, with a focus on developer productivity, usability and performance.",
      highlights: [
        "Real-time WPM tracking built on the VS Code API",
        "Designed and shipped through the Visual Studio Code Marketplace",
        "Currently used by 10+ users",
      ],
      tags: ["Developer tools", "TypeScript"],
      stack: ["TypeScript", "VS Code API"],
      links: [
        {
          label: "View on the Marketplace",
          url: "https://marketplace.visualstudio.com/items?itemName=SwiftkeyC.live-wpm-counting",
        },
      ],
    },
  ],

  /* ---------- Experience page ---------- */
  experience: [
    {
      title: "Software Tester Intern",
      org: "UMAG",
      period: "Summer 2026",
      location: "Kazakhstan",
      summary: "Summer software testing internship, contributing to internal IT projects.",
      points: [
        "Debugged and tested backend APIs using Postman",
        "Identified more than 20 UI/UX bugs through systematic testing and documented them in detailed reports in Atlassian Confluence for the software team",
        "Performed functional and regression testing to identify backend and frontend issues and verify that fixes worked as expected",
        "Collaborated with the development team to reproduce issues, communicate technical findings and improve overall software quality",
      ],
      tags: ["Postman", "API testing", "Regression testing", "Confluence"],
    },
  ],

  education: [
    {
      title: "Computer Science, 1st year",
      org: "The University of York",
      period: "2026 — 2029",
      location: "York, UK",
      summary: "Relevant coursework:",
      points: [],
      tags: ["Programming", "Computational Thinking", "Mathematics", "Algorithms and Data Structures", "Software Engineering"],
    },
  ],

  // Add contests or awards here and an "Achievements" tab appears on the Experience page:
  // { title: "", org: "", period: "", location: "", summary: "", points: [], tags: [] }
  achievements: [],
};
