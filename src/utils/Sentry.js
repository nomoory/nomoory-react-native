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
        this.setUserContext({
            id: user.uuid,
            username: user && user.profile && user.profile.real_name,
            email: user.email,
            extra: user,
        })

        // this.configureScope(scope => {
        //     console.log({scope, user});
        //     scope.setUser({
        //         email: user.email,
        //         id: user.uuid,
        //         userInfo: user,
        //     });
        // });
    }
}

const sentry = new ExtendedSentry();
export default sentry;
