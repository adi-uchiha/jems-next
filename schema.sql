-- PostgreSQL Schema (Version 17 compatible) - MINIMAL VERSION
-- Integrating Custom Tables with Updated Auth Schema (BetterAuth - Timestamp/Boolean Version)
-- Timestamp format aligned with Auth tables (TIMESTAMP)
-- Triggers REMOVED - Application MUST handle timestamp updates manually.
-- Minimal indexes - Performance may degrade on larger datasets without more indexes.

-- ========= AUTH RELATED TABLES (New definitions - Types Updated to Timestamp/Boolean) =========
-- Structure untouched as per requirement, but uses new types provided.

CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL, -- Application MUST update this manually
    "twoFactorEnabled" BOOLEAN,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP
);

CREATE TABLE "organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "logo" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "metadata" TEXT
);

CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" TIMESTAMP NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL, -- Application MUST update this manually
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "activeOrganizationId" TEXT REFERENCES "organization" ("id") ON DELETE SET NULL,
    "impersonatedBy" TEXT REFERENCES "user" ("id") ON DELETE SET NULL
);
CREATE INDEX idx_session_userId ON "session"("userId"); -- Keep FK index

CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope" TEXT,
    "password" TEXT, -- Store securely hashed passwords
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL, -- Application MUST update this manually
    UNIQUE ("providerId", "accountId")
);
CREATE INDEX idx_account_userId ON "account"("userId"); -- Keep FK index

CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP,
    "updatedAt" TIMESTAMP, -- Application MUST update this manually (if applicable)
    UNIQUE ("identifier", "value")
);

CREATE TABLE "member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "role" TEXT NOT NULL, -- Consider CHECK constraint for roles
    "createdAt" TIMESTAMP NOT NULL,
    UNIQUE ("organizationId", "userId")
);
CREATE INDEX idx_member_organizationId ON "member"("organizationId"); -- Keep FK index
CREATE INDEX idx_member_userId ON "member"("userId"); -- Keep FK index

CREATE TABLE "invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    "expiresAt" TIMESTAMP NOT NULL,
    "inviterId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE SET NULL,
    UNIQUE ("organizationId", "email", "status") -- Adjust uniqueness if needed
);
CREATE INDEX idx_invitation_organizationId ON "invitation"("organizationId"); -- Keep FK index
CREATE INDEX idx_invitation_inviterId ON "invitation"("inviterId"); -- Keep FK index

CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL, -- Consider JSONB or TEXT[]
    "userId" TEXT NOT NULL UNIQUE REFERENCES "user" ("id") ON DELETE CASCADE
);
-- Index on userId automatically created by UNIQUE constraint

CREATE TABLE "passkey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "credentialID" TEXT NOT NULL UNIQUE,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT, -- Consider JSONB or TEXT[]
    "createdAt" TIMESTAMP
);
CREATE INDEX idx_passkey_userId ON "passkey"("userId"); -- Keep FK index
-- Index on credentialID automatically created by UNIQUE constraint

CREATE TABLE "oauthApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "metadata" TEXT,
    "clientId" TEXT NOT NULL UNIQUE,
    "clientSecret" TEXT NOT NULL, -- Store securely hashed
    "redirectURLs" TEXT NOT NULL, -- Consider JSONB or TEXT[]
    "type" TEXT NOT NULL, -- Consider CHECK constraint
    "disabled" BOOLEAN DEFAULT FALSE,
    "userId" TEXT REFERENCES "user" ("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL -- Application MUST update this manually
);
CREATE INDEX idx_oauthApplication_userId ON "oauthApplication"("userId"); -- Keep FK index
-- Index on clientId automatically created by UNIQUE constraint

CREATE TABLE "oauthAccessToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL UNIQUE,
    "refreshToken" TEXT UNIQUE,
    "accessTokenExpiresAt" TIMESTAMP NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP,
    "clientId" TEXT NOT NULL REFERENCES "oauthApplication" ("clientId") ON DELETE CASCADE,
    "userId" TEXT REFERENCES "user" ("id") ON DELETE CASCADE,
    "scopes" TEXT NOT NULL, -- Consider JSONB or TEXT[]
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL -- Application MUST update this manually
);
CREATE INDEX idx_oauthAccessToken_clientId ON "oauthAccessToken"("clientId"); -- Keep FK index
CREATE INDEX idx_oauthAccessToken_userId ON "oauthAccessToken"("userId"); -- Keep FK index
-- Indexes on accessToken, refreshToken automatically created by UNIQUE constraints

