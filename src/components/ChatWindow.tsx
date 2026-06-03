"use client";

import ReactMarkdown from "react-markdown";
import {
  useState,
  useEffect,
  useRef
} from "react";

type Source = {
  content: string;
  payload: {
    source?: string;
    act?: string;
    article?: string;
    section?: string;
    title?: string;
    heading?: string;
  };
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow() {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [sources, setSources] =
    useState<Source[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ??
            "No answer returned.",
        },
      ]);

      setSources(
        data.sources ?? []
      );
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const uniqueSources = [
    ...new Map(
      sources.map((source) => [
        JSON.stringify(
          source.payload
        ),
        source,
      ])
    ).values(),
  ];

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Sidebar */}

      <div
        className="
        w-[260px]
        border-r
        border-white/10
        p-5
      "
      >
        <div
          className="
          text-2xl
          font-bold
          mb-8
        "
        >
          🏛️ AI Gumasthan
        </div>

        <button
          className="
          w-full
          rounded-xl
          bg-white/10
          p-3
          hover:bg-white/20
          transition
        "
          onClick={() => {
            setMessages([]);
            setSources([]);
          }}
        >
          + New Chat
        </button>
      
      </div>
  
      {/* Chat */}

      <div
        className="
        flex-1
        flex
        flex-col
      "
      >
        <div
          className="
          flex-1
          overflow-y-auto
          p-8
          space-y-6
        "
        >
          {messages.length === 0 && (
            <div
              className="
              h-full
              flex
              items-center
              justify-center
              text-center
              opacity-60
            "
            >
              <div>
                <div
                  className="
                  text-4xl
                  mb-3
                "
                >
                  🏛️
                </div>

                <div
                  className="
                  text-2xl
                  font-semibold
                  mb-2
                "
                >
                  AI Gumasthan
                </div>

                <div>
                  Ask questions
                  about Indian law
                </div>
                <div className="text-sm opacity-50">
  Created by Sreekumar KS
</div>
              </div>
            </div>
          )}

          {messages.map(
            (
              message,
              index
            ) => (
              <div
                key={index}
                className={`
                max-w-[85%]
                rounded-2xl
                p-4

                ${
                  message.role ===
                  "user"
                    ? "ml-auto bg-blue-600"
                    : "bg-white/10"
                }
              `}
              >
                <ReactMarkdown
                  components={{
                    h1: ({
                      children,
                    }) => (
                      <h1
                        className="
                        text-2xl
                        font-bold
                        mb-4
                      "
                      >
                        {
                          children
                        }
                      </h1>
                    ),

                    h2: ({
                      children,
                    }) => (
                      <h2
                        className="
                        text-xl
                        font-semibold
                        mb-3
                        mt-4
                      "
                      >
                        {
                          children
                        }
                      </h2>
                    ),

                    p: ({
                      children,
                    }) => (
                      <p
                        className="
                        mb-3
                        leading-7
                      "
                      >
                        {
                          children
                        }
                      </p>
                    ),

                    ul: ({
                      children,
                    }) => (
                      <ul
                        className="
                        list-disc
                        ml-6
                        space-y-2
                      "
                      >
                        {
                          children
                        }
                      </ul>
                    ),

                    ol: ({
                      children,
                    }) => (
                      <ol
                        className="
                        list-decimal
                        ml-6
                        space-y-2
                      "
                      >
                        {
                          children
                        }
                      </ol>
                    ),

                    strong: ({
                      children,
                    }) => (
                      <strong
                        className="
                        font-bold
                      "
                      >
                        {
                          children
                        }
                      </strong>
                    ),

                    code: ({
                      children,
                    }) => (
                      <code
                        className="
                        bg-white/10
                        px-1
                        rounded
                      "
                      >
                        {
                          children
                        }
                      </code>
                    ),

                    blockquote:
                      ({
                        children,
                      }) => (
                        <blockquote
                          className="
                          border-l-4
                          border-white/20
                          pl-4
                          italic
                          my-3
                        "
                        >
                          {
                            children
                          }
                        </blockquote>
                      ),
                  }}
                >
                  {
                    message.content
                  }
                </ReactMarkdown>
              </div>
            )
          )}

          {loading && (
            <div
              className="
              bg-white/10
              rounded-2xl
              p-4
              w-fit
            "
            >
              Thinking...
            </div>
          )}

          <div
            ref={bottomRef}
          />
        </div>

        {/* Input */}

        <div
          className="
          border-t
          border-white/10
          p-6
        "
        >
          <div
            className="
            flex
            gap-4
          "
          >
            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                    "Enter" &&
                  !loading
                ) {
                  sendMessage();
                }
              }}
              placeholder="Ask about Indian law..."
              className="
              flex-1
              bg-white/5
              border
              border-white/10
              rounded-xl
              p-4
              outline-none
            "
            />

            <button
              onClick={
                sendMessage
              }
              disabled={
                loading
              }
              className="
              px-6
              rounded-xl
              bg-white
              text-black
              font-medium
              disabled:opacity-50
            "
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Sources */}

      <div
        className="
        w-[320px]
        border-l
        border-white/10
        p-6
        overflow-y-auto
      "
      >
        <div
          className="
          font-semibold
          mb-5
        "
        >
          Sources
        </div>

        <div
          className="
          space-y-3
        "
        >
          {uniqueSources.map(
            (
              source,
              index
            ) => (
              <div
                key={index}
                className="
                rounded-xl
                bg-white/5
                p-4
              "
              >
                <div
                  className="
                  font-medium
                  mb-1
                "
                >
                  {source
                    .payload
                    .title ||
                    source
                      .payload
                      .heading ||
                    "Legal Source"}
                </div>

                <div
                  className="
                  text-xs
                  opacity-60
                  mb-2
                "
                >
                  {source
                    .payload
                    .article &&
                    `Article ${source.payload.article}`}

                  {source
                    .payload
                    .section &&
                    `Section ${source.payload.section}`}
                </div>

                <div
                  className="
                  text-xs
                  opacity-50
                "
                >
                  {source
                    .payload
                    .act ||
                    source
                      .payload
                      .source}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}