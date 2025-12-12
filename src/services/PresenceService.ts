/**
 * PresenceService - Real-time user presence and activity tracking
 * Manages user presence states, activity tracking, and collaboration features
 */

import { webSocketService } from './WebSocketService';

export interface PresenceUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status: PresenceStatus;
  lastSeen: Date;
  currentProject?: string;
  currentActivity?: ActivityInfo;
  location?: LocationInfo;
  device?: DeviceInfo;
  color: string;
  isOnline: boolean;
  permissions?: UserPermissions;
}

export type PresenceStatus = 
  | 'online' 
  | 'away' 
  | 'busy' 
  | 'offline' 
  | 'in-meeting' 
  | 'focus-mode' 
  | 'editing' 
  | 'viewing';

export interface ActivityInfo {
  type: 'editing' | 'viewing' | 'commenting' | 'reviewing' | 'browsing' | 'idle';
  details: string;
  target?: string; // document id, project id, etc.
  startTime: Date;
  metadata?: Record<string, any>;
}

export interface LocationInfo {
  page: string;
  section?: string;
  context?: string;
  coordinates?: { x: number; y: number };
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  userAgent?: string;
}

export interface UserPermissions {
  canEdit: boolean;
  canComment: boolean;
  canView: boolean;
  canInvite: boolean;
  canDelete: boolean;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';
}

export interface PresenceEvent {
  id: string;
  userId: string;
  type: PresenceEventType;
  timestamp: Date;
  data: any;
}

export type PresenceEventType = 
  | 'user-joined'
  | 'user-left'
  | 'status-changed'
  | 'activity-changed'
  | 'location-changed'
  | 'permissions-changed'
  | 'heartbeat';

export interface PresenceConfig {
  heartbeatInterval: number;
  awayTimeout: number;
  offlineTimeout: number;
  maxInactiveTime: number;
  enableActivityTracking: boolean;
  enableLocationTracking: boolean;
}

export type PresenceHandler = (event: PresenceEvent) => void;
export type UsersChangeHandler = (users: PresenceUser[]) => void;

class PresenceService {
  private users: Map<string, PresenceUser> = new Map();
  private eventHandlers: Set<PresenceHandler> = new Set();
  private usersChangeHandlers: Set<UsersChangeHandler> = new Set();
  private currentUserId: string = '';
  private config: PresenceConfig;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private lastActivity: Date = new Date();
  private isInitialized = false;

  constructor(config?: Partial<PresenceConfig>) {
    this.config = {
      heartbeatInterval: 30000, // 30 seconds
      awayTimeout: 300000, // 5 minutes
      offlineTimeout: 600000, // 10 minutes
      maxInactiveTime: 1800000, // 30 minutes
      enableActivityTracking: true,
      enableLocationTracking: true,
      ...config
    };

    this.initializeWebSocketHandlers();
    this.startHeartbeat();
  }

  /**
   * Initialize the service with current user information
   */
  initialize(userId: string, userInfo: Omit<PresenceUser, 'id' | 'status' | 'lastSeen' | 'isOnline'>): void {
    this.currentUserId = userId;
    
    const user: PresenceUser = {
      id: userId,
      name: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.avatar,
      status: 'online',
      lastSeen: new Date(),
      currentProject: userInfo.currentProject,
      currentActivity: userInfo.currentActivity,
      location: userInfo.location,
      device: userInfo.device,
      color: userInfo.color,
      isOnline: true,
      permissions: userInfo.permissions || {
        canEdit: true,
        canComment: true,
        canView: true,
        canInvite: false,
        canDelete: false,
        role: 'editor'
      }
    };

    this.users.set(userId, user);
    this.isInitialized = true;

    // Announce presence to other users
    this.broadcastPresence('user-joined', user);
  }

  /**
   * Update current user's status
   */
  updateStatus(status: PresenceStatus): void {
    if (!this.currentUserId) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    const oldStatus = user.status;
    user.status = status;
    user.lastSeen = new Date();

    // Broadcast status change
    this.broadcastPresence('status-changed', {
      userId: this.currentUserId,
      oldStatus,
      newStatus: status
    });

    this.notifyEventHandlers({
      id: this.generateId(),
      userId: this.currentUserId,
      type: 'status-changed',
      timestamp: new Date(),
      data: { oldStatus, newStatus: status }
    });
  }

