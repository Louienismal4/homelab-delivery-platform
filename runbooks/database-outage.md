# Database Outage Runbook

## Symptom

- `GET /ready` returns `503`
- `GET /notes` returns `503 Database unavailable`

## Diagnose

```bash
docker compose ps
docker compose logs app --tail=100
docker compose logs db --tail=100
```
