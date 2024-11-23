#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: Please provide a project name"
    echo "Usage: ./create-vite.sh <project-name>"
    exit 1
fi

npm create vite@latest $1 -- --template react