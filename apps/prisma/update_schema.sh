#!/bin/bash

LANGUAGE="$1"
if [ -z "$LANGUAGE" ]; then
  echo "You must pass the target language as the first argument to the script"
  exit 1
fi

cat "./prisma/$LANGUAGE.prisma" "./prisma/models.prisma" > ./prisma/schema.prisma
