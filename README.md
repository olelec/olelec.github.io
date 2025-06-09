# TerraBuild

![Website](https://img.shields.io/website?url=https%3A%2F%2FTerraBuild.ie&up_message=Online&down_message=Offline&down_color=red&style=for-the-badge&link=https%3A%2F%2FTerraBuild.ie)
![GitHub Release](https://img.shields.io/github/v/release/olelec/olelec.github.io?style=for-the-badge&color=purple)

![VueJS](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![SonarCloud](https://img.shields.io/badge/Sonar%20cloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

![GitHub Deploy Action Workflow Status](https://img.shields.io/github/actions/workflow/status/olelec/olelec.github.io/deploy.yml?style=for-the-badge&label=Deploy)
![GitHub Analysis Action Workflow Status](https://img.shields.io/github/actions/workflow/status/olelec/olelec.github.io/analysis.yml?style=for-the-badge&label=analysis)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/olelec/olelec.github.io/release.yml?style=for-the-badge&label=release)

![Sonar Violations](https://img.shields.io/sonar/blocker_violations/olelec_olelec.github.io?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![Sonar Violations](https://img.shields.io/sonar/critical_violations/olelec_olelec.github.io?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![Sonar Violations](https://img.shields.io/sonar/major_violations/olelec_olelec.github.io?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![Sonar Violations](https://img.shields.io/sonar/minor_violations/olelec_olelec.github.io?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![Sonar Violations](https://img.shields.io/sonar/info_violations/olelec_olelec.github.io?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)

## Project Setup

```bash
nvm use

npm install
```

Add Azure, Firebase and reCAPTCHA environment variables to `.env` file. Use `.env.example` as a template.

```bash
cp .env.example .env
```

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Compile and Minify for Production

```bash
npm run build
```
