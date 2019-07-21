import Sentry from 'sentry-expo';

class ExtendedSentry {
    constructor() {
        // Remove this once Sentry is correctly setup.
        Sentry.enableInExpoDevelopment = true;

        Sentry.config("https://26385eda1ed94a6da36a306512e8da86@sentry.io/1509735").install();

        Object.assign(this, Sentry);
    }

    setUser(user) {
        if (!user) return;
        this.configureScope(scope => {
            scope.setUser({
                email: user.email,
                id: user.uuid,
                userInfo: user,
            });
        });
    }
}

const sentry = new ExtendedSentry();
export default sentry;
