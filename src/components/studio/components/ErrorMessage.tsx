// src/components/studio/components/ErrorMessage.tsx
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6">
      {message}
    </div>
  )
}
