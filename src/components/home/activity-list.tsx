import { ChevronRight, ClipboardList, Clock } from "lucide-react";

export function ActivityList() {
  const activities = [
    { title: "Próximos agendamentos", icon: Clock },
    { title: "Histórico recente", icon: ClipboardList },
  ];

  return (
    <div className="px-4 mt-6 space-y-3 mb-10">
      <h3 className="font-bold text-white">Outras atividades</h3>
      {activities.map((a) => (
        <div key={a.title} className="glass-panel p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl text-primary">
              <a.icon className="size-5" />
            </div>
            <span className="font-medium text-sm text-gray-200">{a.title}</span>
          </div>
          <ChevronRight className="size-5 text-gray-400" />
        </div>
      ))}
    </div>
  );
}
