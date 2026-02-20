#!/bin/bash

# 1. Tenta subir os serviços. Se falhar, para o script.
if ! docker compose up -d; then
    echo "❌ Erro ao subir os contentores. Verifica a tua ligação à internet."
    exit 1
fi

echo "⏳ A gerar o teu link mágico (pode demorar uns segundos)..."

# 2. Loop para esperar que o link apareça nos logs (máximo 20 segundos)
for i in {1..20}; do
    LINK=$(docker compose logs tunnel 2>&1 | grep -o 'https://[-a-z0-9.]*\.trycloudflare.com' | head -n 1)
    
    if [ -n "$LINK" ]; then
        echo "------------------------------------------------"
        echo "🚀 PROJETO ONLINE: $LINK"
        echo "------------------------------------------------"
        exit 0
    fi
    sleep 1
done

echo "⚠️ O túnel demorou demasiado tempo. Tenta correr: docker compose logs tunnel"