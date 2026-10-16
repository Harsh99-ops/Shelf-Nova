import React, { useState, useRef, useEffect } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import { askWarehouseRag } from '../services/ragAssistantEngine';
import { WAREHOUSE_KNOWLEDGE_DOCS } from '../data/initialData';

export const AssistantKnowledgeScreen: React.FC = () => {
  const { 
    batches, 
    zones, 
    alerts, 
    ragMessages, 
    addRagMessage,
    setCurrentTab
  } = useWarehouse();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ragMessages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addRagMessage(userMsg);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      // Realistic confectioner thinking delay
      await new Promise(r => setTimeout(r, 600));
      const assistantResponse = await askWarehouseRag(q, { batches, zones, alerts });
      addRagMessage(assistantResponse);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('FEFO') || action.includes('Pick List') || action.includes('Dispatch')) {
      setCurrentTab('fefo');
    } else if (action.includes('Zone') || action.includes('Chiller') || action.includes('Telemetry')) {
      setCurrentTab('telemetry');
    } else if (action.includes('Camera') || action.includes('Inspection') || action.includes('Scan')) {
      setCurrentTab('inspection');
    } else if (action.includes('Alert') || action.includes('HACCP') || action.includes('Audit')) {
      setCurrentTab('alerts');
    } else {
      handleSendMessage(action);
    }
  };

  const promptSuggestions = [
    'Which candy batches expire in the next 48 hours?',
    'Explain Zone C Milk & Cream temperature breach protocol',
    'How does ethylene gas impact fresh strawberries in Zone A?',
    'What are the AI vision inspection grading thresholds?'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner - Chef Nova's Pastry Kitchen */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-pink-400/25 via-rose-300/35 to-amber-200/35 border-2 border-pink-300/70 shadow-lg shadow-pink-200/50 backdrop-blur-sm">
        {/* Floating Background Icons */}
        <div className="absolute -top-3 -right-3 text-5xl opacity-20 select-none pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
          🧁
        </div>
        <div className="absolute bottom-1 right-24 text-4xl opacity-20 select-none pointer-events-none">
          🍪
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-pink-500 text-white shadow-sm flex items-center gap-1.5 border border-white/60">
              <Sparkles className="w-3.5 h-3.5" /> Chef Nova RAG Assistant
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-white/80 text-pink-800 border border-pink-200 shadow-sm">
              ✨ Grounded in Live Confection Stock & Food Safety SOPs
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-candy font-extrabold text-pink-950 flex items-center gap-2">
            <span>AI Pastry Kitchen & Warehouse Copilot</span>
            <span className="text-xl">👩‍🍳</span>
          </h2>

          <p className="text-xs sm:text-sm text-pink-950/80 max-w-2xl font-medium leading-relaxed">
            Instant AI queries across current pantry stock, sub-zero cooler telemetry, and authoritative FDA 21 CFR / HACCP candy handling standard operating procedures.
          </p>
        </div>
      </div>

      {/* Main Chat & Knowledge Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Chat (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[660px] rounded-3xl bg-white/90 border-2 border-pink-200 shadow-xl shadow-pink-100/60 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b-2 border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-white to-amber-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-pink-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-candy font-extrabold text-sm text-pink-950 flex items-center gap-1.5">
                  <span>Chef Nova</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                    Master Confectioner AI
                  </span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Synchronized with {batches.length} Confection Lots & 4 Storage Bays</span>
                </span>
              </div>
            </div>

            <span className="text-xs font-candy font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              🍩 RAG Engine v2.4
            </span>
          </div>

          {/* Messages Stream - Soft Marshmallow Backdrop */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-pink-50/20 via-white to-amber-50/20">
            {ragMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs space-y-2.5 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-none border-2 border-pink-400 shadow-pink-200 font-candy'
                      : 'bg-white border-2 border-pink-200 text-amber-950 rounded-tl-none shadow-pink-100 font-sans'
                  }`}
                >
                  {/* Message Text with simple Markdown rendering */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="text-sm font-candy font-extrabold text-pink-900 mt-2 mb-1 border-b border-pink-100 pb-1">
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('* **')) {
                        return <div key={idx} className="my-1 font-medium">{line}</div>;
                      }
                      return <p key={idx} className={line === '' ? 'h-2' : ''}>{line}</p>;
                    })}
                  </div>

                  {/* Regulatory Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t-2 border-pink-100 space-y-2">
                      <span className="text-[10px] font-candy font-bold text-pink-700 uppercase tracking-wider block flex items-center gap-1">
                        📜 Official Confectionery SOP & FDA Citations:
                      </span>
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] space-y-0.5">
                          <div className="font-candy font-bold text-amber-950">{cite.source} ({cite.section})</div>
                          <p className="text-amber-900/80 italic font-medium">"{cite.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Chips */}
                  {msg.recommendedActions && msg.recommendedActions.length > 0 && (
                    <div className="pt-2 border-t-2 border-pink-100 space-y-2">
                      <span className="text-[10px] font-candy font-bold text-pink-700 uppercase tracking-wider block">
                        🧁 Recommended Next Steps:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.recommendedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(action)}
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-pink-800 border border-pink-300 text-[11px] font-candy font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <span>{action}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-pink-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] text-right font-candy font-medium ${msg.sender === 'user' ? 'text-pink-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-pink-700 text-xs font-candy font-bold p-3 rounded-2xl bg-pink-50/80 border border-pink-200 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                <span>Chef Nova is whipping up the recipe & searching HACCP SOPs... 🍰</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Prompt Suggestion Chips */}
          <div className="p-4 border-t-2 border-pink-100 bg-white/95 space-y-3">
            {/* Macaron Suggestion Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-800 border-2 border-pink-200 whitespace-nowrap shrink-0 transition font-candy font-bold shadow-sm cursor-pointer hover:scale-105"
                >
                  🍬 {prompt}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Chef Nova about FEFO dispatches, candy temperatures, or inspection grades..."
                className="flex-1 px-4 py-3 rounded-2xl bg-pink-50/50 border-2 border-pink-200 focus:border-pink-500 focus:bg-white text-pink-950 font-candy text-xs placeholder:text-pink-400 outline-none transition shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white font-candy font-bold transition shadow-md shadow-pink-300 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Knowledge Base & SOP Index (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white/90 border-2 border-pink-200 shadow-xl shadow-pink-100/60 space-y-4">
            <div className="flex items-center gap-2.5 border-b-2 border-pink-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-candy font-extrabold text-sm text-pink-950">Pastry SOPs & Rules</h3>
                <p className="text-[10px] text-pink-600 font-bold">FDA & HACCP Candy Regulations</p>
              </div>
            </div>

            <div className="space-y-3">
              {WAREHOUSE_KNOWLEDGE_DOCS.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-pink-50/40 border-2 border-pink-100 hover:border-pink-300 space-y-2 transition shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-candy text-pink-600 font-extrabold px-2 py-0.5 rounded-full bg-pink-100 border border-pink-200">
                      {doc.code}
                    </span>
                    <span className="font-candy text-amber-700 font-bold">{doc.category}</span>
                  </div>
                  <h4 className="font-candy font-extrabold text-xs text-amber-950">{doc.title}</h4>
                  <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed line-clamp-3">
                    {doc.content}
                  </p>
                  <button
                    onClick={() => handleSendMessage(`Explain the requirements of ${doc.code} (${doc.title})`)}
                    className="text-[11px] text-pink-600 hover:text-pink-700 font-candy font-bold flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>Consult Chef Nova on this rule</span>
                    <ArrowRight className="w-3.5 h-3.5 text-pink-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

