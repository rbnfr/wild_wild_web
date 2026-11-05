// Renders copy where **text** marks emphasis, so content stays plain strings.
export function RichText({ text }: { text: string }) {
  return text
    .split("**")
    .map((part, index) =>
      index % 2 ? <strong key={index}>{part}</strong> : part,
    );
}
