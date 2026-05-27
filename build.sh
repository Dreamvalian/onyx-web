#!/bin/bash
cd /root/projects/onyx-web
npx next build > /tmp/next-build.log 2>&1
BUILD_EXIT=$?
echo "BUILD_EXIT: $BUILD_EXIT" >> /tmp/next-build.log
if [ $BUILD_EXIT -eq 0 ]; then
  cp -r .next/static .next/standalone/.next/ >> /tmp/next-build.log 2>&1
  echo "COPY_DONE" >> /tmp/next-build.log
fi
echo "BUILD_COMPLETE" >> /tmp/next-build.log
