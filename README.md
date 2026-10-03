# Eternal Flame Tech (EFT)

<div align="center">

[![Deploy to GitHub Pages](https://github.com/eternalflametech/eft.io.vn/actions/workflows/deploy.yml/badge.svg)](https://github.com/eternalflametech/eft.io.vn/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/badge/Website-eft.io.vn-7c3aed?style=flat&logo=google-chrome&logoColor=white)](https://eft.io.vn)
[![License: MIT](https://img.shields.io/badge/License-MIT-f43f5e.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**The Official Portal of Eternal Flame Tech (EFT)**  
*AI & Robotics Student Club &bull; Nguyen Thi Minh Khai High School for the Gifted &bull; Can Tho City, Vietnam*

[**Explore Website &rarr;**](https://eft.io.vn) &bull; [**Join the Club &rarr;**](https://tally.so/r/KYbqoA) &bull; [**Facebook Fanpage &rarr;**](https://www.facebook.com/profile.php?id=61579958011741)

</div>

---

## 📌 Overview

**Eternal Flame Tech (EFT)** is an academic and applied engineering club founded at [**Nguyen Thi Minh Khai High School for the Gifted**](https://chuyenminhkhaist.edu.vn/) (Can Tho City, Vietnam). The club focuses on empowering high-school students with modern, hands-on proficiencies across four foundational pillars:

1. **Artificial Intelligence & Large Language Models (LLMs)**: Generative AI, AI agents, prompt engineering, custom chatbot design with Google AI Studio & GPTs, and hallucination management.
2. **Embedded Systems & Robotics**: Breadboard circuit prototyping, microcontrollers (Arduino, ESP32), sensor integration, DC/Servo motor drivers, and peripheral interfaces.
3. **Vibe Coding & Next-Gen Tooling**: Accelerated engineering workflows utilizing state-of-the-art AI-assisted development environments (Cursor, Google AntiGravity, Claude Code).
4. **3D CAD Modeling & Additive Manufacturing**: Parametric 3D mechanical modeling in Onshape, rapid prototyping, and precision 3D printing for robotic chassis and joint mechanisms.

---

## 🚀 Key Features & Interactive UX

- **Sliding Capsule Switch Navbar**: Tactile glassmorphic indicator pill that glides with smooth spring dynamics between sections on click, scroll, and hover preview.
- **Mobile-First Progressive Scroll Reveal**: Full-viewport landing view (`100svh`) paired with silky scroll-triggered animations (`IntersectionObserver`) for seamless vertical pacing on mobile devices.
- **Embedded Modal Application Form**: Built-in modal dialog embedding the official Tally registration form (`https://tally.so/r/KYbqoA`) with backdrop blur, keyboard navigation (`ESC`), outside-click dismissal, and body scroll lock.
- **Dynamic Ambient Canvas**: Lightweight, high-performance particle constellation with subtle neon purple/rose ember drift.
- **Zero-Runtime Dependency Client**: Pure vanilla JavaScript modular architecture (`window.EFT`) ensuring 100% compatibility across both static hosting (`https://`) and local offline viewing (`file:///`).

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Markup & Semantics** | HTML5, Accessible ARIA standards, Open Graph & Twitter Cards |
| **Styling & Design System** | Tailwind CSS v3 (JIT mode), CSS Grid, Glassmorphism, Precision Dark Palette (`Zinc-950`, `Violet`, `Rose`) |
| **Client Scripts** | Modular ES6 JavaScript (Universal Namespace: `window.EFT`), Intersection Observer API |
| **Local Development** | Node.js, Express static server, Concurrently, Tailwind CLI |
| **CI / CD Deployment** | GitHub Actions (`actions/deploy-pages@v4`), GitHub Pages with custom domain (`CNAME: eft.io.vn`) |

---

## 📂 Project Structure

```text
eft.io.vn/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── assets/
│   └── logo.jpg                # High-resolution EFT official insignia
├── css/
│   └── style.css               # Production minified stylesheet compiled by Tailwind
├── js/
│   ├── modules/
│   │   ├── animations.js       # Scroll-reveal intersection observers & numeric counters
│   │   ├── canvas.js           # Ambient background particle simulation
│   │   ├── modal.js            # Tally registration form iframe modal controller
│   │   ├── navbar.js           # Glassmorphic navbar & desktop sliding switch indicator
│   │   ├── scroll.js           # Scroll progress bar, back-to-top button & active section spy
│   │   └── stepper.js          # Desktop keyboard arrow navigation
│   └── main.js                 # Application bootstrapper and orchestrator
├── src/
│   └── input.css               # Tailwind CSS source rules, component classes & utilities
├── .gitignore                  # Git ignore rules for node, editors, and temporary files
├── CNAME                       # Custom apex domain configuration (eft.io.vn)
├── CODE_OF_CONDUCT.md          # Community guidelines and behavioral standards
├── CONTRIBUTING.md             # Developer contribution workflows and commit standards
├── index.html                  # Core single-page landing application
├── package.json                # Project dependencies and operational scripts
├── README.md                   # Repository documentation
├── SECURITY.md                 # Vulnerability reporting and security policy
├── server.js                   # Lightweight Express local development server
└── tailwind.config.js          # Tailwind theme configurations and color tokens
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 18.0.0 or higher; LTS v20+ recommended)
- [npm](https://www.npmjs.com/) (Version 9.0.0 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eternalflametech/eft.io.vn.git
   cd eft.io.vn
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Development Workflow

- **Start Development Mode:**
  Runs the local Express web server concurrently with the Tailwind CSS file watcher:
  ```bash
  npm run dev
  ```
  Open your browser and navigate to:
  ```text
  http://localhost:3000
  ```

- **Build Production Stylesheet:**
  Compiles and minifies `src/input.css` into `css/style.css`:
  ```bash
  npm run build
  ```

- **Run Local Static Server only:**
  ```bash
  npm start
  ```

---

## 🚢 Continuous Deployment (GitHub Pages)

This repository includes a fully automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

- Every push to the `main` branch triggers an automated build runner.
- The runner sets up Node.js v20, runs `npm ci`, compiles production CSS via `npm run build`, and stages `index.html`, `CNAME`, `assets/`, `css/`, and `js/` into a pristine `_site` deployment bundle.
- The artifact is deployed directly to **GitHub Pages** serving the custom domain **[eft.io.vn](https://eft.io.vn)** with HTTPS enforcement.

---

## 🤝 Contributing

We welcome contributions from club members, alumni, and open-source enthusiasts!

1. Please read our [**Contributing Guide**](CONTRIBUTING.md) for details on code style, commit conventions, and branch strategy.
2. Review our [**Code of Conduct**](CODE_OF_CONDUCT.md) to maintain an inclusive and respectful environment.
3. For bug reports or feature requests, feel free to submit an issue via [GitHub Issues](https://github.com/eternalflametech/eft.io.vn/issues).

---

## 🔒 Security

For security vulnerability disclosures, please review our [Security Policy](SECURITY.md) or contact us directly at [eternalflametech.eft@gmail.com](mailto:eternalflametech.eft@gmail.com).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Designed & Developed with passion by the <strong>Eternal Flame Tech</strong> Engineering Team.</sub><br>
  <sub>&copy; 2026 Eternal Flame Tech Club &bull; Nguyen Thi Minh Khai High School for the Gifted, Can Tho City, Vietnam.</sub>
</div>
