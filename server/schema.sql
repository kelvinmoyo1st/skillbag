CREATE TABLE IF NOT EXISTS skill_profiles (
      id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
          goal TEXT,
            created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS progress_logs (
              id SERIAL PRIMARY KEY,
                profile_id INTEGER REFERENCES skill_profiles(id) ON DELETE CASCADE,
                  note TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW()
                    );

                    CREATE TABLE IF NOT EXISTS reminders (
                      id SERIAL PRIMARY KEY,
                        profile_id INTEGER REFERENCES skill_profiles(id) ON DELETE CASCADE,
                          message TEXT NOT NULL,
                            remind_at TIMESTAMP NOT NULL,
                              sent BOOLEAN DEFAULT FALSE
                              );
