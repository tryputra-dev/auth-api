const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  let dummyUser1, dummyUser2;
  let dummyThreadId;

  beforeEach(async () => {
    const uniqueTime = new Date().getTime();

    dummyUser1 = {
      id: `user-A-${uniqueTime}`,
      username: `user_a_${uniqueTime}`,
    };
    dummyUser2 = {
      id: `user-B-${uniqueTime}`,
      username: `user_b_${uniqueTime}`,
    };
    dummyThreadId = `thread-123-${uniqueTime}`;

    await UsersTableTestHelper.addUser(dummyUser1);
    await UsersTableTestHelper.addUser(dummyUser2);
    await ThreadsTableTestHelper.addThread({
      id: dummyThreadId,
      owner: dummyUser1.id,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "Isi komentar",
        threadId: dummyThreadId,
        owner: dummyUser1.id,
      });

      const fakeIdGenerator = () => "456";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert
      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment.id).toEqual("comment-456");
      expect(addedComment.content).toEqual(newComment.content);
      expect(addedComment.owner).toEqual(newComment.owner);

      const foundComments = await CommentsTableTestHelper.findCommentsById(
        "comment-456"
      );
      expect(foundComments).toHaveLength(1);
    });
  });

  describe("deleteComment function", () => {
    it("should throw NotFoundError when comment ID not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const deletedComment =
        commentRepositoryPostgres.deleteComment("comment-not-exist");

      //Assert
      await expect(deletedComment).rejects.toThrow(NotFoundError);
      await expect(deletedComment).rejects.toThrow(
        "Komentar gagal dihapus. ID tidak ditemukan"
      );
    });

    it("should soft delete comment (set is_deleted to TRUE)", async () => {
      // Arrange
      const existingCommentId = "comment-to-delete";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: existingCommentId,
        threadId: dummyThreadId,
        owner: dummyUser1.id,
      });

      // Action
      await commentRepositoryPostgres.deleteComment(existingCommentId);

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentsById(
        existingCommentId
      );
      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const verifyCommentOwner = commentRepositoryPostgres.verifyCommentOwner(
        "comment-not-exist",
        dummyUser1.id
      );

      //Assert
      await expect(verifyCommentOwner).rejects.toThrow(NotFoundError);
      await expect(verifyCommentOwner).rejects.toThrow(
        "Komentar tidak ditemukan"
      );
    });

    it("should throw AuthorizationError when owner is not the comment creator", async () => {
      // Arrange
      const existingCommentId = "comment-owner-check";
      const wrongOwnerId = dummyUser2.id;
      const actualOwnerId = dummyUser1.id;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: existingCommentId,
        threadId: dummyThreadId,
        owner: actualOwnerId,
      });

      // Action
      const verifyCommentOwner = commentRepositoryPostgres.verifyCommentOwner(
        existingCommentId,
        wrongOwnerId
      );

      //Assert
      await expect(verifyCommentOwner).rejects.toThrow(AuthorizationError);
      await expect(verifyCommentOwner).rejects.toThrow(
        "Anda tidak berhak menghapus komentar ini"
      );
    });

    it("should not throw error when owner is the comment creator", async () => {
      // Arrange
      const existingCommentId = "comment-owner-valid";
      const correctOwnerId = dummyUser1.id;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: existingCommentId,
        threadId: dummyThreadId,
        owner: correctOwnerId,
      });

      // Action
      const verifyCommentOwner = commentRepositoryPostgres.verifyCommentOwner(
        existingCommentId,
        correctOwnerId
      );

      //Assert
      await expect(verifyCommentOwner).resolves.not.toThrow();
      await expect(verifyCommentOwner).resolves.not.toThrow(NotFoundError);
      await expect(verifyCommentOwner).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("checkCommentExistence function", () => {
    it("should throw NotFoundError when comment does not exist", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      //Action
      const checkCommentExistence =
        commentRepositoryPostgres.checkCommentExistence("comment-not-exist");

      // Assert
      await expect(checkCommentExistence).rejects.toThrow(NotFoundError);
      await expect(checkCommentExistence).rejects.toThrow(
        "Komentar tidak ditemukan"
      );
    });

    it("should throw NotFoundError when comment is already deleted (is_deleted = TRUE)", async () => {
      // Arrange
      const deletedCommentId = "comment-is-deleted";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: deletedCommentId,
        threadId: dummyThreadId,
        owner: dummyUser1.id,
        isDeleted: true,
      });

      //Action
      const checkCommentExistence =
        commentRepositoryPostgres.checkCommentExistence(deletedCommentId);

      // Assert
      await expect(checkCommentExistence).rejects.toThrow(NotFoundError);
      await expect(checkCommentExistence).rejects.toThrow(
        "Komentar tidak ditemukan"
      );
    });

    it("should not throw error when comment exists and is not deleted", async () => {
      // Arrange
      const existingCommentId = "comment-is-active";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: existingCommentId,
        threadId: dummyThreadId,
        owner: dummyUser1.id,
        isDeleted: false,
      });


      // Action
      const checkCommentExistence = commentRepositoryPostgres.checkCommentExistence(existingCommentId);

      //Assert
      await expect(checkCommentExistence).resolves.not.toThrow();
      await expect(checkCommentExistence).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return empty array if no comments found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        "thread-with-no-comments"
      );

      // Assert
      expect(comments).toEqual([]);
    });

    it("should return comments detail for a given thread, including soft deleted ones", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const date1 = new Date().toISOString();
      const date2 = new Date(Date.now() + 1000).toISOString();

      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        threadId: dummyThreadId,
        owner: dummyUser1.id,
        content: "Komentar Pertama",
        date: date1,
        isDeleted: false,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        threadId: dummyThreadId,
        owner: dummyUser2.id,
        content: "Komentar Kedua yang dihapus",
        date: date2,
        isDeleted: true,
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        dummyThreadId
      );

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[0].id).toEqual("comment-1");
      expect(comments[0].username).toEqual(dummyUser1.username);
      expect(comments[0].content).toEqual("Komentar Pertama");
      expect(comments[0].is_deleted).toEqual(false);
      expect(comments[0].date.toISOString()).toEqual(date1);

      expect(comments[1].id).toEqual("comment-2");
      expect(comments[1].username).toEqual(dummyUser2.username);
      expect(comments[1].content).toEqual("Komentar Kedua yang dihapus");
      expect(comments[1].is_deleted).toEqual(true);
      expect(comments[1].date.toISOString()).toEqual(date2);

      expect(new Date(comments[0].date).getTime()).toBeLessThan(
        new Date(comments[1].date).getTime()
      );
    });
  });
});
