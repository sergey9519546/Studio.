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
  private hasWarned = false;

  private warnUnimplemented(method: string) {
    if (this.hasWarned) return;
    this.hasWarned = true;
    console.warn(
      `[PresenceService] ${method} called, but PresenceService is not implemented. ` +
        'Hook this up to a backend to enable real presence updates.',
    );
  }

  initialize(_userId: string, _data: unknown) {
    this.warnUnimplemented('initialize');
  }

  trackActivity(_type: string, _description: string, _documentId: string) {
    this.warnUnimplemented('trackActivity');
  }

  onUsersChange(_callback: (users: PresenceUser[]) => void) {
    this.warnUnimplemented('onUsersChange');
    return () => {};
  }
}

export const presenceService = new PresenceService();
