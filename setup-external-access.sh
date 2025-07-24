#!/bin/bash

# Script para configurar acesso externo ao B2B SaaS Demo
# Execute este script para configurar o ambiente para testes externos

echo "🔧 Configurando acesso externo ao B2B SaaS Demo..."

# Configurar variáveis de ambiente para o frontend
echo "NEXT_PUBLIC_API_URL=http://192.168.1.200:4001" > apps/web/.env.local

echo "✅ Configuração concluída!"
echo ""
echo "📋 Para acessar externamente:"
echo "   Frontend: http://192.168.1.200:4000"
echo "   Backend:  http://192.168.1.200:4001"
echo "   API Docs: http://192.168.1.200:4001/docs"
echo ""
echo "🔑 Credenciais de teste:"
echo "   Admin: admin@demo.com / admin123"
echo "   User:  user@demo.com / user123"
echo ""
echo "🚀 Execute 'pnpm dev' na raiz do projeto para iniciar ambos os serviços" 