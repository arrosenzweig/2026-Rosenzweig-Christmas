import { useEffect, useRef, useState } from 'react';

/**
 * A piece of text on your own list that you can simply click and rewrite.
 * Hovering shows it is editable; Enter saves, Escape puts it back.
 */
export default function Editable({
  value = '',
  onSave,
  placeholder = '',
  label = 'this',
  className = '',
  as: Tag = 'span',
  multiline = false,
  type = 'text',
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    const next = draft.trim();
    if (next !== (value || '').trim()) onSave(next);
  }

  if (editing) {
    const common = {
      ref,
      className: `editable-input ${className}`,
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault();
          commit();
        }
        if (e.key === 'Escape') {
          setDraft(value);
          setEditing(false);
        }
      },
    };
    return multiline ? <textarea rows={3} {...common} /> : <input type={type} {...common} />;
  }

  return (
    <Tag
      className={`editable ${className} ${value ? '' : 'is-empty'}`}
      tabIndex={0}
      role="button"
      title={`Click to edit ${label}`}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setEditing(true);
        }
      }}
    >
      {value || placeholder}
    </Tag>
  );
}
