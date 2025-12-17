const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrate the delete comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-456",
      owner: "user-789",
    };

    /** Mocking Dependencies */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** Mocking methods yang digunakan */
    mockThreadRepository.checkThreadExistence = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.checkCommentExistence = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    /** Membuat Use Case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentExistence).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
  });
});