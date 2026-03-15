# ItacaPanel

Web UI segura para conversar con Itacabot/OpenClaw sin depender de Telegram. Inspirada en AskClaw, PinchChat y BotMaker, pero enfocada en:

- 🔐 Sesiones privadas con Auth (Magic Link / TOTP) y control IP
- 🧵 Vista multi-thread (cada chat = sesión OpenClaw) con inspector de herramientas
- 🖥️ Widgets gráficos (tableros, previews, archivos) para acompañar las respuestas
- 📨 Canal alternativo para los briefings diarios (render Markdown + botones)

## MVP propuesto

1. **Backoffice FastAPI**
   - Endpoints `/sessions`, `/messages`, `/events`
   - Webhook del gateway -> streaming SSE para la UI
   - Cola Redis opcional para fanout

2. **Frontend Next.js + Tailwind**
   - Login rápido (PIN) + Passkey opcional
   - Panel con: lista de sesiones, chat principal, consola de herramientas
   - Vista “Briefing” con cards y botones (reenviar a Telegram / guardar en repo)

3. **Integración OpenClaw**
   - Conexión vía Gateway HTTP (`/sessions/:id/messages`)
   - Firma de requests con token corto almacenado en server (no en cliente)

4. **Hardening**
   - Rate limiting per user (FastAPI-limiter)
   - CSP + iframe sandbox para previews
   - Audit log en SQLite/pgvector

## Inspiración

| Proyecto | Qué reutilizar | Qué mejorar |
|----------|----------------|-------------|
| AskClaw (Svelte + FastAPI) | Streaming chat, KB search, exports | Añadir soporte nativo a OpenClaw tools + panel multi-sesión |
| PinchChat (Next.js) | UI oscura, inspector de tool calls | Seguridad (auth mínima), componentes reutilizables |
| BotMaker | Gestión de bots en contenedores | Integrar dashboards + permisos granulares |

## Próximos pasos

- [ ] Scaffold Next.js 15 + Tailwind + Shadcn
- [ ] Definir contrato API (`/api/chat`, `/api/briefings`)
- [ ] Implementar proxy SSE para respuestas del gateway
- [ ] Diseñar layout (Stacked split: sesiones / chat / inspector)
- [ ] Añadir modo “Briefing” (cards + CTA)
