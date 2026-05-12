#!/bin/bash
# render_start.sh — used as the Start Command on Render
# Command: bash render_start.sh

uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
