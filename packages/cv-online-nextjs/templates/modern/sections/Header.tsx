export default function Header({ profile, title }: any) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {profile?.avatar && (
        <img
          src={profile.avatar}
          alt="avatar"
          width={80}
          height={80}
          style={{ borderRadius: 8 }}
        />
      )}
      <div>
        <h1 style={{ margin: 0 }}>{profile?.full_name || "Tên"}</h1>
        <p style={{ margin: 0 }}>{title}</p>
      </div>
    </div>
  );
}
