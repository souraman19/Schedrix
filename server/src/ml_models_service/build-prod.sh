#!/usr/bin/env bash

echo "Installing Python 3.11.9 manually..."

# Install pyenv
curl https://pyenv.run | bash

# Set up environment (make sure these lines work in Render's shell)
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# Install Python 3.11.9
pyenv install 3.11.9
pyenv global 3.11.9

# Confirm version
python --version


# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
