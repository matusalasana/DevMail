// Import this first in every test file. Tests never touch a real database:
// the repository is mocked, so a syntactically valid placeholder URL is enough.
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/devmail_test";
process.env.NODE_ENV = "test";
