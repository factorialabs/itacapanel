"use client";

import { useState } from "react";

// Tipos
interface Session {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ToolCall {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: string;
  output?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

// Datos mock para demo
const mockSessions: Session[] = [
  { id: "1", title: "SDD Starter Kit", lastMessage: "Creando plantilla de specs...", timestamp: "19:18" },
  { id: "2", title: "Comparativa AWS/GCP/Azure", lastMessage: "Analizando precios...", timestamp: "19:15" },
  { id: "3", title: "ItacaPanel Backend", lastMessage: "API SSE configurada", timestamp: "18:42" },
];

const mockTools: ToolCall[] = [
  { name: "web_search", status: "completed", duration: "2.3s", output: "15 resultados" },
  { name: "read_file", status: "completed", duration: "0.1s", output: "SKILL.md" },
  { name: "exec", status: "running", duration: "1.2s" },
];

const mockMessages: Message[] = [
  { id: "1", role: "user", content: "Crea una plantilla de specs para SDD", timestamp: "19:18:02" },
  { id: "2", role: "assistant", content: "Perfecto, voy a crear una plantilla funcional para Spec-Driven Development...", timestamp: "19:18:05" },
];

export default function Home() {
  const [selectedSession, setSelectedSession] = useState<string>("1");
  const [inputMessage, setInputMessage] = useState("");

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Columna 1: Lista de Sesiones */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            🛡️ ItacaPanel
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">v0.1.0-alpha</p>
        </div>
        
        <div className="p-2">
          <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors mb-3">
            + Nueva Sesión
          </button>
          
          <div className="space-y-1">
            {mockSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session.id)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  selectedSession === session.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {session.title}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                  {session.lastMessage}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  {session.timestamp}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">qwen-portal/coder-model</span>
          </div>
        </div>
      </aside>

      {/* Columna 2: Chat Stream */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <h1 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            SDD Starter Kit
          </h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors">
              Exportar
            </button>
            <button className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors">
              Historial
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === "user" ? "text-blue-200" : "text-zinc-500 dark:text-zinc-400"
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && console.log("Send:", inputMessage)}
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
              Enviar
            </button>
          </div>
        </div>
      </main>

      {/* Columna 3: Tool Inspector */}
      <aside className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            🔧 Herramientas
          </h2>
        </div>

        <div className="p-4 space-y-3">
          {/* Herramientas usadas */}
          <div>
            <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Esta Sesión
            </h3>
            <div className="space-y-2">
              {mockTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {tool.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tool.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : tool.status === "running"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {tool.status === "running" ? "⏳" : tool.status === "completed" ? "✅" : "⏸️"}
                    </span>
                  </div>
                  {tool.duration && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {tool.duration}
                    </div>
                  )}
                  {tool.output && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
                      {tool.output}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Estadísticas
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Tokens in</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono">5,621</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Tokens out</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono">321</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Tiempo</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono">2m 34s</span>
              </div>
            </div>
          </div>

          {/* Modelos disponibles */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Modelos
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-700 dark:text-zinc-300">qwen-portal/coder-model</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-700 dark:text-zinc-300">gpt-5.1-codex</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-700 dark:text-zinc-300">qwen2.5:0.5b (local)</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
