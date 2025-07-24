#!/bin/bash

# Script para testar o acesso externo ao B2B SaaS Demo
echo "🧪 Testando acesso externo ao B2B SaaS Demo..."
echo ""

# Testar frontend
echo "📱 Testando Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.1.200:4000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: http://192.168.1.200:4000 - OK"
else
    echo "❌ Frontend: http://192.168.1.200:4000 - ERRO ($FRONTEND_STATUS)"
fi

# Testar backend
echo "🔧 Testando Backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.1.200:4001)
if [ "$BACKEND_STATUS" = "404" ] || [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend: http://192.168.1.200:4001 - OK"
else
    echo "❌ Backend: http://192.168.1.200:4001 - ERRO ($BACKEND_STATUS)"
fi

# Testar CORS
echo "🌐 Testando CORS..."
CORS_RESPONSE=$(curl -s -X OPTIONS http://192.168.1.200:4001/auth/login \
  -H "Origin: http://192.168.1.200:4000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -w "%{http_code}")

if [ "$CORS_RESPONSE" = "204" ]; then
    echo "✅ CORS: Preflight request - OK"
else
    echo "❌ CORS: Preflight request - ERRO ($CORS_RESPONSE)"
fi

# Testar login
echo "🔐 Testando Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://192.168.1.200:4001/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://192.168.1.200:4000" \
  -d '{"email":"admin@demo.com","password":"admin123"}' \
  -o /dev/null \
  -w "%{http_code}")

if [ "$LOGIN_RESPONSE" = "201" ]; then
    echo "✅ Login: Admin credentials - OK"
else
    echo "❌ Login: Admin credentials - ERRO ($LOGIN_RESPONSE)"
fi

echo ""
echo "🎯 Resumo dos testes:"
echo "   Frontend: $([ "$FRONTEND_STATUS" = "200" ] && echo "✅" || echo "❌")"
echo "   Backend:  $([ "$BACKEND_STATUS" = "404" ] || [ "$BACKEND_STATUS" = "200" ] && echo "✅" || echo "❌")"
echo "   CORS:     $([ "$CORS_RESPONSE" = "204" ] && echo "✅" || echo "❌")"
echo "   Login:    $([ "$LOGIN_RESPONSE" = "201" ] && echo "✅" || echo "❌")"
echo ""
echo "🌐 URLs de acesso:"
echo "   Frontend: http://192.168.1.200:4000"
echo "   Backend:  http://192.168.1.200:4001"
echo "   API Docs: http://192.168.1.200:4001/docs"
echo ""
echo "🔑 Credenciais:"
echo "   Admin: admin@demo.com / admin123"
echo "   User:  user@demo.com / user123" 