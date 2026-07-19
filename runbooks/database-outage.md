Symptom: /ready returns 503
Diagnosis: docker compose ps and docker compose logs app
Recovery: docker compose start db
Verification: curl /ready returns 200
