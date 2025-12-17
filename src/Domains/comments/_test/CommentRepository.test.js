const CommentRepository = require("../CommentRepository");

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract method', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    const mockNewComment = {};
    
    await expect(commentRepository.addComment(mockNewComment)).rejects.toThrow(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrow(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.deleteComment('comment-123')).rejects.toThrow(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.checkCommentExistence('comment-123')).rejects.toThrow(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.getCommentsByThreadId('thread-123')).rejects.toThrow(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});