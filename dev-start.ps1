# Minimal dev stack: infra (Docker) + 4 Java services (native) + frontend
# RAM estimate: Redis 64m + Zookeeper 256m + Kafka 512m + 4x Java 256m + FE ~300m = ~2.4GB

$ROOT = $PSScriptRoot
$JVM  = "-Xmx256m -Xms128m"

Write-Host "==> Starting infra (Redis + Kafka)..." -ForegroundColor Cyan
docker compose -f "$ROOT\docker\docker-compose.infra.yml" up -d
Start-Sleep -Seconds 10

Write-Host "==> Starting identity-service (port 8087)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\services\identity-service'; `$env:MAVEN_OPTS='$JVM'; .\mvnw spring-boot:run"

Start-Sleep -Seconds 5

Write-Host "==> Starting profile-service (port 8081)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\services\profile-service'; `$env:MAVEN_OPTS='$JVM'; .\mvnw spring-boot:run"

Write-Host "==> Starting order-service (port 8082)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\services\order-service'; `$env:MAVEN_OPTS='$JVM'; .\mvnw spring-boot:run"

Write-Host "==> Starting gateway-api (port 8080)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\services\gateway-api'; `$env:MAVEN_OPTS='$JVM'; .\mvnw spring-boot:run"

Write-Host ""
Write-Host "==> All services starting. Wait ~60s for JVM warmup." -ForegroundColor Yellow
Write-Host "    Gateway : http://localhost:8080" -ForegroundColor White
Write-Host "    Frontend: cd apps\sender-web && npm run dev  ->  http://localhost:3000" -ForegroundColor White
