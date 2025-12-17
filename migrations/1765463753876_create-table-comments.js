exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "threads",
      onDelete: "cascade",
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    content: { type: "TEXT", notNull: true },
    date: {
      type: "TIMESTAMP WITH TIME ZONE",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: { type: "BOOLEAN", notNull: true, default: false },
  });

  pgm.createIndex("comments", "thread_id");
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
