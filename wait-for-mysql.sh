#!/bin/sh

echo "⏳ Aguardando MySQL ficar disponível..."

until nc -z -v -w30 mysql 3306
do
  echo "⏳ Aguardando MySQL..."
  sleep 3
done

echo "✅ MySQL está pronto, iniciando a aplicação..."
npm run start
