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
  initialize(userId: string, data: any) {}
  trackActivity(type: string, description: string, documentId: string) {}
  onUsersChange(callback: (users: PresenceUser[]) => void) {
    return () => {};
  }
}

export const presenceService = new PresenceService();
