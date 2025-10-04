import { Contacts } from '@capacitor-community/contacts';
import { Capacitor } from '@capacitor/core';

export interface PhoneContact {
  id: string;
  name: string;
  phoneNumbers: string[];
  avatar?: string;
}

export const requestContactsPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Not running on native platform');
    return false;
  }

  try {
    const permission = await Contacts.requestPermissions();
    return permission.contacts === 'granted';
  } catch (error) {
    console.error('Error requesting contacts permission:', error);
    return false;
  }
};

export const getPhoneContacts = async (): Promise<PhoneContact[]> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Not running on native platform, returning empty array');
    return [];
  }

  try {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      throw new Error('Permission denied');
    }

    const result = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
        image: true,
      },
    });

    return result.contacts.map((contact) => ({
      id: contact.contactId,
      name: contact.name?.display || 'Unknown',
      phoneNumbers: contact.phones?.map((phone) => phone.number || '') || [],
      avatar: contact.image?.base64String 
        ? `data:image/jpeg;base64,${contact.image.base64String}`
        : undefined,
    }));
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const makePhoneCall = (phoneNumber: string) => {
  // Remove any non-digit characters except +
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  if (Capacitor.isNativePlatform()) {
    // On native platforms, use the tel: protocol
    window.location.href = `tel:${cleanNumber}`;
  } else {
    // On web, open in new tab
    window.open(`tel:${cleanNumber}`, '_blank');
  }
};
