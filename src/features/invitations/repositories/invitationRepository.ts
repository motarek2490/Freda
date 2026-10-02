import { InvitationData } from '../../../types';
import {
  getInvitationCloudBySlugOrId,
  saveInvitationCloud,
  subscribeUserInvitationsCloud,
} from '../../../lib/firestoreService';
import { getStoredInvitations, saveInvitation as saveLocalInvitation } from '../../../lib/storage';
import { normalizeInvitation } from '../model/normalization';
import { logger } from '../../../shared/utils/logger';

/**
 * Repository interface for Invitation persistence.
 * Abstracts Firestore vs LocalStorage seamlessly while guaranteeing canonical normalized models.
 */
export const invitationRepository = {
  async getById(id: string): Promise<InvitationData | null> {
    try {
      logger.debug('Fetching invitation by ID', { invitationId: id });
      
      // First try cloud
      const cloudData = await getInvitationCloudBySlugOrId(id);
      if (cloudData) {
        return normalizeInvitation(cloudData);
      }

      // Fallback to local storage
      const localList = getStoredInvitations();
      const localItem = localList.find((item) => item.id === id);
      if (localItem) {
        return normalizeInvitation(localItem);
      }

      return null;
    } catch (err) {
      logger.error('Error fetching invitation by ID', { invitationId: id }, err);
      // Fallback to local storage on network/permission error
      const localList = getStoredInvitations();
      const localItem = localList.find((item) => item.id === id);
      return localItem ? normalizeInvitation(localItem) : null;
    }
  },

  async getBySlug(slug: string): Promise<InvitationData | null> {
    try {
      logger.debug('Fetching invitation by slug', { slug });
      const cloudData = await getInvitationCloudBySlugOrId(slug);
      if (cloudData) {
        return normalizeInvitation(cloudData);
      }

      const localList = getStoredInvitations();
      const localItem = localList.find((item) => item.slug === slug || item.id === slug);
      if (localItem) {
        return normalizeInvitation(localItem);
      }

      return null;
    } catch (err) {
      logger.error('Error fetching invitation by slug', { slug }, err);
      const localList = getStoredInvitations();
      const localItem = localList.find((item) => item.slug === slug || item.id === slug);
      return localItem ? normalizeInvitation(localItem) : null;
    }
  },

  async save(invitation: InvitationData, previousSlug?: string): Promise<void> {
    const normalized = normalizeInvitation(invitation);
    try {
      saveLocalInvitation(normalized);
      await saveInvitationCloud(normalized, previousSlug);
      logger.info('Invitation saved successfully', { invitationId: normalized.id });
    } catch (err) {
      logger.warn('Cloud save failed, saved locally', { invitationId: normalized.id }, err);
      saveLocalInvitation(normalized);
    }
  },

  subscribeToUserInvitations(
    userId: string,
    callback: (invitations: InvitationData[]) => void
  ): () => void {
    logger.debug('Subscribing to user invitations', { userId });
    return subscribeUserInvitationsCloud(userId, (cloudList) => {
      const normalizedList = cloudList.map((inv) => normalizeInvitation(inv));
      callback(normalizedList);
    });
  },
};
