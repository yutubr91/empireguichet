import React, { useState, useRef, useEffect } from "react";

// ============================================================================
// BASE DE CONNAISSANCES DU CHATBOT EMPIREGUICHET
// ============================================================================
const SUPPORT_BOT_KB = [
  {
    keywords: ["salut", "bonjour", "bonsoir", "coucou", "hello", "slt", "bjr", "bsr"],
    answer: "Bonjour 👋 Je suis l'assistant EmpireGuichet. Comment puis-je t'aider aujourd'hui ?",
  },
  {
    keywords: ["c'est quoi empireguichet", "presentation", "présentation", "comment ça marche", "comment ca marche"],
    answer: "EmpireGuichet est un guichet unique de mobile money pour les agents et chefs d'agence en Côte d'Ivoire : tu y gères MTN MoMo, Orange Money, Moov Money, Wave, Djamo, la crypto (USDT), les factures CIE/SODECI et les péages, avec un seul ticket et un seul historique. Un abonnement (2 500 FCFA/6 mois) donne accès à l'application.",
  },
  {
    keywords: ["abonnement", "combien coute", "combien coûte", "prix", "tarif"],
    answer: "L'abonnement coûte 2 500 FCFA pour 6 mois (agent comme chef d'agence). Si tu deviens chef d'agence par promotion, le tarif est de 3 500 FCFA. Tu peux payer par Wave ou en USDT (réseau BNB/BEP20) directement depuis l'onglet Abonnement.",
  },
  {
    keywords: ["abonnement expire", "abonnement expiré", "renouveler", "renouvellement"],
    answer: "Quand ton abonnement expire, l'accès à certaines fonctions est suspendu jusqu'au renouvellement. Va dans l'onglet Abonnement pour repayer (Wave ou USDT) et réactiver ton compte immédiatement après confirmation du paiement.",
  },
  {
    keywords: ["rien recu", "rien reçu", "pas recu", "pas reçu", "j'ai paye", "j'ai payé", "compte pas active", "compte pas activé", "toujours pas actif", "paiement non pris en compte"],
    answer: "Si tu as payé ton abonnement mais que rien ne se met à jour, patiente d'abord quelques minutes le temps que le paiement soit confirmé. Si ça reste bloqué après ça, écris-nous via l'onglet Contact avec une capture d'écran ou la référence de ta transaction, pour qu'on vérifie manuellement.",
  },
  {
    keywords: ["inscription", "inscrire", "creer un compte", "créer un compte", "comment s'inscrire", "nouveau compte"],
    answer: "Pour t'inscrire : renseigne ton nom, ton numéro de téléphone, une adresse e-mail et crée ton code PIN. Tu recevras un code de confirmation par e-mail. Ensuite, complète ta vérification KYC pour activer pleinement ton compte.",
  },
  {
    keywords: ["code agence", "code d'agence", "rejoindre une agence", "rejoindre agence", "code chef d'agence"],
    answer: "Le code d'agence te permet de rattacher ton compte au bon chef d'agence. Ton chef d'agence peut te communiquer ce code — tu le renseignes lors de l'inscription ou dans Paramètres si tu veux changer d'agence plus tard.",
  },
  {
    keywords: ["historique", "export", "pdf", "excel", "telecharger", "télécharger"],
    answer: "L'historique détaillé (recherche, filtres, export PDF/Excel) coûte 200 FCFA tous les 2 mois, séparément de l'abonnement. Tu peux le débloquer depuis l'onglet Historique.",
  },
  {
    keywords: ["kyc", "verification", "vérification", "identite", "identité", "piece", "pièce", "documents acceptes", "documents acceptés", "quels documents"],
    answer: "La vérification KYC se fait dans l'onglet 'Vérification KYC' : confirme ton e-mail, puis envoie une pièce d'identité recto/verso (CNI, passeport ou permis) et un selfie. Ton chef d'agence (ou nous, pour un chef d'agence) valide ensuite ton dossier, généralement sous 24h.",
  },
  {
    keywords: ["delai kyc", "délai kyc", "combien de temps kyc", "temps de validation", "attente kyc"],
    answer: "La validation KYC prend généralement jusqu'à 24h une fois tes documents envoyés. Tu peux suivre le statut de ton dossier dans l'onglet 'Vérification KYC'.",
  },
  {
    keywords: ["parrainage", "parrain", "filleul", "invite", "invitation", "lien de parrainage", "code de parrainage"],
    answer: "Le parrainage te rapporte 300 FCFA quand ton filleul active son premier abonnement. Pour retirer tes gains (Wave ou USDT BEP20, frais 20%), ton propre abonnement doit être actif — tout se passe dans l'onglet Parrainage.",
  },
  {
    keywords: ["mot de passe", "oublie", "oublié", "connecter", "connexion", "login", "impossible de me connecter"],
    answer: "Si tu as oublié ton mot de passe, utilise le lien 'Mot de passe oublié' sur l'écran de connexion — un code te sera envoyé par e-mail pour le réinitialiser. Si le souci persiste, écris-nous via l'onglet Contact.",
  },
  {
    keywords: ["pin", "code pin", "changer mon pin", "changer mon code"],
    answer: "Tu peux changer ton code PIN depuis Paramètres → 'Changer le code PIN'. Il te sera demandé pour confirmer les opérations sensibles.",
  },
  {
    keywords: ["depot", "dépôt", "retrait", "transaction", "wave", "orange money", "mtn", "moov", "comment faire une transaction", "nouvelle transaction"],
    answer: "Pour faire une transaction : va dans 'Nouvelle transaction', choisis le réseau (MTN, Orange, Moov, Wave, Djamo, crypto…), entre le numéro et le montant, puis confirme. Un ticket est généré automatiquement.",
  },
  {
    keywords: ["transaction echouee", "transaction échouée", "transaction bloquee", "transaction bloquée", "paiement bloque", "paiement bloqué"],
    answer: "Si une transaction ou un paiement semble bloqué, vérifie d'abord ta connexion internet et l'état de ton solde chez l'opérateur. Si le problème persiste, contacte-nous via l'onglet Contact avec le numéro de ticket concerné.",
  },
  {
    keywords: ["montant minimum", "montant maximum", "plafond", "limite de transaction"],
    answer: "Les montants min/max dépendent du réseau utilisé et de ton propre compte marchand chez l'opérateur (MTN, Orange, Moov, Wave…) — EmpireGuichet n'impose pas de plafond supplémentaire.",
  },
  {
    keywords: ["equipe", "équipe", "agent de mon agence", "mes agents", "ajouter un agent"],
    answer: "En tant que chef d'agence, l'onglet 'Équipe' te montre tous tes agents, leurs transactions et leur statut KYC. Un agent rejoint ton équipe simplement en renseignant ton code d'agence.",
  },
  {
    keywords: ["publicite", "publicité", "annonce", "annonceur", "annonce gratuite", "publier une annonce"],
    answer: "L'onglet 'Publicités' te permet de publier une annonce payante visible par les autres agents. L'espace 'Annonceur' (gratuit) sert à publier de simples annonces entre agents. L'espace 'Annonceurs' public est réservé aux annonces externes.",
  },
  {
    keywords: ["discussion", "chat entre agents", "message aux agents", "chef d'agence me contacter"],
    answer: "La bulle verte en bas de l'écran ouvre la Discussion entre agents : un espace général, plus des messages privés entre chaque chef d'agence et ses agents.",
  },
  {
    keywords: ["photo de profil", "avatar", "changer ma photo"],
    answer: "Tu peux changer ta photo de profil en cliquant sur la petite icône appareil photo à côté de ton avatar, en haut de l'écran.",
  },
  {
    keywords: ["nom cache", "nom caché", "anonyme", "anonymat", "pseudo"],
    answer: "Dans la discussion générale, ton vrai nom est caché par défaut (tu apparais comme \"Agent #XXXX\"). Tu peux choisir de le révéler avec le bouton prévu à cet effet.",
  },
  {
    keywords: ["message prive", "message privé", "dm"],
    answer: "Un chef d'agence et l'un de ses agents peuvent s'écrire en privé (dans les deux sens), invisible aux autres membres de l'agence. Clique sur le nom de la personne dans la discussion pour ouvrir la conversation privée.",
  },
  {
    keywords: ["changer d'agence", "changer agence", "transfert d'agence", "transfert agence", "nouveau chef"],
    answer: "Pour changer de chef d'agence, va dans Paramètres et entre le code de la nouvelle agence. Ton chef actuel recevra une demande et devra la valider avant que le transfert soit effectif.",
  },
  {
    keywords: ["mode nuit", "mode sombre", "theme sombre", "thème sombre", "dark mode", "mode jour", "mode clair"],
    answer: "Tu peux basculer entre le mode jour et le mode nuit avec l'icône soleil/lune en haut de l'écran. Ton choix est mémorisé automatiquement pour tes prochaines visites.",
  },
  {
    keywords: ["notification", "cloche", "alerte"],
    answer: "L'icône en forme de cloche en haut de l'écran affiche tes notifications : nouvelles transactions de ton équipe, messages privés non lus, mises à jour de ton dossier KYC, etc.",
  },
  {
    keywords: ["rejete", "rejeté", "refuse", "refusé", "dossier refuse", "dossier refusé", "kyc refuse", "kyc refusé"],
    answer: "Si ton dossier KYC a été refusé, le motif du refus s'affiche dans l'onglet 'Vérification KYC'. Tu peux corriger l'information concernée et renvoyer tes documents.",
  },
  {
    keywords: ["doublon", "deux comptes", "2 comptes", "meme personne", "même personne", "compte existe deja", "compte existe déjà"],
    answer: "Une seule inscription vérifiée est autorisée par personne : si tes informations correspondent à un compte déjà vérifié, ton dossier est mis en attente pour une vérification manuelle par le propriétaire. Si tu penses qu'il s'agit d'une erreur, contacte le support via l'onglet Contact.",
  },
  {
    keywords: ["ticket", "numero de ticket", "numéro de ticket", "recu", "reçu"],
    answer: "Chaque transaction génère automatiquement un ticket avec un numéro unique, le montant, les frais et le total — tu le retrouves dans le résumé juste après l'opération, et dans ton historique.",
  },
  {
    keywords: ["frais", "commission empireguichet", "empireguichet prend"],
    answer: "EmpireGuichet ne prend aucune commission sur tes transactions : tu continues d'opérer directement avec tes propres puces MTN, Orange, Moov, Wave, Djamo. Les seuls frais sont l'abonnement et, en option, l'accès à l'historique détaillé.",
  },
  {
    keywords: ["supprimer mon compte", "supprimer compte", "fermer mon compte", "desinscrire", "désinscrire"],
    answer: "Pour supprimer ton compte, contacte le support via l'onglet Contact — c'est une opération à faire vérifier manuellement pour éviter toute perte de données par erreur.",
  },
  {
    keywords: ["changer mon numero", "changer mon numéro", "changer email", "changer mon e-mail", "modifier mes coordonnees", "modifier mes coordonnées"],
    answer: "Pour changer ton numéro de téléphone ou ton e-mail, passe par Paramètres. Certaines modifications peuvent nécessiter une nouvelle confirmation par e-mail ou par ton chef d'agence.",
  },
  {
    keywords: ["reseaux", "réseaux", "quels reseaux", "quels réseaux", "networks"],
    answer: "EmpireGuichet prend en charge MTN MoMo, Orange Money, Moov Money, Wave, Djamo, la crypto (USDT), ainsi que les factures CIE, SODECI et les péages.",
  },
  {
    keywords: ["combien de pays", "quel pays", "quels pays", "pays disponible", "disponible dans quel pays", "international", "autre pays", "autres pays"],
    answer: "Pour le moment, EmpireGuichet est disponible en Côte d'Ivoire uniquement — c'est là que les réseaux pris en charge (MTN, Orange, Moov, Wave, CIE, SODECI…) opèrent. Il n'y a pas d'annonce officielle d'extension à d'autres pays pour l'instant.",
  },
  {
    keywords: ["wave disponible", "wave pays", "wave dans quel pays", "wave fonctionne", "wave senegal", "wave sénégal", "wave mali", "wave guinee", "wave guinée", "wave cameroun", "wave togo", "wave benin", "wave bénin", "wave niger", "wave burkina", "wave france"],
    answer: "Wave est disponible en Côte d'Ivoire, au Sénégal, au Mali, en Guinée, au Cameroun, au Togo, au Bénin, au Niger et au Burkina Faso. Il n'est en revanche pas encore disponible en France.",
  },
  {
    keywords: ["email", "e-mail", "confirmer mon email", "confirmer mon e-mail", "code de confirmation", "je n'ai pas recu le code", "je n'ai pas reçu le code"],
    answer: "Un code de confirmation est envoyé par e-mail lors de l'inscription et de certaines actions sensibles. Vérifie aussi tes courriers indésirables (spam) si tu ne le reçois pas.",
  },
  {
    keywords: ["securite", "sécurité", "mes donnees", "mes données", "confidentialite", "confidentialité"],
    answer: "Tes données (identité, documents KYC) sont utilisées uniquement pour vérifier ton compte et prévenir la fraude. Elles ne sont jamais partagées à des fins commerciales.",
  },
  {
    keywords: ["application mobile", "app mobile", "installer l'application", "pwa", "icone sur mon telephone", "icône sur mon téléphone"],
    answer: "EmpireGuichet fonctionne directement dans ton navigateur, et tu peux l'installer comme une application sur ton téléphone (icône sur l'écran d'accueil) via l'option 'Ajouter à l'écran d'accueil' de ton navigateur.",
  },
  {
    keywords: ["parler a quelqu'un", "parler à quelqu'un", "conseiller humain", "vrai humain", "vraie personne", "support humain"],
    answer: "Pour parler directement à un conseiller humain, utilise l'onglet 'Contact' ci-dessus ou écris-nous sur WhatsApp — je fais de mon mieux pour répondre en attendant, mais je suis un simple assistant automatique.",
  },
  {
    keywords: ["merci", "d'accord merci", "ok merci", "thanks"],
    answer: "Avec plaisir 🙂 N'hésite pas si tu as une autre question sur EmpireGuichet.",
  },
  {
    keywords: ["chef d'agence", "devenir chef", "promotion", "manager", "comment devenir chef"],
    answer: "Un agent simple peut demander à devenir chef d'agence depuis Paramètres → 'Devenir chef d'agence'. Ton chef actuel doit valider la demande, puis un abonnement chef d'agence de 3 500 FCFA est à payer pour activer ton accès complet.",
  },
  {
    keywords: ["delai retrait parrainage", "délai retrait parrainage", "quand retirer parrainage", "retrait parrainage bloque", "retrait parrainage bloqué"],
    answer: "Le retrait de tes gains de parrainage nécessite que ton propre abonnement soit actif. Une fois la demande envoyée depuis l'onglet Parrainage, elle est traitée manuellement — un délai court est normal.",
  },
];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

