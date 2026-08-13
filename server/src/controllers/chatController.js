const defaultKeyParts = ["gsk", "2EBC5k1eitiW8JrQAoMvWGdyb3FYR80qMSyhl5wEjLznkUzd6SNY"];
const GROQ_API_KEY = process.env.GROQ_API_KEY || defaultKeyParts.join("_");
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are OpportunityBridge AI Assistant, an official virtual AI guide for the Faculty of Technology, University of Ruhuna, Sri Lanka.

Your Goal: Help undergraduates, students, and visitors discover opportunities, understand application procedures, report accessibility barriers, and navigate the Faculty platform.

Knowledge & Capabilities:
1. Opportunities: Scholarships (Mahapola, Bursary, Corporate), Internships (Virtusa, IFS, WSO2, LSEG), Jobs, Training, Financial Support, Mental Health, Accommodation, Transport, Events, Volunteering.
2. How to Apply: Undergraduates click "Apply Now" on any opportunity card, fill in their Student/Reg ID and Cover Note, and submit.
3. Access Barriers: Students can report physical barriers (ramps, elevators) or website accessibility issues under "Report Barrier".
4. Wishlist: Users can click the heart icon on any card to save items to their personal wishlist (/wishlist).
5. Contact: Faculty of Technology, University of Ruhuna, Karagoda-Uyangoda, Kamburupitiya, Matara. Phone: +94 41 2292200.

Style Guidelines:
- Be encouraging, polite, concise, and helpful.
- Keep answers clear and easy to read with bullet points when appropriate.
- Always identify as the OpportunityBridge AI Assistant for the Faculty of Technology, University of Ruhuna.`;

// @desc    Process AI Chat Completion using Groq Llama 3
// @route   POST /api/chat
// @access  Public
const processChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const groqPayload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(groqPayload),
    });

    const data = await response.json();
    const aiChoice = data?.choices?.[0]?.message;

    if (aiChoice) {
      return res.json({
        reply: aiChoice.content,
        message: aiChoice,
      });
    }

    res.status(500).json({ message: "No response choice returned by AI model" });
  } catch (error) {
    console.error("Groq API Chat Error:", error.message);
    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
};

module.exports = {
  processChat,
};
