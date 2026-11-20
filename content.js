/* =====================================================================
   MAYA'S CONTENT FILE  ✏️
   This is the ONLY file you need to edit to update the site.
   (Hebrew guide: see the file  מדריך-עדכון.md)
   ===================================================================== */

window.SITE = {
  name: "Maya Paz",
  role: "3D Character Animator",

  // Short line under the name on the main page
  tagline: "Giving characters weight, timing and a little bit of soul.",

  // ---------- ABOUT ----------
  aboutTitle: "Hi, I'm Maya.",
  aboutText: [
    "I'm a 3D character animator who loves finding the moment a character stops moving and starts feeling.",
    "From body mechanics to quiet acting beats, I animate in Maya and bring scenes to life in Unreal Engine."
  ],
  tools: ["Maya", "Unreal Engine"],
  focus: ["Character animation", "Body mechanics", "Acting & pantomime"],

  // ---------- CONTACT ----------
  email: "mayapaz53@gmail.com",
  instagram: "mayapaz53",

  // ---------- WORKS ----------
  // To add a work: upload the video next to the other files and add a line below.
  //   video   = the video file (MP4)                       (required)
  //   videoHD = a bigger/sharper version for full screen   (optional)
  //   poster  = a still image shown while loading          (optional)
  //   title   = a name for the work                        (optional — leave "" to hide)
  // The FIRST work in the list is shown first.
  works: [
    { video: "samurai-720.mp4", videoHD: "samurai-1080.mp4", poster: "samurai.jpg", title: "" },
    { video: "chips-720.mp4",   videoHD: "chips-1080.mp4",   poster: "chips.jpg",   title: "" },
    { video: "door-720.mp4",    videoHD: "door-1080.mp4",    poster: "door.jpg",    title: "" },
    { video: "couch-720.mp4",   videoHD: "couch-1080.mp4",   poster: "couch.jpg",   title: "" }
  ],

  // ---------- OPENING ANIMATION ----------
  // The video that plays on the opening screen, and the point (in % of the frame)
  // the camera flies into at the end. x = from the left, y = from the top.
  intro: {
    video: "samurai-720.mp4",
    videoHD: "samurai-1080.mp4",
    poster: "samurai.jpg",
    lastFrame: "samurai-last.jpg",
    target: { x: 35.9, y: 53.2 }
  }
};
