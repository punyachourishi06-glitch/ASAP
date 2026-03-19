import { useState, useCallback, useEffect } from "react";
import { milestones } from "@/data/milestones";
import { KiroLoopSidebar } from "@/components/KiroLoopSidebar";
import { StrategicWorkspace } from "@/components/StrategicWorkspace";
import { ThinkFixDrawer } from "@/components/ThinkFixDrawer";
import { BoilerplateModal } from "@/components/BoilerplateModal";
import { StrategicInitBox } from "@/components/StrategicInitBox";
import { DeepDiveDrawer } from "@/components/DeepDiveDrawer";
import { Zap } from "lucide-react";
import { toast } from "sonner";

function generateTitlesForInput(input: string): string[] {
  const word = input.split(" ").slice(0, 3).join(" ");
  return [
    `${word} — Environment & Guardrails`,
    `${word} — Auth & Identity Layer`,
    `${word} — Data & Caching Strategy`,
    `${word} — Real-time Event Mesh`,
    `${word} — Deploy & Observability`,
  ];
}

const Index = () => {
  const [currentMilestone, setCurrentMilestone] = useState(1);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [hinglish, setHinglish] = useState(false);
  const [learnMode, setLearnMode] = useState(false);
  const [boilerplateOpen, setBoilerplateOpen] = useState(false);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [titleOverrides, setTitleOverrides] = useState<Record<number, string>>({});

  const milestone = milestones.find((m) => m.id === currentMilestone)!;

  useEffect(() => {
    const allChecked = milestone.checklist.every((item) => checkedItems[item.id]);
    if (allChecked && !completedMilestones.includes(milestone.id)) {
      setCompletedMilestones((prev) => [...prev, milestone.id]);
      toast.success("✅ Milestone Verified by Auditor", {
        duration: 3000,
        className: "glass-card border-cyber-lime/30",
      });
      const next = milestones.find((m) => m.id === milestone.id + 1);
      if (next) {
        setTimeout(() => setCurrentMilestone(next.id), 800);
      }
    }
  }, [checkedItems, milestone, completedMilestones]);

  const handleCheck = useCallback((id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleAutoComplete = useCallback(() => {
    const updates: Record<string, boolean> = {};
    milestone.checklist.forEach((item) => { updates[item.id] = true; });
    setCheckedItems((prev) => ({ ...prev, ...updates }));
  }, [milestone]);

  const handleInitialize = useCallback((input: string) => {
    const titles = generateTitlesForInput(input);
    const overrides: Record<number, string> = {};
    milestones.forEach((m, i) => { overrides[m.id] = titles[i] || m.title; });
    setTitleOverrides(overrides);
    setCompletedMilestones([]);
    setCheckedItems({});
    setCurrentMilestone(1);
    toast.success(`🚀 Agentic loop initialized for "${input}"`, { duration: 3000 });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-white/[0.06] flex items-center px-6 gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-neon-blue" />
        </div>
        <span className="text-sm font-bold tracking-wide text-foreground">ASAP</span>
        <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">Autonomous Strategic Achievement Platform</span>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${learnMode ? 'bg-neon-amber animate-pulse' : 'bg-neon-blue animate-pulse'}`} />
          <span className="text-xs text-muted-foreground">
            {learnMode ? "Learning Mode" : "Architect Mode"}
          </span>
        </div>
      </header>

      <div className="flex-1 flex gap-6 p-6 overflow-auto">
        <KiroLoopSidebar
          currentMilestone={currentMilestone}
          completedMilestones={completedMilestones}
          onSelect={setCurrentMilestone}
          learnMode={learnMode}
          titleOverrides={titleOverrides}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <StrategicInitBox onInitialize={handleInitialize} />
          <StrategicWorkspace
            milestone={milestone}
            checkedItems={checkedItems}
            onCheck={handleCheck}
            hinglish={hinglish}
            onToggleHinglish={() => setHinglish((p) => !p)}
            learnMode={learnMode}
            onToggleLearnMode={() => setLearnMode((p) => !p)}
            onOpenBoilerplate={() => setBoilerplateOpen(true)}
            onAutoComplete={handleAutoComplete}
            onOpenDeepDive={() => setDeepDiveOpen(true)}
            titleOverride={titleOverrides[currentMilestone]}
          />
        </div>
      </div>

      <footer className="h-10 border-t border-white/[0.06] flex items-center justify-center px-6 flex-shrink-0">
        <span className="text-xs text-muted-foreground tracking-wide">
          Powered by <span className="text-neon-blue font-medium">Murf AI Falcon Model</span> | Sub-130ms Latency Enabled
        </span>
      </footer>

      <ThinkFixDrawer />
      <BoilerplateModal
        open={boilerplateOpen}
        onClose={() => setBoilerplateOpen(false)}
        code={milestone.boilerplate}
        title={`Boilerplate — ${titleOverrides[currentMilestone] || milestone.title}`}
      />
      <DeepDiveDrawer
        open={deepDiveOpen}
        onClose={() => setDeepDiveOpen(false)}
        mentalModel={milestone.mentalModel}
        milestoneTitle={titleOverrides[currentMilestone] || milestone.title}
        hinglish={hinglish}
        learnMode={learnMode}
      />
    </div>
  );
};

export default Index;
