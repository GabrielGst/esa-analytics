# Automation Hub

The Automation Hub was conceived as a central platform to consolidate all automation tools and related  raining material into a single, accessible location. At present, the ecosystem is fragmented across multiple hosting environments, with the Automation App on SharePoint, the Power BI Dashboard on Power BI, the Annual Review Portal on Power Apps, and the Success Story App already integrated into the hub itself. By centralizing these tools, the hub aims to provide a unified user experience and, with further development, could evolve into a comprehensive activity dashboard offering visibility into process timelines and activity states. In order to ensure long-term resilience, the framework has been designed with future-proofing in mind : external IT consultants have recommended shifting future development towards more flexible technologies such as React.js, enabling a more sustainable and adaptable foundation.

The Annual Review Tracking Tool (ARTT) was created to streamline the preparation of draft Annual Review Portal reports by leveraging data provided by technical officers. Unlike the Annual Review Portal itself, the ARTT performs a “soft extraction” of information, meaning the data is retrieved and compiled without altering the status of any records in the portal. This approach not only preserves data integrity but also introduces greater granularity, allowing users to filter and select specific activities by country, program fund, CDO in charge, program total amount, program expected due date... As a result, the tool enhances the reliability of annual reporting processes.

The Success Story Application (SSAP), in turn, was developed as an end-of-process reporting tool designed to capture and present successful activities in a consistent and reusable format. Beyond its immediate function of contributing to annual reviews and serving as annexes for country reports, the application provides a standardized resource for CDOs to use in their annual reports. By digitalizing this reporting process, the SSAP ensures that a single, authoritative source of information is available across multiple contexts. Additionally, the tool acts as a repository of showcase material, enabling the extraction of success stories from any country on demand. This capability facilitates the preparation of presentations for program reviews, training sessions, business development briefings, and high-level events, thereby extending the visibility and impact of the agency’s achievements.

---

## Deployment

The app runs as two Docker containers (Next.js + Flask) managed by `docker compose`. Deployments are automated via GitHub Actions using a self-hosted runner on the production server.

### One-time server setup

**1. Install Docker**
```bash
# https://docs.docker.com/engine/install/ubuntu/
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

**2. Clone the repo at a fixed path**
```bash
sudo mkdir -p /opt/esa-analytics
sudo chown $USER /opt/esa-analytics
git clone https://github.com/GabrielGst/esa-analytics-homecenter-public.git /opt/esa-analytics
```

**3. Create the secrets directory**

Env files are gitignored and must be placed on the server manually:
```bash
sudo mkdir -p /opt/esa-analytics-secrets
# .env.local — AUTH_URL, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET, FLASK_INTERNAL_URL
sudo cp .env.local /opt/esa-analytics-secrets/.env.local
# flask/.env — CLIENT_ID, CLIENT_SECRET, SITE_NAME, PORT, log paths
sudo cp flask/.env /opt/esa-analytics-secrets/flask.env
sudo chmod 600 /opt/esa-analytics-secrets/*
```

**4. Add GitHub Actions secrets**

Go to **GitHub → repo → Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `SERVER_HOST` | Server IP or hostname |
| `SERVER_USER` | SSH username |
| `SSH_PRIVATE_KEY` | Private key whose public key is in `~/.ssh/authorized_keys` on the server |

**5. Migrate the existing database (first deploy only)**

```bash
cd /opt/esa-analytics
cp /opt/esa-analytics-secrets/.env.local .env.local
cp /opt/esa-analytics-secrets/flask.env flask/.env
docker compose up flask -d
docker cp flask/instance/mydata.db esa-analytics-flask-1:/app/flask/instance/mydata.db
docker compose restart flask
```

**6. Configure nginx**

```bash
sudo cp /opt/esa-analytics/esa-analytics.webagab.fr.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/esa-analytics.webagab.fr.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Deploying

Push or merge to `public` — GitHub Actions SSHes into the server, pulls the latest code, and runs `docker compose up -d --build` automatically.

### CI on the dev branch

Every push to `dev` triggers a build validation (both Docker images built, no deploy). A red check means the branch has a broken build.
