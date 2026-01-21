export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  currentActivity?: {
    type: 'editing' | 'viewing';
    description: string;
  };
}

class PresenceService {
  initialize(_userId: string, _data: unknown) {}
  trackActivity(_type: string, _description: string, _documentId: string) {}
  onUsersChange(_callback: (users: PresenceUser[]) => void) {
    return () => {};
  }
}

export const presenceService = new PresenceService();
