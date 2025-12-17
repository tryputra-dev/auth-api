const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository interface", () => {
  it("should throw error when invoke abstract method", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    const mockNewThread = {};

    await expect(threadRepository.addThread(mockNewThread)).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      threadRepository.checkThreadExistence("thread-123")
    ).rejects.toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(threadRepository.getThreadById("thread-123")).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
