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
sudo usermod -aG docker $USER   # allow runner user to run docker without sudo
newgrp docker
```

**2. Register the GitHub Actions self-hosted runner**

Go to **GitHub → repo → Settings → Actions → Runners → New self-hosted runner**, select Linux, and follow the instructions. Install the runner as a service so it survives reboots:
```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

**3. Create the secrets directory**

Env files are gitignored and must be placed on the server manually:
```bash
sudo mkdir -p /opt/esa-analytics-secrets
# Copy .env.local (Next.js secrets: AUTH_URL, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET, FLASK_INTERNAL_URL)
sudo cp .env.local /opt/esa-analytics-secrets/.env.local
# Copy flask/.env (Flask secrets: CLIENT_ID, CLIENT_SECRET, SITE_NAME, PORT, log paths)
sudo cp flask/.env /opt/esa-analytics-secrets/flask.env
sudo chmod 600 /opt/esa-analytics-secrets/*
```

**4. Migrate the existing database (first deploy only)**

```bash
docker compose up flask -d
docker cp flask/instance/mydata.db esa-analytics-flask-1:/app/flask/instance/mydata.db
docker compose restart flask
```

**5. Configure nginx**

```bash
sudo cp esa-analytics.webagab.fr.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/esa-analytics.webagab.fr.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Deploying

Push or merge to `public` — the Actions runner rebuilds both images and restarts the containers automatically.

### CI on the dev branch

Every push to `dev` triggers a build validation (both Docker images built, no deploy). A red check means the branch has a broken build.