CREATE TABLE "oauthConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL REFERENCES "oauthApplication" ("clientId") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "scopes" TEXT NOT NULL, -- Consider JSONB or TEXT[]
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL, -- Application MUST update this manually
    "consentGiven" BOOLEAN NOT NULL,
    UNIQUE ("clientId", "userId")
);
CREATE INDEX idx_oauthConsent_clientId ON "oauthConsent"("clientId"); -- Keep FK index
CREATE INDEX idx_oauthConsent_userId ON "oauthConsent"("userId"); -- Keep FK index

-- ========= CELERY TASK TRACKING (Minimal - No Trigger) =========

CREATE TABLE celery_tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    task_name VARCHAR(255) NOT NULL,
    task_args JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Use TIMESTAMP
    started_at TIMESTAMP, -- Worker MUST set this manually
    completed_at TIMESTAMP, -- Worker MUST set this manually
    error_message TEXT,
    retries INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP -- Worker MUST set this manually
);

-- Essential indexes
CREATE INDEX idx_celery_tasks_task_id ON celery_tasks(task_id);
CREATE INDEX idx_celery_tasks_status ON celery_tasks(status); -- Important for finding pending/failed tasks

-- ========= JOB DATA TABLES (Minimal - No Trigger) =========

CREATE TABLE raw_jobs (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(255) NOT NULL REFERENCES celery_tasks(task_id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    raw_data JSONB NOT NULL,
    source_site VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_url VARCHAR(1024),
    job_type VARCHAR(100),
    salary_interval VARCHAR(20),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Use TIMESTAMP
);

CREATE INDEX idx_raw_jobs_task_id ON raw_jobs(task_id); -- Keep FK index
-- Removed idx_raw_jobs_source, idx_raw_jobs_created, idx_raw_jobs_external_id for minimalism

CREATE TABLE processed_jobs (
    id SERIAL PRIMARY KEY,
    raw_job_id INTEGER REFERENCES raw_jobs(id) ON DELETE SET NULL,
    task_id VARCHAR(255) NOT NULL REFERENCES celery_tasks(task_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    url VARCHAR(1024),
    job_type VARCHAR(100),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3),
    pinecone_id VARCHAR(255) UNIQUE,
    embedding_status VARCHAR(50) DEFAULT 'PENDING' CHECK (embedding_status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Use TIMESTAMP
);

CREATE INDEX idx_processed_jobs_task_id ON processed_jobs(task_id); -- Keep FK index
CREATE INDEX idx_processed_jobs_embedding_status ON processed_jobs(embedding_status); -- Keep status index
CREATE INDEX idx_processed_jobs_pinecone_id ON processed_jobs(pinecone_id); -- Keep likely lookup index
-- Removed idx_processed_jobs_created for minimalism

-- ========= RESUME TABLES (Minimal - No Trigger) =========

CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT,
    file_type TEXT,
    status TEXT CHECK( status IN ('pending', 'active', 'archived') ) NOT NULL,
    personal_info_name TEXT NOT NULL,
    personal_info_phone TEXT NOT NULL,
    personal_info_email TEXT NOT NULL,
    personal_info_linkedin TEXT,
    personal_info_github TEXT,
    education JSONB NOT NULL,
    experience JSONB NOT NULL,
    projects JSONB NOT NULL,
    technical_skills JSONB NOT NULL,
    certifications_achievements JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Use TIMESTAMP
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Use TIMESTAMP, Application MUST update manually
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id); -- Keep FK index
CREATE INDEX idx_resumes_status ON resumes(status); -- Keep status index

-- ========= CHAT TABLES (Minimal - No Trigger) =========

CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Use TIMESTAMP
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Use TIMESTAMP, Application MUST update manually
);

CREATE INDEX idx_chats_user_id ON chats(user_id); -- Keep FK index

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Use TIMESTAMP
);

CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id); -- Keep FK index
-- Removed idx_chat_messages_created_at for minimalism

-- ========= TASK PROCESSING LOGS (Minimal - No Trigger) =========

CREATE TABLE task_logs (
    id SERIAL PRIMARY KEY,
    task_pk_id INTEGER REFERENCES celery_tasks(id) ON DELETE CASCADE,
    task_uuid VARCHAR(255),
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Use TIMESTAMP
);

CREATE INDEX idx_task_logs_task_pk ON task_logs(task_pk_id); -- Keep FK index
-- Removed idx_task_logs_log_level, idx_task_logs_created_at, idx_task_logs_task_uuid for minimalism

-- ========= TRIGGERS (REMOVED) =========
-- NO TRIGGERS ARE CREATED IN THIS MINIMAL SCHEMA.
-- Application code is fully responsible for managing 'updated_at',
-- 'started_at', 'completed_at', 'last_retry_at' fields manually.

-- ========= END OF SCHEMA =========