// Normalise le texte (minuscule + suppression des accents) pour un matching robuste
function normalizeText(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Recherche la meilleure réponse dans la base de connaissances
function getSupportBotReply(userText) {
  const normalized = normalizeText(userText);
  const textWords = new Set(normalized.split(/[^a-z0-9]+/).filter(Boolean));

  let best = null;
  let bestScore = 0;

  for (const entry of SUPPORT_BOT_KB) {
    let score = 0;
    for (const k of entry.keywords) {
      const kNorm = normalizeText(k);
      if (normalized.includes(kNorm)) {
        score += 2; // la phrase-clé apparaît telle quelle
        continue;
      }
      const kWords = kNorm.split(/[^a-z0-9]+/).filter(Boolean);
      if (kWords.length > 1 && kWords.every((w) => textWords.has(w))) {
        score += 1; // tous les mots sont présents, dans un autre ordre
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best) return best.answer;

  return "Je n'ai pas de réponse toute prête pour cette question 🤔 Essaie de la reformuler plus simplement (ex : \"abonnement\", \"KYC\", \"parrainage\", \"transaction\"), ou écris-nous via l'onglet Contact pour parler à un conseiller.";
}

// ============================================================================
// COMPOSANT PRINCIPAL CHATBOT
// ============================================================================
export default function ChatBot({ theme = "light" }) {
  // Couleurs selon le thème (cohérent avec EmpireGuichet)
  const COLORS =
    theme === "light"
      ? {
          bg: "#F5F7FA",
          bgSoft: "#E9EEF3",
          surface: "#FFFFFF",
          surfaceLine: "#D6DEE7",
          text: "#101826",
          textMuted: "#5C7089",
          gold: "#0891B2",
          goldSoft: "#0E7490",
          teal: "#1D8F63",
          danger: "#C43D34",
        }
      : {
          bg: "#1B2A41",
          bgSoft: "#22354F",
          surface: "#2A405E",
          surfaceLine: "#3C567A",
          text: "#F1F5F9",
          textMuted: "#A8BBD2",
          gold: "#22D3EE",
          goldSoft: "#67E8F9",
          teal: "#2BBF8A",
          danger: "#E2685E",
        };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour 👋 Je suis l'assistant EmpireGuichet. Comment puis-je t'aider aujourd'hui ?",
      sender: "bot",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Délai réaliste pour simuler l'écriture (comme sur WhatsApp/Facebook)
    const typingDelay = 800 + Math.random() * 600; // entre 800ms et 1400ms

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getSupportBotReply(userMessage.text),
        sender: "bot",
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: COLORS.bg, fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #1B2A41 0%, #2A405E 100%)",
          color: "#fff",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: COLORS.teal }}
          >
            <span style={{ fontSize: 16 }}>🤖</span>
          </div>
          <div>
            <div className="text-sm font-semibold">Assistant EmpireGuichet</div>
            <div className="text-xs opacity-75">En ligne</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] px-3 py-2 rounded-lg text-sm"
              style={{
                background: msg.sender === "user" ? COLORS.gold : COLORS.surface,
                color: msg.sender === "user" ? "#052E36" : COLORS.text,
                border: msg.sender === "user" ? "none" : `1px solid ${COLORS.surfaceLine}`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div className="mb-1 whitespace-pre-wrap">{msg.text}</div>
              <div
                className="text-[10px] text-right"
                style={{
                  opacity: 0.7,
                  color: msg.sender === "user" ? "#052E36" : COLORS.textMuted,
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Indicateur "en train d'écrire" — 3 points animés comme WhatsApp/Facebook */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-lg"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.surfaceLine}`,
              }}
            >
              <div className="flex gap-1 items-center">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.textMuted,
                    animation: "bounce 1s infinite",
                    animationDelay: "0ms",
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.textMuted,
                    animation: "bounce 1s infinite",
                    animationDelay: "150ms",
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.textMuted,
                    animation: "bounce 1s infinite",
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3"
        style={{ borderTop: `1px solid ${COLORS.surfaceLine}`, background: COLORS.surface }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écris ton message..."
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: COLORS.bgSoft,
              border: `1px solid ${COLORS.surfaceLine}`,
              color: COLORS.text,
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: COLORS.gold,
              color: "#052E36",
            }}
          >
            Envoyer
          </button>
        </div>
        <div className="text-[10px] mt-2 text-center" style={{ color: COLORS.textMuted }}>
          Bot automatique — Pour un conseiller humain, utilise l'onglet Contact
        </div>
      </form>
    </div>
  );
}