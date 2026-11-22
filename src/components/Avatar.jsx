/**
 * Someone's profile picture --- their upload if they have one, their emoji if
 * not. The size comes in as a CSS variable so a phone-sized screen can shrink
 * it from the stylesheet.
 */
export default function Avatar({ profile, image, emoji, size = 96, className = '' }) {
  return (
    <span
      className={`avatar ${className}`}
      style={{
        '--avatar': `${size}px`,
        '--avatar-font': `${Math.round(size * 0.46)}px`,
        '--accent': profile.theme.accent,
        '--accent-2': profile.theme.accent2,
      }}
    >
      {image ? (
        <img src={image} alt={`${profile.name}'s profile picture`} />
      ) : (
        <span aria-hidden="true">{emoji || profile.emoji}</span>
      )}
    </span>
  );
}
