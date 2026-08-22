# GitHub Actions deployment

The CI workflow in `.github/workflows/ci.yml` builds both Docker images for
pull requests and pushes to `main`. After CI succeeds on `main`, the CD
workflow in `.github/workflows/cd.yml` deploys to the Ubuntu server.

## Required GitHub environment and secrets

Create an environment named `production` in **Settings → Environments**, then
add these secrets:

| Secret | Example | Purpose |
| --- | --- | --- |
| `EC2_HOST` | `203.0.113.10` | Public IP or hostname of the Ubuntu EC2 server |
| `EC2_USER` | `ubuntu` | Ubuntu SSH user |
| `EC2_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Private EC2 SSH key |

The matching public SSH key must exist in
`/home/ubuntu/.ssh/authorized_keys` on the server.

## Server prerequisites

- Docker Engine and the Docker Compose plugin are installed.
- The repository is already cloned at `/home/ubuntu/CV-Online`.
- The repository can run `git pull origin main` without interactive prompts.
- The production `.env` file exists in the repository directory and is not
  committed to Git.
- The SSH user can run Docker without `sudo`.

## Deployment sequence

1. GitHub Actions builds the backend and frontend images as a CI check.
2. The deploy job connects to Ubuntu over SSH.
3. The server fast-forwards to the latest `main` commit.
4. `docker compose up -d --build --remove-orphans` rebuilds and restarts the
   services.
5. The backend entrypoint runs `prisma migrate deploy` before NestJS starts.
6. The workflow prints service status and the latest backend logs.

For the first deployment, test the same commands directly on the server:

```bash
cd /home/ubuntu/CV-Online
git pull --ff-only origin main
docker compose up -d --build --remove-orphans
docker compose ps
docker compose logs backend --tail=100
```
