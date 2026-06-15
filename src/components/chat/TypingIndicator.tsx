export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 shadow-soft">
      <span className="sr-only">Assistant is typing</span>
      <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
      <span className="size-2 animate-bounce rounded-full bg-primary/80 [animation-delay:-0.15s]" />
      <span className="size-2 animate-bounce rounded-full bg-primary/60" />
    </div>
  );
}
