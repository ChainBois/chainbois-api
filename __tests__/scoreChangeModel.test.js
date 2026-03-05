const ScoreChange = require("../models/scoreChangeModel");

describe("ScoreChange model", () => {
  describe("pre-save middleware", () => {
    test("populates date components from timestamp", (done) => {
      const timestamp = new Date("2026-03-04T14:30:00.000Z");
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 500,
        previousScore: 0,
        scoreChange: 500,
        timestamp,
      });

      // Trigger pre-save middleware manually
      doc.schema.s.hooks.execPre("save", doc, (err) => {
        expect(err).toBeFalsy();
        expect(doc.year).toBe(2026);
        expect(doc.month).toBe(3); // March
        expect(doc.day).toBe(timestamp.getDate());
        expect(doc.hour).toBe(timestamp.getHours());
        expect(doc.week).toBeGreaterThan(0);
        done();
      });
    });

    test("handles different months correctly", (done) => {
      const timestamp = new Date("2026-01-15T08:00:00.000Z");
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 100,
        previousScore: 0,
        scoreChange: 100,
        timestamp,
      });

      doc.schema.s.hooks.execPre("save", doc, (err) => {
        expect(err).toBeFalsy();
        expect(doc.year).toBe(2026);
        expect(doc.month).toBe(1); // January
        expect(doc.day).toBe(timestamp.getDate());
        done();
      });
    });

    test("defaults timestamp to now when not provided", (done) => {
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 200,
        previousScore: 100,
        scoreChange: 100,
      });

      doc.schema.s.hooks.execPre("save", doc, (err) => {
        expect(err).toBeFalsy();
        const now = new Date();
        expect(doc.year).toBe(now.getFullYear());
        expect(doc.month).toBe(now.getMonth() + 1);
        done();
      });
    });
  });

  describe("schema validation", () => {
    test("requires uid", () => {
      const doc = new ScoreChange({
        score: 100,
        previousScore: 0,
        scoreChange: 100,
      });

      const err = doc.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.uid).toBeDefined();
    });

    test("requires score", () => {
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        previousScore: 0,
        scoreChange: 100,
      });

      const err = doc.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.score).toBeDefined();
    });

    test("requires previousScore", () => {
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 100,
        scoreChange: 100,
      });

      const err = doc.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.previousScore).toBeDefined();
    });

    test("requires scoreChange", () => {
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 100,
        previousScore: 0,
      });

      const err = doc.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.scoreChange).toBeDefined();
    });

    test("valid document passes validation", () => {
      const doc = new ScoreChange({
        uid: "test_uid_12345678901234567890",
        score: 500,
        previousScore: 0,
        scoreChange: 500,
        address: "0xabc",
        username: "player1",
      });

      const err = doc.validateSync();
      expect(err).toBeUndefined();
    });
  });
});
