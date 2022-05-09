import { $currentUser } from '../components/globals';

export async function getAccessToken() {
    const user = $currentUser();
    if (user) {
        return user.accessToken ?? '';
    }
    return '';
}