  /**
   * Update current user's activity
   */
  updateActivity(activity: Omit<ActivityInfo, 'startTime'>): void {
    if (!this.currentUserId || !this.config.enableActivityTracking) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    const oldActivity = user.currentActivity;
    user.currentActivity = {
      ...activity,
      startTime: new Date()
    };
    user.lastSeen = new Date();
    this.lastActivity = new Date();

    // Broadcast activity change
    this.broadcastPresence('activity-changed', {
      userId: this.currentUserId,
      activity: user.currentActivity
    });

    this.notifyEventHandlers({
      id: this.generateId(),
      userId: this.currentUserId,
      type: 'activity-changed',
      timestamp: new Date(),
      data: { oldActivity, newActivity: user.currentActivity }
    });
  }

  /**
   * Update current user's location
   */
  updateLocation(location: LocationInfo): void {
    if (!this.currentUserId || !this.config.enableLocationTracking) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    const oldLocation = user.location;
    user.location = location;
    user.lastSeen = new Date();

    // Broadcast location change
    this.broadcastPresence('location-changed', {
      userId: this.currentUserId,
      location
    });

    this.notifyEventHandlers({
      id: this.generateId(),
      userId: this.currentUserId,
      type: 'location-changed',
      timestamp: new Date(),
      data: { oldLocation, newLocation: location }
    });
  }

  /**
   * Set current user as away
   */
  setAway(): void {
    this.updateStatus('away');
  }

  /**
   * Set current user as busy
   */
  setBusy(): void {
    this.updateStatus('busy');
  }

  /**
   * Set current user as in meeting
   */
  setInMeeting(): void {
    this.updateStatus('in-meeting');
  }

  /**
   * Set current user as focus mode
   */
  setFocusMode(): void {
    this.updateStatus('focus-mode');
  }

  /**
   * Go offline
   */
  goOffline(): void {
    if (!this.currentUserId) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    user.status = 'offline';
    user.isOnline = false;
    user.lastSeen = new Date();

    // Stop timers
    this.stopHeartbeat();

    // Broadcast offline status
    this.broadcastPresence('user-left', {
      userId: this.currentUserId
    });
  }

  /**
   * Come back online
   */
  comeOnline(): void {
    if (!this.currentUserId) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    user.status = 'online';
    user.isOnline = true;
    user.lastSeen = new Date();

    // Restart timers
    this.startHeartbeat();

    // Broadcast online status
    this.broadcastPresence('user-joined', user);
  }

  /**
   * Get current user
   */
  getCurrentUser(): PresenceUser | undefined {
    return this.currentUserId ? this.users.get(this.currentUserId) : undefined;
  }

  /**
   * Get all users
   */
  getAllUsers(): PresenceUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Get users by status
   */
  getUsersByStatus(status: PresenceStatus): PresenceUser[] {
    return Array.from(this.users.values()).filter(user => user.status === status);
  }

  /**
   * Get users by project
   */
  getUsersByProject(projectId: string): PresenceUser[] {
    return Array.from(this.users.values()).filter(user => user.currentProject === projectId);
  }

  /**
   * Get active users (online and not offline)
   */
  getActiveUsers(): PresenceUser[] {
    return Array.from(this.users.values()).filter(user => 
      user.isOnline && user.status !== 'offline'
    );
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): PresenceUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Check if user is currently active
   */
  isUserActive(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const now = new Date();
    const inactiveTime = now.getTime() - user.lastSeen.getTime();
    
    return user.isOnline && inactiveTime < this.config.maxInactiveTime;
  }

