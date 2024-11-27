#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: Please provide a project name"
    echo "Usage: ../make.sh <project-name>"
    exit 1
fi

# Create the Vite project in the current directory
cd "$(pwd)" && npm create vite@latest $1 -- --template react

# Navigate into project directory and install dependencies
cd "$1" && npm install