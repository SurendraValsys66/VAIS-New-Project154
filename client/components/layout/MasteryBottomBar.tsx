import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  CheckCircle,
  Circle,
  Coins,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/utils";
import {
  calculateMasteryPercentage,
  getMastery,
  MasterySteps,
  MASTERY_EVENT,
  emitMasteryUpdate,
} from "@/lib/masteryStorage";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfettiCanvas from "@/components/onboarding/ConfettiCanvas";
import { toast } from "@/components/ui/use-toast";
import { useMasteryAnimation } from "@/contexts/MasteryAnimationContext";

const MASTERY_DISMISS_KEY = "valasys-mastery-dismissed";
const MASTERY_MINIMIZE_KEY = "valasys-mastery-minimized";

// Map mastery step keys to human-readable labels for toasts
const STEP_LABELS: Record<string, string> = {
  onboardingCompleted: "Completed onboarding questions",
  vaisResultsGenerated: "Generated VAIS Results",
  accountsDownloaded: "Downloaded Accounts",
  prospectSearchGenerated: "Generated Prospect Search",
  prospectDetailsDownloaded: "Downloaded Prospect Details",
};

type MasteryStepDefinition = {
  key: string;
  label: string;
  completed: boolean;
  hint: React.ReactNode;
  to: string;
  cta?: string;
  type?: "reward";
};

