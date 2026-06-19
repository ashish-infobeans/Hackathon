import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { normalizeDisplayName } from '../lib/identity'
import './NamePromptModal.css'

type NamePromptModalProps = {
  onSubmit: (displayName: string) => void
}

export function NamePromptModal({ onSubmit }: NamePromptModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedName = normalizeDisplayName(name)

    if (!normalizedName) {
      setError('Enter a display name up to 50 characters.')
      return
    }

    setError(null)
    onSubmit(normalizedName)
  }

  return (
    <div className="name-prompt__backdrop" role="presentation">
      <div
        className="name-prompt__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h2 id={titleId}>Welcome</h2>
        <p id={descriptionId}>
          Enter a display name to join hackathon projects. Names are not unique and stay on this
          browser only.
        </p>

        <form className="name-prompt__form" onSubmit={handleSubmit}>
          <label className="name-prompt__field" htmlFor="display-name">
            Display name
          </label>
          <input
            ref={inputRef}
            id="display-name"
            name="displayName"
            type="text"
            autoComplete="nickname"
            maxLength={50}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) {
                setError(null)
              }
            }}
          />
          {error ? (
            <p className="name-prompt__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="name-prompt__submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
