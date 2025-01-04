// src/components/studio/components/TextArea.tsx
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <textarea
        className="form-input"
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
