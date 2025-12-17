const CommentDetail = require("../../Domains/comments/entities/CommentDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsData = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const formattedThread = {
      ...thread,
      date:
        thread.date instanceof Date ? thread.date.toISOString() : thread.date,
    };
    const processedComments = commentsData.map((comment) => {
      const isDeleted =
        comment.is_deleted === "t" || comment.is_deleted === true;
      const formattedDate =
        comment.date instanceof Date
          ? comment.date.toISOString()
          : comment.date;

      let content = comment.content;

      if (isDeleted) {
        content = "**komentar telah dihapus**";
      }

      return new CommentDetail({
        id: comment.id,
        username: comment.username,
        date: formattedDate,
        content: content,
        is_deleted: isDeleted,
      });
    });

    return {
      ...formattedThread,
      comments: processedComments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
