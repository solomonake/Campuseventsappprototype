import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { Event, FilterCriteria, UserPreferences } from "../types/models";
import { mockEvents, defaultFilterCriteria } from "../data/mockData";
import { EventService } from "../services/EventService";
import { ApprovalService } from "../services/ApprovalService";
import { CheckInService } from "../services/CheckInService";
import { RoleRequestService } from "../services/RoleRequestService";

interface AppContextType {
  events: Event[];
  eventService: EventService;
  approvalService: ApprovalService;
  checkInService: CheckInService;
  roleRequestService: RoleRequestService;
  filterCriteria: FilterCriteria;
  setFilterCriteria: (criteria: FilterCriteria) => void;
  userPreferences: UserPreferences | null;
  setUserPreferences: (prefs: UserPreferences) => void;
  refreshEvents: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem("cecs-filters");
    return saved ? JSON.parse(saved) : defaultFilterCriteria;
  });
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences | null>(null);

  // Services - use useMemo to avoid recreating on every render
  const eventService = useMemo(() => new EventService(events), [events]);
  const approvalService = useMemo(() => new ApprovalService(events), [events]);
  const checkInService = useMemo(() => new CheckInService(), []);
  const roleRequestService = useMemo(() => new RoleRequestService(), []);

  // Save filter criteria to localStorage
  useEffect(() => {
    localStorage.setItem("cecs-filters", JSON.stringify(filterCriteria));
  }, [filterCriteria]);

  const setUserPreferences = (prefs: UserPreferences) => {
    setUserPreferencesState(prefs);
    localStorage.setItem("cecs-preferences", JSON.stringify(prefs));
  };

  const refreshEvents = () => {
    setEvents([...events]);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        eventService,
        approvalService,
        checkInService,
        roleRequestService,
        filterCriteria,
        setFilterCriteria,
        userPreferences,
        setUserPreferences,
        refreshEvents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}