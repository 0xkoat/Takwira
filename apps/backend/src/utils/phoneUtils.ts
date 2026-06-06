export const normalizePhoneNumber = (phoneNumber: any): number => {
    let cleaned = String(phoneNumber || '').replace(/\D/g, '');
    if (cleaned.startsWith('216') && cleaned.length > 8) {
        cleaned = cleaned.substring(3);
    }
    return parseInt(cleaned) || 0;
};
