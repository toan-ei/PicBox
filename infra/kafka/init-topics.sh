#!/bin/bash
KAFKA_HOST="kafka:29092"

topics=(
  "order.created"
  "order.status_changed"
  "order.cancelled"
  "payment.events"
  "payment.success"
  "tracking.events"
  "notification.events"
  "shipper.assigned"
  "order.created.DLQ"
  "payment.events.DLQ"
  "tracking.events.DLQ"
)

for topic in "${topics[@]}"; do
  kafka-topics --bootstrap-server $KAFKA_HOST \
    --create --if-not-exists \
    --topic "$topic" \
    --partitions 3 \
    --replication-factor 1
  echo "✓ Created: $topic"
done

echo "All topics created!"