CREATE TABLE resumes (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    filePath TEXT,
    fileType TEXT,
    status TEXT CHECK( status IN ('pending', 'active', 'archived') ) NOT NULL,
    personalInfoName TEXT NOT NULL,
    personalInfoPhone TEXT NOT NULL,
    personalInfoEmail TEXT NOT NULL,
    personalInfoLinkedIn TEXT,
    personalInfoGithub TEXT,
    education TEXT NOT NULL,  -- JSON array
    experience TEXT NOT NULL, -- JSON array
    projects TEXT NOT NULL,    -- JSON array
    technicalSkills TEXT NOT NULL,  -- JSON array
    certificationsAchievements TEXT NOT NULL,  -- JSON array
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id)
);

