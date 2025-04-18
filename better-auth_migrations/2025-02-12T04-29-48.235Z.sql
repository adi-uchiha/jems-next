create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" integer not null, "image" text, "createdAt" date not null, "updatedAt" date not null, "twoFactorEnabled" integer, "role" text, "banned" integer, "banReason" text, "banExpires" date);

create table "session" ("id" text not null primary key, "expiresAt" date not null, "token" text not null unique, "createdAt" date not null, "updatedAt" date not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id"), "activeOrganizationId" text, "impersonatedBy" text);

create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id"), "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" date, "refreshTokenExpiresAt" date, "scope" text, "password" text, "createdAt" date not null, "updatedAt" date not null);

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" date not null, "createdAt" date, "updatedAt" date);

create table "organization" ("id" text not null primary key, "name" text not null, "slug" text not null unique, "logo" text, "createdAt" date not null, "metadata" text);

create table "member" ("id" text not null primary key, "organizationId" text not null references "organization" ("id"), "userId" text not null references "user" ("id"), "role" text not null, "createdAt" date not null);

create table "invitation" ("id" text not null primary key, "organizationId" text not null references "organization" ("id"), "email" text not null, "role" text, "status" text not null, "expiresAt" date not null, "inviterId" text not null references "user" ("id"));

create table "twoFactor" ("id" text not null primary key, "secret" text not null, "backupCodes" text not null, "userId" text not null references "user" ("id"));

create table "passkey" ("id" text not null primary key, "name" text, "publicKey" text not null, "userId" text not null references "user" ("id"), "credentialID" text not null, "counter" integer not null, "deviceType" text not null, "backedUp" integer not null, "transports" text, "createdAt" date);

create table "oauthApplication" ("id" text not null primary key, "name" text not null, "icon" text, "metadata" text, "clientId" text not null unique, "clientSecret" text not null, "redirectURLs" text not null, "type" text not null, "disabled" integer, "userId" text, "createdAt" date not null, "updatedAt" date not null);

create table "oauthAccessToken" ("id" text not null primary key, "accessToken" text not null unique, "refreshToken" text not null unique, "accessTokenExpiresAt" date not null, "refreshTokenExpiresAt" date not null, "clientId" text not null, "userId" text, "scopes" text not null, "createdAt" date not null, "updatedAt" date not null);

create table "oauthConsent" ("id" text not null primary key, "clientId" text not null, "userId" text not null, "scopes" text not null, "createdAt" date not null, "updatedAt" date not null, "consentGiven" integer not null)