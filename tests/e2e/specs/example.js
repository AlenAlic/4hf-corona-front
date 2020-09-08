// https://docs.cypress.io/api/introduction/api.html

describe("Navigates to app", () => {
  it("Visits the app root", () => {
    cy.visit("/");
  });
  it("Accepts cookies", () => {
    cy.contains("Cookie policy");
    cy.get("#cookies-ok-btn").click();
  });
});

describe("Test sign in", () => {
  it("Sign in", () => {
    cy.contains("Sign in");
    cy.get("#login-email").type("admin@test");
    cy.get("#login-password").focus();
    cy.get("label[for=login-email]").should("have.class", "error--text");
    cy.get("#login-email").type(".com");
    cy.get("label[for=login-password]").should("have.class", "error--text");
    cy.get("#login-password").focus();
    cy.get("label[for=login-email]").should("not.have.class", "error--text");
    cy.get("#login-password").type("test");
    cy.get("label[for=login-password]").should("not.have.class", "error--text");
    cy.get("#login-remember_me").should("not.be.checked");
    cy.get("label[for=login-remember_me]").click();
    cy.get("#login-remember_me").should("be.checked");
    cy.get("label[for=login-remember_me]").click();
    cy.get("#login-remember_me").should("not.be.checked");
    cy.get("#login-sign_in").click();
    cy.contains("Dashboard");
  });
});

describe("View pages", () => {
  it("Navigate to profile page", () => {
    cy.get("#header-menu-btn").click();
    cy.get("#header-menu-profile").click();
    cy.contains("Profile");
  });
  it("Navigate to security page", () => {
    cy.get("#header-menu-btn").click();
    cy.get("#header-menu-security").click();
    cy.contains("Security");
  });
});

describe("Sign out", () => {
  it("Sign out", () => {
    cy.get("#header-menu-btn").click();
    cy.get("#header-menu-sign_out").click();
  });
});
