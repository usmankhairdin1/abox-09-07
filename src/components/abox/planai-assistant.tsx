import { useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { AboxMark } from "@/components/abox/logo";
import { Button } from "@/components/ui/button";

type ChatMessage = { id: string; role: "assistant" | "user"; text: string };

export function PlanAiAssistant({ context }: { context: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `I’m PlanAI. I can help you understand ${context}, summarize work, and identify the next governed action.`,
    },
  ]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          className="flex h-[min(620px,calc(100dvh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-hairline bg-popover shadow-elevated"
          aria-label="PlanAI assistant"
        >
          <header className="flex items-center gap-3 border-b border-hairline px-5 py-4">
            <AboxMark size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">PlanAI</p>
              <p className="truncate text-xs text-muted-foreground">Context-aware workspace assistant</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Close PlanAI">
              <X />
            </Button>
          </header>

          <Conversation className="min-h-0">
            <ConversationContent className="gap-5 px-5 py-6">
              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-hairline p-3">
            <PromptInput
              className="rounded-2xl"
              onSubmit={(message) => {
                const text = message.text.trim();
                if (!text) return;
                setMessages((current) => [
                  ...current,
                  { id: `user-${Date.now()}`, role: "user", text },
                  {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    text: "I’ve captured that request in this workspace context. Review the governed records on this page before taking the next action.",
                  },
                ]);
              }}
            >
              <PromptInputTextarea className="min-h-20" placeholder={`Ask about ${context}…`} />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      ) : null}

      <Button
        className="h-12 rounded-full px-4 shadow-elevated"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close PlanAI assistant" : "Open PlanAI assistant"}
        aria-expanded={open}
      >
        {open ? <X /> : <Bot />}
        <span>{open ? "Close" : "Ask PlanAI"}</span>
      </Button>
    </div>
  );
}