export default function MasteryBottomBar() {
  const { startAnimation, endAnimation, badgeRef, getBadgePosition } =
    useMasteryAnimation();
  const [state, setState] = useState<MasterySteps>({});
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const isDismissed = localStorage.getItem(MASTERY_DISMISS_KEY) === "1";
      const isFirstLoad = !localStorage.getItem("vais.mastery");
      return isDismissed && !isFirstLoad;
    } catch (error) {
      return false;
    }
  });
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MASTERY_MINIMIZE_KEY) === "1";
    } catch (error) {
      return false;
    }
  });
  const [expanded, setExpanded] = useState(false);
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [showDismissDialog, setShowDismissDialog] = useState(false);
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const toggleHint = (key: string) =>
    setOpenHints((s) => {
      const isOpen = !!s[key];
      if (isOpen) return {};
      return { [key]: true };
    });
  const prevRef = useRef<MasterySteps>({});
  const initializedRef = useRef(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStepConfetti, setShowStepConfetti] = useState(false);
  const [dialogBlast, setDialogBlast] = useState(0);

  useEffect(() => {
    setState(getMastery());
    const onUpdate = (e: Event) =>
      setState((e as CustomEvent).detail as MasterySteps);
    window.addEventListener(MASTERY_EVENT, onUpdate as EventListener);
    const id = setInterval(() => setState(getMastery()), 3000);
    return () => {
      window.removeEventListener(MASTERY_EVENT, onUpdate as EventListener);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const prev = prevRef.current;

    // Skip notifications on first initialization
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevRef.current = state;
      return;
    }

    const prevPct = calculateMasteryPercentage(prev);
    const currPct = calculateMasteryPercentage(state);

    // Final completion celebration (full-screen)
    if (prevPct < 100 && currPct >= 100) {
      let alreadyShown = false;
      try {
        alreadyShown = localStorage.getItem("valasys-mastery-complete") === "1";
      } catch {}
      if (!alreadyShown) {
        try {
          localStorage.setItem("valasys-mastery-complete", "1");
        } catch {}
        setShowConfetti(true);
        setShowFinalDialog(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    // Detect newly completed steps and celebrate within the bottom bar
    const stepKeys: (keyof MasterySteps)[] = [
      "onboardingCompleted",
      "vaisResultsGenerated",
      "accountsDownloaded",
      "prospectSearchGenerated",
      "prospectDetailsDownloaded",
    ];
    const newlyCompleted = stepKeys.filter(
      (k) => !(prev?.[k] as boolean) && !!(state?.[k] as boolean),
    );

    if (newlyCompleted.length > 0) {
      setShowStepConfetti(true);
      setTimeout(() => setShowStepConfetti(false), 2000);

      newlyCompleted.forEach((k) => {
        const label = STEP_LABELS[k as string] ?? "Step completed";
        toast({
          title: "Step completed",
          description: `${label}. Your mastery is now ${currPct}%`,
        });
      });
    }

    prevRef.current = state;
  }, [state]);

  const doneAll = useMemo(
    () =>
      !!(
        state.onboardingCompleted &&
        state.vaisResultsGenerated &&
        state.accountsDownloaded &&
        state.prospectSearchGenerated &&
        state.prospectDetailsDownloaded
      ),
    [state],
  );

  const steps = useMemo<MasteryStepDefinition[]>(() => {
    const list: MasteryStepDefinition[] = [
      {
        key: "signUp",
        label: "Sign up to VAIS",
        completed: true,
        hint: null,
        to: "/free-trial",
        cta: "Invite a teammate",
      },
      {
        key: "onboardingCompleted",
        label: "Complete the onboarding questions",
        completed: !!state.onboardingCompleted,
        hint: (
          <>
            Answer a few quick questions about your goals so we can tailor VAIS
            to your workflow.{" "}
            <Link to="/onboarding/role" className="text-valasys-blue underline">
              Resume onboarding
            </Link>
            .
          </>
        ),
        to: "/onboarding/role",
        cta: "Resume onboarding",
      },
      {
        key: "vaisResultsGenerated",
        label: "Generate your VAIS Results",
        completed: !!state.vaisResultsGenerated,
        hint: (
          <>
            <Link to="/build-vais" className="text-valasys-blue underline">
              Build your VAIS
            </Link>{" "}
            model to unlock prioritized account and lead insights in just a
            couple of clicks.
          </>
        ),
        to: "/build-vais",
        cta: "Generate VAIS Results",
      },
      {
        key: "accountsDownloaded",
        label: "Download the Accounts from the VAIS Results page",
        completed: !!state.accountsDownloaded,
        hint: (
          <>
            Head to the VAIS Results page, apply any filters you need, then
            export the ready-to-use account list.
          </>
        ),
        to: "/vais-results",
        cta: "Open VAIS Results",
      },
      {
        key: "prospectSearchGenerated",
        label: "Generate the Prospect Search",
        completed: !!state.prospectSearchGenerated,
        hint: (
          <>
            Use{" "}
            <Link to="/find-prospect" className="text-valasys-blue underline">
              Find Prospect
            </Link>{" "}
            to build a targeted search—start with a few filters, generate the
            list, and refine as you go.
          </>
        ),
        to: "/find-prospect",
        cta: "Start a prospect search",
      },
      {
        key: "prospectDetailsDownloaded",
        label: "Download the Prospect Details",
        completed: !!state.prospectDetailsDownloaded,
        hint: (
          <>
            Open your Prospect Results, preview the contacts, and download the
            detailed CSV to share with your team.
          </>
        ),
        to: "/prospect-results",
        cta: "View prospect results",
      },
    ];

    return list;
  }, [doneAll, state]);

  const next = useMemo(() => {
    if (!state.onboardingCompleted)
      return { label: "Complete onboarding", to: "/onboarding/role" };
    if (!state.vaisResultsGenerated)
      return { label: "Generate VAIS Results", to: "/build-vais" };
    if (!state.accountsDownloaded)
      return { label: "Download Accounts", to: "/vais-results" };
    if (!state.prospectSearchGenerated)
      return { label: "Generate Prospect Search", to: "/find-prospect" };
    if (!state.prospectDetailsDownloaded)
      return { label: "Download Prospect Details", to: "/prospect-results" };
    return null;
  }, [state]);

  const percent = calculateMasteryPercentage(state);
  const level = useMemo(
    () => Math.max(1, Math.min(5, Math.ceil(percent / 20))),
    [percent],
  );

  const handleConfirmRemove = useCallback(() => {
    try {
      localStorage.setItem(MASTERY_DISMISS_KEY, "1");
    } catch (error) {}
    setHidden(true);
    setShowDismissDialog(false);
    setExpanded(false);
  }, []);

  const manPos = Math.max(0, Math.min(100, percent));
  const handleOpenGuide = useCallback(() => setExpanded(true), []);
  const handleCloseGuide = useCallback(() => setExpanded(false), []);
  const handleGuideKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setExpanded(true);
      }
    },
    [],
  );

  const handleMinimize = useCallback(() => {
    setIsAnimatingMinimize(true);
    startAnimation();
    setExpanded(false);

    // After animation completes, finalize the minimize
    const animationDuration = 600; // Match the CSS animation duration
    setTimeout(() => {
      try {
        localStorage.setItem(MASTERY_MINIMIZE_KEY, "1");
      } catch (error) {}
      setMinimized(true);
      setIsAnimatingMinimize(false);
      endAnimation();
      window.dispatchEvent(
        new CustomEvent("app:mastery-minimized", {
          detail: { percent },
        }) as Event,
      );
      // Emit mastery update to notify badge component immediately
      emitMasteryUpdate(state);
    }, animationDuration);
  }, [percent, state, startAnimation, endAnimation, getBadgePosition]);

  if (hidden && !showDismissDialog && !showFinalDialog) {
    return null;
  }

  useEffect(() => {
    try {
      const openOnce =
        localStorage.getItem("valasys-open-mastery-once") === "1";
      if (openOnce) {
        setHidden(false);
        setExpanded(true);
        localStorage.removeItem("valasys-open-mastery-once");
        try {
          localStorage.removeItem(MASTERY_DISMISS_KEY);
        } catch {}
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleMasteryRestored = () => {
      try {
        const isMinimized =
          localStorage.getItem("valasys-mastery-minimized") === "1";
        if (!isMinimized) {
          setMinimized(false);
          setHidden(false);
        }
      } catch {}
    };

    window.addEventListener(
      "app:mastery-restored",
      handleMasteryRestored as EventListener,
    );
    return () => {
      window.removeEventListener(
        "app:mastery-restored",
        handleMasteryRestored as EventListener,
      );
    };
  }, []);

  const shouldShowPanel = !hidden && !doneAll && !minimized;
  const [animationTarget, setAnimationTarget] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (showFinalDialog && showConfetti) {
      setDialogBlast(1);
      const t = setTimeout(() => setDialogBlast(2), 650);
      return () => clearTimeout(t);
    }
    setDialogBlast(0);
  }, [showFinalDialog, showConfetti]);

  // Calculate target position when minimizing
  useEffect(() => {
    if (isAnimatingMinimize && bottomBarRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      const frameId = requestAnimationFrame(() => {
        const badgePos = getBadgePosition();
        const bottomBarRect = bottomBarRef.current?.getBoundingClientRect();

        if (badgePos && bottomBarRect) {
          // Calculate the delta between bottom bar center and badge center
          const deltaX =
            badgePos.x - (bottomBarRect.left + bottomBarRect.width / 2);
          const deltaY =
            badgePos.y - (bottomBarRect.top + bottomBarRect.height / 2);

          setAnimationTarget({ x: deltaX, y: deltaY });
        }
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [isAnimatingMinimize, getBadgePosition]);

  return (
    <>
      {/* Confetti celebration moved inside dialog to blast from behind modal (two times) */}

      {shouldShowPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div
            className="mx-auto w-full pointer-events-auto px-4 sm:px-6 pb-4"
            onMouseLeave={handleCloseGuide}
            style={{
              maxWidth: "min(92vw, 520px)",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Slide-up panel */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mb-2 rounded-xl border border-gray-200 shadow-xl bg-white overflow-hidden"
                >
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-[15px] font-semibold text-[#333333]">
                          VAIS Mastery Steps Guide
                        </h2>
                        <p className="text-xs text-[#666] mt-0.5">
                          Complete these steps to unlock your full VAIS
                          potential 🚀
                        </p>
                      </div>
                      <button
                        aria-label="Close"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={handleCloseGuide}
                        title="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 h-px bg-gray-200" />
                  </div>

                  <div className="px-5 pb-4 max-h-[360px] overflow-y-auto">
                    <ul className="space-y-3">
                      {steps.map((s) => {
                        const isOpen = !!openHints[s.key];
                        const isReward = s.type === "reward";

                        return (
                          <li key={s.key} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isReward ? (
                                <Coins className="w-5 h-5 text-amber-500" />
                              ) : s.completed ? (
                                <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 text-sm text-[#333333] leading-5">
                              <button
                                type="button"
                                onClick={() => toggleHint(s.key)}
                                className="relative flex items-center w-full gap-2 font-medium pr-6 text-left"
                                aria-expanded={isOpen}
                              >
                                {isReward ? (
                                  s.completed ? (
                                    <Badge className="inline-flex items-center gap-1.5 bg-valasys-green text-white border-transparent px-2.5 py-1 text-[11px] font-semibold">
                                      <Coins className="w-3.5 h-3.5" />
                                      {s.label}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border-gray-200 px-2.5 py-1 text-[11px] font-semibold"
                                      aria-disabled="true"
                                    >
                                      <Coins className="w-3.5 h-3.5" />
                                      {s.label}
                                    </Badge>
                                  )
                                ) : (
                                  <span>{s.label}</span>
                                )}
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-[#666] absolute right-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#666] absolute right-0" />
                                )}
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeOut",
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-2 space-y-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-[#555]">
                                      <p>{s.hint}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next up suggestion (shown when collapsed) */}
            {!expanded && next && (
              <div className="mb-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white rounded-xl shadow-md p-1">
                        <img
                          src="https://cdn.builder.io/o/assets%2F1d0d3cbc213245beba3786aa1a6f12a3%2F515d18c2065f4103840ed7e794f0f02f?alt=media&token=b6ff5c54-de26-42ea-960d-cf00e42191cf&apiKey=1d0d3cbc213245beba3786aa1a6f12a3"
                          alt="Mastery progress"
                          className="h-6 w-6 rounded"
                          loading="lazy"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[260px] text-center"
                    >
                      <div>Complete all steps to master VAIS.</div>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-[13px]">
                    <span className="font-semibold text-[#FF7A00]">
                      Next up:{" "}
                    </span>
                    <span className="text-[#333]">{next.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs font-semibold text-[#FF7A00] hover:underline"
                    onClick={handleOpenGuide}
                    title="Open guide"
                  >
                    Details
                  </button>
                  <Link
                    to={next.to}
                    className="inline-flex items-center rounded-md bg-valasys-orange hover:bg-valasys-orange-light px-2 py-1 text-xs font-semibold text-white"
                    title="Go"
                  >
                    Go
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom orange bar */}
            <motion.div
              ref={bottomBarRef}
              className="relative flex flex-col gap-1 rounded-xl shadow-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white cursor-pointer hover:opacity-95 transition-opacity"
              role="button"
              tabIndex={0}
              aria-expanded={expanded}
              onClick={!isAnimatingMinimize ? handleOpenGuide : undefined}
              onMouseEnter={!isAnimatingMinimize ? handleOpenGuide : undefined}
              onKeyDown={handleGuideKeyDown}
              animate={
                isAnimatingMinimize && animationTarget
                  ? {
                      x: animationTarget.x,
                      y: animationTarget.y,
                      scale: 0.2,
                      opacity: 0,
                    }
                  : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              {showStepConfetti && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <ConfettiCanvas duration={1400} mode="blast" />
                </div>
              )}

              {/* Top row: progress, chevron, collapse, close */}
              <div className="flex items-center gap-3">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Progress
                        value={percent}
                        className="h-[14px] bg-[#F1F1F1]"
                        indicatorClassName="bg-[#eab308]"
                      />
                      <img
                        src="https://cdn.builder.io/o/assets%2F1d0d3cbc213245beba3786aa1a6f12a3%2F56aede21efb849a7aa049e8e2f87be99?alt=media&token=e4598e27-8e81-4e91-8d2c-e890a2c118e8&apiKey=1d0d3cbc213245beba3786aa1a6f12a3"
                        alt="Walking progress"
                        className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 sm:h-7 sm:w-7 drop-shadow"
                        style={{ left: `${manPos}%` }}
                      />
                    </div>
                  </div>
                </div>

                <img
                  src="https://cdn.builder.io/o/assets%2F1d0d3cbc213245beba3786aa1a6f12a3%2F515d18c2065f4103840ed7e794f0f02f?alt=media&token=b6ff5c54-de26-42ea-960d-cf00e42191cf&apiKey=1d0d3cbc213245beba3786aa1a6f12a3"
                  alt="Gift"
                  className="h-5 w-5 rounded-full bg-white p-0.5 shadow-sm"
                  loading="lazy"
                />
                <button
                  aria-label="Minimize"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMinimize();
                  }}
                  className="ml-1 rounded-md hover:opacity-90"
                  title="Minimize"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  aria-label="Hide for now"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCloseGuide();
                    setShowDismissDialog(true);
                  }}
                  className="ml-1 rounded-md hover:opacity-90"
                  title="Hide for now"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom text */}
              {!isAnimatingMinimize && (
                <div className="text-center text-[12px] font-semibold">
                  Your VAIS mastery: {percent}%
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      <Dialog open={showDismissDialog} onOpenChange={setShowDismissDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hide mastery progress?</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this? Your progress will be lost
              permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDismissDialog(false)}
            >
              Close
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final completion dialog */}
      <Dialog open={showFinalDialog} onOpenChange={setShowFinalDialog}>
        <DialogContent className="relative max-w-sm p-0 overflow-hidden rounded-2xl border-0">
          {showConfetti && (
            <div className="pointer-events-none absolute inset-0 z-0">
              {dialogBlast >= 1 && (
                <ConfettiCanvas
                  key={`blast-1-${dialogBlast}`}
                  duration={1800}
                  mode="blast"
                />
              )}
              {dialogBlast >= 2 && (
                <ConfettiCanvas
                  key={`blast-2-${dialogBlast}`}
                  duration={1800}
                  mode="blast"
                />
              )}
            </div>
          )}
          <div className="relative z-10 bg-gradient-to-b from-amber-200 via-amber-100 to-white p-6 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/o/assets%2F6bf9f940afaa47adb0dc2265d0f0cc7d%2Fb6757c28effa47b997680f4cce7b558d?alt=media&token=314bff09-2dc0-48a8-9030-ccb545eaefcb&apiKey=6bf9f940afaa47adb0dc2265d0f0cc7d"
                alt="Rewards celebration"
                className="h-32 w-auto rounded-md"
              />
            </div>
            <div className="mx-auto mb-4 flex w-full max-w-xs items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "relative flex-1 h-4",
                    n === 1
                      ? "rounded-l-full"
                      : n === 5
                        ? "rounded-r-full"
                        : "",
                    n <= level ? "bg-amber-400" : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center text-[10px] font-semibold",
                      n <= level ? "text-white" : "text-gray-700",
                    )}
                  >
                    {n}
                  </span>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Congratulations
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              You’ve completed all the steps — enjoy your reward of
              <span className="ai-pulse text-valasys-orange font-semibold">
                {" "}
                50 bonus credits
              </span>
              !
              <span aria-hidden className="ml-1">
                ✨
              </span>
            </p>
          </div>
          <div className="relative z-10 px-6 pb-6 pt-4">
            <div className="mb-3 text-left text-sm">
              <div className="mb-1 font-semibold text-gray-900">
                Rewards Unlocked:
              </div>
              <ul className="list-none space-y-1 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-500">★</span>
                  <span>50 bonus credits added</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-500">★</span>
                  <span>Priority access to new features</span>
                </li>
              </ul>
            </div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-valasys-orange to-valasys-blue hover:from-[#FF6A00]/90 hover:to-[#1A73E8]/90 text-white"
            >
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
