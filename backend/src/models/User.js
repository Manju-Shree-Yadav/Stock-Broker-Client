const users = new Map();

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function getOrCreateUser(email) {
    const normalizedEmail = normalizeEmail(email);

    if (!users.has(normalizedEmail)) {
        users.set(normalizedEmail, {
            id: normalizedEmail,
            email: normalizedEmail,
            subscriptions: []
        });
    }

    return users.get(normalizedEmail);
}

function getUser(email) {
    return users.get(normalizeEmail(email));
}

function updateUserSubscriptions(email, subscriptions) {
    const user = getOrCreateUser(email);
    user.subscriptions = subscriptions;
    return user;
}

export { getOrCreateUser, getUser, updateUserSubscriptions };
