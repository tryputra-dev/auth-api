const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    threadId = "thread-123",
    owner = "user-123",
    content = "Komentar",
    date = new Date().toISOString(),
    isDeleted = false,
  }) {
    const query = {
      text: "INSERT INTO comments (id, thread_id, owner, content, date, is_deleted) VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, threadId, owner, content, date, isDeleted],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_deleted = TRUE WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments");
  },
};

module.exports = CommentsTableTestHelper;