  /**
   * Subscribe to presence events
   */
  onPresenceEvent(handler: PresenceHandler): () => void {
    this.eventHandlers.add(handler);
    
    return () => {
      this.eventHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to users change events
   */
  onUsersChange(handler: UsersChangeHandler): () => void {
    this.usersChangeHandlers.add(handler);
    
    return () => {
      this.usersChangeHandlers.delete(handler);
    };
  }

  /**
   * Get presence statistics
   */
  getPresenceStats(): PresenceStats {
    const users = this.getAllUsers();
    const activeUsers = this.getActiveUsers();
    
    const statusCounts = users.reduce((counts, user) => {
      counts[user.status] = (counts[user.status] || 0) + 1;
      return counts;
    }, {} as Record<PresenceStatus, number>);

    const activityCounts = users.reduce((counts, user) => {
      if (user.currentActivity) {
        counts[user.currentActivity.type] = (counts[user.currentActivity.type] || 0) + 1;
      }
      return counts;
    }, {} as Record<string, number>);

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      onlineUsers: users.filter(u => u.status === 'online').length,
      awayUsers: users.filter(u => u.status === 'away').length,
      busyUsers: users.filter(u => u.status === 'busy').length,
      statusCounts,
      activityCounts,
      currentUser: this.getCurrentUser()
    };
  }

  /**
   * Update activity automatically based on user interactions
   */
  trackActivity(type: ActivityInfo['type'], details: string, target?: string): void {
    if (!this.config.enableActivityTracking) return;

    // Debounce rapid activity updates
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    this.activityTimer = setTimeout(() => {
      this.updateActivity({
        type,
        details,
        target,
        metadata: {
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        }
      });
    }, 1000); // 1 second debounce
  }

  // Private methods

  private initializeWebSocketHandlers(): void {
    // Handle user joined
    webSocketService.onMessage('user-presence-joined', (message) => {
      const user = message.payload as PresenceUser;
      this.users.set(user.id, user);
      this.notifyUsersChangeHandlers();
    });

    // Handle user left
    webSocketService.onMessage('user-presence-left', (message) => {
      const { userId } = message.payload;
      this.users.delete(userId);
      this.notifyUsersChangeHandlers();
    });

    // Handle status change
    webSocketService.onMessage('user-status-changed', (message) => {
      const { userId, status } = message.payload;
      const user = this.users.get(userId);
      if (user) {
        user.status = status;
        user.lastSeen = new Date();
        this.notifyUsersChangeHandlers();
      }
    });

    // Handle activity change
    webSocketService.onMessage('user-activity-changed', (message) => {
      const { userId, activity } = message.payload;
      const user = this.users.get(userId);
      if (user) {
        user.currentActivity = activity;
        user.lastSeen = new Date();
        this.notifyUsersChangeHandlers();
      }
    });

    // Handle location change
    webSocketService.onMessage('user-location-changed', (message) => {
      const { userId, location } = message.payload;
      const user = this.users.get(userId);
      if (user) {
        user.location = location;
        user.lastSeen = new Date();
        this.notifyUsersChangeHandlers();
      }
    });

    // Handle presence heartbeat
    webSocketService.onMessage('presence-heartbeat', (message) => {
      const { userId } = message.payload;
      const user = this.users.get(userId);
      if (user) {
        user.lastSeen = new Date();
        user.isOnline = true;
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.currentUserId && this.isInitialized) {
        // Send heartbeat
        webSocketService.send({
          type: 'presence-heartbeat',
          payload: {
            userId: this.currentUserId,
            timestamp: Date.now()
          },
          userId: this.currentUserId
        });

        // Check for inactive users and update their status
        this.updateInactiveUsers();
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private updateInactiveUsers(): void {
    const now = new Date();
    
    this.users.forEach((user, userId) => {
      if (userId === this.currentUserId) return; // Skip current user
      
      const inactiveTime = now.getTime() - user.lastSeen.getTime();
      
      if (inactiveTime > this.config.offlineTimeout && user.status !== 'offline') {
        user.status = 'offline';
        user.isOnline = false;
      } else if (inactiveTime > this.config.awayTimeout && 
                 user.status === 'online' && 
                 user.status !== 'busy') {
        user.status = 'away';
      }
    });

    this.notifyUsersChangeHandlers();
  }

  private broadcastPresence(eventType: PresenceEventType, data: any): void {
    if (!this.currentUserId) return;

    webSocketService.send({
      type: `user-presence-${eventType.replace('-', '')}`,
      payload: data,
      userId: this.currentUserId
    });
  }

  private notifyEventHandlers(event: PresenceEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in presence event handler:', error);
      }
    });
  }

  private notifyUsersChangeHandlers(): void {
    this.usersChangeHandlers.forEach(handler => {
      try {
        handler(this.getAllUsers());
      } catch (error) {
        console.error('Error in users change handler:', error);
      }
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export interface PresenceStats {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  awayUsers: number;
  busyUsers: number;
  statusCounts: Record<PresenceStatus, number>;
  activityCounts: Record<string, number>;
  currentUser?: PresenceUser;
}

// Create singleton instance
export const presenceService = new PresenceService();

export default PresenceService;
