import { useState, useRef, useEffect } from "react";

const PRODUCT_CONTEXT = `You are "Nova" — a warm, approachable AI student advisor for first-generation college students at a mid-size university.

Your purpose: Help students navigate confusing topics without judgment — financial aid, choosing a major, campus resources, study strategies, internships, and general college life.

Persona: Friendly, clear, encouraging. Never condescending. Use plain language. Occasionally use light affirmations ("Great question!", "That's really common to wonder about"). Keep answers concise — 2-4 short paragraphs max unless the student asks for more detail.

When students seem stressed or overwhelmed, acknowledge that first before answering.

Always end with either: a follow-up question to keep them going, or a suggested next step (e.g. "You might want to book a 15-min slot with the Financial Aid office after this").

You are NOT a replacement for official advisors — occasionally remind students to verify important decisions with a real human advisor.`;

const SUGGESTED_QUESTIONS = [
"How does FAFSA actually work?",
"I don't know what major to pick — where do I start?",
"What campus resources do most students not know about?",
"How do I get an internship with no experience?",
"I'm struggling to keep up — what should I do?",
];

const USER_PERSONAS = [
{
name: "Maya, 19",
tag: "First-gen freshman",
avatar: "M",
color: "#f97316",
quote: "Nobody in my family went to college — I feel like I'm figuring everything out alone.",
},
{
name: "DeShawn, 21",
tag: "Junior, undeclared",
avatar: "D",
color: "#06b6d4",
quote: "I've changed my major twice and I'm worried I'm wasting money.",
},
{
name: "Priya, 20",
tag: "Sophomore, pre-med",
avatar: "P",
color: "#8b5cf6",
quote: "I know what I want but I don't know the system well enough to get there.",
},
];

export default function PortfolioChatbot() {
const [messages, setMessages] = useState([
{
role: "assistant",
content: "Hey! I'm Nova 👋 I'm here to help you navigate college life — no question is too basic or too embarrassing to ask. What's on your mind today?",
},
]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState("chat");
const [activatedPersona, setActivatedPersona] = useState(null);
const messagesEndRef = useRef(null);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);

async function sendMessage(text) {
const userText = text || input.trim();
if (!userText || loading) return;
setInput("");

const newMessages = [...messages, { role: "user", content: userText }];
setMessages(newMessages);
setLoading(true);

try {
const apiMessages = newMessages.map((m) => ({
role: m.role,
content: m.content,
}));

const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
"anthropic-version": "2023-06-01",
"anthropic-dangerous-direct-browser-access": "true",

},
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 1000,
system: PRODUCT_CONTEXT,
messages: apiMessages,
}),
});

const data = await res.json();
const reply = data.content?.map((b) => b.text || "").join("") || "Sorry, I couldn't get a response. Try again!";
setMessages([...newMessages, { role: "assistant", content: reply }]);
} catch (e) {
setMessages([...newMessages, { role: "assistant", content: "Something went wrong — please try again." }]);
}

setLoading(false);
}

function handlePersonaClick(persona) {
setActivatedPersona(persona.name);
setActiveTab("chat");
setTimeout(() => sendMessage(persona.quote), 100);
}

return (
<div style={{
fontFamily: "'Georgia', 'Times New Roman', serif",
background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
minHeight: "100vh",
color: "#f0ece4",
display: "flex",
flexDirection: "column",
}}>
<div style={{ padding: "24px 32px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
<div style={{ maxWidth: 900, margin: "0 auto" }}>
<span style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#a78bfa" }}>Portfolio Project</span>
<h1 style={{ margin: "4px 0", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-1px", background: "linear-gradient(90deg, #f0ece4 60%, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
Nova — Student Advisor AI
</h1>
<p style={{ margin: "0 0 20px", color: "#9ca3af", fontSize: 15, fontStyle: "italic" }}>
Helping first-gen college students navigate the system, one question at a time.
</p>
<div style={{ display: "flex", gap: 0 }}>
{["chat", "product thinking", "users"].map((tab) => (
<button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: activeTab === tab ? "#a78bfa" : "#6b7280", borderBottom: activeTab === tab ? "2px solid #a78bfa" : "2px solid transparent", transition: "all 0.2s", fontFamily: "inherit" }}>
{tab}
</button>
))}
</div>
</div>
</div>

<div style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "24px 32px", boxSizing: "border-box" }}>
{activeTab === "chat" && (
<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)", minHeight: 400 }}>
<div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 8 }}>
{messages.map((m, i) => (
<div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}>
{m.role === "assistant" && (
<div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>✦</div>
)}
<div style={{ maxWidth: "72%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "rgba(255,255,255,0.07)", border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none", fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
{m.content}
</div>
</div>
))}
{loading && (
<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
<div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
<div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 5, alignItems: "center" }}>
{[0,1,2].map(i => (
<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
))}
</div>
</div>
)}
<div ref={messagesEndRef} />
</div>
{messages.length <= 1 && (
<div style={{ marginBottom: 12 }}>
<p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6b7280", marginBottom: 8 }}>Common questions</p>
<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
{SUGGESTED_QUESTIONS.map((q) => (
<button key={q} onClick={() => sendMessage(q)} style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd", padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
))}
</div>
</div>
)}
<div style={{ display: "flex", gap: 10 }}>
<input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask anything about college life..." style={{ flex: 1, padding: "14px 18px", borderRadius: 28, border: "1px solid rgba(167,139,250,0.3)", background: "rgba(255,255,255,0.06)", color: "#f0ece4", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
<button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 50, height: 50, borderRadius: "50%", background: loading || !input.trim() ? "rgba(167,139,250,0.2)" : "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", cursor: loading || !input.trim() ? "default" : "pointer", fontSize: 20, color: "#fff", flexShrink: 0 }}>↑</button>
</div>
</div>
)}

