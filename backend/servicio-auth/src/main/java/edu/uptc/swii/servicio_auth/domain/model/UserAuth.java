package edu.uptc.swii.servicio_auth.domain.model;

import edu.uptc.swii.servicio_auth.shared.domain.AggregateRoot;

public class UserAuth extends AggregateRoot<UserId> {
    private final Username username;
    private final Email email;
    private Password password;
    private Role role;
    private AccountState state;
    private final String authProvider;

    public UserAuth(UserId id, Username username, Email email, Password password, Role role, AccountState state,
            String authProvider) {
        super(id);
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.state = state;
        this.authProvider = authProvider;
    }

    public static UserAuth createLocal(UserId id, Username username, Email email, Password password, Role role) {
        UserAuth user = new UserAuth(id, username, email, password, role, AccountState.HABILITADO, "LOCAL");
        return user;
    }

    public static UserAuth createExternal(UserId id, Username username, Email email, Role role, String provider) {
        return new UserAuth(id, username, email, null, role, AccountState.HABILITADO, provider);
    }

    public boolean canLogin() {
        return this.state == AccountState.HABILITADO;
    }

    public void disable() {
        this.state = AccountState.INHABILITADO;
    }

    public Username getUsername() {
        return username;
    }

    public Email getEmail() {
        return email;
    }

    public Password getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public AccountState getState() {
        return state;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void updateRole(Role newRole) {
        if (newRole != null) {
            this.role = newRole;
        }
    }
}