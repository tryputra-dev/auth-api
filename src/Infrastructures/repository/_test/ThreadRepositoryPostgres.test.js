const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  let dummyUniqId;
  let dummyOwnerId;
  let dummyOwnerUsername;

  beforeEach(async () => {
    dummyUniqId = `${new Date().getTime()}-a`;
    dummyOwnerId = `user-${dummyUniqId}`;
    dummyOwnerUsername = `repopsql-${dummyUniqId}`;

    await UsersTableTestHelper.addUser({
      id: dummyOwnerId,
      username: dummyOwnerUsername,
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

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      // Arrange
      const threadId = `thread-${dummyUniqId}`;
      const newThread = new NewThread({
        title: "title thread",
        body: "body thread",
        owner: dummyOwnerId,
      });

      const fakeIdGenerator = () => dummyUniqId;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toBeInstanceOf(AddedThread);
      expect(addedThread.id).toEqual(threadId);
      expect(addedThread.title).toEqual(newThread.title);
      expect(addedThread.owner).toEqual(newThread.owner);

      const foundThreads = await ThreadsTableTestHelper.findThreadsById(
        threadId
      );
      expect(foundThreads).toHaveLength(1);
    });
  });

  describe("checkThreadExistence function", () => {
    it("should throw NotFoundError when thread does not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      //Action
      const checkThreadExistence = threadRepositoryPostgres.checkThreadExistence("thread-not-exist");

      //Assert
      await expect(checkThreadExistence).rejects.toThrow(NotFoundError);
      await expect(checkThreadExistence).rejects.toThrow("Thread tidak ditemukan");
    });

    it("should not throw error when thread exists", async () => {
      // Arrange
      const threadId = `thread-${dummyUniqId}`;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: dummyOwnerId,
      });

      //Action
      const checkThreadExistence = threadRepositoryPostgres.checkThreadExistence(threadId);

      //Assert
      await expect(checkThreadExistence).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread does not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

       //Action
      const getThreadById = threadRepositoryPostgres.getThreadById("thread-not-exist");

      //Assert
      await expect(getThreadById).rejects.toThrow(NotFoundError);
      await expect(getThreadById).rejects.toThrow("Thread tidak ditemukan");
    
    });

    it("should return thread detail correctly when thread exists", async () => {
      // Arrange
      const threadId = `thread-${dummyUniqId}`;
      const creationDate = new Date();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: dummyOwnerId,
        title: "title",
        body: "body",
        date: creationDate.toISOString(),
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual("title");
      expect(thread.body).toEqual("body");
      expect(thread.username).toEqual(dummyOwnerUsername);
      expect(thread.date).toBeInstanceOf(Date);
    });
  });
});