{activeTab === "product thinking" && (
<div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
{[
{ emoji: "🎯", title: "Problem Statement", content: "First-generation college students face a distinct disadvantage: they lack the informal knowledge networks that legacy students have. They don't know what questions to ask, who to ask, or whether their question is \"dumb.\" This leads to underutilization of financial aid, delayed course corrections, and higher dropout rates. Advisors are stretched thin — average student-to-advisor ratio at public universities is 441:1." },
{ emoji: "👥", title: "Target Users", content: "Primary: First-gen undergrads (18–22) at mid-size public universities. Secondary: Transfer students re-navigating a new system. They share a common trait: high anxiety around not knowing what they don't know. They are comfortable with conversational interfaces and more likely to ask a chatbot a \"basic\" question than risk embarrassment with a human." },
{ emoji: "🔍", title: "How Do We Know This Is the Right Problem?", content: "Hypothetical research methods used: (1) Interviews with 8 first-gen students — 7 of 8 mentioned feeling too embarrassed to ask advisors repeat questions. (2) Survey of 40 students: 68% had Googled a question instead of asking someone. (3) NCAN research showing first-gen students are 2x less likely to use campus advising services." },
{ emoji: "💬", title: "How Users Interact", content: "The chatbot is accessible 24/7 on the student portal. Students interact conversationally — no forms, no appointments. Key patterns: open-ended questions, scenario-based queries, and stress venting. Nova acknowledges emotional context before giving information." },
{ emoji: "📊", title: "How We Measure Effectiveness", content: "Success metrics: (1) Task completion rate. (2) Advisor follow-through rate. (3) Retention signal — Nova users vs dropout rate. North star: % of students reporting more confidence navigating college at semester-end survey." },
{ emoji: "⚠️", title: "Risks & Limitations", content: "Nova is not a replacement for human advisors. Key risks: over-reliance, hallucinated financial aid info, and equity of device access. Each is mitigated in the design and would be revisited with real usage data." },
].map(({ emoji, title, content }) => (
<div key={title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
<span style={{ fontSize: 22 }}>{emoji}</span>
<h3 style={{ margin: 0, fontSize: 16, color: "#c4b5fd" }}>{title}</h3>
</div>
<p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#d1d5db" }}>{content}</p>
</div>
))}
</div>
)}

{activeTab === "users" && (
<div style={{ paddingTop: 8 }}>
<p style={{ color: "#9ca3af", fontSize: 14, fontStyle: "italic", marginBottom: 20 }}>Hypothetical personas constructed from aggregated research patterns.</p>
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
{USER_PERSONAS.map((p) => (
<div key={p.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
<div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: p.color }}>{p.avatar}</div>
<div style={{ flex: 1 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
<span style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</span>
<span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: p.color, background: `${p.color}18`, padding: "2px 8px", borderRadius: 10 }}>{p.tag}</span>
</div>
<p style={{ margin: "0 0 14px", fontSize: 14, fontStyle: "italic", color: "#9ca3af" }}>"{p.quote}"</p>
<button onClick={() => handlePersonaClick(p)} style={{ background: `${p.color}22`, border: `1px solid ${p.color}55`, color: p.color, padding: "7px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
Simulate this user's first message →
</button>
</div>
</div>
))}
</div>
</div>
)}
</div>
<style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } } * { box-sizing: border-box; }`}</style>
</div>
);
}
