#!/bin/bash
# Start both Next.js and the worker
npm start &
npm run worker &
wait -n
exit $?

