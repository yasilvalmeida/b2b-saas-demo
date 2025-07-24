#!/bin/bash

echo "🧪 Testando CORS específico..."

# Testar preflight request
echo "📋 Testando preflight request..."
curl -X OPTIONS http://192.168.1.200:4001/auth/login \
  -H "Origin: http://192.168.1.200:4000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -E "(access-control-|HTTP/)"

echo ""
echo "🔐 Testando login real..."
curl -X POST http://192.168.1.200:4001/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://192.168.1.200:4000" \
  -d '{"email":"admin@demo.com","password":"admin123"}' \
  -v 2>&1 | grep -E "(access-control-|HTTP/|{.*})"

echo ""
echo "🌐 Testando com localhost..."
curl -X POST http://192.168.1.200:4001/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4000" \
  -d '{"email":"admin@demo.com","password":"admin123"}' \
  -v 2>&1 | grep -E "(access-control-|HTTP/|{.*})" 