export function MySessionTabs({
  activeTab,
  onChange,
}: {
  activeTab: "upcoming" | "history";
  onChange: (value: "upcoming" | "history") => void;
}) {
  return (
    <div className="mt-5 flex border-b border-slate-200">
      {(["upcoming", "history"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`-mb-px mr-6 border-b-2 pb-3 text-sm font-bold capitalize ${
            activeTab === tab ? "border-sky-500 text-sky-500" : "border-transparent text-slate-400"
          }`}
        >
          {tab === "upcoming" ? "Upcoming" : "History"}
        </button>
      ))}
    </div>
  );
}
