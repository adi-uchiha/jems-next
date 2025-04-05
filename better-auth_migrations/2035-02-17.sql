CREATE TABLE resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    education TEXT NOT NULL, -- JSON array
    experience TEXT NOT NULL,-- JSON array
    projects TEXT NOT NULL, -- JSON array
    technicalSkills TEXT NOT NULL, -- JSON array
    certificationsAchievements TEXT NOT NULL, -- JSON array
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);