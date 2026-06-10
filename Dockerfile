# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production stage (nginx) ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Archivos estáticos generados por Angular (Angular 17+ → browser/)
COPY --from=builder /app/dist/my-ninja/browser /usr/share/nginx/html

# Configuración de nginx con soporte para SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
