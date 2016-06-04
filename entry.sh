#!/bin/bash
GITHUB_ROOT=https://eddibot:6d159d67d45981282216bc85be75ed5e7876a73f@github.com/water-alchemists
PERSIST=eddi-persist
CONTROLS=eddi-controls

if [ -d "$PERSIST" ]; then
    (cd $PERSIST && git pull origin master && npm install)
else
    git clone $GITHUB_ROOT/$PERSIST.git
    (cd $PERSIST && npm install)
fi

if [ -d "$CONTROLS" ]; then
    (cd $CONTROLS && git pull origin master && npm install)
else
    git clone $GITHUB_ROOT/$CONTROLS.git
    (cd $CONTROLS && npm install)
fi

npm start