/** Someone's profile picture --- their upload if they have one, their emoji if not. */
export default function Avatar({ profile, image, size = 96, className = '' }) {
  return (
    <span
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.46,
        '--accent': profile.theme.accent,
        '--accent-2': profile.theme.accent2,
      }}
    >
      {image ? <img src={image} alt={`${profile.name}'s profile picture`} /> : <span aria-hidden="true">{profile.emoji}</span>}
    </span>
  );
}
