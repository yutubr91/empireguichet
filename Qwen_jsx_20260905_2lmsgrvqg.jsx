import ChatBot from "./components/ChatBot";

// Dans ton rendu, remplace la section supportOpen par :
{supportOpen && (
  <div
    className="gc-fade-in mb-3 rounded-xl overflow-hidden flex flex-col"
    style={{
      width: 340,
      maxWidth: "88vw",
      height: 460,
      background: COLORS.surface,
      border: `1px solid ${COLORS.surfaceLine}`,
      boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
    }}
  >
    <ChatBot theme={theme} />
  </div>
)}