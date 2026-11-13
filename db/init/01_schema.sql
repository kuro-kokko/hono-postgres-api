CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE app.members (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO app.members (name, email) VALUES
  ('John Doe', 'john.doe@example.com'),
  ('Jane Doe', 'jane.doe@example.com'),
  ('Taro Yamada', 'taro.yamada@example.com');
  