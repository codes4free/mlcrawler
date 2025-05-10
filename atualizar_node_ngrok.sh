#!/bin/bash

# Carrega o NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instala e usa a versão LTS do Node.js
nvm install --lts
nvm use --lts

# Mostra a versão do Node.js
node -v

# Instala o ngrok globalmente
npm install -g ngrok

# Mostra a versão do ngrok
ngrok version

echo "Node.js e ngrok prontos para uso!" 