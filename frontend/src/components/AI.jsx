import { useState } from "react";
import axios from "axios";
import { Sparkles, SendHorizonal, Bot } from "lucide-react";

function AI() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!prompt.trim()) return;

    try {

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/ai`,
        {
          prompt,
        }
      );

      setReply(res.data.reply);

    } catch (err) {

      console.log(err);

      setReply("Something went wrong.");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-black via-gray-900 to-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-white/5">

          <div className="bg-white text-black p-2 rounded-2xl">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              EduNEXA AI
            </h1>

            <p className="text-gray-300 text-sm">
              Your smart academic assistant
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-5">

          {/* Input */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">

            <textarea
              rows="6"
              placeholder="Ask anything about coding, DBMS, AI, assignments..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent outline-none resize-none text-white placeholder:text-gray-400"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleAsk}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 disabled:opacity-70"
          >

            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </>
            ) : (
              <>
                <SendHorizonal size={18} />
                Ask AI
              </>
            )}

          </button>

          {/* Reply */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-h-[220px]">

            <div className="flex items-center gap-2 mb-4 text-gray-300">

              <Bot size={20} />

              <span className="font-medium">
                AI Response
              </span>
            </div>

            <div className="whitespace-pre-wrap leading-7 text-gray-100">

              {reply || (
                <p className="text-gray-400">
                  Your AI response will appear here...
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AI;