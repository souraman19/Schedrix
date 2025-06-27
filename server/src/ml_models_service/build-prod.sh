#!/usr/bin/env bash

set -e  # Exit if any command fails

echo "🔧 Installing Python 3.11.9 manually..."

# Install pyenv
curl https://pyenv.run | bash

# Set up pyenv in this shell session
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# Install Python 3.11.9 only if not already installed
if ! pyenv versions | grep -q "3.11.9"; then
  pyenv install 3.11.9
fi

# Set Python version globally for this session
pyenv global 3.11.9

# Verify the correct Python version is active
python --version

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Python 3.11.9 and dependencies setup complete."
